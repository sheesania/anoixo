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

export type SuccessResult = PassageResult[];

export type ErrorResult = {
  error: string;
  description: string;
  friendlyErrorMessage: string;
};

export const parseWordResult = (json: any): WordResult => {
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

export const parseReferenceResult = (json: any): ReferenceResult => {
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

export const parsePassageResult = (json: any): PassageResult => {
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

export const parseSuccessResult = (json: any): SuccessResult => {
  if (!Array.isArray(json)) {
    throw new TypeError();
  }
  return json.map((passage: any) => parsePassageResult(passage));
};

export const parseErrorResult = (json: any): ErrorResult => {
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
