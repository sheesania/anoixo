from QueryResult import QueryResult
from TextQuery import TextQuery
from typing import List
import abc


class TextProviderError(Exception):
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

    @abc.abstractmethod
    def attribute_query(self, attribute_name: str) -> List[str]:
        pass
