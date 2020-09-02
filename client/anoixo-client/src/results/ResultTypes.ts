export type WordResult = {
  text: string;
  matchedSequence: number;
  matchedWordQuery: number;
  [name: string]: any;
};

export type ReferenceResult = {
  book: string;
  chapter: number;
  verse: number;
};

export type PassageResult = {
  references: ReferenceResult[];
  words: WordResult[];
  translation: string;
};

export type Pagination = {
  page: number;
  totalPages: number;
};

export type SuccessResponse = {
  pagination: Pagination;
  results: PassageResult[];
};

export type ErrorResponse = {
  error: string;
  description: string;
  friendlyErrorMessage: string;
};

const parseWordResult = (json: any): WordResult => {
  if (
    !(
      json &&
      typeof json.text === 'string' &&
      Number.isInteger(json.matchedSequence) &&
      Number.isInteger(json.matchedWordQuery)
    )
  ) {
    throw new TypeError();
  }
  return json as WordResult;
};

const parseReferenceResult = (json: any): ReferenceResult => {
  if (
    !(
      json &&
      typeof json.book === 'string' &&
      Number.isInteger(json.chapter) &&
      Number.isInteger(json.verse)
    )
  ) {
    throw new TypeError();
  }
  return {
    book: json.book,
    chapter: json.chapter,
    verse: json.verse,
  };
};

const parsePassageResult = (json: any): PassageResult => {
  if (
    !(
      json &&
      Array.isArray(json.references) &&
      Array.isArray(json.words) &&
      typeof json.translation === 'string'
    )
  ) {
    throw new TypeError();
  }

  return {
    references: json.references.map((reference: any) =>
      parseReferenceResult(reference)
    ),
    words: json.words.map((word: any) => parseWordResult(word)),
    translation: json.translation,
  };
};

const parsePagination = (json: any): Pagination => {
  if (
    !(json && Number.isInteger(json.page) && Number.isInteger(json.totalPages))
  ) {
    throw new TypeError();
  }

  return {
    page: json.page,
    totalPages: json.totalPages,
  };
};

export const parseSuccessResponse = (json: any): SuccessResponse => {
  if (
    !(json && json.pagination && json.results && Array.isArray(json.results))
  ) {
    throw new TypeError();
  }

  return {
    pagination: parsePagination(json.pagination),
    results: json.results.map((passage: any) => parsePassageResult(passage)),
  };
};

export const parseErrorResponse = (json: any): ErrorResponse => {
  if (
    !(
      json &&
      typeof json.error === 'string' &&
      typeof json.description === 'string' &&
      typeof json.friendlyErrorMessage === 'string'
    )
  ) {
    throw new TypeError();
  }
  return {
    error: json.error,
    description: json.description,
    friendlyErrorMessage: json.friendlyErrorMessage,
  };
};
