import React from 'react';
import { render } from '@testing-library/react';
import { AttributeQueryCacheProvider } from '../AttributeQueryCache';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import fetchMock from 'jest-fetch-mock';
import { act } from 'react-dom/test-utils';

describe('AttributeQueryCacheProvider component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('makes attribute queries when first rendered', async () => {
    fetchMock.mockResponse(JSON.stringify(['value1', 'value2']));
    // async necessary to avoid React warnings about state changes in tests.
    // See https://github.com/facebook/react/issues/15379
    await act(async () => {
      render(
        <TextContextProvider text={TextName.NLF}>
          <AttributeQueryCacheProvider></AttributeQueryCacheProvider>
        </TextContextProvider>
      );
    });
    expect(fetchMock.mock.calls).toEqual([
      ['http://localhost:5000/api/text/nlf/attribute/lemma'],
      ['http://localhost:5000/api/text/nlf/attribute/normalized'],
    ]);
  });

  it('logs errors making attribute queries', async () => {
    fetchMock.mockReject(new Error('fake error'));
    const consoleSpy = jest.spyOn(console, 'log');
    await act(async () => {
      render(
        <TextContextProvider text={TextName.NLF}>
          <AttributeQueryCacheProvider></AttributeQueryCacheProvider>
        </TextContextProvider>
      );
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching values for attribute 'lemma': Error: fake error"
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching values for attribute 'normalized': Error: fake error"
    );
  });
});
