from TextProvider import TextProvider, ProviderError
from TextQuery import TextQuery, WordQuery
from BaseXClient import BaseXClient
from collections import defaultdict
from pprint import pprint
from timeout_decorator import timeout
from typing import DefaultDict, Dict, List
import json
import Nestle1904LowfatProvider_Config as Config
from QueryResult import QueryResult


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
    This XQuery query WILL NOT handle all the parameters in the TextQuery! The results will still need to be checked to 
    make sure word queries that only allow a certain number of words between matches have an acceptable number of words, 
    handle multiple matches in the same sentence, etc.
    
    TODO: Split this function up into smaller pieces. Sorry for how long this is. At least it's mostly comments.
    """
    def _build_query_string(self, query: TextQuery) -> str:
        # the code for getting matches for each sequence
        sequence_matchers: List[str] = []
        # checks for whether a sequence had matches
        sequence_match_checks: List[str] = []
        # variables with what index a word matched in each sequence (if any)
        index_in_sequences_variables: List[str] = []
        # clauses to get a matched word's sequence index
        sequence_index_getters: List[str] = []
        # clauses to get a matched word's index within its sequence
        word_query_index_getters: List[str] = []

        for sequence_index, sequence in enumerate(query.sequences):
            """
            First, build XQuery loops to grab matching words for each sequence. The goal is to produce something like 
            this for every sequence:
            let $matching_sequences0 :=
              for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
              for $word1 in $sentence//w[@lemma='Ἰησοῦς' and @case='genitive']
              for $word2 in $sentence//w[@lemma='Χριστός' and @case='genitive']
              where $word0 << $word1 and $word1 << $word2
              return map {$word0/@osisId: 0, $word1/@osisId: 1, $word2/@osisId: 2}
            """
            sequence_var = f'$matching_sequence{sequence_index}'

            word_match_variables: List[str] = []  # names for the variables containing words matched by each word query
            word_matchers: List[str] = []  # loops for getting matches for each word query
            # dictionary entries mapping the word's ID to its matched word query index
            word_ids_to_indexes: List[str] = []
            for word_query_index, word_query in enumerate(sequence.word_queries):
                word_variable = f'$word{word_query_index}'
                word_match_variables.append(word_variable)

                # A filter string for only matching words with the given attributes. Will look something like:
                # `@lemma='κύριος' and @case='genitive'`
                attribute_filters = " and ".join([f"@{key}='{val}'" for key, val in word_query.attributes.items()])

                # A loop for grabbing matches for this word query. Will look something like:
                # for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
                word_matchers.append(f'for {word_variable} in $sentence//w[{attribute_filters}]')

                # Will be used to build a dictionary mapping word IDs to their matched word query indexes. Looks like:
                # $word0/@osisId: 0
                word_ids_to_indexes.append(f'{word_variable}/@osisId: {word_query_index}')

            for_matching_words = ' '.join(word_matchers)

            # Build a conditional to only keep matched words that are in order. Will look something like:
            # where $word0 << $word1 and $word1 << $word2
            word_variable_pairs = \
                [word_match_variables[index:index + 2] for index in range(0, len(word_match_variables) - 1)]
            words_in_order_checks = [' << '.join(pair) for pair in word_variable_pairs]
            # There will not be anything in words_in_order_checks if there was just 1 word query in the sequence
            where_words_in_order = \
                f'where {" and ".join(words_in_order_checks)}' if words_in_order_checks else ''

            # Build the dictionary mapping word IDs to their matched word query indexes. Looks like:
            # map {$word0/@osisId: 0, $word1/@osisId: 1}
            word_id_to_index_map = f'map {{{", ".join(word_ids_to_indexes)}}}'

            sequence_matcher = f"""
                let {sequence_var} := map:merge(
                    {for_matching_words}
                    {where_words_in_order}
                    return {word_id_to_index_map}
                )
            """
            sequence_matchers.append(sequence_matcher)

            # Build a check for whether this sequence found any matches. Looks like:
            # (map:size($matching_sequence0) > 0)
            sequence_match_checks.append(f'(map:size({sequence_var}) > 0)')

            """
            Now we're onto handling the results found by the sequence matchers. Let's build:
            - variable declarations that hold information about what index in each sequence a word that got through to 
            the results matched (if any)
            - conditionals that check these variables and return 1) the index of the sequence the word matched and 
            2) the index of the word query the word matched within the sequence.
        
            If there are multiple matches for the sequence within the sentence, they will still have the correct 
            matched sequence index and matched word query index. (So for instance, you could have multiple instances of
            2 words following each other, one with matchedSequence=0/matchedWordQuery=0 and the following with
            matchedSequence=0/matchedWordQuery=1.)
            """
            # This will look something like:
            # let $index_in_sequence_0 := map:get($matching_sequence0, $w/@osisId)
            index_in_sequence_var = f'$index_in_sequence_{sequence_index}'
            index_in_sequence_declaration = f'let {index_in_sequence_var} := map:get({sequence_var}, $w/@osisId)'

            index_in_sequences_variables.append(index_in_sequence_declaration)
            # This will look like:
            # if (not(empty($index_in_sequence_0))) then 0
            sequence_index_getters.append(f'if (not(empty({index_in_sequence_var}))) then {sequence_index}')
            # This will look like:
            # if (not(empty($index_in_sequence_0))) then $index_in_sequence_0
            word_query_index_getters.append(f'if (not(empty({index_in_sequence_var}))) then {index_in_sequence_var}')

        """
        Now that we've built code snippets for each sequence, let's finally build the full query!
        """
        get_matching_sequences = '\n'.join(sequence_matchers)
        # Produces something like:
        # where matching_sequences0 and matching_sequences1
        where_matching_sequences_found = f'where {" and ".join(sequence_match_checks)}'
        declare_index_in_sequences_variables = '\n'.join(index_in_sequences_variables)
        # Produces something like:
        # if ($w = $matching_sequences0) then 0
        # else if ($w = $matching_sequences1) then 1
        # else -1
        matched_sequence_switch = '\nelse '.join(sequence_index_getters) + '\nelse -1'
        # Produces something like:
        # if ($w = $matching_sequences0) then index-of(matching_sequences0, $w)[1] - 1
        # else if ($w = $matching_sequences1) then index-of(matching_sequences1, $w)[1] - 1
        # else -1
        matched_word_query_switch = '\nelse '.join(word_query_index_getters) + '\nelse -1'

        return f"""
        declare function local:punctuated($w as node()) as xs:string {{
          let $punc := $w/following-sibling::*[1][name()='pc']
          let $text := $w/text()
          return
            if ($punc) then $text || $punc
            else $text
        }};
        
        json:serialize(
          array {{
            for $sentence in //sentence
            {get_matching_sequences}
            {where_matching_sequences_found}
            return map {{
              "references": array {{for $ref in $sentence//milestone/@id return string($ref)}},
              "sentence": $sentence//p/text(),
              "words":  array {{
                for $w in $sentence//w
                {declare_index_in_sequences_variables}
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

    """
    Returns a dictionary with each sequence index pointing to a mapping of its word query indexes to indexes of matches 
    for that word query in this result
    Example:
    sequence 0: {word query 0: [indexes 1, 4, 19], word query 1: [indexes 3, 30]}
    sequence 1: {word query 0: [indexes 2, 14]}
    """
    def _get_word_matches_for_sequences(self, words_in_result: List) -> DefaultDict[int, DefaultDict[int, List[int]]]:
        word_matches_for_sequences: DefaultDict[int, DefaultDict[int, List[int]]] = \
            defaultdict(lambda: defaultdict(list))
        for word_index, word in enumerate(words_in_result):
            if word['matchedSequence'] < 0:
                continue
            word_matches_for_sequences[word['matchedSequence']][word['matchedWordQuery']].append(word_index)
        return word_matches_for_sequences

    """
    Given query results, matches from the results for two contiguous word queries, and the number of words allowed 
    between matches for these 2 word queries:
    - check if at least 1 pair of results has an acceptable number of words between them
    - mark any results that don't have the second word within an acceptable number of words as not a match after all
    """
    def _check_matches_for_linked_word_queries(self, words_from_result: List[Dict], word1_match_indexes: List,
                                               word2_match_indexes: List, allowed_words_between: int) -> bool:
        word1_has_valid_match = False
        for word1_match_index in word1_match_indexes:
            index_is_valid_match = False
            for word2_match_index in word2_match_indexes:
                if word2_match_index - word1_match_index - 1 <= allowed_words_between:
                    index_is_valid_match = True
            if index_is_valid_match:
                word1_has_valid_match = True
            else:  # not actually a match; mark it as such
                words_from_result[word1_match_index]['matchedSequence'] = -1
                words_from_result[word1_match_index]['matchedWordQuery'] = -1
        return word1_has_valid_match

    """
    Uses the link.allowed_words_between parameters in the TextQuery to:
    - filter out results that don't actually have any valid matches
    - edit words marked as "matched" in the results that don't pass this check so they are no longer marked as matched
    """
    def _check_allowed_words_between(self, query: TextQuery, results: List) -> List:
        filtered_results = []
        for result in results:
            words: List = result['words']
            word_matches_for_sequences = self._get_word_matches_for_sequences(words)
            valid_result = True

            for sequence_index, sequence in enumerate(query.sequences):
                sequence_word_matches = word_matches_for_sequences[sequence_index]
                # get every contiguous pair of word queries; each might have a link parameter applying to them
                word_query_pairs: List[List[WordQuery]] = \
                    [sequence.word_queries[index:index + 2] for index in range(0, len(sequence.word_queries) - 1)]
                for word1_query_index, (word1, word2) in enumerate(word_query_pairs):
                    if not word1.link_to_next_word:  # no parameters specified on the link between these words
                        continue
                    allowed_words_between = word1.link_to_next_word.allowed_words_between
                    word1_matches = sequence_word_matches[word1_query_index]
                    word2_matches = sequence_word_matches[word1_query_index + 1]
                    word1_has_valid_match = \
                        self._check_matches_for_linked_word_queries(words, word1_matches, word2_matches,
                                                                    allowed_words_between)
                    if not word1_has_valid_match:
                        valid_result = False
                        break
                if not valid_result:
                    break  # if any sequence doesn't have a match in this result, the whole result should be thrown out

            if valid_result:
                filtered_results.append(result)

        return filtered_results

    def text_query(self, query: TextQuery):  # -> QueryResult
        query_string = self._build_query_string(query)
        try:
            raw_results = self._execute_query(query_string)
            results = json.loads(raw_results)

            def on_parsing_error(message: str):
                raise ProviderError(message)
            results_parsed = QueryResult(results, on_parsing_error)

            print(results_parsed)
            # if not (isinstance(results, List)):
            #     raise ProviderError('XQuery result is not a list')
            # print('UNFILTERED RESULTS')
            # print('==================')
            # pprint(results)
            # filtered_results = self._check_allowed_words_between(query, results)
            # print()
            # print('FILTERED RESULTS')
            # print('================')
            # pprint(filtered_results)
            # results_with_parsed_references = self._parse_references(filtered_results)
            # print('PARSED REFS')
            # print('===========')
            # pprint(results_with_parsed_references)
        except ProviderError:
            raise
        except Exception as err:
            self.error = f'Error executing query: {type(err).__name__}'
            raise ProviderError(self.error)
