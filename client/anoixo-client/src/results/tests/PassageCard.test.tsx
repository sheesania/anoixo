import React from 'react';
import { render } from '@testing-library/react';
import withMarkup from '../../test/helpers/withMarkup';
import PassageCard from '../PassageCard';

describe('PassageCard component', () => {
  it('renders the passage reference, text, and translation', () => {
    const passageResult = {
      references: [
        {
          book: 'John',
          chapter: 11,
          verse: 35,
        },
      ],
      words: [
        {
          text: 'ἐδάκρυσεν',
          matchedSequence: -1,
          matchedWordQuery: -1,
        },
        {
          text: 'ὁ',
          matchedSequence: 0,
          matchedWordQuery: 0,
        },
        {
          text: 'Ἰησοῦς.',
          matchedSequence: 0,
          matchedWordQuery: 1,
        },
      ],
      translation: 'Jesus wept.',
    };
    const { getByText } = render(
      <PassageCard passage={passageResult} passageIndex={0} />
    );
    const getByTextWithMarkup = withMarkup(getByText);
    expect(getByText('John 11:35')).toBeInTheDocument();
    expect(getByTextWithMarkup('ἐδάκρυσεν ὁ Ἰησοῦς.')).toBeInTheDocument();
    expect(getByText('Jesus wept.')).toBeInTheDocument();
  });

  it('shows the reference correctly when it has multiple verses', () => {
    const passageResult = {
      references: [
        {
          book: 'John',
          chapter: 11,
          verse: 35,
        },
        {
          book: 'John',
          chapter: 11,
          verse: 36,
        },
      ],
      words: [],
      translation: '',
    };
    const { getByText } = render(
      <PassageCard passage={passageResult} passageIndex={0} />
    );
    expect(getByText('John 11:35-36')).toBeInTheDocument();
  });

  it('shows the reference correctly when it has multiple chapters', () => {
    const passageResult = {
      references: [
        {
          book: 'John',
          chapter: 11,
          verse: 35,
        },
        {
          book: 'John',
          chapter: 12,
          verse: 1,
        },
      ],
      words: [],
      translation: '',
    };
    const { getByText } = render(
      <PassageCard passage={passageResult} passageIndex={0} />
    );
    expect(getByText('John 11:35 - 12:1')).toBeInTheDocument();
  });

  it('highlights matched words', () => {
    const passageResult = {
      references: [
        {
          book: 'John',
          chapter: 11,
          verse: 35,
        },
      ],
      words: [
        {
          text: 'ἐδάκρυσεν',
          matchedSequence: 0,
          matchedWordQuery: 0,
        },
        {
          text: 'ὁ',
          matchedSequence: 1,
          matchedWordQuery: 0,
        },
        {
          text: 'Ἰησοῦς.',
          matchedSequence: -1,
          matchedWordQuery: -1,
        },
      ],
      translation: 'Jesus wept.',
    };
    const { getByText } = render(
      <PassageCard passage={passageResult} passageIndex={0} />
    );
    const matchedFirstSequence = getByText('ἐδάκρυσεν');
    expect(matchedFirstSequence.className).toBe('matched-word');
    const matchedSecondSequence = getByText('ὁ');
    expect(matchedSecondSequence.className).toBe('matched-word');
    const didNotMatch = getByText('Ἰησοῦς.');
    expect(didNotMatch.className).not.toBe('matched-word');
  });
});
