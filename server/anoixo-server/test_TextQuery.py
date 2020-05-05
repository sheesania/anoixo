from unittest.mock import MagicMock
from TextQuery import Link


def test_link_allowed_words_between_must_be_int():
    on_parsing_error_string = MagicMock()
    Link({'allowedWordsBetween': 'string instead of number'}, on_parsing_error_string)
    on_parsing_error_string.assert_called_with('Link is not a dictionary with int attribute \'allowedWordsBetween\'')

    on_parsing_error_float = MagicMock()
    Link({'allowedWordsBetween': 3.14}, on_parsing_error_float)
    on_parsing_error_float.assert_called_with('Link is not a dictionary with int attribute \'allowedWordsBetween\'')
