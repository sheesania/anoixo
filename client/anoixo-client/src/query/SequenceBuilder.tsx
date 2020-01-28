import React, {memo, useCallback} from 'react';
import {Sequence} from './QueryTypes';
import AddWord from './AddWord';
import WordBuilder from './WordBuilder';
import WordLink from './WordLink';
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

  const addWord = useCallback(() => {
    const updatedWords = [
      ...sequence,
      {}
    ];
    updateSequence(sequenceIndex, updatedWords);
  }, [sequence, sequenceIndex, updateSequence]);

  const wordsAndArrows = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    wordsAndArrows.push(
      <WordBuilder word={sequence[i]} wordIndex={i} updateWord={updateWord} key={`word${i}`}/>,
      <WordLink type='active' key={`arrow${i}`} id={i}/>
    );
  }
  const lastIndex = sequence.length - 1;
  wordsAndArrows.push(
    <WordBuilder word={sequence[lastIndex]} wordIndex={lastIndex} updateWord={updateWord} key={`word${lastIndex}`}/>,
    <WordLink type='inactive' key={`arrow${lastIndex}`} id={lastIndex}/>,
    <AddWord addWord={addWord} key={'addWord'}/>,
  );

  return (
    <div className='SequenceBuilder'>
        {wordsAndArrows}
    </div>
  );
})

export default SequenceBuilder;
