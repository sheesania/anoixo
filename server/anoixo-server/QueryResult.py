from typing import Any, Callable, Dict, List, Union


class Reference:
    # Currently only handles strings in Book.Chapter.Verse format. Throws exceptions otherwise
    def _parse_string_ref(self, ref: str):
        parts = ref.split('.')
        self.book = parts[0]
        self.chapter = int(parts[1])
        self.verse = int(parts[2])

    # Currently only handles string references
    def __init__(self, json: Any, on_parsing_error: Callable[[str], Any]):
        if isinstance(json, str):
            self.string_ref = json
            try:
                self._parse_string_ref(json)
            except Exception as err:
                on_parsing_error(f'Error parsing reference: {type(err).__name__}')
        else:
            on_parsing_error('Reference is not a string')

    def __repr__(self):
        return f'{self.serialize()}'

    def serialize(self) -> Dict[str, Union[str, int]]:
        return {'book': self.book, 'chapter': self.chapter, 'verse': self.verse}


class WordResult:
    def __init__(self, json: Any, on_parsing_error: Callable[[str], Any]):
        if not isinstance(json, dict):
            on_parsing_error('Word is not a dictionary')
        if 'text' not in json:
            on_parsing_error('Word does not contain \'text\' attribute')
        if 'matchedSequence' not in json:
            on_parsing_error('Word does not contain \'matchedSequence\' attribute')
        if 'matchedWordQuery' not in json:
            on_parsing_error('Word does not contain \'matchedWordQuery\' attribute')

        # TODO: check types of keys to make sure they're all strings, & values to make sure they're all strings or ints?
        self.text = json.pop('text')
        self.matchedSequence = json.pop('matchedSequence')
        self.matchedWordQuery = json.pop('matchedWordQuery')
        self.attributes = json  # any extra attributes in the dictionary

    def __repr__(self):
        return f'{self.serialize()}'

    def serialize(self) -> Dict[str, Union[str, int]]:
        attr_dict = {**self.attributes, 'text': self.text, 'matchedSequence': self.matchedSequence,
                     'matchedWordQuery': self.matchedWordQuery}
        return attr_dict


class PassageResult:
    def __init__(self, json: Any, on_parsing_error: Callable[[str], Any]):
        if not isinstance(json, dict):
            on_parsing_error('Result is not a dictionary')

        if not('references' in json and isinstance(json['references'], list)):
            on_parsing_error('Result does not have a list of references')
        self.references = [Reference(ref, on_parsing_error) for ref in json['references']]

        if not('words' in json and isinstance(json['words'], list)):
            on_parsing_error('Result does not have a list of words')
        self.words = [WordResult(word, on_parsing_error) for word in json['words']]

        self.translation = ''

    def __repr__(self):
        return f'{self.serialize()}'

    def serialize(self) -> Dict[str, List[Dict]]:
        return {'references': [reference.serialize() for reference in self.references],
                'words': [word.serialize() for word in self.words],
                'translation': self.translation}


class QueryResult:
    def __init__(self, json: Dict[Any, Any], on_parsing_error: Callable[[str], Any]):
        if not isinstance(json, list):
            on_parsing_error('Results are not a list')
        self.passages: List[PassageResult] = [PassageResult(passage, on_parsing_error) for passage in json]

    def __repr__(self):
        return f'{self.serialize()}'

    def serialize(self) -> List[Dict]:
        return [passage.serialize() for passage in self.passages]
