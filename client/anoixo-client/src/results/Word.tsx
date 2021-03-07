import React, { memo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { WordResult } from './ResultTypes';
import './css/Word.css';

type Props = {
  word: WordResult;
};

const Word: React.FC<Props> = memo((props: Props) => {
  const word = props.word;

  const matchedWordClass = word.matchedSequence > -1 ? 'matched-word' : '';
  const tooltipContent = (
    <div>
      <strong>Awoo: </strong>Bewy
      <br />
      <strong>Heemin: </strong>Bobo
      <br />
    </div>
  );

  return (
    <Tooltip
      title={tooltipContent}
      classes={{
        tooltip: 'attribute-tooltip',
        arrow: 'attribute-tooltip-arrow',
      }}
      interactive
      arrow
    >
      <span className={matchedWordClass}>{word.text}</span>
    </Tooltip>
  );
});

export default Word;
