import React from 'react';
import fetchMock from 'jest-fetch-mock';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import Results from '../Results';

describe('Results component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('displays an error message if there is a problem with the request', async () => {
    fetchMock.mockOnce(JSON.stringify('invalid response'));
    await act(async () => {
      const { findByText } = render(
        <TextContextProvider text={TextName.NLF}>
          <Results
            query={{ sequences: [[{}]] }}
            isOpen={true}
            closeSelf={() => {}}
          />
        </TextContextProvider>
      );

      const message = await findByText('There was a problem doing your search');
      expect(message).toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    const page1Response = {
      pagination: {
        page: 1,
        totalPages: 2,
      },
      results: [
        {
          references: [],
          translation: 'page 1',
          words: [],
        },
      ],
    };

    it('requests page 1 when first rendered', async () => {
      fetchMock.mockOnce(JSON.stringify(page1Response));
      const query = { sequences: [[{}]] };
      await act(async () => {
        render(
          <TextContextProvider text={TextName.NLF}>
            <Results query={query} isOpen={true} closeSelf={() => {}} />
          </TextContextProvider>
        );
      });
      const jsonBody =
        fetchMock.mock.calls[0][1] && fetchMock.mock.calls[0][1].body;
      expect(jsonBody).toEqual(
        JSON.stringify({
          page: 1,
          ...query,
        })
      );
    });

    it('requests and displays a new page when pagination is toggled', async () => {
      const query = { sequences: [[{}]] };

      fetchMock.mockOnce(JSON.stringify(page1Response));
      await act(async () => {
        render(
          <TextContextProvider text={TextName.NLF}>
            <Results query={query} isOpen={true} closeSelf={() => {}} />
          </TextContextProvider>
        );
      });

      const page2Response = {
        pagination: {
          page: 2,
          totalPages: 2,
        },
        results: [
          {
            references: [],
            translation: 'page 2',
            words: [],
          },
        ],
      };
      fetchMock.mockOnce(JSON.stringify(page2Response));
      const page2Button = screen.getAllByLabelText('Go to page 2')[0];
      await act(async () => {
        fireEvent.click(page2Button);
      });

      const jsonBody =
        fetchMock.mock.calls[1][1] && fetchMock.mock.calls[1][1].body;
      expect(jsonBody).toEqual(
        JSON.stringify({
          page: 2,
          ...query,
        })
      );
      expect(screen.getByText('page 2')).toBeInTheDocument();
    });

    it('handles errors when requesting new pages', async () => {
      fetchMock.mockOnce(JSON.stringify(page1Response));
      await act(async () => {
        render(
          <TextContextProvider text={TextName.NLF}>
            <Results
              query={{ sequences: [[{}]] }}
              isOpen={true}
              closeSelf={() => {}}
            />
          </TextContextProvider>
        );
      });

      fetchMock.mockReject(new Error('fake error'));
      const page2Button = screen.getAllByLabelText('Go to page 2')[0];
      await act(async () => {
        fireEvent.click(page2Button);
      });

      expect(
        screen.getByText('There was a problem doing your search')
      ).toBeInTheDocument();
    });
  });
});
