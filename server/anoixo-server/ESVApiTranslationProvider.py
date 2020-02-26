import aiohttp
import asyncio
import ESVApiTranslationProvider_Secret as Config
from typing import Dict, List
from QueryResult import QueryResult, Reference
from TranslationProvider import TranslationProvider, TranslationProviderError


class TranslationsForResultIndexes:
    def __init__(self, response: Dict, result_start_index: int):
        if not (isinstance(response, dict) and
                'passages' in response and
                isinstance(response['passages'], list)):
            raise TranslationProviderError('Invalid response from ESV API')
        self.translations: List[str] = response['passages']
        self.result_start_index = result_start_index

    def __repr__(self):
        return f'Translations starting at index {self.result_start_index}: {{{self.translations}}}'


class ESVApiTranslationProvider(TranslationProvider):

    """
    How many characters the request line is besides the verse query string part.
    It's necessary to keep track of the request line size since the ESV API rejects requests with request lines >
    4094 bytes/chars.
    """
    STARTING_REQUEST_LINE_SIZE = 225

    DEFAULT_REQUEST_PARAMS = {
        'include-passage-references': 'false',
        'include-verse-numbers': 'false',
        'include-first-verse-numbers': 'false',
        'include-footnotes': 'false',
        'include-headings': 'false',
        'include-short-copyright': 'false',
        'indent-paragraphs': '0',
    }

    def _get_verse_query(self, references: List[Reference]) -> str:
        if not references:
            raise TranslationProviderError('Result has no references')
        if len(references) == 1:
            return references[0].string_ref
        else:
            return f'{references[0].string_ref}-{references[-1].string_ref}'

    async def _send_query(self, session: aiohttp.ClientSession, chunk_verse_queries: List[str],
                          chunk_start_index: int) -> TranslationsForResultIndexes:
        query = ';'.join(chunk_verse_queries)
        print(query)
        try:
            resp = await session.get('https://api.esv.org/v3/passage/text',
                                     params={'q': query, **self.DEFAULT_REQUEST_PARAMS})
            json = await resp.json()
        except aiohttp.ContentTypeError:
            raise TranslationProviderError('ESV API did not return JSON')
        except aiohttp.ClientResponseError as err:
            if err.status == 502:
                raise TranslationProviderError('ESV API quota exceeded')
            else:
                raise TranslationProviderError(f'Error response from ESV API: {err.status} {err.message}')
        return TranslationsForResultIndexes(json, chunk_start_index)

    async def _request_translations(self, query_result: QueryResult) -> List[TranslationsForResultIndexes]:
        async with aiohttp.ClientSession(
                headers={'Authorization': Config.esv_api_key}, raise_for_status=True) as session:
            result_index = 0
            verses_in_chunk_counter = 0
            query_string_length = self.STARTING_REQUEST_LINE_SIZE
            chunk_verse_queries: List[str] = []
            chunk_start_index = 0
            requests = []

            while result_index < len(query_result.passages):
                result = query_result.passages[result_index]
                verses_in_chunk_counter += len(result.references)
                verse_query = self._get_verse_query(result.references)
                query_string_length += len(verse_query) + 3  # add 3 chars for URL-encoded semicolon character

                # Partition requests into 300-verse chunks/4094-char request lines
                if verses_in_chunk_counter > 300 or query_string_length > 4094:
                    requests.append(self._send_query(session, chunk_verse_queries, chunk_start_index))
                    verses_in_chunk_counter = 0
                    query_string_length = self.STARTING_REQUEST_LINE_SIZE
                    chunk_verse_queries = []
                    chunk_start_index = result_index
                else:
                    chunk_verse_queries.append(verse_query)
                    result_index += 1

            # if there is a remainder from the 300-verse/4094-char chunks
            if verses_in_chunk_counter > 0:
                requests.append(self._send_query(session, chunk_verse_queries, chunk_start_index))

            results = await asyncio.gather(*requests)
            return results

    def _add_translations_to_result(self, query_result: QueryResult,
                                    translation_chunks: List[TranslationsForResultIndexes]) -> None:
        for translation_chunk in translation_chunks:
            result_start_index = translation_chunk.result_start_index
            translations = translation_chunk.translations
            for i in range(len(translations)):
                query_result.passages[result_start_index + i].translation = translations[i]

    def add_translations(self, query_result: QueryResult) -> None:
        translations = asyncio.run(self._request_translations(query_result))
        print(translations)
        self._add_translations_to_result(query_result, translations)
