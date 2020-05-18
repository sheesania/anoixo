import pytest
import re
from app import app
from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
from translation_providers.ESVApiTranslationProvider import ESVApiTranslationProvider
from typing import Dict
from werkzeug.wrappers import BaseResponse
from AnoixoError import ServerOverwhelmedError
from QueryResult import QueryResult


@pytest.fixture
def client(mocker):
    mocker.patch('text_providers.Nestle1904LowfatProvider.Nestle1904LowfatProvider', autospec=True)
    mocker.patch('translation_providers.ESVApiTranslationProvider.ESVApiTranslationProvider', autospec=True)
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client


def get_json_response(response: BaseResponse) -> Dict:
    import json
    return json.loads(response.get_data(as_text=True))


def test_logging_for_text_query(monkeypatch, capsys, client):
    def mock_provider_text_query(self, query_result):
        return QueryResult([{'references': ['Mark.1.1'], 'words': []}], lambda x: None)
    monkeypatch.setattr(Nestle1904LowfatProvider, 'text_query', mock_provider_text_query)

    def mock_add_translations(self, query_result):
        return query_result
    monkeypatch.setattr(ESVApiTranslationProvider, 'add_translations', mock_add_translations)

    client.post('/api/text/nlf', json={'sequences': [
        [
            {
                'attributes': {
                    'lemma': 'λόγος'
                }
            }
        ]
    ]})
    captured = capsys.readouterr()
    assert re.search(
        r"^\[\w\w\w \w\w\w \d\d \d\d:\d\d:\d\d \d\d\d\d\] 127\.0\.0\.1 POST /api/text/nlf 200\n\t" +
        r"Time: \d+\.\d+\n\t" +
        r"Request: {'sequences': \[\[{'attributes': {'lemma': 'λόγος'}}]]}\n\t" +
        r"Response: <1 results>$",
        captured.out
    )


def test_logging_for_attribute_query(monkeypatch, capsys, client):
    def mock_attribute_query(self, attribute_id):
        return [f'val1', f'val2']
    monkeypatch.setattr(Nestle1904LowfatProvider, 'attribute_query', mock_attribute_query)
    client.get('/api/text/nlf/attribute/lemma')
    captured = capsys.readouterr()
    assert re.search(
        r"GET /api/text/nlf/attribute/lemma 200\n\t" +
        r"Time: .*\n\t" +
        r"Request: None\n\t" +
        r"Response: <2 results>$",
        captured.out
    )


def test_logging_for_error(monkeypatch, capsys, client):
    def mock_provider_text_query(self, query_result):
        raise ServerOverwhelmedError('Error message')
    monkeypatch.setattr(Nestle1904LowfatProvider, 'text_query', mock_provider_text_query)
    client.post('/api/text/nlf', json={'sequences': []})
    captured = capsys.readouterr()
    assert re.search(
        r"POST /api/text/nlf 500\n\t" +
        r"Time: .*\n\t" +
        r"Request: {'sequences': \[]}\n\t" +
        r"Response: {'description': 'Error message', 'error': 'Internal Server Error', 'friendlyErrorMessage': " +
        r"'It looks like the server is currently overwhelmed. Try your search again later.'}$",
        captured.out
    )


def test_logging_with_proxy_ip(monkeypatch, capsys, client):
    def mock_attribute_query(self, attribute_id):
        return [f'val1', f'val2']
    monkeypatch.setattr(Nestle1904LowfatProvider, 'attribute_query', mock_attribute_query)
    client.get('/api/text/nlf/attribute/lemma', headers={
        'X-Real-Ip': '256.256.256.256'
    })
    captured = capsys.readouterr()
    assert re.search(
        r"256\.256\.256\.256 GET /api/text/nlf/attribute/lemma 200",
        captured.out
    )


def test_text_query_success(monkeypatch, client):
    def mock_provider_text_query(self, text_query):
        return QueryResult([{
            'references': ['Mark.1.1'],
            'words': [{
                'matchedSequence': 0,
                'matchedWordQuery': 0,
                'text': 'word'
            }]
        }], lambda x: None)
    monkeypatch.setattr(Nestle1904LowfatProvider, 'text_query', mock_provider_text_query)

    def mock_add_translations(self, query_result):
        for passage in query_result.passages:
            passage.translation = 'translation text'
    monkeypatch.setattr(ESVApiTranslationProvider, 'add_translations', mock_add_translations)

    response = client.post('/api/text/nlf', json={'sequences': []})
    assert response.status_code == 200
    assert get_json_response(response) == [
        {
            'references': [{
                'book': 'Mark',
                'chapter': 1,
                'verse': 1,
            }],
            'words': [{
                'matchedSequence': 0,
                'matchedWordQuery': 0,
                'text': 'word'
            }],
            'translation': 'translation text'
        }
    ]


def test_text_query_handles_no_json_given(client):
    response = client.post('/api/text/nlf')
    assert response.status_code == 400
    assert get_json_response(response) == {
        'error': 'Bad Request',
        'description': 'Request does not contain a JSON body',
        'friendlyErrorMessage': 'It looks like there\'s a bug in the app. Please let us know you had this problem so '
                                'we can fix it!'
    }


def test_text_query_handles_invalid_json(client):
    response = client.post('/api/text/nlf', json={'invalid': 'json'})
    assert response.status_code == 400
    assert get_json_response(response) == {
        'error': 'Bad Request',
        'description': 'Error parsing JSON: Does not contain a list \'sequences\'',
        'friendlyErrorMessage': 'It looks like there\'s a bug in the app. Please let us know you had this problem so '
                                'we can fix it!'
    }


def test_text_query_handles_text_not_found(client):
    response = client.post('/api/text/invalid', json={'sequences': []})
    assert response.status_code == 404
    assert get_json_response(response) == {
        'error': 'Not Found',
        'description': 'Text provider with id \'invalid\' was not found. Available texts: nlf',
        'friendlyErrorMessage': 'It looks like there\'s a bug in the app. Please let us know you had this problem so '
                                'we can fix it!'
    }


def test_text_query_handles_text_provider_error(monkeypatch, client):
    def mock_provider_text_query(self, query_result):
        raise ServerOverwhelmedError('Error message')
    monkeypatch.setattr(Nestle1904LowfatProvider, 'text_query', mock_provider_text_query)
    response = client.post('/api/text/nlf', json={'sequences': []})
    assert response.status_code == 500
    assert get_json_response(response) == {
        'error': 'Internal Server Error',
        'description': 'Error message',
        'friendlyErrorMessage': 'It looks like the server is currently overwhelmed. Try your search again later.'
    }


def test_text_query_handles_translation_provider_error(monkeypatch, client):
    def mock_provider_text_query(self, query_result):
        return QueryResult([{'references': ['Mark.1.1'], 'words': []}], lambda x: None)
    monkeypatch.setattr(Nestle1904LowfatProvider, 'text_query', mock_provider_text_query)

    def mock_add_translations(self, query_result):
        raise ServerOverwhelmedError('Error message')
    monkeypatch.setattr(ESVApiTranslationProvider, 'add_translations', mock_add_translations)

    response = client.post('/api/text/nlf', json={'sequences': []})
    assert response.status_code == 500
    assert get_json_response(response) == {
        'error': 'Internal Server Error',
        'description': 'Error message',
        'friendlyErrorMessage': 'It looks like the server is currently overwhelmed. Try your search again later.'
    }


def test_attribute_query_success(monkeypatch, client):
    def mock_attribute_query(self, attribute_id):
        return [f'{attribute_id}_val1', f'{attribute_id}_val2']
    monkeypatch.setattr(Nestle1904LowfatProvider, 'attribute_query', mock_attribute_query)
    response = client.get('/api/text/nlf/attribute/lemma')
    assert response.status_code == 200
    assert get_json_response(response) == ['lemma_val1', 'lemma_val2']


def test_attribute_query_text_not_found(client):
    response = client.get('/api/text/fake_text/attribute/lemma')
    assert response.status_code == 404
    assert get_json_response(response)['error'] == 'Not Found'


def test_attribute_query_internal_error(monkeypatch, client):
    def mock_attribute_query(self, attribute_id):
        raise ServerOverwhelmedError('Error message')
    monkeypatch.setattr(Nestle1904LowfatProvider, 'attribute_query', mock_attribute_query)
    response = client.get('/api/text/nlf/attribute/lemma')
    assert response.status_code == 500
    assert get_json_response(response)['error'] == 'Internal Server Error'
    assert get_json_response(response)['description'] == 'Error message'
