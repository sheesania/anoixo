import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import AddWord from './AddWord';

describe('AddWord component', () => {
  it('has a button for adding following words', () => {
    const { getByLabelText } = render(<AddWord addWord={() => {}} />);
    const button = getByLabelText(/Add a*following word/, { exact: false });
    expect(button).toBeInTheDocument();
  });

  it('calls the addWord callback when the button is clicked', () => {
    const addWordCallback = jest.fn();
    const { getByLabelText } = render(<AddWord addWord={addWordCallback} />);
    const button = getByLabelText(/Add a*following word/, { exact: false });
    fireEvent.click(button);
    expect(addWordCallback).toHaveBeenCalled();
  });
});
