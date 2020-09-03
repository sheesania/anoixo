from typing import Any, Callable, Dict, List, Union
from AnoixoError import AnoixoError, ProbableBugError, ServerOverwhelmedError
import app_constants
from BaseXClient import BaseXClient
import math
from QueryResult import QueryResult
from text_providers.TextProvider import TextProvider
from TextQuery import TextQuery
import json
from text_providers import Nestle1904LowfatProvider_Config as Config

allowed_attributes = [
    'class',
    'lemma',
    'normalized',
    'person',
    'number',
    'gender',
    'case',
    'tense',
    'voice',
    'mood'
]


class Nestle1904LowfatProvider(TextProvider):
    def __init__(self):
        self.cache: Dict[str, Any] = {}

    def get_provided_text_name(self) -> str:
        return 'New Testament (Greek)'

    def get_source_name(self) -> str:
        return 'Nestle 1904 Lowfat Treebank'

    def _connect_to_basex(self) -> BaseXClient.Session:
        session = BaseXClient.Session(Config.basex['host'],
                                      Config.basex['port'],
                                      Config.basex['username'],
                                      Config.basex['password'])
        session.execute('open nestle1904lowfat')
        return session

    def _close_basex_session(self, session: Union[BaseXClient.Session, None]) -> None:
        if session:
            try:
                session.close()
            except BrokenPipeError:
                pass

    def _execute_query(self, query_string: str) -> str:
        session = None
        exception = None
        for retry in range(3):
            try:
                session = self._connect_to_basex()
                return session.query(query_string).execute()
            except Exception as err:
                exception = err
            finally:
                self._close_basex_session(session)

        # if this code is reached, the last retry errored out with an exception
        raise exception

    def _check_attributes(self, query: TextQuery) -> None:
        for sequence in query.sequences:
            for word_query in sequence.word_queries:
                for attribute in word_query.attributes:
                    if attribute not in allowed_attributes:
                        raise ProbableBugError(f'Attribute \'{attribute}\' not allowed')

    def _sanitize(self, string: str) -> str:
        """
        Sanitizes a user-input string so it can be safely included in an XQuery query without the risk of injection
        attacks.
        :param string: The string to sanitize
        :return: The sanitized string
        """
        return string.replace('&', '').replace('\'', '’')

    """
    Builds an XQuery string to find matches for the given TextQuery.

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
            let $matching_sequence0 :=
              for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
              for $word1 in $sentence//w[@lemma='Ἰησοῦς' and @case='genitive']
              for $word2 in $sentence//w[@lemma='Χριστός' and @case='genitive']
              let $pos0 := xs:integer($word0/@position)
              let $pos1 := xs:integer($word1/@position)
              let $pos2 := xs:integer($word2/@position)
              where ($pos0 < $pos1) and ($pos1 < $pos2) and ($pos1 - $pos0 <= 1) and ($pos2 - pos1 <= 1)
              return map {$word0/@osisId: 0, $word1/@osisId: 1, $word2/@osisId: 2}
            """
            sequence_var = f'$matching_sequence{sequence_index}'

            word_match_variables: List[str] = []  # names for the variables containing words matched by each word query
            position_variables: List[str] = []  # names for the variables containing the position of each matched word
            position_variable_declarations: List[str] = []  # declarations of those position variables
            word_matchers: List[str] = []  # loops for getting matches for each word query
            # how many words are allowed between a given word query and the next word query, if there is any restriction
            words_between_filters: List[Union[int, None]] = []
            # dictionary entries mapping the word's ID to its matched word query index
            word_ids_to_indexes: List[str] = []
            for word_query_index, word_query in enumerate(sequence.word_queries):
                word_variable = f'$word{word_query_index}'
                word_match_variables.append(word_variable)

                # Create a variable for this word's position/order, and a declaration of it. The declaration will look
                # something like:
                # let $pos0 := xs:integer($word0/@position)
                pos_var = f'$pos{word_query_index}'
                position_variables.append(pos_var)
                position_variable_declarations.append(f'let {pos_var} := xs:integer({word_variable}/@position)')

                # A filter string for only matching words with the given attributes. Will look something like:
                # `[@lemma='κύριος' and @case='genitive']`
                if word_query.attributes:
                    attribute_filters = " and ".join([
                        # key has already been checked using check_attributes
                        f"@{key}='{self._sanitize(val)}'" for key, val in word_query.attributes.items()
                    ])
                    attribute_filter_string = f'[{attribute_filters}]'
                else:
                    attribute_filter_string = ''

                # Collect information about words between restrictions for each word query
                if word_query.link_to_next_word:
                    words_between_filters.append(word_query.link_to_next_word.allowed_words_between)
                else:
                    words_between_filters.append(None)

                # A loop for grabbing matches for this word query. Will look something like:
                # for $word0 in $sentence//w[@lemma='κύριος' and @case='genitive']
                word_matchers.append(f'for {word_variable} in $sentence//w{attribute_filter_string}')

                # Will be used to build a dictionary mapping word IDs to their matched word query indexes. Looks like:
                # $word0/@osisId: 0
                word_ids_to_indexes.append(f'{word_variable}/@osisId: {word_query_index}')

            for_matching_words = ' '.join(word_matchers)
            let_position_variables = '\n'.join(position_variable_declarations)

            # Build conditionals to only keep matched words that are in order and follow any restrictions on allowed
            # words between matches. Will look something like:
            # where ($pos0 < $pos1) and ($pos1 < $pos2) and ($pos1 - $pos0 <= 1) and ($pos2 - pos1 <= 1)
            position_variable_pairs = \
                [position_variables[index:index + 2] for index in range(0, len(position_variables) - 1)]
            word_order_checks = [f'({pos1} < {pos2})' for (pos1, pos2) in position_variable_pairs]
            for filter_word_query_index, allowed_words_between in enumerate(words_between_filters):
                if allowed_words_between is None:
                    continue
                (word_position, following_word_position) = position_variable_pairs[filter_word_query_index]
                word_order_checks.append(
                    f'({following_word_position} - {word_position} <= {allowed_words_between + 1})')
            # There will not be anything in word_order_checks if there was just 1 word query in the sequence
            where_words_in_order = \
                f'where {" and ".join(word_order_checks)}' if word_order_checks else ''

            # Build the dictionary mapping word IDs to their matched word query indexes. Looks like:
            # map {$word0/@osisId: 0, $word1/@osisId: 1}
            word_id_to_index_map = f'map {{{", ".join(word_ids_to_indexes)}}}'

            sequence_matcher = f"""
                let {sequence_var} := map:merge(
                    {for_matching_words}
                    {let_position_variables}
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
            - conditionals that check these variables and return:
                - the index of the sequence the word matched
                - the index of the word query the word matched within the sequence
        
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
        # where (map:size($matching_sequence0) > 0) and (map:size($matching_sequence1) > 0)
        where_matching_sequences_found = f'where {" and ".join(sequence_match_checks)}'
        declare_index_in_sequences_variables = '\n'.join(index_in_sequences_variables)
        # Produces something like:
        # if (not(empty($index_in_sequence_0))) then 0
        # else if (not(empty($index_in_sequence_1))) then 1
        # else -1
        matched_sequence_switch = '\nelse '.join(sequence_index_getters) + '\nelse -1'
        # Produces something like:
        # if (not(empty($index_in_sequence_0))) then $index_in_sequence_0
        # else if (not(empty($index_in_sequence_1))) then $index_in_sequence_1
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
                order by $w/@position 
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

    def _execute_query_and_process_results(self, query_string: str, process_results: Callable):
        try:
            raw_results = self._execute_query(query_string)
        except Exception as err:
            raise ServerOverwhelmedError(f'Error executing XML database query: {type(err).__name__}')

        try:
            return process_results(raw_results)
        except AnoixoError:
            raise
        except Exception as err:
            raise ProbableBugError(f'Error processing query results: {type(err).__name__}')

    def text_query(self, query: TextQuery) -> QueryResult:
        self._check_attributes(query)

        query_string = self._build_query_string(query)

        def process_results(raw_results: str) -> QueryResult:
            def on_parsing_error(message: str):
                raise ProbableBugError(f'Error parsing XML database response JSON: {message}')

            results_json = json.loads(raw_results)
            if not isinstance(results_json, list):
                on_parsing_error('Results are not a list')

            num_results = len(results_json)
            total_pages = math.ceil(num_results / app_constants.page_size) or 1
            if query.page > total_pages:
                raise ProbableBugError(
                    f'Requested page {query.page} is out of bounds for results with {total_pages} total pages')
            page_start = (query.page - 1) * app_constants.page_size
            page_end = page_start + app_constants.page_size
            results_for_page = results_json[page_start:page_end]

            return QueryResult(results_for_page, query.page, total_pages, on_parsing_error)

        return self._execute_query_and_process_results(query_string, process_results)

    def attribute_query(self, attribute_name: str) -> List[str]:
        if attribute_name not in allowed_attributes:
            raise ProbableBugError(f'Attribute \'{attribute_name}\' not allowed')

        if attribute_name == 'lemma' and self.cache.get('lemma'):
            return self.cache.get('lemma')
        if attribute_name == 'normalized' and self.cache.get('normalized'):
            return self.cache.get('normalized')

        query_string = f"""
            json:serialize(
              array {{
                sort(distinct-values(//w/@{attribute_name}))
              }}
            )
        """

        def process_results(raw_results: str) -> List[str]:
            results = json.loads(raw_results)
            if not isinstance(results, list):
                raise ProbableBugError(f'Error parsing XML database response JSON: not a list')
            return results

        results = self._execute_query_and_process_results(query_string, process_results)
        if attribute_name == 'lemma':
            self.cache['lemma'] = results
        if attribute_name == 'normalized':
            self.cache['normalized'] = results
        return results
