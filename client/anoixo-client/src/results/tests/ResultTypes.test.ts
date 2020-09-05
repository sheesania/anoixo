import { parseSuccessResponse } from '../ResultTypes';

describe('ResultTypes', () => {
  describe('parseSuccessResponse', () => {
    const correctResponse = {
      pagination: {
        page: 1,
        totalPages: 5,
      },
      results: [
        {
          references: [
            {
              book: 'Matt',
              chapter: 1,
              verse: 1,
            },
            {
              book: 'Matt',
              chapter: 1,
              verse: 2,
            },
          ],
          translation: 'translation',
          words: [
            {
              text: 'word1',
              matchedSequence: 0,
              matchedWordQuery: 0,
            },
            {
              text: 'word2',
              matchedSequence: -1,
              matchedWordQuery: -1,
            },
          ],
        },
      ],
    };

    it('parses a correct SuccessResponse', () => {
      expect(parseSuccessResponse(correctResponse)).toEqual(correctResponse);
    });

    it('throws a TypeError if there the response is not an object', () => {
      expect(() => {
        parseSuccessResponse([]);
      }).toThrow(TypeError);
    });

    it('throws a TypeError if the response does not have pagination info', () => {
      expect(() => {
        parseSuccessResponse({
          results: correctResponse.results,
        });
      }).toThrow(TypeError);
    });

    it('throws a TypeError if the response does not have results', () => {
      expect(() => {
        parseSuccessResponse({
          pagination: correctResponse.pagination,
        });
      }).toThrow(TypeError);
    });

    it('throws a TypeError if results are not a list', () => {
      expect(() => {
        parseSuccessResponse({
          pagination: correctResponse.pagination,
          results: {},
        });
      }).toThrow(TypeError);
    });

    it('throws a TypeError if pagination does not have the right attributes', () => {
      expect(() => {
        parseSuccessResponse({
          pagination: {
            wrong: 'attribute',
          },
          results: correctResponse.results,
        });
      }).toThrow(TypeError);
    });

    it('throws a TypeError if pagination attributes are not integers', () => {
      expect(() => {
        parseSuccessResponse({
          pagination: {
            page: 2,
            totalPages: undefined,
          },
          results: correctResponse.results,
        });
      }).toThrow(TypeError);
    });
  });
});
