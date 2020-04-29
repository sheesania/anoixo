import React from 'react';
import { render } from '@testing-library/react';
import PassageLinks from '../PassageLinks';

describe('PassageLinks component', () => {
  it('shows a link to the NET Bible', () => {
    const { getByText } = render(
      <PassageLinks
        references={[{ book: 'Phlm', chapter: 1, verse: 1 }]}
      />
    );
    const link = getByText('NET Bible').closest('a');
    expect(link && link.getAttribute('href')).toBe('https://netbible.org/bible/Philemon+1');
  });

  it('shows a link to commentaries at BibleHub', () => {
    const { getByText } = render(
      <PassageLinks
        references={[{ book: '2Cor', chapter: 1, verse: 1 }, { book: '2Cor', chapter: 1, verse: 2 }]}
      />
    );
    const link = getByText('Commentaries').closest('a');
    expect(link && link.getAttribute('href')).toBe('https://biblehub.com/commentaries/2_corinthians/1-1.htm');
  });

  it('shows a link to other translations at Bible Gateway', () => {
    const { getByText } = render(
      <PassageLinks
        references={[{ book: '2Cor', chapter: 1, verse: 1 }, { book: '2Cor', chapter: 1, verse: 2 }]}
      />
    );
    const link = getByText('Compare other translations').closest('a');
    expect(link && link.getAttribute('href')).toBe(
      'https://www.biblegateway.com/passage/?search=2Cor1:1-1:2&version=SBLGNT;ESV');
  })
});