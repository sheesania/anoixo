import React, {useCallback, useState} from 'react';
import {Query} from './query/QueryTypes';
import QueryBuilder from './query/QueryBuilder';
import Results from './results/Results';

const App: React.FC = () => {
  const [query, setQuery] = useState<Query>({
      sequences: [
          [
              {}
          ]
      ]
  });
  const [showResults, setShowResults] = useState(false);

  const updateQuery = useCallback((newQuery: Query) => {
    setQuery(newQuery);
  }, [setQuery]);

  const openResults = useCallback(() => {
    setShowResults(true);
  }, [setShowResults]);

  const closeResults = useCallback(() => {
    setShowResults(false);
  }, [setShowResults]);

  return (
    <div className='App'>
      <QueryBuilder query={query} updateQuery={updateQuery} openResults={openResults}/>
      {showResults && <Results query={query} closeResults={closeResults}/>}
    </div>
  );
}

export default App;
