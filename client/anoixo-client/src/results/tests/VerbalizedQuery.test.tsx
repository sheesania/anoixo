import React from 'react';
import { render } from '@testing-library/react';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import withMarkup from '../../test/helpers/withMarkup';
import VerbalizedQuery from '../VerbalizedQuery';

describe('VerbalizedQuery component', () => {
  it('verbalizes a query for a single word', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(getByTextWithMarkup('for a genitive')).toBeInTheDocument();
  });

  it('verbalizes a sequence with multiple words', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup('for a preposition followed by a genitive')
    ).toBeInTheDocument();
  });

  it('verbalizes words with restricted allowedWordsBetween', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                  link: {
                    allowedWordsBetween: 0,
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup(
        'for a preposition followed by a genitive with up to 0 words in between'
      )
    ).toBeInTheDocument();
  });

  it('uses the correct plural when allowedWordsBetween = 1', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                  link: {
                    allowedWordsBetween: 1,
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup(
        'for a preposition followed by a genitive with up to 1 word in between'
      )
    ).toBeInTheDocument();
  });

  it('verbalizes multiple sequences', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                  link: {
                    allowedWordsBetween: 1,
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
              [
                {
                  attributes: {
                    class: 'det',
                  },
                },
                {
                  attributes: {
                    mood: 'participle',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup(
        'for a preposition followed by a genitive with up to 1 word in between ' +
          'and an article/determiner followed by a participle'
      )
    ).toBeInTheDocument();
  });

  it('highlights the word descriptions in the verbalization', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                  link: {
                    allowedWordsBetween: 1,
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
            ],
          }}
        />
      </TextContextProvider>
    );

    expect(getByText('a preposition').nodeName).toEqual('STRONG');
    expect(getByText('a genitive').nodeName).toEqual('STRONG');
  });

  it('ignores empty sequences', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [
              [
                {
                  attributes: {
                    class: 'prep',
                  },
                },
                {
                  attributes: {
                    case: 'genitive',
                  },
                },
              ],
              [],
              [
                {
                  attributes: {
                    class: 'det',
                  },
                },
                {
                  attributes: {
                    mood: 'participle',
                  },
                },
              ],
              [],
            ],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(
      getByTextWithMarkup(
        'for a preposition followed by a genitive and an article/determiner followed by ' +
          'a participle'
      )
    ).toBeInTheDocument();
  });

  it('handles an empty query', () => {
    const { getByText } = render(
      <TextContextProvider text={TextName.NLF}>
        <VerbalizedQuery
          query={{
            sequences: [],
          }}
        />
      </TextContextProvider>
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(getByTextWithMarkup('for an empty query')).toBeInTheDocument();
  });
});
