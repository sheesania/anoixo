import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import SequenceBuilder from '../SequenceBuilder';

describe('SequenceBuilder component', () => {
  describe('word builder components', () => {
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