import React, { useCallback, useState } from 'react';
import { Query } from './query/QueryTypes';
import { TextContextProvider } from './TextContext'
import { TextName } from './TextSettings';
import QueryBuilder from './query/QueryBuilder';
import Results from './results/Results';

const App: React.FC = () => {
  const [query, setQuery] = useState<Query>({
    sequences: [[{}]],
  });
  const [showResults, setShowResults] = useState(false);

  // In the future, the current text could be pulled from a selection box/the URL/etc instead of being hardcoded
  const [currentText] = useState(TextName.NLF);

  const updateQuery = useCallback(
    (newQuery: Query) => {
      setQuery(newQuery);
    },
    [setQuery]
  );

  const openResults = useCallback(() => {
    setShowResults(true);
  }, [setShowResults]);

  const closeResults = useCallback(() => {
    setShowResults(false);
  }, [setShowResults]);

  return (
    <TextContextProvider text={currentText}>
      <QueryBuilder
        query={query}
        updateQuery={updateQuery}
        openResults={openResults}
      />
      <Results query={query} isOpen={showResults} closeSelf={closeResults} />
    </TextContextProvider>
  );
};

export default App;
