import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import WordsBetween from './WordsBetween';

describe('WordsBetween component', () => {
  it('has a checkbox', () => {
    const { getByLabelText } = render(
      <WordsBetween
        allowedWordsBetween={undefined}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const checkbox = getByLabelText(/up to.*words in between/);
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.getAttribute('type')).toBe('checkbox');
  });

  it('has a text field', () => {
    const { getByLabelText } = render(
      <WordsBetween
        allowedWordsBetween={undefined}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const textField = getByLabelText('Number of words to allow in between');
    expect(textField).toBeInTheDocument();
    expect(textField.getAttribute('type')).toBe('text');
  });

  it('sets the checkbox and text field correctly for no set words between', () => {
    const { getByLabelText } = render(
      <WordsBetween
        allowedWordsBetween={undefined}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const checkbox = getByLabelText(/up to.*words in between/);
    const textField = getByLabelText('Number of words to allow in between');
    expect(checkbox.hasAttribute('checked')).toBe(false);
    expect(textField.getAttribute('value')).toBe('0');
  });

  it('sets the checkbox and text field correctly for a set words between', () => {
    const { getByLabelText } = render(
      <WordsBetween
        allowedWordsBetween={2}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const checkbox = getByLabelText(/up to.*words in between/);
    const textField = getByLabelText('Number of words to allow in between');
    expect(checkbox.hasAttribute('checked')).toBe(true);
    expect(textField.getAttribute('value')).toBe('2');
  });

  it('shows an error message if there is an invalid text field value, when it is not checked', () => {
    const { getByLabelText, queryByText } = render(
      <WordsBetween
        allowedWordsBetween={undefined}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const textField = getByLabelText('Number of words to allow in between');
    expect(textField.getAttribute('aria-invalid')).toBe('false');
    expect(queryByText('Not a number')).toBeNull();

    fireEvent.change(textField, { target: { value: 'invalid' } });
    expect(textField.getAttribute('aria-invalid')).toBe('true');
    expect(queryByText('Not a number')).toBeInTheDocument();
  });

  it('shows an error message if there is an invalid text field value, when it is checked', () => {
    const { getByLabelText, queryByText } = render(
      <WordsBetween
        allowedWordsBetween={2}
        updateAllowedWordsBetween={() => {}}
      />
    );
    const textField = getByLabelText('Number of words to allow in between');
    expect(textField.getAttribute('aria-invalid')).toBe('false');
    expect(queryByText('Not a number')).toBeNull();

    fireEvent.change(textField, { target: { value: 'invalid' } });
    expect(textField.getAttribute('aria-invalid')).toBe('true');
    expect(queryByText('Not a number')).toBeInTheDocument();
  });

  describe('updates', () => {
    it('updates allowedWordsBetween when the checkbox is checked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={undefined}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const checkbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(checkbox);
      expect(updatedAllowedWordsBetween).toHaveBeenCalledWith(0);
    });

    it('updates allowedWordsBetween when the checkbox is unchecked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={2}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const checkbox = getByLabelText(/up to.*words in between/);
      fireEvent.click(checkbox);
      expect(updatedAllowedWordsBetween).toHaveBeenCalledWith(undefined);
    });

    it('updates allowedWordsBetween when the text field is changed and the checkbox is already checked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={2}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const textField = getByLabelText('Number of words to allow in between');
      fireEvent.change(textField, { target: { value: '3' } });
      expect(updatedAllowedWordsBetween).toHaveBeenCalledWith(3);
    });

    it('does not update allowedWordsBetween when the text field is changed and the checkbox is unchecked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={undefined}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const textField = getByLabelText('Number of words to allow in between');
      fireEvent.change(textField, { target: { value: '3' } });
      expect(updatedAllowedWordsBetween).not.toHaveBeenCalled();
    });

    it('does not update allowedWordsBetween when the text field value is invalid and the checkbox is checked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={2}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const textField = getByLabelText('Number of words to allow in between');
      fireEvent.change(textField, { target: { value: 'invalid' } });
      expect(updatedAllowedWordsBetween).not.toHaveBeenCalled();
    });

    it('updates allowedWordsBetween even if the text field value is invalid when the checkbox is unchecked', () => {
      const updatedAllowedWordsBetween = jest.fn();
      const { getByLabelText } = render(
        <WordsBetween
          allowedWordsBetween={2}
          updateAllowedWordsBetween={updatedAllowedWordsBetween}
        />
      );
      const textField = getByLabelText('Number of words to allow in between');
      const checkbox = getByLabelText(/up to.*words in between/);
      fireEvent.change(textField, { target: { value: 'invalid' } });
      fireEvent.click(checkbox);
      expect(updatedAllowedWordsBetween).toHaveBeenCalledWith(undefined);
    });
  });
});
