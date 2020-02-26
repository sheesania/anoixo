import abc
from QueryResult import QueryResult


class TranslationProviderError(Exception):
    def __init__(self, message):
        self.message = message


class TranslationProvider(abc.ABC):
    @abc.abstractmethod
    def add_translations(self, query_result: QueryResult) -> None:
        pass
