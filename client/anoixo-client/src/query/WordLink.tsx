import React, { memo, useCallback } from 'react';
import { Link } from './QueryTypes';
import Arrow from './Arrow';
import WordsBetween from './WordsBetween';
import Typography from '@material-ui/core/Typography';
import './css/WordLink.css';

type Props = {
  link: Link | undefined;
  wordIndex: number;
  type: 'active' | 'inactive';
  updateLink: (wordIndex: number, updatedLink: Link | undefined) => void;
};

const WordLink: React.FC<Props> = memo((props: Props) => {
  const { link, wordIndex, type, updateLink } = props;
  const id = `arrow${wordIndex}`;

  const updateAllowedWordsBetween = useCallback(
    (newAllowedWordsBetween: number | undefined) => {
      let updatedLink: Link | undefined;
      if (newAllowedWordsBetween || newAllowedWordsBetween === 0) {
        updatedLink = { allowedWordsBetween: newAllowedWordsBetween };
      } else {
        updatedLink = undefined;
      }
      updateLink(wordIndex, updatedLink);
    },
    [wordIndex, updateLink]
  );

  return (
    <div className="word-link">
      {type === 'active' && (
        <Typography variant="subtitle1" component="label" htmlFor={id}>
          followed by a
        </Typography>
      )}
      <Arrow type={type} id={id} />
      {type === 'active' && (
        <WordsBetween
          allowedWordsBetween={link ? link.allowedWordsBetween : undefined}
          updateAllowedWordsBetween={updateAllowedWordsBetween}
        />
      )}
    </div>
  );
});

export default WordLink;
