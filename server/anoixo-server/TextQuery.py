from typing import Any, Callable, Dict, Optional, List


class Link:
    def __init__(self, link_json: Any, on_parsing_error: Callable[[str], Any]):
        if not(isinstance(link_json, dict) and
               'allowedWordsBetween' in link_json and
               isinstance(link_json['allowedWordsBetween'], int)):
            on_parsing_error('Link is not a dictionary with int attribute \'allowedWordsBetween\'')
        self.allowed_words_between: int = link_json['allowedWordsBetween']

    def __repr__(self):
        return f'allowed_words_between: {str(self.allowed_words_between)}'


class WordQuery:
    def __init__(self, word_query_json: Any, on_parsing_error: Callable[[str], Any]):
        if not isinstance(word_query_json, dict):
            on_parsing_error('Word query is not a dictionary')
        self.link_to_next_word: Optional[Link] = None
        if 'link' in word_query_json:
            self.link_to_next_word = Link(word_query_json.pop('link'), on_parsing_error)
        self.attributes: Dict[str, str] = word_query_json

    def __repr__(self):
        return f'{{attributes: {str(self.attributes)}, link_to_next_word: {{{str(self.link_to_next_word)}}}}}'


class LinkedWordGroup:
    def __init__(self, group_json: Any, on_parsing_error: Callable[[str], Any]):
        if not isinstance(group_json, list):
            on_parsing_error('Group is not a list')
        self.word_queries: List[WordQuery] = []
        for word_query in group_json:
            self.word_queries.append(WordQuery(word_query, on_parsing_error))

    def __repr__(self):
        return str(self.word_queries)


class TextQuery:
    def __init__(self, json: Dict[Any, Any], on_parsing_error: Callable[[str], Any]):
        if not ('groups' in json and isinstance(json['groups'], list)):
            on_parsing_error('Does not contain a list \'groups\'')
        self.groups: List[LinkedWordGroup] = []
        for group in json['groups']:
            self.groups.append(LinkedWordGroup(group, on_parsing_error))

    def __repr__(self):
        return str(self.groups)
