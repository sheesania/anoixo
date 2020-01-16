from TextProvider import TextProvider, ProviderError
from TextQuery import TextQuery, WordQuery
from BaseXClient import BaseXClient
from collections import defaultdict
from timeout_decorator import timeout
from typing import DefaultDict, Dict, List
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
    This XQuery query WILL NOT handle all the parameters in the TextQuery! The results will still need to be checked to 
    make sure word queries that only allow a certain number of words between matches have an acceptable number of words, 
    handle multiple matches in the same sentence, etc.
    
    TODO: Split this function up into smaller pieces. Sorry for how long this is. At least it's mostly comments.
    """
    def _build_query_string(self, query: TextQuery) -> str:
        """
        First, build XQuery loops to grab matching words for each sequence. The goal is to produce something like this
        for every sequence:
        let $matching_sequences0 :=
          for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
          for $word1 in $sentence//w[@lemma='Ἰησοῦς' and @case='genitive']
          for $word2 in $sentence//w[@lemma='Χριστός' and @case='genitive']
          where $word0 << $word1 and $word1 << $word2
          return ($word0, $word1, $word2)
        """
        # the code for getting matches for each sequence
        sequence_matchers: List[str] = []
        # names for the variables containing each sequence's matches
        sequence_match_variables: List[str] = []
        # variables with information about whether a word is part of a matched sequence
        part_of_sequence_variables: List[str] = []
        # clauses to get a matched word's sequence index
        sequence_index_getters: List[str] = []
        # clauses to get a matched word's index within its sequence
        word_query_index_getters: List[str] = []

        for sequence_index, sequence in enumerate(query.sequences):
            sequence_var = f'$matching_sequences{sequence_index}'
            sequence_match_variables.append(sequence_var)

            word_match_variables: List[str] = []  # names for the variables containing words matched by each word query
            word_matchers: List[str] = []  # loops for getting matches for each word query
            for word_query_index, word_query in enumerate(sequence.word_queries):
                word_variable = f'$word{word_query_index}'
                word_match_variables.append(word_variable)

                # A filter string for only matching words with the given attributes. Will look something like:
                # `@lemma='κύριος' and @case='genitive'`
                attribute_filters = " and ".join([f"@{key}='{val}'" for key, val in word_query.attributes.items()])

                # A loop for grabbing matches for this word query. Will look something like:
                # for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
                word_matchers.append(f'for {word_variable} in $sentence//w[{attribute_filters}]')

            for_matching_words = ' '.join(word_matchers)

            # Build a conditional to only keep matched words that are in order. Will look something like:
            # where $word0 << $word1 and $word1 << $word2
            word_variable_pairs = \
                [word_match_variables[index:index + 2] for index in range(0, len(word_match_variables) - 1)]
            words_in_order_checks = [' << '.join(pair) for pair in word_variable_pairs]
            # There will not be anything in words_in_order_checks if there was just 1 word query in the sequence
            where_words_in_order = \
                f'where {" and ".join(words_in_order_checks)}' if words_in_order_checks else ''

            word_match_variables_list = f'({", ".join(word_match_variables)})'

            sequence_matcher = f"""
                let {sequence_var} :=
                    {for_matching_words}
                    {where_words_in_order}
                    return {word_match_variables_list}
            """
            sequence_matchers.append(sequence_matcher)

            """
            Now build:
            - variable declarations that hold information about what sequence a word that got through to the 
            results matched (if any)
            - conditionals that check these variables and return 1) the index of the sequence the word matched and 
            2) the index of the word query the word matched within the sequence.
        
            If there are multiple matches for the sequence within the sentence, they will still have the correct 
            matched sequence index and matched word query index. (So for instance, you could have multiple instances of
            2 words following each other, one with matchedSequence=0/matchedWordQuery=0 and the following with
            matchedSequence=0/matchedWordQuery=1.)
            """
            # This will look something like:
            # let $matches_sequence_0 :=
            #   some $matched_word in $matching_sequences0 satisfies $matched_word/@osisId = $w/@osisId
            part_of_sequence_var = f'$matches_sequence_{sequence_index}'
            part_of_sequence_declaration = f"""
                let {part_of_sequence_var} := 
                    some $matched_word in {sequence_var} satisfies $matched_word/@osisId = $w/@osisId
                """
            part_of_sequence_variables.append(part_of_sequence_declaration)
            # This will look like:
            # if ($matches_sequence_0) then 0
            sequence_index_getters.append(f'if ({part_of_sequence_var}) then {sequence_index}')
            # This will look like:
            # if ($matches_sequence_0) then index-of($matching_sequences0, $w)[1] - 1
            # (This is where I must apologize for XQuery. Array indices start at 1, so `index_of($list, $item)[1]` gets
            # the index of the first occurrence of $item, and subtracting 1 gives the 0-indexed equivalent.)
            word_query_index_getters.append(
                f'if ({part_of_sequence_var}) then index-of({sequence_var}, $w)[1] - 1')

        """
        Let's finally build the full query!
        """
        get_matching_sequences = '\n'.join(sequence_matchers)
        # Produces something like:
        # where matching_sequences0 and matching_sequences1
        where_matching_sequences_found = f'where {" and ".join(sequence_match_variables)}'
        declare_part_of_sequence_variables = '\n'.join(part_of_sequence_variables)
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
                {declare_part_of_sequence_variables}
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
    Map each sequence index to all its word query indexes mapped to indexes of occurrences in this result
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
            else:
                words_from_result[word1_match_index]['matchedSequence'] = -1
                words_from_result[word1_match_index]['matchedWordQuery'] = -1
        return word1_has_valid_match

    def _check_allowed_words_between(self, query: TextQuery, results: List) -> List:
        filtered_results = []
        for result in results:
            words: List = result['words']
            word_matches_for_sequences = self._get_word_matches_for_sequences(words)
            print(word_matches_for_sequences)
            valid_result = True

            for sequence_index, sequence in enumerate(query.sequences):
                sequence_word_matches = word_matches_for_sequences[sequence_index]
                word_query_pairs: List[List[WordQuery]] = \
                    [sequence.word_queries[index:index + 2] for index in range(0, len(sequence.word_queries) - 1)]
                for word1_query_index, (word1, word2) in enumerate(word_query_pairs):
                    if not word1.link_to_next_word:
                        continue
                    allowed_words_between = word1.link_to_next_word.allowed_words_between
                    word1_matches = sequence_word_matches[word1_query_index]
                    word2_matches = sequence_word_matches[word1_query_index + 1]
                    word1_has_valid_match = \
                        self._check_matches_for_linked_word_queries(words, word1_matches, word2_matches,
                                                                    allowed_words_between)
                    print(f'{word1} has a valid match: {word1_has_valid_match}')
                    if not word1_has_valid_match:
                        valid_result = False
                        break
                if not valid_result:
                    break

            if valid_result:
                filtered_results.append(result)

        return filtered_results

    def _parse_references(self, results: List):
        pass

    def text_query(self, query: TextQuery):  # -> QueryResult
        query_string = self._build_query_string(query)
        print(query_string)
        try:
            raw_results = self._execute_query(query_string)
            results = json.loads(raw_results)
            if not (isinstance(results, List)):
                raise ProviderError('XQuery result is not a list')
            print(f'length of results: {len(results)}')
            filtered_results = self._check_allowed_words_between(query, results)
            print(f'length of filtered results: {len(filtered_results)}')
            print()
            print(filtered_results)
        except ProviderError:
            raise
        except Exception as err:
            self.error = f'Error executing query: {type(err).__name__}'
            raise ProviderError(self.error)
