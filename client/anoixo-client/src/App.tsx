import React, {useCallback, useState} from 'react';
import {Query} from './query/QueryTypes';
import QueryBuilder from './query/QueryBuilder';

const App: React.FC = () => {
  const [query, setQuery] = useState<Query>({
      sequences: [
          [
              {}
          ]
      ]
  });

  const updateQuery = useCallback((newQuery: Query) => {
    console.log(newQuery);
    setQuery(newQuery);
  }, [setQuery]);

  return (
    <div className='App'>
      <QueryBuilder query={query} updateQuery={updateQuery}/>
    </div>
  );
}

export default App;
