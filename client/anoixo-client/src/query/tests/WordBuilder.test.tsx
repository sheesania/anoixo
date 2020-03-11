import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import WordBuilder from '../WordBuilder';

describe('WordBuilder component', () => {
  describe('delete button', () => {
    it('exists', () => {
      const { getByLabelText } = render(
        <WordBuilder
          word={{}}
          wordIndex={0}
          updateWord={() => {}}
          deleteWord={() => {}}
        />
      );
      const deleteButton = getByLabelText('Delete');
      expect(deleteButton).toBeInTheDocument();
    });

    it('deletes the word when clicked', () => {
      const deleteWord = jest.fn();
      const { getByLabelText } = render(
        <WordBuilder
          word={{}}
          wordIndex={0}
          updateWord={() => {}}
          deleteWord={deleteWord}
        />
      );
      const deleteButton = getByLabelText('Delete');
      fireEvent.click(deleteButton);
      expect(deleteWord).toHaveBeenCalledWith(0);
    });
  });
});