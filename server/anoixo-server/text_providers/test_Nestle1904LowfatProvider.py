import pytest
from text_providers.TextProvider import TextProviderError
from typing import Callable
from unittest.mock import MagicMock


@pytest.fixture
def basex_session_mock(mocker):
    basex_session_mock = MagicMock()
    mocker.patch('BaseXClient.BaseXClient.Session', basex_session_mock)
    return basex_session_mock


@pytest.fixture
def get_nestle_lowfat_provider(mocker):
    from test_helpers.mock_decorator import mock_decorator
    mocker.patch('timeout_decorator.timeout', mock_decorator)
    from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
    return lambda: Nestle1904LowfatProvider()


def mock_basex_on_query_execute(mocker, basex_session_mock: MagicMock, on_query_execute: Callable):
    class MockQuery:
        def __init__(self, query_string):
            pass

        def execute(self):
            return on_query_execute()

    basex_session_mock.return_value.query = lambda query_string: MockQuery(query_string)
    spy = mocker.spy(MockQuery, '__init__')
    return spy


def test_handles_basex_not_available(mocker, get_nestle_lowfat_provider):
    def raise_connection_refused(*args):
        raise ConnectionRefusedError()
    mocker.patch('BaseXClient.BaseXClient.Session.__init__', new=raise_connection_refused)
    provider = get_nestle_lowfat_provider()
    with pytest.raises(TextProviderError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error executing XML database query: ConnectionRefusedError'


def test_reconnects_to_basex_after_error(mocker, get_nestle_lowfat_provider):
    def raise_connection_refused(*args):
        raise ConnectionRefusedError()
    mocker.patch('BaseXClient.BaseXClient.Session.__init__', new=raise_connection_refused)
    provider = get_nestle_lowfat_provider()
    with pytest.raises(TextProviderError):
        provider.attribute_query('test_attr')

    basex_session_mock = MagicMock()
    mocker.patch('BaseXClient.BaseXClient.Session', basex_session_mock)
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_retries_queries(basex_session_mock, get_nestle_lowfat_provider):
    class MockQuery:
        def execute(self):
            return '["value1","value2"]'
    basex_session_mock.return_value.query.side_effect = [Exception(), Exception(), MockQuery()]
    provider = get_nestle_lowfat_provider()

    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']
    assert basex_session_mock.return_value.query.call_count == 3


def test_reconnects_to_basex_even_if_close_fails(mocker, basex_session_mock, get_nestle_lowfat_provider):
    class MockQuery:
        def execute(self):
            return '["value1","value2"]'

    def raise_broken_pipe_error():
        raise BrokenPipeError()

    basex_session_mock.return_value.query.side_effect = [Exception(), Exception(), MockQuery()]
    basex_session_mock.return_value.close = raise_broken_pipe_error
    provider = get_nestle_lowfat_provider()

    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_attribute_query_success(mocker, basex_session_mock, get_nestle_lowfat_provider):
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    provider = get_nestle_lowfat_provider()
    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_attribute_query_query_string(mocker, basex_session_mock, get_nestle_lowfat_provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    provider = get_nestle_lowfat_provider()
    provider.attribute_query('test_attr')
    assert basex_query_spy.call_args.args[1] == """
            json:serialize(
              array {
                sort(distinct-values(//w/@test_attr))
              }
            )
        """


def test_attribute_query_lemma_caching(mocker, basex_session_mock, get_nestle_lowfat_provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["lemma1","lemma2"]')
    provider = get_nestle_lowfat_provider()
    result1 = provider.attribute_query('lemma')
    assert result1 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('lemma')
    assert result2 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_surface_form_caching(mocker, basex_session_mock, get_nestle_lowfat_provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["normalized1","normalized2"]')
    provider = get_nestle_lowfat_provider()
    result1 = provider.attribute_query('normalized')
    assert result1 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('normalized')
    assert result2 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_error_on_query(mocker, basex_session_mock, get_nestle_lowfat_provider):
    def raise_exception():
        raise TextProviderError('exception on query')
    mock_basex_on_query_execute(mocker, basex_session_mock, raise_exception)
    provider = get_nestle_lowfat_provider()
    with pytest.raises(TextProviderError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'exception on query'


def test_attribute_query_error_on_processing_results(mocker, basex_session_mock, get_nestle_lowfat_provider):
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: 'not valid json')
    provider = get_nestle_lowfat_provider()
    with pytest.raises(TextProviderError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error processing query results: JSONDecodeError'
