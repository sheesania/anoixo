import React, { memo } from 'react';
import { PassageResult, ReferenceResult, WordResult } from './ResultTypes';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import './css/PassageCard.css';

type Props = {
  passage: PassageResult;
  passageIndex: number;
};

const makeReferenceString = (references: ReferenceResult[]): string => {
  // There should always be at least one reference, but let's not break if there isn't
  if (!references.length) {
    return '';
  }
  const firstReference = references[0];
  const lastReference = references[references.length - 1];
  let reference: string = `${firstReference.book} `;
  if (firstReference.chapter !== lastReference.chapter) {
    reference += `${firstReference.chapter}:${firstReference.verse} - ${lastReference.chapter}:${lastReference.verse}`;
  } else {
    reference += `${firstReference.chapter}:${firstReference.verse}`;
    if (firstReference.verse !== lastReference.verse) {
      reference += `-${lastReference.verse}`;
    }
  }
  return reference;
};

const makeTextElements = (words: WordResult[]): (string | JSX.Element)[] => {
  /* This triggers a React warning since the array elements don't have unique 'key' attributes, which help with optimized
     re-rendering if array elements are added/removed/updated. However, these array elements will never be individually
     changed (only the array as a whole when different results are displayed), so the warning is not relevant.
     Unfortunately there's no way to tell React to ignore this issue here. */
  const wordElements = words.map(word => {
    if (word.matchedSequence > -1) {
      return <span className="matched-word">{word.text}</span>;
    } else {
      return word.text;
    }
  });

  // Insert spaces between words
  const joinedText = wordElements.reduce(
    (previous: (string | JSX.Element)[], current: string | JSX.Element) => {
      if (!previous.length) {
        return [current];
      } else {
        return [...previous, ' ', current];
      }
    },
    []
  );

  return joinedText;
};

const dividerStyle = {
  marginLeft: '2%',
  marginRight: '2%',
}

const PassageCard: React.FC<Props> = memo((props: Props) => {
  const reference = makeReferenceString(props.passage.references);
  const text = makeTextElements(props.passage.words);
  return (
    <Paper className="passage-card" elevation={3} key={props.passageIndex}>
      <Typography variant="h6" component="h3">
        {reference}
      </Typography>
      <div className="passage-card-text-container">
        <Typography className="passage-card-text-element" variant="body1">{text}</Typography>
        <Divider style={dividerStyle} orientation="vertical" flexItem/>
        <Typography className="passage-card-text-element" variant="body1">{props.passage.translation}</Typography>
      </div>
    </Paper>
  );
});

export default PassageCard;
