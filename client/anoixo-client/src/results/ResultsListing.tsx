import React, {memo} from 'react';
import {ReferenceResult, SuccessResult, WordResult} from './ResultTypes';
import BackForwardButton from '../common/BackForwardButton';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './css/ResultsListing.css';

type Props = {
    results: SuccessResult;
    closeResults: () => void;
};

const makeReferenceString = (references: ReferenceResult[]): string => {
  //There should always be at least one reference, but let's not break if there isn't
  if (!references.length) { 
    return '';
  }
  const firstReference = references[0];
  const lastReference = references[references.length - 1];
  let reference: string = `${firstReference.book} `;
  if (firstReference.chapter !== lastReference.chapter) {
    reference += 
      `${firstReference.chapter}:${firstReference.verse} - ${lastReference.chapter}:${lastReference.verse}`;
  } else {
    reference += `${firstReference.chapter}:${firstReference.verse}`;
    if (firstReference.verse !== lastReference.verse) {
      reference += `-${lastReference.verse}`;
    }
  }
  return reference;
};

const makeTextElements = (words: WordResult[]): (string | JSX.Element)[] => {
  //This triggers a React warning since the array elements don't have unique 'key' attributes, which help with optimized
  //re-rendering if array elements are added/removed/updated. However, these array elements will never be individually
  //changed (only the array as a whole when different results are displayed), so the warning is not relevant.
  //Unfortunately there's no way to tell React to ignore this issue here.
  const wordElements = words.map((word) => {
    if (word.matchedSequence > -1) {
      return <span className='matched-word'>{word.text}</span>;
    } else {
      return word.text;
    }
  });

  //Insert spaces between words
  const joinedText = wordElements.reduce((previous: (string | JSX.Element)[], current: (string | JSX.Element)) => {
    if (!previous.length) {
      return [current];
    } else {
      return [...previous, ' ', current];
    }
  }, []);

  return joinedText;
}

const ResultsListing: React.FC<Props> = memo((props: Props) => {
  const passageCards = props.results.map((passage, index) => {
    const reference = makeReferenceString(passage.references);
    const text = makeTextElements(passage.words);
    return (
      <Paper className='passage-card' elevation={3} key={index}>
        <Typography variant='h6' component='h3'>
          {reference}
        </Typography>
        <Typography variant='body1'>
          {text}
        </Typography>
      </Paper>
    );
  });

  return (
    <div className='ResultsListing'>
        <BackForwardButton type='back' onClick={props.closeResults} 
            customStyling={{marginLeft: '1.2rem', marginTop: '1.2rem'}}/>
        {passageCards}
        <BackForwardButton type='back' onClick={props.closeResults} 
            customStyling={{marginLeft: '1.2rem', marginBottom: '1.2rem'}}/>
    </div>
  );
})

export default ResultsListing;
