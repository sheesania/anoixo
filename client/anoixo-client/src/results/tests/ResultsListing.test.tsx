import React from 'react';
import { render } from '@testing-library/react';
import withMarkup from '../../test/helpers/withMarkup';
import ResultsListing from '../ResultsListing';

describe('ResultsListing component', () => {
  it('renders the required copyright notice', () => {
    const result = [{references: [], words: [], translation: ''}]
    const { getByText } = render(<ResultsListing results={result} closeResults={() => {}} />);
    const getByTextWithMarkup = withMarkup(getByText);
    const copyright = 'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), ' +
      'copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights ' +
      'reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one ' +
      'half of any book of the ESV Bible.';
    expect(getByTextWithMarkup(copyright)).toBeInTheDocument();
  });

  it('renders the required link to ESV.org', () => {
    const result = [{references: [], words: [], translation: ''}]
    const { getByText } = render(<ResultsListing results={result} closeResults={() => {}} />);
    const link = getByText('ESV® Bible');
    expect(link.getAttribute('href')).toBe('http://www.esv.org/');
  });
});
