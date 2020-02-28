import React, { memo } from 'react';
import { SuccessResult } from './ResultTypes';
import BackForwardButton from '../common/BackForwardButton';
import PassageCard from './PassageCard';
import Typography from '@material-ui/core/Typography';
import './css/ResultsListing.css';

type Props = {
  results: SuccessResult;
  closeResults: () => void;
};

const ResultsListing: React.FC<Props> = memo((props: Props) => {
  const passageCards = props.results.map((passage, index) => <PassageCard passage={passage} passageIndex={index}/>);

  return (
    <div className="ResultsListing">
      <div className="results-title">
        <Typography variant="h4" component="h2">
          Results
        </Typography>
        <BackForwardButton
          type="back"
          onClick={props.closeResults}
          customStyling={{ marginLeft: '1.2rem' }}
        />
      </div>
      {passageCards}
      <BackForwardButton
        type="back"
        onClick={props.closeResults}
        customStyling={{ marginLeft: '1.2rem', marginBottom: '1.2rem' }}
      />
    </div>
  );
});

export default ResultsListing;
