import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';
import withMarkup from '../../test/helpers/withMarkup';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import PassageCard from '../PassageCard';
import ResultsListing from '../ResultsListing';

describe('ResultsListing component', () => {
  const blankResponse = {
    pagination: {
      page: 1,
      totalPages: 1,
    },
    results: [],
  };

  describe('results view', () => {
    it('displays a message if no results were passed in', () => {
      const response = blankResponse;
      const { getByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const noResultsFoundMessage = getByText(
        'No results were found for your search.'
      );
      expect(noResultsFoundMessage).toBeInTheDocument();
    });

    it('displays passage cards for results if results were passed in', () => {
      const response = {
        ...blankResponse,
        results: [
          { references: [], words: [], translation: '' },
          { references: [], words: [], translation: '' },
          { references: [], words: [], translation: '' },
        ],
      };
      const wrapper = mount(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      expect(wrapper.find(PassageCard)).toHaveLength(3);
    });

    it('does not display the no results found message if there are results', () => {
      const response = {
        ...blankResponse,
        results: [{ references: [], words: [], translation: '' }],
      };
      const { queryByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const noResultsFoundMessage = queryByText(
        'No results were found for your search.'
      );
      expect(noResultsFoundMessage).toBeNull();
    });
  });

  describe('verbalization', () => {
    it('displays a verbalization of the query when there were results', () => {
      const query = {
        sequences: [
          [
            {
              attributes: {
                case: 'genitive',
              },
            },
          ],
        ],
      };
      const response = {
        ...blankResponse,
        results: [{ references: [], words: [], translation: '' }],
      };
      const { getByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={query}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      expect(withMarkup(getByText)('for a genitive')).toBeInTheDocument();
    });

    it('displays a verbalization of the query when there were no results', () => {
      const query = {
        sequences: [
          [
            {
              attributes: {
                case: 'genitive',
              },
            },
          ],
        ],
      };
      const response = blankResponse;
      const { getByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={query}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      expect(withMarkup(getByText)('for a genitive')).toBeInTheDocument();
    });
  });

  describe('copyright notice', () => {
    it('renders the required copyright notice', () => {
      const response = {
        ...blankResponse,
        results: [{ references: [], words: [], translation: '' }],
      };
      const { getByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const getByTextWithMarkup = withMarkup(getByText);
      const copyright =
        'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), ' +
        'copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights ' +
        'reserved. You may not copy or download more than 500 consecutive verses of the ESV Bible or more than one ' +
        'half of any book of the ESV Bible.';
      expect(getByTextWithMarkup(copyright)).toBeInTheDocument();
    });

    it('renders the required link to ESV.org', () => {
      const response = {
        ...blankResponse,
        results: [{ references: [], words: [], translation: '' }],
      };
      const { getByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const link = getByText('ESV® Bible');
      expect(link.getAttribute('href')).toBe('http://www.esv.org/');
    });

    it('does not render the copyright notice and link if there are no results', () => {
      const response = blankResponse;
      const { queryByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const copyright = queryByText('ESV® Bible');
      expect(copyright).toBeNull();
    });
  });

  describe('pagination', () => {
    it('displays the correct pages in the pagination if there are results', () => {
      const response = {
        pagination: {
          page: 1,
          totalPages: 3,
        },
        results: [{ references: [], words: [], translation: '' }],
      };
      const { getAllByLabelText, queryAllByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      expect(getAllByLabelText('page 1').length).toBe(2);
      expect(getAllByLabelText('Go to page 2').length).toBe(2);
      expect(getAllByLabelText('Go to page 3').length).toBe(2);
      expect(queryAllByLabelText('Go to page 4').length).toBe(0);
    });

    it('goes to the right page when the pagination is clicked', () => {
      const response = {
        pagination: {
          page: 1,
          totalPages: 3,
        },
        results: [{ references: [], words: [], translation: '' }],
      };
      const goToPageCallback = jest.fn();
      const { getAllByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={goToPageCallback}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      const page2Button = getAllByLabelText('Go to page 2')[0];
      fireEvent.click(page2Button);
      expect(goToPageCallback).toHaveBeenCalledWith(2);
    });

    it('does not display pagination if there are no results', () => {
      const response = blankResponse;
      const { queryAllByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <ResultsListing
            query={{ sequences: [] }}
            response={response}
            goToPage={() => {}}
            closeResults={() => {}}
          />
        </TextContextProvider>
      );
      expect(queryAllByLabelText('page 1').length).toBe(0);
    });
  });
});
