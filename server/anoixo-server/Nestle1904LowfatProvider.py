from TextProvider import TextProvider, ProviderError
from TextQuery import TextQuery
from BaseXClient import BaseXClient
from timeout_decorator import timeout
from typing import List
import json
import Nestle1904LowfatProvider_Config as Config


# All searchable attributes and their possible values.
available_attributes = {
    'class': [
        'noun',
        'verb',
        'det',
        'conj',
        'pron',
        'prep',
        'adj',
        'adv',
        'ptcl',
        'num',
        'intj',
    ],
    'lemma': [],  # too many to list them all
    'person': [
        'first',
        'second',
        'third',
    ],
    'number': [
        'singular',
        'plural',
    ],
    'gender': [
        'masculine',
        'feminine',
        'neuter',
    ],
    'case': [
        'nominative',
        'genitive',
        'dative',
        'accusative',
        'vocative',
    ],
    'tense': [
        'aorist',
        'present',
        'imperfect',
        'future',
        'perfect',
        'pluperfect',
    ],
    'voice': [
        'active',
        'passive',
        'middle',
        'middlepassive',
    ],
    'mood': [
        'indicative',
        'imperative',
        'subjunctive',
        'optative',
        'participle',
        'infinitive',
    ],
}


class Nestle1904LowfatProvider(TextProvider):
    def __init__(self):
        self.session = None
        self.error = ''

        try:
            self.session = BaseXClient.Session(Config.basex['host'],
                                               Config.basex['port'],
                                               Config.basex['username'],
                                               Config.basex['password'])
            self.session.execute('open nestle1904lowfat')
        except Exception as err:
            self.error = f'Error opening BaseX XML database: {type(err).__name__}'
            if self.session:
                self.session.close()

    def get_provided_text_name(self) -> str:
        return 'New Testament (Greek)'

    def get_source_name(self) -> str:
        return 'Nestle 1904 Lowfat Treebank'

    @timeout(2, use_signals=False)  # timeout after 2 seconds; use_signals to be thread-safe
    def _execute_query(self, query_string: str) -> str:
        if not self.session:
            raise ProviderError(self.error)
        return self.session.query(query_string).execute()

    def get_text_for_reference(self, reference: str) -> str:
        query = f'//sentence[descendant::milestone[@id="{reference}"]]/p/text()'
        try:
            return self._execute_query(query)
        except ProviderError:
            raise
        except Exception as err:
            self.error = f'Error getting reference \'{reference}\': {type(err).__name__}'
            raise ProviderError(self.error)

    """
    Builds an XQuery string to begin finding matches for the given TextQuery.
    This XQuery string WILL NOT handle the whole query! The results will still need to be checked to make sure matches
    in the same sequence each other, deal with extra words that matched one of the word queries and thus were marked
    as "matched", etc.
    """
    def _build_query_string(self, query: TextQuery) -> str:
        """
        Build a filter string for each word query in each sequence. This can be attached to any kind of `w` element
        selector to just match words that match the word query.
        Produces filter strings like this:
        '[@tense='aorist' and @mood='participle']'
        """
        # id of the sequence maps to a list of filter strings for the words in it
        sequence_word_filters: List[List[str]] = []
        for sequence in query.sequences:
            word_filters: List[str] = []
            for word_query in sequence.word_queries:
                attribute_filters = [f"@{key}='{val}'" for key, val in word_query.attributes.items()]
                word_filters.append(f'[{" and ".join(attribute_filters)}]')
            sequence_word_filters.append(word_filters)

        """
        Build a selector string to only find sentences that contain words matching all of the word queries.
        Produces something like:
        '//sentence[descendant::w[@tense='aorist' and @mood='participle'] and descendant::w[@mood='imperative']]'
        """
        sentence_word_filters = [f'descendant::w{word_filter}' for sequence_words in sequence_word_filters
                                 for word_filter in sequence_words]
        sentence_selector = f'//sentence[{" and ".join(sentence_word_filters)}]'

        """
        Build selector strings for each sequence to only match words that are part of that sequence.
        Produces an array of strings like:
        '$w[@tense='aorist' and @mood='participle'] or $w[@mood='imperative']
        """
        sequence_selectors = [f'$w{" or $w".join(word_filters)}' for word_filters in sequence_word_filters]

        """
        Build an if/else tree for assigning each word in the results a matchedSequence index based on what sequence it 
        matched (if any)
        Produces something like:
        if ($w[@tense='aorist' and @mood='participle'] or $w[@mood='imperative']) then 0   <-- Matched 1st sequence
        else if ($w[@lemma='Ἰησοῦς']) then 1                                               <-- Matched 2nd sequence
        else -1                                                                            <-- Not matched
        """
        if_clauses: List[str] = []
        for index, sequence_selector in enumerate(sequence_selectors):
            if_clauses.append(f'if ({sequence_selector}) then {index}')
        matched_sequence_switch = '\nelse '.join(if_clauses) + '\nelse -1'

        """
        And build a similar if/else tree for assigning each word in the results a matchedWordQuery index based on which 
        word query in the sequence it matched (if any). A combo of matchedSequence and matchedWordQuery lets you tell 
        which word query in which sequence the word matched (if any).

        Produces something like:
        if ($w[@tense='aorist' and @mood='participle']) then 0            <-- Matched 1st word query (in 1st sequence)
        else if ($w[@tense='aorist' and @mood='imperative']) then 1       <-- Matched 2nd word query (in 1st sequence)
        else if ($w[@lemma='Ἰησοῦς']) then 0                              <-- Matched 1st word query (in 2nd sequence)
        else -1                                                           <-- Not matched
        """
        if_clauses: List[str] = []
        for sequence in sequence_word_filters:
            for index, word_filter in enumerate(sequence):
                if_clauses.append(f'if ($w{word_filter}) then {index}')
        matched_word_query_switch = '\nelse '.join(if_clauses) + '\nelse -1'

        # Now we can finally build the full XQuery query!
        query = f"""
               declare function local:punctuated($w as node()) as xs:string {{
                 let $punc := $w/following-sibling::*[1][name()='pc']
                 let $text := $w/text()
                 return
                   if ($punc) then $text || $punc
                   else $text
               }};

               json:serialize(
                 array {{
                   for $sentence in {sentence_selector}
                   return map {{
                     "references": array {{ for $ref in $sentence//milestone/@id return string($ref)}},
                     "words":  array {{
                       for $w in $sentence//w
                       order by $w/@n 
                       return map {{
                         "text": local:punctuated($w),
                         "matchedSequence": {matched_sequence_switch},
                         "matchedWordQuery": {matched_word_query_switch}
                       }}
                     }}
                   }}
                 }}
               )
               """
        return query

    def _check_order(self, query: TextQuery, results: List) -> List:
        filtered_results = []
        for result in results:
            passes_check = True
            # TODO: Optimize to only do one pass for all sequences. Turn found_up_to into an array indexed by sequence
            # index. This isn't an urgent optimization since there won't usually be many sequences.
            for sequence_index, sequence in enumerate(query.sequences):
                found_up_to = 0
                for word in result['words']:
                    if word['matchedSequence'] == sequence_index and word['matchedWordQuery'] == found_up_to:
                        found_up_to += 1
                if found_up_to != len(sequence.word_queries):
                    passes_check = False
            if passes_check:
                filtered_results.append(result)
        return filtered_results

    def _parse_references(self, results: List):
        pass

    def text_query(self, query: TextQuery):  # -> QueryResult
        query_string = self._build_query_string(query)
        print(query_string)
        results = []
        try:
            raw_results = self._execute_query(query_string)
            results = json.loads(raw_results)
        except ProviderError:
            raise
        except Exception as err:
            self.error = f'Error executing query: {type(err).__name__}'
            raise ProviderError(self.error)

        print(len(results))
        print(len(self._check_order(query, results)))
