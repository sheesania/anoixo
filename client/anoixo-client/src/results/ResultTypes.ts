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
};

export type Result = PassageResult[];

export type ErrorResult = {
    error: string;
    description: string;
};