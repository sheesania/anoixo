import aiohttp
import asyncio
from typing import List
from QueryResult import QueryResult, Reference
from TranslationProvider import TranslationProvider, TranslationProviderError


class ESVApiTranslationProvider(TranslationProvider):

    """
    How many characters the request line is besides the verse query string part.
    It's necessary to keep track of the request line size since the ESV API rejects requests with request lines >
    4094 bytes/chars.
    """
    STARTING_REQUEST_LINE_SIZE = 225

    def _get_verse_query(self, references: List[Reference]) -> str:
        if not references:
            raise TranslationProviderError('Result has no references')
        if len(references) == 1:
            return references[0].string_ref
        else:
            return f'{references[0].string_ref}-{references[-1].string_ref}'

    async def _send_query(self, session: aiohttp.ClientSession, chunk_verse_queries: List[str]):
        query = ';'.join(chunk_verse_queries)
        print(query)
        resp = await session.get('http://httpbin.org/get')
        return await resp.json()

    async def _request_translations(self, query_result: QueryResult) -> None:
        async with aiohttp.ClientSession() as session:
            result_index = 0
            verses_in_chunk_counter = 0
            query_string_length = self.STARTING_REQUEST_LINE_SIZE
            chunk_verse_queries: List[str] = []
            requests = []

            while result_index < len(query_result.passages):
                result = query_result.passages[result_index]
                verses_in_chunk_counter += len(result.references)
                verse_query = self._get_verse_query(result.references)
                query_string_length += len(verse_query) + 3  # add 3 chars for URL-encoded semicolon character

                # Partition requests into 300-verse chunks/4094-char request lines
                if verses_in_chunk_counter > 300 or query_string_length > 4094:
                    requests.append(self._send_query(session, chunk_verse_queries))
                    verses_in_chunk_counter = 0
                    query_string_length = self.STARTING_REQUEST_LINE_SIZE
                    chunk_verse_queries = []
                else:
                    chunk_verse_queries.append(verse_query)
                    result_index += 1

            # if there is a remainder from the 300-verse/4094-char chunks
            if verses_in_chunk_counter > 0:
                requests.append(self._send_query(session, chunk_verse_queries))

            results = await asyncio.gather(*requests)
            print(results)

    def add_translations(self, query_result: QueryResult) -> None:
        asyncio.run(self._request_translations(query_result))
