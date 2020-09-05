import React from 'react';
import { shallow } from 'enzyme';
import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { TextContextProvider } from './texts/TextContext';
import QueryBuilder from './query/QueryBuilder';
import Results from './results/Results';
import fetchMock from 'jest-fetch-mock';

it('provides the current text setting', () => {
  const app = shallow(<App />);
  expect(app.find(TextContextProvider)).toBeDefined();
});

it('contains the query builder', () => {
  const app = shallow(<App />);
  expect(app.find(QueryBuilder)).toBeDefined();
});

it('contains the results view', () => {
  const app = shallow(<App />);
  expect(app.find(Results)).toBeDefined();
});

it('resets the current page of results when the results view is closed', async () => {
  // Fake pages of results for mocking API responses
  const fakeResults = [
    {
      references: [],
      translation: '',
      words: [],
    },
  ];
  const page1Response = {
    pagination: {
      page: 1,
      totalPages: 2,
    },
    results: fakeResults,
  };
  const page2Response = {
    pagination: {
      page: 2,
      totalPages: 2,
    },
    results: fakeResults,
  };

  // Mock stuff for attribute query cache and render the app
  fetchMock.mockResponses('[]', '[]');
  await act(async () => {
    render(<App />);
  });

  // Click "search" and get response for 1st page
  const searchButton = screen.getByRole('button', { name: 'Search' });
  fetchMock.mockOnce(JSON.stringify(page1Response));
  await act(async () => {
    fireEvent.click(searchButton);
  });

  // Go the second page of results
  const page2Button = screen.getAllByLabelText('Go to page 2')[0];
  fetchMock.mockOnce(JSON.stringify(page2Response));
  await act(async () => {
    fireEvent.click(page2Button);
  });

  // Now go back to query view
  const goBackButton = screen.getAllByRole('button', {
    name: 'Back to Search',
  })[0];
  fireEvent.click(goBackButton);

  // Click "Search" again
  const newSearchButton = screen.getByRole('button', { name: 'Search' });
  fetchMock.mockOnce(JSON.stringify(page1Response));
  await act(async () => {
    fireEvent.click(newSearchButton);
  });

  // Assert that the request was made for page 1, not page 2 like we left off
  const jsonBody =
    fetchMock.mock.calls[4][1] && fetchMock.mock.calls[4][1].body;
  expect(jsonBody).toEqual(
    JSON.stringify({
      page: 1,
      sequences: [[{}]],
    })
  );
});
