import pytest
from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
from typing import Callable
from unittest.mock import MagicMock
from AnoixoError import ProbableBugError, ServerOverwhelmedError


@pytest.fixture
def basex_session_mock(mocker):
    basex_session_mock = MagicMock()
    mocker.patch('BaseXClient.BaseXClient.Session', basex_session_mock)
    return basex_session_mock


@pytest.fixture
def provider():
    return Nestle1904LowfatProvider()


def mock_basex_on_query_execute(mocker, basex_session_mock: MagicMock, on_query_execute: Callable):
    class MockQuery:
        def __init__(self, query_string):
            pass

        def execute(self):
            return on_query_execute()

    basex_session_mock.return_value.query = lambda query_string: MockQuery(query_string)
    spy = mocker.spy(MockQuery, '__init__')
    return spy


def test_handles_basex_not_available(mocker, provider):
    def raise_connection_refused(*args):
        raise ConnectionRefusedError()
    mocker.patch('BaseXClient.BaseXClient.Session.__init__', new=raise_connection_refused)
    with pytest.raises(ServerOverwhelmedError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error executing XML database query: ConnectionRefusedError'


def test_reconnects_to_basex_after_error(mocker, provider):
    def raise_connection_refused(*args):
        raise ConnectionRefusedError()
    mocker.patch('BaseXClient.BaseXClient.Session.__init__', new=raise_connection_refused)
    with pytest.raises(ServerOverwhelmedError):
        provider.attribute_query('test_attr')

    basex_session_mock = MagicMock()
    mocker.patch('BaseXClient.BaseXClient.Session', basex_session_mock)
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_retries_queries(basex_session_mock, provider):
    class MockQuery:
        def execute(self):
            return '["value1","value2"]'
    basex_session_mock.return_value.query.side_effect = [Exception(), Exception(), MockQuery()]

    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']
    assert basex_session_mock.return_value.query.call_count == 3


def test_reconnects_to_basex_even_if_close_fails(basex_session_mock, provider):
    class MockQuery:
        def execute(self):
            return '["value1","value2"]'

    def raise_broken_pipe_error():
        raise BrokenPipeError()

    basex_session_mock.return_value.query.side_effect = [Exception(), Exception(), MockQuery()]
    basex_session_mock.return_value.close = raise_broken_pipe_error

    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_closes_basex_session_even_on_errors(mocker, basex_session_mock, provider):
    def raise_exception():
        raise ServerOverwhelmedError('exception on query')
    mock_basex_on_query_execute(mocker, basex_session_mock, raise_exception)

    with pytest.raises(ServerOverwhelmedError):
        provider.attribute_query('test_attr')
    assert basex_session_mock.return_value.close.call_count == 3


def test_attribute_query_success(mocker, basex_session_mock, provider):
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    result = provider.attribute_query('test_attr')
    assert result == ['value1', 'value2']


def test_attribute_query_query_string(mocker, basex_session_mock, provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["value1","value2"]')
    provider.attribute_query('test_attr')
    assert basex_query_spy.call_args.args[1] == """
            json:serialize(
              array {
                sort(distinct-values(//w/@test_attr))
              }
            )
        """


def test_attribute_query_lemma_caching(mocker, basex_session_mock, provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["lemma1","lemma2"]')
    result1 = provider.attribute_query('lemma')
    assert result1 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('lemma')
    assert result2 == ['lemma1', 'lemma2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_surface_form_caching(mocker, basex_session_mock, provider):
    basex_query_spy = mock_basex_on_query_execute(mocker, basex_session_mock, lambda: '["normalized1","normalized2"]')
    result1 = provider.attribute_query('normalized')
    assert result1 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1
    result2 = provider.attribute_query('normalized')
    assert result2 == ['normalized1', 'normalized2']
    assert basex_query_spy.call_count == 1


def test_attribute_query_error_on_query(mocker, basex_session_mock, provider):
    def raise_exception():
        raise Exception()
    mock_basex_on_query_execute(mocker, basex_session_mock, raise_exception)
    with pytest.raises(ServerOverwhelmedError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error executing XML database query: Exception'


def test_attribute_query_error_on_processing_results(mocker, basex_session_mock, provider):
    mock_basex_on_query_execute(mocker, basex_session_mock, lambda: 'not valid json')
    with pytest.raises(ProbableBugError) as excinfo:
        provider.attribute_query('test_attr')
    assert excinfo.value.message == 'Error processing query results: JSONDecodeError'
