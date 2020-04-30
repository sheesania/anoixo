import React from 'react';
import fetchMock from 'jest-fetch-mock';
import { act, render } from '@testing-library/react';
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
            closeSelf={() => { }}
          />
        </TextContextProvider>
      );

      const message = await findByText('There was a problem doing your search');
      expect(message).toBeInTheDocument();
    });
  });
});