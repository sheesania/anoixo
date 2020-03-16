import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import getSelectItemFunction from '../../test/helpers/getSelectItem';
import WordBuilder from '../WordBuilder';

describe('WordBuilder component', () => {
  describe('delete button', () => {
    it('is not displayed when showDeleteButton is false', () => {
      const { queryByLabelText } = render(
        <WordBuilder
          word={{}}
          wordIndex={0}
          showDeleteButton={false}
          updateWord={() => {}}
          deleteWord={() => {}}
        />
      );
      const deleteButton = queryByLabelText('Delete');
      expect(deleteButton).toBeNull();
    });

    it('is displayed when showDeleteButton is true', () => {
      const { getByLabelText } = render(
        <WordBuilder
          word={{}}
          wordIndex={0}
          showDeleteButton={true}
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
          showDeleteButton={true}
          updateWord={() => {}}
          deleteWord={deleteWord}
        />
      );
      const deleteButton = getByLabelText('Delete');
      fireEvent.click(deleteButton);
      expect(deleteWord).toHaveBeenCalledWith(0);
    });
  });

  describe('attribute editors', () => {
    it('disables irrelevant attributes when a part of speech is selected', async () => {
      const updateWord = jest.fn();
      const { getByLabelText, getByText, rerender } = render(
        <WordBuilder
          word={{}}
          wordIndex={0}
          showDeleteButton={false}
          updateWord={updateWord}
          deleteWord={() => { }}
        />
      );
      const selectItem = getSelectItemFunction(getByLabelText, getByText);
      await selectItem('Part of Speech', 'Noun');
      const newWord = updateWord.mock.calls[0][1];
      rerender(
        <WordBuilder
          word={newWord}
          wordIndex={0}
          showDeleteButton={false}
          updateWord={updateWord}
          deleteWord={() => { }}
        />
      );
      const personSelector = getByLabelText('Person');
      expect(personSelector).toHaveClass('Mui-disabled');
      const caseSelector = getByLabelText('Case');
      expect(caseSelector).not.toHaveClass('Mui-disabled');
    });
  });
});