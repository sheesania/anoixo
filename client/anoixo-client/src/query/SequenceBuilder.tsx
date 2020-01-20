import React, {memo} from 'react';
import {Sequence} from './QueryTypes';
import WordBuilder from './WordBuilder';
import './css/SequenceBuilder.css';

type Props = {
    sequence: Sequence;
};

const SequenceBuilder: React.FC<Props> = memo((props: Props) => {
  return (
    <div className='SequenceBuilder'>
        {props.sequence.map(wordQuery => <WordBuilder word={wordQuery}/>)}
    </div>
  );
})

export default SequenceBuilder;
