import React, { memo, useCallback } from 'react';
import { Link, Sequence } from './QueryTypes';
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
  const { sequence, sequenceIndex, updateSequence } = props;

  const updateWord = useCallback(
    (updateIndex, updatedWord) => {
      const updatedWords = sequence.map((word, index) => {
        if (index === updateIndex) {
          return updatedWord;
        } else {
          return word;
        }
      });
      updateSequence(sequenceIndex, updatedWords);
    },
    [sequence, sequenceIndex, updateSequence]
  );

  const updateLink = useCallback(
    (wordIndex: number, updatedLink: Link | undefined) => {
      const updatedWords = sequence.map((word, index) => {
        if (index !== wordIndex) {
          return word;
        }
        const updatedWord = { ...word };
        if (updatedLink) {
          updatedWord.link = updatedLink;
        } else {
          delete updatedWord.link;
        }
        return updatedWord;
      });
      updateSequence(sequenceIndex, updatedWords);
    },
    [sequence, sequenceIndex, updateSequence]
  );

  const addWord = useCallback(() => {
    const updatedWords = [...sequence, {}];
    updateSequence(sequenceIndex, updatedWords);
  }, [sequence, sequenceIndex, updateSequence]);

  const deleteWord = useCallback((wordIndex: number) => {
    const updatedWords = sequence.filter((_, index) => index !== wordIndex);
    /* if the deleted word was at the end of the sequence, make sure the preceding word doesn't have a
       link. updatedWords.length should never be < 1 if this callback is called corrrectly, but let's
       not break if it's called incorrectly */
    if ((wordIndex === updatedWords.length) && (updatedWords.length > 0)) {
      const previousWord = updatedWords[wordIndex - 1];
      delete previousWord.link;
    }
    updateSequence(sequenceIndex, updatedWords);
  }, [sequence, sequenceIndex, updateSequence]);

  const wordsAndArrows = [];
  const showDeleteButton = sequence.length > 1;
  for (let i = 0; i < sequence.length - 1; i++) {
    wordsAndArrows.push(
      <WordBuilder
        word={sequence[i]}
        wordIndex={i}
        showDeleteButton={showDeleteButton}
        updateWord={updateWord}
        deleteWord={deleteWord}
        key={`word${i}`}
      />,
      <WordLink
        link={sequence[i].link}
        wordIndex={i}
        type="active"
        key={`arrow${i}`}
        updateLink={updateLink}
      />
    );
  }
  const lastIndex = sequence.length - 1;
  wordsAndArrows.push(
    <WordBuilder
      word={sequence[lastIndex]}
      wordIndex={lastIndex}
      showDeleteButton={showDeleteButton}
      updateWord={updateWord}
      deleteWord={deleteWord}
      key={`word${lastIndex}`}
    />,
    <WordLink
      link={sequence[lastIndex].link}
      wordIndex={lastIndex}
      type="inactive"
      key={`arrow${lastIndex}`}
      updateLink={updateLink}
    />,
    <AddWord addWord={addWord} key={'addWord'} />
  );

  return <div className="SequenceBuilder">{wordsAndArrows}</div>;
});

export default SequenceBuilder;
