import abc
from QueryResult import QueryResult


class TranslationProvider(abc.ABC):
    @abc.abstractmethod
    def add_translations(self, query_result: QueryResult) -> None:
        pass
