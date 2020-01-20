import React, {useState} from 'react';
import SearchScope from './SearchScope';
import {Query} from './QueryTypes';

const QueryBuilder: React.FC = () => {
    const [query, setQuery] = useState<Query>({
        sequences: [
            [
                {}
            ]
        ]
    });

  return (
    <div className='QueryBuilder'>
      <SearchScope/>
    </div>
  );
}

export default QueryBuilder;
