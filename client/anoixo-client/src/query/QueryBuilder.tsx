import React, {useCallback, useState} from 'react';
import {Query, Sequence} from './QueryTypes';
import SearchScope from './SearchScope';
import SequenceBuilder from './SequenceBuilder';

const QueryBuilder: React.FC = () => {
  const [query, setQuery] = useState<Query>({
      sequences: [
          [
              {}
          ]
      ]
  });

  const updateSequence = useCallback((updateIndex: number, updatedSequence: Sequence) => {
    const updatedSequences = query.sequences.map((sequence, index) => {
      if (index === updateIndex) {
        return updatedSequence;
      } else {
        return sequence;
      }
    });
    setQuery({
      ...query,
      sequences: updatedSequences
    });
  }, [query]);

  return (
    <div className='QueryBuilder'>
      <SearchScope/>
      {query.sequences.map((sequence, index) => <SequenceBuilder sequence={sequence} sequenceIndex={index} 
        updateSequence={updateSequence} key={index}/>)}
    </div>
  );
}

export default QueryBuilder;
