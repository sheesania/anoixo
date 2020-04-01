import pytest
from text_providers.TextProvider import TextProviderError
from typing import Callable
from unittest.mock import MagicMock


@pytest.fixture
def get_nestle_lowfat_provider(mocker):
    from test_helpers.mock_decorator import mock_decorator
    mocker.patch('timeout_decorator.timeout', mock_decorator)
    basex_session_mock = MagicMock()
    mocker.patch('BaseXClient.BaseXClient.Session', basex_session_mock)
    from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider

    def get_provider_and_basex_query_spy(on_query_execute: Callable) -> (Nestle1904LowfatProvider, MagicMock):
        class MockQuery:
            def __init__(self, query_string):
                pass
            def execute(self):
                return on_query_execute()
        basex_session_mock.return_value.query = lambda query_string: MockQuery(query_string)
        spy = mocker.spy(MockQuery, '__init__')
        return Nestle1904LowfatProvider(), spy
    return get_provider_and_basex_query_spy


def test_attribute_query_success(get_nestle_lowfat_provider):
    provider = get_nestle_lowfat_provider(lambda: '["value1","value2"]')[0]
    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_attribute_query_query_string(get_nestle_lowfat_provider):
    provider, basex_query_spy = get_nestle_lowfat_provider(lambda: '["value1","value2"]')
    provider.attribute_query('test_attr')
    assert basex_query_spy.call_args.args[1] == """
            json:serialize(
              array {
                sort(distinct-values(//w/@test_attr))
              }
            )
        """


def test_attribute_query_lemma_caching(get_nestle_lowfat_provider):
    provider, basex_query_spy = get_nestle_lowfat_provider(lambda: '["lemma1","lemma2"]')
    result1 = provider.attribute_query('lemma')
    assert result1 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('lemma')
    assert result2 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_surface_form_caching(get_nestle_lowfat_provider):
    provider, basex_query_spy = get_nestle_lowfat_provider(lambda: '["normalized1","normalized2"]')
    result1 = provider.attribute_query('normalized')
    assert result1 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('normalized')
    assert result2 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_error_on_query(get_nestle_lowfat_provider):
    def raise_exception():
        raise TextProviderError('exception on query')
    provider = get_nestle_lowfat_provider(raise_exception)[0]
    with pytest.raises(TextProviderError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'exception on query'


def test_attribute_query_error_on_processing_results(get_nestle_lowfat_provider):
    provider = get_nestle_lowfat_provider(lambda: 'not valid json')[0]
    with pytest.raises(TextProviderError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error processing query results: JSONDecodeError'
