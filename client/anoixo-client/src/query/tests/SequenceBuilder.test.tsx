import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SequenceBuilder from '../SequenceBuilder';

describe('SequenceBuilder component', () => {
  describe('word builder components', () => {
    it('does not show delete buttons when there is only one word in the sequence', () => {
      const { queryByLabelText } = render(
        <SequenceBuilder
          sequence={[{}]}
          sequenceIndex={0}
          updateSequence={() => {}}
        />
      );
      const deleteButton = queryByLabelText('Delete');
      expect(deleteButton).toBeNull();
    });

    it('shows delete buttons for all word cards when there are multiple words in the sequence', () => {
      const { getAllByLabelText } = render(
        <SequenceBuilder
          sequence={[{}, {}]}
          sequenceIndex={0}
          updateSequence={() => {}}
        />
      );
      const deleteButtons = getAllByLabelText('Delete');
      expect(deleteButtons.length).toBe(2);
    });

    it('deletes the word when the delete button is clicked', () => {
      const updateSequence = jest.fn();
      const { getAllByLabelText } = render(
        <SequenceBuilder
          sequence={[
            { attributes: { 'class': 'verb' } },
            { attributes: { 'class': 'noun' } }
          ]}
          sequenceIndex={0}
          updateSequence={updateSequence}
        />
      );
      const deleteButton = getAllByLabelText('Delete')[1];
      fireEvent.click(deleteButton);
      expect(updateSequence).toHaveBeenCalledWith(0, [
        { attributes: { 'class': 'verb' } }
      ]);
    });

    it('removes any link on the previous word when the last word is deleted', () => {
      const updateSequence = jest.fn();
      const { getAllByLabelText } = render(
        <SequenceBuilder
          sequence={[
            { attributes: { 'class': 'verb' }, link: { allowedWordsBetween: 0} },
            { attributes: { 'class': 'noun' } }
          ]}
          sequenceIndex={0}
          updateSequence={updateSequence}
        />
      );
      const deleteButton = getAllByLabelText('Delete')[1];
      fireEvent.click(deleteButton);
      expect(updateSequence).toHaveBeenCalledWith(0, [
        { attributes: { 'class': 'verb' } }
      ]);
    });

    it('does not remove links on previous words when a non-last word is deleted', () => {
      const updateSequence = jest.fn();
      const { getAllByLabelText } = render(
        <SequenceBuilder
          sequence={[
            { attributes: { 'class': 'verb' }, link: { allowedWordsBetween: 0} },
            { attributes: { 'class': 'noun' } },
            { attributes: { 'class': 'conj'} }
          ]}
          sequenceIndex={0}
          updateSequence={updateSequence}
        />
      );
      const deleteButton = getAllByLabelText('Delete')[1];
      fireEvent.click(deleteButton);
      expect(updateSequence).toHaveBeenCalledWith(0, [
        { attributes: { 'class': 'verb' }, link: { allowedWordsBetween: 0} },
        { attributes: { 'class': 'conj'} }
      ]);
    });
  });

  describe('word link components', () => {
    it('updates the sequence when a link is changed', () => {
      const updateSequence = jest.fn();
      const { getByLabelText } = render(
        <SequenceBuilder
          sequence={[
            { attributes: { 'class': 'verb' } },
            { attributes: { 'class': 'noun' } }
          ]}
          sequenceIndex={0}
          updateSequence={updateSequence}
        />
      );
      const restrictWordsBetweenCheckbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(restrictWordsBetweenCheckbox);
      expect(updateSequence).toHaveBeenCalledWith(0, [
        { attributes: { 'class': 'verb' }, link: { allowedWordsBetween: 0 } },
        { attributes: { 'class': 'noun' } }
      ]);
    });

    it('updates the sequence when a link is removed', () => {
      const updateSequence = jest.fn();
      const { getByLabelText } = render(
        <SequenceBuilder
          sequence={[
            { attributes: { 'class': 'verb' }, link: { allowedWordsBetween: 3 } },
            { attributes: { 'class': 'noun' } }
          ]}
          sequenceIndex={0}
          updateSequence={updateSequence}
        />
      );
      const restrictWordsBetweenCheckbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(restrictWordsBetweenCheckbox);
      expect(updateSequence).toHaveBeenCalledWith(0, [
        { attributes: { 'class': 'verb' } },
        { attributes: { 'class': 'noun' } }
      ]);
    });
  });
});