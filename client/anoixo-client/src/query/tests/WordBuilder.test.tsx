import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { TextContextProvider } from '../../texts/TextContext';
import { TextName } from '../../texts/TextSettings';
import getSelectItemFunction from '../../test/helpers/getSelectItem';
import WordBuilder from '../WordBuilder';

import { useAttributeQueryCache } from '../AttributeQueryCache';
jest.mock('../AttributeQueryCache', () => {
  return {
    useAttributeQueryCache: jest.fn(() => []),
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
            deleteWord={() => {}}
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
            deleteWord={() => {}}
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
    it('displays attribute editors in the correct order', () => {
      render(
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

      const labels = screen.getAllByTestId('attribute-editor');
      expect(within(labels[0]).getByLabelText('Part of Speech')).toBeDefined();
      expect(within(labels[1]).getByLabelText('Lexical Form')).toBeDefined();
      expect(within(labels[2]).getByLabelText('Inflected Form')).toBeDefined();
      expect(within(labels[3]).getByLabelText('Case')).toBeDefined();
      expect(within(labels[4]).getByLabelText('Person')).toBeDefined();
      expect(within(labels[5]).getByLabelText('Number')).toBeDefined();
      expect(within(labels[6]).getByLabelText('Gender')).toBeDefined();
      expect(within(labels[7]).getByLabelText('Tense')).toBeDefined();
      expect(within(labels[8]).getByLabelText('Voice')).toBeDefined();
      expect(within(labels[9]).getByLabelText('Mood')).toBeDefined();
    });

    describe('attribute editors', () => {
      it('has a part of speech dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
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
            class: 'verb',
          },
        });
      });

      it('has an autocompleting lexical form selector', () => {
        mockUseAttributeQueryCache.mockReturnValue(['λογος', 'αγαπη']);
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const lexicalFormField = screen.getByLabelText('Lexical Form');
        fireEvent.mouseDown(lexicalFormField);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('λογος')).toBeDefined();
        expect(within(options).getByText('αγαπη')).toBeDefined();

        fireEvent.change(lexicalFormField, { target: { value: 'λογος' } });
        expect(within(options).queryByText('αγαπη')).toBeNull();
        fireEvent.click(within(options).getByText('λογος'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            lemma: 'λογος',
          },
        });
      });

      it('has an autocompleting inflected form selector', () => {
        mockUseAttributeQueryCache.mockReturnValue(['λογος', 'αγαπη']);
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const lexicalFormField = screen.getByLabelText('Inflected Form');
        fireEvent.mouseDown(lexicalFormField);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('λογος')).toBeDefined();
        expect(within(options).getByText('αγαπη')).toBeDefined();

        fireEvent.change(lexicalFormField, { target: { value: 'λογος' } });
        expect(within(options).queryByText('αγαπη')).toBeNull();
        fireEvent.click(within(options).getByText('λογος'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            normalized: 'λογος',
          },
        });
      });

      it('has a case dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Case');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Accusative')).toBeDefined();
        expect(within(options).getByText('Dative')).toBeDefined();
        expect(within(options).getByText('Genitive')).toBeDefined();
        expect(within(options).getByText('Nominative')).toBeDefined();
        expect(within(options).getByText('Vocative')).toBeDefined();

        fireEvent.click(within(options).getByText('Accusative'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            case: 'accusative',
          },
        });
      });

      it('has a person dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Person');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('1st person')).toBeDefined();
        expect(within(options).getByText('2nd person')).toBeDefined();
        expect(within(options).getByText('3rd person')).toBeDefined();

        fireEvent.click(within(options).getByText('1st person'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            person: 'first',
          },
        });
      });

      it('has a number dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Number');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Singular')).toBeDefined();
        expect(within(options).getByText('Plural')).toBeDefined();

        fireEvent.click(within(options).getByText('Singular'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            number: 'singular',
          },
        });
      });

      it('has a gender dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Gender');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Masculine')).toBeDefined();
        expect(within(options).getByText('Feminine')).toBeDefined();
        expect(within(options).getByText('Neuter')).toBeDefined();

        fireEvent.click(within(options).getByText('Masculine'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            gender: 'masculine',
          },
        });
      });

      it('has a tense dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Tense');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Aorist')).toBeDefined();
        expect(within(options).getByText('Imperfect')).toBeDefined();
        expect(within(options).getByText('Future')).toBeDefined();
        expect(within(options).getByText('Perfect')).toBeDefined();
        expect(within(options).getByText('Pluperfect')).toBeDefined();
        expect(within(options).getByText('Present')).toBeDefined();

        fireEvent.click(within(options).getByText('Aorist'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            tense: 'aorist',
          },
        });
      });

      it('has a voice dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Voice');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Active')).toBeDefined();
        expect(within(options).getByText('Passive')).toBeDefined();
        expect(within(options).getByText('Middle')).toBeDefined();
        expect(within(options).getByText('Middle/Passive')).toBeDefined();

        fireEvent.click(within(options).getByText('Active'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            voice: 'active',
          },
        });
      });

      it('has a mood dropdown', () => {
        const updateWord = jest.fn();
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={{}}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={updateWord}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );

        const dropdown = screen.getByLabelText('Mood');
        fireEvent.mouseDown(dropdown);

        const options = screen.getByRole('listbox');
        expect(within(options).getByText('Indicative')).toBeDefined();
        expect(within(options).getByText('Infinitive')).toBeDefined();
        expect(within(options).getByText('Imperative')).toBeDefined();
        expect(within(options).getByText('Optative')).toBeDefined();
        expect(within(options).getByText('Participle')).toBeDefined();
        expect(within(options).getByText('Subjunctive')).toBeDefined();

        fireEvent.click(within(options).getByText('Indicative'));
        expect(updateWord).toHaveBeenCalledWith(0, {
          attributes: {
            mood: 'indicative',
          },
        });
      });
    });

    describe('attribute editor disabling', () => {
      it('disables the correct attribute editors when Adjective is the part of speech', () => {
        const adjective = {
          attributes: {
            class: 'adj',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={adjective}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Adverb is the part of speech', () => {
        const adverb = {
          attributes: {
            class: 'adv',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={adverb}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Article/Determiner is the part of speech', () => {
        const determiner = {
          attributes: {
            class: 'det',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={determiner}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Conjunction is the part of speech', () => {
        const conjunction = {
          attributes: {
            class: 'conj',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={conjunction}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Interjection is the part of speech', () => {
        const interjection = {
          attributes: {
            class: 'intj',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={interjection}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Noun is the part of speech', () => {
        const noun = {
          attributes: {
            class: 'noun',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={noun}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Particle is the part of speech', () => {
        const particle = {
          attributes: {
            class: 'ptcl',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={particle}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Preposition is the part of speech', () => {
        const preposition = {
          attributes: {
            class: 'prep',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={preposition}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Pronoun is the part of speech', () => {
        const pronoun = {
          attributes: {
            class: 'pron',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={pronoun}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).toHaveClass('Mui-disabled');
      });

      it('disables the correct attribute editors when Verbal is the part of speech', () => {
        const verb = {
          attributes: {
            class: 'verb',
          },
        };
        render(
          <TextContextProvider text={TextName.NLF}>
            <WordBuilder
              word={verb}
              wordIndex={0}
              showDeleteButton={false}
              updateWord={() => {}}
              deleteWord={() => {}}
            />
          </TextContextProvider>
        );
        expect(screen.getByLabelText('Case')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Person')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Number')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Gender')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Tense')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Voice')).not.toHaveClass('Mui-disabled');
        expect(screen.getByLabelText('Mood')).not.toHaveClass('Mui-disabled');
      });
    });
  });
});
