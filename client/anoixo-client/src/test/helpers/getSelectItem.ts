// from https://stackoverflow.com/a/56183912/4954731
import { fireEvent, waitForElement } from '@testing-library/react';

const DOWN_ARROW = { keyCode: 40 };
const getSelectItemFunction = (
  getByLabelText: (labelText: string) => HTMLElement,
  getByText: (text: string) => HTMLElement
) => async (selectLabel: string, itemText: string) => {
  fireEvent.keyDown(getByLabelText(selectLabel), DOWN_ARROW);
  await waitForElement(() => getByText(itemText));
  fireEvent.click(getByText(itemText));
};

export default getSelectItemFunction;
