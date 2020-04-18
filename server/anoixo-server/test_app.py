import pytest
from app import app
from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
from typing import Dict
from werkzeug.wrappers import BaseResponse
from AnoixoError import ServerOverwhelmedError


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


def test_attribute_query_success(client):
    def mock_attribute_query(self, attribute_id):
        return [f'{attribute_id}_val1', f'{attribute_id}_val2']

    Nestle1904LowfatProvider.attribute_query = mock_attribute_query
    response = client.get('/api/text/nlf/attribute/lemma')
    assert response.status_code == 200
    assert get_json_response(response) == ['lemma_val1', 'lemma_val2']


def test_attribute_query_text_not_found(client):
    response = client.get('/api/text/fake_text/attribute/lemma')
    assert response.status_code == 404
    assert get_json_response(response)['error'] == 'Not Found'


def test_attribute_query_internal_error(client):
    def mock_attribute_query(self, attribute_id):
        raise ServerOverwhelmedError('Error message')

    Nestle1904LowfatProvider.attribute_query = mock_attribute_query
    response = client.get('/api/text/nlf/attribute/lemma')
    assert response.status_code == 500
    assert get_json_response(response)['error'] == 'Internal Server Error'
    assert get_json_response(response)['description'] == 'Error message'
