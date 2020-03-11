import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import WordLink from './WordLink';

describe('WordLink component', () => {
  describe('allowed words between', () => {
    it('does not appear for inactive links', () => {
      const { queryByLabelText } = render(
        <WordLink
          link={undefined}
          wordIndex={0}
          type='inactive'
          updateLink={() => { }}
        />
      );
      const restrictWordsBetweenCheckbox = queryByLabelText(/up to.*words in between/);
      expect(restrictWordsBetweenCheckbox).toBeNull();
    });

    it('appears for active links', () => {
      const { getByLabelText } = render(
        <WordLink
          link={undefined}
          wordIndex={0}
          type='active'
          updateLink={() => { }}
        />
      );
      const restrictWordsBetweenCheckbox = getByLabelText(/up to.*words in between/);
      expect(restrictWordsBetweenCheckbox).toBeInTheDocument();
    });

    it('updates the Link when allowed words between is set', () => {
      const updateLink = jest.fn();
      const { getByLabelText } = render(
        <WordLink
          link={undefined}
          wordIndex={0}
          type='active'
          updateLink={updateLink}
        />
      );
      const restrictWordsBetweenCheckbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(restrictWordsBetweenCheckbox);
      expect(updateLink).toHaveBeenCalledWith(0, {
        allowedWordsBetween: 0
      });
    });

    it('updates the Link when the allowed words between is unset', () => {
      const updateLink = jest.fn();
      const { getByLabelText } = render(
        <WordLink
          link={{allowedWordsBetween: 2}}
          wordIndex={0}
          type='active'
          updateLink={updateLink}
        />
      );
      const restrictWordsBetweenCheckbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(restrictWordsBetweenCheckbox);
      expect(updateLink).toHaveBeenCalledWith(0, undefined);
    });
  });
});