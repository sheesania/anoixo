import abc
from QueryResult import QueryResult
from TextQuery import TextQuery


class ProviderError(Exception):
    def __init__(self, message):
        self.message = message


class TextProvider(abc.ABC):
    @abc.abstractmethod
    def get_provided_text_name(self) -> str:
        pass

    @abc.abstractmethod
    def get_source_name(self) -> str:
        pass

    @abc.abstractmethod
    def get_text_for_reference(self, reference: str) -> str:
        pass

    @abc.abstractmethod
    def text_query(self, query: TextQuery) -> QueryResult:
        pass
