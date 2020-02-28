import pytest
from unittest.mock import AsyncMock
from typing import Dict, List
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from QueryResult import QueryResult


def mock_response(mocker, response: Dict):
    class MockResponse:
        async def json(self):
            return response
    mock_get = mocker.patch('aiohttp.ClientSession.get', new_callable=AsyncMock)
    mock_get.return_value = MockResponse()
    return mock_get


def query_result_for_json(json: List) -> QueryResult:
    return QueryResult(json, lambda x: None)


@pytest.fixture
def esv_provider():
    return ESVApiTranslationProvider()


def test_get_translations_for_few_results(mocker, esv_provider: ESVApiTranslationProvider):
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
    mock_response(mocker, {
        'passages': [
            'text of Mark.1.1',
            'text of Matt.1.1-Matt.1.2',
        ]
    })
    esv_provider.add_translations(result)
    assert result.passages[0].translation == 'text of Mark.1.1'
    assert result.passages[1].translation == 'text of Matt.1.1-Matt.1.2'


def test_chunk_translation_api_requests(mocker, esv_provider: ESVApiTranslationProvider):
    result = query_result_for_json([{'references': ['John.1.1'], 'words': []} for _ in range(900)])
    mock_get = mock_response(mocker, {
        'passages': ['text of John.1.1' for _ in range(300)]
    })
    esv_provider.add_translations(result)
    assert mock_get.call_count == 3
