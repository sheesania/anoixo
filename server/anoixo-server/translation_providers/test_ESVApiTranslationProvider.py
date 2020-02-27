import aiohttp
import pytest
from typing import Dict, List
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from QueryResult import QueryResult


def mock_response(monkeypatch, response: Dict):
    class MockResponse:
        async def json(self):
            return response

    async def mock_get(*args, **kwargs):
        return MockResponse()

    monkeypatch.setattr(aiohttp.ClientSession, 'get', mock_get)


def query_result_for_json(json: List) -> QueryResult:
    return QueryResult(json, lambda x: None)


@pytest.fixture
def esv_provider():
    return ESVApiTranslationProvider()


def test_get_translations_for_few_results(monkeypatch, esv_provider: ESVApiTranslationProvider):
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
    mock_response(monkeypatch, {
        'passages': [
            'text of Mark.1.1',
            'text of Matt.1.1-Matt.1.2',
        ]
    })
    esv_provider.add_translations(result)
    assert result.passages[0].translation == 'text of Mark.1.1'
    assert result.passages[1].translation == 'text of Matt.1.1-Matt.1.2'
