import React, { useCallback } from 'react';
import { AttributeQueryCacheProvider } from './AttributeQueryCache';
import { Query, Sequence } from './QueryTypes';
import SearchScope from './SearchScope';
import SequenceBuilder from './SequenceBuilder';
import BackForwardButton from '../common/BackForwardButton';

type Props = {
  query: Query;
  updateQuery: (newQuery: Query) => void;
  openResults: () => void;
};

const QueryBuilder: React.FC<Props> = (props: Props) => {
  const { query, updateQuery } = props;

  const updateSequence = useCallback(
    (updateIndex: number, updatedSequence: Sequence) => {
      const updatedSequences = query.sequences.map((sequence, index) => {
        if (index === updateIndex) {
          return updatedSequence;
        } else {
          return sequence;
        }
      });
      updateQuery({
        ...query,
        sequences: updatedSequences,
      });
    },
    [query, updateQuery]
  );

  return (
    <div className="QueryBuilder">
      <AttributeQueryCacheProvider>
        <SearchScope />
        {query.sequences.map((sequence, index) => (
          <SequenceBuilder
            sequence={sequence}
            sequenceIndex={index}
            updateSequence={updateSequence}
            key={index}
          />
        ))}
        <BackForwardButton
          type="search"
          onClick={props.openResults}
          customStyling={{ marginTop: '2rem' }}
        />
      </AttributeQueryCacheProvider>
    </div>
  );
};

export default QueryBuilder;
