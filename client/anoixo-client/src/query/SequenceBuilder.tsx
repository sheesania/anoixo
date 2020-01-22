import React, {memo, useCallback} from 'react';
import {Sequence} from './QueryTypes';
import WordBuilder from './WordBuilder';
import './css/SequenceBuilder.css';

type Props = {
    sequence: Sequence;
    sequenceIndex: number;
    updateSequence: (updateIndex: number, updatedSequence: Sequence) => void;
};

const SequenceBuilder: React.FC<Props> = memo((props: Props) => {
  const {sequence, sequenceIndex, updateSequence} = props;
  const updateWord = useCallback((updateIndex, updatedWord) => {
    const updatedWords = sequence.map((word, index) => {
      if (index === updateIndex) {
        return updatedWord;
      } else {
        return word;
      }
    });
    updateSequence(sequenceIndex, updatedWords);
  }, [sequence, sequenceIndex, updateSequence]);

  return (
    <div className='SequenceBuilder'>
        {sequence.map((wordQuery, index) => <WordBuilder word={wordQuery} wordIndex={index} 
          updateWord={updateWord} key={index}/>)}
    </div>
  );
})

export default SequenceBuilder;
