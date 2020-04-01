import pytest


@pytest.fixture
def nestle_lowfat_provider(mocker):
    from test_helpers.mock_decorator import mock_decorator
    mocker.patch('timeout_decorator.timeout', mock_decorator)
    mocker.patch('BaseXClient.BaseXClient.Session', autospec=True)
    from text_providers.Nestle1904LowfatProvider import Nestle1904LowfatProvider
    return Nestle1904LowfatProvider()


def test_attribute_query(nestle_lowfat_provider):
    assert nestle_lowfat_provider.attribute_query('test') == ['value1', 'value2']
