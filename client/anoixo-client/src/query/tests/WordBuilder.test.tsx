import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import getSelectItemFunction from '../../test/helpers/getSelectItem';
import WordBuilder from '../WordBuilder';

import { useAttributeQueryCache } from '../AttributeQueryCache';
jest.mock("../AttributeQueryCache", () => {
  return {
    useAttributeQueryCache: jest.fn(() => [])
  };
});
const mockUseAttributeQueryCache = useAttributeQueryCache as jest.Mock;

describe('WordBuilder component', () => {
  describe('delete button', () => {
    it('is not displayed when showDeleteButton is false', () => {
      const { queryByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={false}
            updateWord={() => {}}
            deleteWord={() => {}}
          />
        </TextContextProvider>
      );
      const deleteButton = queryByLabelText('Delete');
      expect(deleteButton).toBeNull();
    });

    it('is displayed when showDeleteButton is true', () => {
      const { getByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={true}
            updateWord={() => {}}
            deleteWord={() => {}}
          />
        </TextContextProvider>
      );
      const deleteButton = getByLabelText('Delete');
      expect(deleteButton).toBeInTheDocument();
    });

    it('deletes the word when clicked', () => {
      const deleteWord = jest.fn();
      const { getByLabelText } = render(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={true}
            updateWord={() => {}}
            deleteWord={deleteWord}
          />
        </TextContextProvider>
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
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={false}
            updateWord={updateWord}
            deleteWord={() => { }}
          />
        </TextContextProvider>
      );
      const selectItem = getSelectItemFunction(getByLabelText, getByText);
      await selectItem('Part of Speech', 'Noun');
      const newWord = updateWord.mock.calls[0][1];
      rerender(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={newWord}
            wordIndex={0}
            showDeleteButton={false}
            updateWord={updateWord}
            deleteWord={() => { }}
          />
        </TextContextProvider>
      );
      const personSelector = getByLabelText('Person');
      expect(personSelector).toHaveClass('Mui-disabled');
      const caseSelector = getByLabelText('Case');
      expect(caseSelector).not.toHaveClass('Mui-disabled');
    });
  });

  describe('with NLF as the text setting', () => {
    it('has a part of speech dropdown', () => {
      const updateWord = jest.fn();
      render(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={false}
            updateWord={updateWord}
            deleteWord={() => { }}
          />
        </TextContextProvider>
      );

      const dropdown = screen.getByLabelText('Part of Speech');
      fireEvent.mouseDown(dropdown);

      const options = screen.getByRole('listbox');
      expect(within(options).getByText('Adjective')).toBeDefined();
      expect(within(options).getByText('Adverb')).toBeDefined();
      expect(within(options).getByText('Article/Determiner')).toBeDefined();
      expect(within(options).getByText('Conjunction')).toBeDefined();
      expect(within(options).getByText('Interjection')).toBeDefined();
      expect(within(options).getByText('Noun')).toBeDefined();
      expect(within(options).getByText('Particle')).toBeDefined();
      expect(within(options).getByText('Preposition')).toBeDefined();
      expect(within(options).getByText('Pronoun')).toBeDefined();
      expect(within(options).getByText('Verbal')).toBeDefined();

      fireEvent.click(within(options).getByText('Verbal'));
      expect(updateWord).toHaveBeenCalledWith(0, {
        attributes: {
          'class': 'verb'
        }
      });
    });

    it('has a lexical form selector', () => {
      mockUseAttributeQueryCache.mockImplementation(() => {
        return [
          'λογος',
          'αγαπη',
        ];
      })
      const updateWord = jest.fn();
      render(
        <TextContextProvider text={TextName.NLF}>
          <WordBuilder
            word={{}}
            wordIndex={0}
            showDeleteButton={false}
            updateWord={updateWord}
            deleteWord={() => { }}
          />
        </TextContextProvider>
      );

      const lexicalFormField = screen.getByLabelText('Lexical Form');
      fireEvent.mouseDown(lexicalFormField);

      const options = screen.getByRole('listbox');
      expect(within(options).getByText('λογος')).toBeDefined();
      expect(within(options).getByText('αγαπη')).toBeDefined();

      fireEvent.change(lexicalFormField, { target: { value: 'λογος' } })
      expect(within(options).queryByText('αγαπη')).toBeNull();
      fireEvent.click(within(options).getByText('λογος'));
      expect(updateWord).toHaveBeenCalledWith(0, {
        attributes: {
          'lemma': 'λογος'
        }
      });
    });
  });
});