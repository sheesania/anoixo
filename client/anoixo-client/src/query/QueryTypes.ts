export type Link = {
    allowedWordsBetween: number;
}

export type WordQuery = {
    attributes?: {
        [name: string]: string;
    }
    link?: Link;
}

export type Sequence = WordQuery[];

export type Query = {
    sequences: Sequence[];
}