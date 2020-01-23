import React, {useCallback} from 'react';
import {Query, Sequence} from './QueryTypes';
import SearchScope from './SearchScope';
import SequenceBuilder from './SequenceBuilder';
import Button from '@material-ui/core/Button';

type Props = {
  query: Query;
  updateQuery: (newQuery: Query) => void;
  openResults: () => void;
}

const QueryBuilder: React.FC<Props> = (props: Props) => {
  const {query, updateQuery} = props;

  const updateSequence = useCallback((updateIndex: number, updatedSequence: Sequence) => {
    const updatedSequences = query.sequences.map((sequence, index) => {
      if (index === updateIndex) {
        return updatedSequence;
      } else {
        return sequence;
      }
    });
    updateQuery({
      ...query,
      sequences: updatedSequences
    });
  }, [query, updateQuery]);

  return (
    <div className='QueryBuilder'>
      <SearchScope/>
      {query.sequences.map((sequence, index) => <SequenceBuilder sequence={sequence} sequenceIndex={index} 
        updateSequence={updateSequence} key={index}/>)}
      <Button onClick={props.openResults}>Search >></Button>
    </div>
  );
}

export default QueryBuilder;
