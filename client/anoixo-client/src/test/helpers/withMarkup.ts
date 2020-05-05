// from https://stackoverflow.com/a/56859650/4954731
import { MatcherFunction } from '@testing-library/react';

type Query = (f: MatcherFunction) => HTMLElement;

const withMarkup = (query: Query) => (text: string): HTMLElement =>
  query((content: string, node: HTMLElement) => {
    const hasText = (node: HTMLElement) => node.textContent === text;
    const childrenDontHaveText = Array.from(node.children).every(
      child => !hasText(child as HTMLElement)
    );
    return hasText(node) && childrenDontHaveText;
  });

export default withMarkup;
