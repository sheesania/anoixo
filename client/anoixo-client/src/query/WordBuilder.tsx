import React, {memo} from 'react';
import {WordQuery} from './QueryTypes';

type Props = {
    word: WordQuery;
};

const WordBuilder: React.FC<Props> = memo((props: Props) => {
  return (
    <div className='WordBuilder'>
        look at my word: {JSON.stringify(props.word)}
    </div>
  );
})

export default WordBuilder;
