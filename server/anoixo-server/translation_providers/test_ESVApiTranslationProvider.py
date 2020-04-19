import pytest
from unittest.mock import AsyncMock
from typing import Callable, List
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from AnoixoError import ProbableBugError, ServerOverwhelmedError
from QueryResult import QueryResult


def mock_response(mocker, response_func: Callable):
    class MockResponse:
        async def json(self):
            return response_func()
    mock_get = mocker.patch('aiohttp.ClientSession.get', new_callable=AsyncMock)
    mock_get.return_value = MockResponse()
    return mock_get


def make_mock_exception(mocker, exception_class_name):
    class MockException(Exception):
        pass
    mock_exception = mocker.patch(exception_class_name, new_callable=lambda: MockException)
    return mock_exception


def query_result_for_json(json: List) -> QueryResult:
    return QueryResult(json, lambda x: None)


@pytest.fixture
def esv_provider():
    return ESVApiTranslationProvider()


def test_gets_translations_for_few_results(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([
        {
            'references': ['Mark.1.1'],
            'words': []
        },
        {
            'references': ['Matt.1.1', 'Matt.1.2'],
            'words': []
        }
    ])
    mock_response(mocker, lambda: {
        'passages': [
            'text of Mark.1.1',
            'text of Matt.1.1-Matt.1.2',
        ]
    })
    esv_provider.add_translations(result)
    assert result.passages[0].translation == 'text of Mark.1.1'
    assert result.passages[1].translation == 'text of Matt.1.1-Matt.1.2'


def test_requests_proper_endpoint(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    mock_get = mock_response(mocker, lambda: {'passages': ['text']})
    esv_provider.add_translations(result)
    assert mock_get.call_args.args[0] == 'https://api.esv.org/v3/passage/text'


def test_properly_formats_verse_query_string(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([
        {
            'references': ['Mark.1.1'],
            'words': []
        },
        {
            'references': ['Matt.1.1', 'Matt.1.2'],
            'words': []
        },
        {
            'references': ['John.1.1', 'John.1.2', 'John.1.3'],
            'words': []
        }
    ])
    mock_get = mock_response(mocker, lambda: {'passages': ['text' for _ in range(3)]})
    esv_provider.add_translations(result)
    get_params = mock_get.call_args.kwargs['params']
    assert get_params['q'] == 'Mark.1.1;Matt.1.1-Matt.1.2;John.1.1-John.1.3'


def test_includes_proper_request_params(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    mock_get = mock_response(mocker, lambda: {'passages': ['text']})
    esv_provider.add_translations(result)
    get_params = mock_get.call_args.kwargs['params']
    assert get_params['include-passage-references'] == 'false'
    assert get_params['include-verse-numbers'] == 'false'
    assert get_params['include-first-verse-numbers'] == 'false'
    assert get_params['include-footnotes'] == 'false'
    assert get_params['include-headings'] == 'false'
    assert get_params['include-short-copyright'] == 'true'
    assert get_params['indent-paragraphs'] == '0'


def test_chunks_translation_api_requests_by_verse_number(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': ['John.1.1'], 'words': []} for _ in range(900)])
    mock_get = mock_response(mocker, lambda: {
        'passages': ['text of John.1.1' for _ in range(300)]
    })
    esv_provider.add_translations(result)
    assert mock_get.call_count == 3


def test_chunks_translation_api_request_by_query_string_length(mocker, esv_provider: ESVApiTranslationProvider):
    long_reference = ''.join(['a' for _ in range(3861)]) + '.1.1'
    result = query_result_for_json([
        {
            'references': [long_reference],
            'words': [],
        },
        {
            'references': [long_reference],
            'words': [],
        },
    ])
    mock_get = mock_response(mocker, lambda: {'passages': ['text']})
    esv_provider.add_translations(result)
    assert mock_get.call_count == 2


def test_handles_wrongly_formatted_query_result(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': [], 'words': []}])
    mock_response(mocker, lambda: None)
    with pytest.raises(ProbableBugError) as excinfo:
        esv_provider.add_translations(result)
    assert excinfo.value.message == 'Result has no references'


def test_handles_wrongly_formatted_response(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    mock_response(mocker, lambda: {'wrong': 'keys'})
    with pytest.raises(ProbableBugError) as excinfo:
        esv_provider.add_translations(result)
    assert excinfo.value.message == 'Could not understand response from ESV API'


def test_handles_content_type_error(mocker, esv_provider: ESVApiTranslationProvider):
    mock_exception = make_mock_exception(mocker, 'aiohttp.ContentTypeError')

    def raise_mock_exception():
        raise mock_exception
    mock_response(mocker, raise_mock_exception)

    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    with pytest.raises(ServerOverwhelmedError) as excinfo:
        esv_provider.add_translations(result)
    assert excinfo.value.message == 'ESV API did not return JSON'


def test_handles_quota_exceeded(mocker, esv_provider: ESVApiTranslationProvider):
    mock_exception = make_mock_exception(mocker, 'aiohttp.ClientResponseError')
    mock_exception.status = 502

    def raise_mock_exception():
        raise mock_exception
    mock_response(mocker, raise_mock_exception)

    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    with pytest.raises(ServerOverwhelmedError) as excinfo:
        esv_provider.add_translations(result)
    assert excinfo.value.message == 'ESV API quota exceeded'


def test_handles_other_api_exceptions(mocker, esv_provider: ESVApiTranslationProvider):
    mock_exception = make_mock_exception(mocker, 'aiohttp.ClientResponseError')
    mock_exception.status = 500
    mock_exception.message = 'Internal Server Error'

    def raise_mock_exception():
        raise mock_exception
    mock_response(mocker, raise_mock_exception)

    result = query_result_for_json([{'references': ['John.1.1'], 'words': []}])
    with pytest.raises(ServerOverwhelmedError) as excinfo:
        esv_provider.add_translations(result)
    assert excinfo.value.message == 'Error response from ESV API: 500 Internal Server Error'
