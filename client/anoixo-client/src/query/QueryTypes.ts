export type Link = {
  allowedWordsBetween: number;
};

export type AttributesQuery = {
  [name: string]: string;
}

export type WordQuery = {
  attributes?: AttributesQuery;
  link?: Link;
};

export type Sequence = WordQuery[];

export type Query = {
  sequences: Sequence[];
};
