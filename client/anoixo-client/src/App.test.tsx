import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import { TextContextProvider } from './TextContext'
import QueryBuilder from './query/QueryBuilder';
import Results from './results/Results';

it('provides the current text setting', () => {
  const app = shallow(<App />);
  expect(app.find(TextContextProvider)).toBeDefined();
});

it('contains the query builder', () => {
  const app = shallow(<App />);
  expect(app.find(QueryBuilder)).toBeDefined();
});

it('contains the results view', () => {
  const app = shallow(<App />);
  expect(app.find(Results)).toBeDefined();
});
