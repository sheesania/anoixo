import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import withMarkup from '../../test/helpers/withMarkup';
import PassageCard from '../PassageCard';
import ResultsListing from '../ResultsListing';
import { SuccessResult } from '../ResultTypes';

describe('ResultsListing component', () => {
  it('displays a message if no results were passed in', () => {
    const result: SuccessResult = [];
    const { getByText } = render(<ResultsListing results={result} closeResults={() => {}} />);
    const noResultsFoundMessage = getByText('No results were found for your search.')
    expect(noResultsFoundMessage).toBeInTheDocument();
  });

  it('displays passage cards for results if results were passed in', () => {
    const result = [
      { references: [], words: [], translation: '' },
      { references: [], words: [], translation: '' },
      { references: [], words: [], translation: '' },
    ];
    const wrapper = shallow(<ResultsListing results={result} closeResults={() => { }} />);
    expect(wrapper.find(PassageCard)).toHaveLength(3);
  });

  it('does not display the no results found message if there are results', () => {
    const result = [{ references: [], words: [], translation: '' }];
    const { queryByText } = render(<ResultsListing results={result} closeResults={() => {}} />);
    const noResultsFoundMessage = queryByText('No results were found for your search.')
    expect(noResultsFoundMessage).toBeNull();
  });

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

  it('does not render the copyright notice and link if there are no results', () => {
    const result: SuccessResult = [];
    const { queryByText } = render(<ResultsListing results={result} closeResults={() => {}} />);
    const copyright = queryByText('ESV® Bible')
    expect(copyright).toBeNull();
  });
});
