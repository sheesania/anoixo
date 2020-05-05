import React, { memo } from 'react';
import { SuccessResult } from './ResultTypes';
import { Query } from '../query/QueryTypes';
import BackForwardButton from '../common/BackForwardButton';
import CopyrightNotice from './CopyrightNotice';
import PassageCard from './PassageCard';
import VerbalizedQuery from './VerbalizedQuery';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import './css/ResultsListing.css';

type Props = {
  query: Query;
  results: SuccessResult;
  closeResults: () => void;
};

const ResultsListing: React.FC<Props> = memo((props: Props) => {
  const hasResults = props.results.length > 0;
  let resultsView;
  if (hasResults) {
    resultsView = props.results.map((passage, index) => (
      <PassageCard key={index} passage={passage} passageIndex={index} />
    ));
  } else {
    resultsView = (
      <Alert className="results-item" severity="info">
        No results were found for your search.
      </Alert>
    );
  }

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
        {hasResults && <CopyrightNotice />}
      </div>
      <VerbalizedQuery query={props.query} />
      {resultsView}
      <BackForwardButton
        type="back"
        onClick={props.closeResults}
        customStyling={{ marginLeft: '1.2rem', marginBottom: '1.2rem' }}
      />
    </div>
  );
});

export default ResultsListing;
