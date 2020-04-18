import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ResultsError from '../ResultsError';

describe('Results component', () => {
  it('displays an explanation that there was an error', () => {
    const { getByText } = render(
      <ResultsError
        error={{ error: '', description: '' }}
        closeResults={() => { }}
      />
    );
    expect(getByText('There was a problem doing your search')).toBeInTheDocument();
  });

  it('displays the given error name and description', () => {
    const { getByText } = render(
      <ResultsError
        error={{ error: 'error name', description: 'error description' }}
        closeResults={() => {}}
      />
    );
    expect(getByText(/error name/)).toBeInTheDocument();
    expect(getByText(/error description/)).toBeInTheDocument();
  });

  it('displays a back button that closes the results', () => {
    const closeResults = jest.fn();
    const { getByText } = render(
      <ResultsError
        error={{ error: '', description: '' }}
        closeResults={closeResults}
      />
    );
    fireEvent.click(getByText('Back to Search'));
    expect(closeResults).toHaveBeenCalled();
  });
});