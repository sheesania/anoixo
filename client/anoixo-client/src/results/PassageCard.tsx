import React, { memo } from 'react';
import { PassageResult, ReferenceResult, WordResult } from './ResultTypes';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import PassageLinks from './PassageLinks';
import Word from './Word';
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
  const wordElements = words.map(word => <Word word={word} />);

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

const PassageCard: React.FC<Props> = memo((props: Props) => {
  const reference = makeReferenceString(props.passage.references);
  const text = makeTextElements(props.passage.words);
  return (
    <Paper
      className="results-item passage-card"
      elevation={3}
      key={props.passageIndex}
    >
      <div className="passage-card-header">
        <Typography variant="h6" component="h3">
          {reference}
        </Typography>
        <PassageLinks references={props.passage.references} />
      </div>
      <div className="passage-card-text-container">
        {/* Workaround for 'missing key props' warning, which is irrelevant here since 'text' will never dynamically
            change and need to be rerendered */}
        {React.createElement(
          Typography,
          { className: 'passage-card-text-element', variant: 'body1' },
          ...text
        )}
        <Divider
          className="passage-card-divider"
          orientation="vertical"
          flexItem
        />
        <Typography className="passage-card-text-element" variant="body1">
          {props.passage.translation}
        </Typography>
      </div>
    </Paper>
  );
});

export default PassageCard;
