import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ResultsError from '../ResultsError';

describe('Results component', () => {
  it('displays an explanation that there was an error', () => {
    const { getByText } = render(
      <ResultsError
        error={{ error: '', description: '', friendlyErrorMessage: '' }}
        closeResults={() => { }}
      />
    );
    expect(getByText('There was a problem doing your search')).toBeInTheDocument();
  });

  it('displays the friendly message for the given error', () => {
    const { getByText } = render(
      <ResultsError
        error={{ error: 'error name', description: 'error description', friendlyErrorMessage: 'friendly message' }}
        closeResults={() => {}}
      />
    );
    expect(getByText('friendly message')).toBeInTheDocument();
  });

  it('displays a back button that closes the results', () => {
    const closeResults = jest.fn();
    const { getByText } = render(
      <ResultsError
        error={{ error: '', description: '', friendlyErrorMessage: '' }}
        closeResults={closeResults}
      />
    );
    fireEvent.click(getByText('Back to Search'));
    expect(closeResults).toHaveBeenCalled();
  });
});