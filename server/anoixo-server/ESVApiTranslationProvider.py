from QueryResult import QueryResult
from TranslationProvider import TranslationProvider


class ESVApiTranslationProvider(TranslationProvider):

    def add_translations(self, query_result: QueryResult) -> None:
        for result in query_result.passages:
            result.translation = 'ESV translation'
