import React, {useState} from 'react';
import {Query} from './QueryTypes';
import SearchScope from './SearchScope';
import SequenceBuilder from './SequenceBuilder';

const QueryBuilder: React.FC = () => {
    const [query] = useState<Query>({
        sequences: [
            [
                {}
            ]
        ]
    });

  return (
    <div className='QueryBuilder'>
      <SearchScope/>
      {query.sequences.map(sequence => <SequenceBuilder sequence={sequence}/>)}
    </div>
  );
}

export default QueryBuilder;
