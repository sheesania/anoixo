import React, { memo } from 'react';
import { ErrorResult } from './ResultTypes';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import BackForwardButton from '../common/BackForwardButton';
import Button from '@material-ui/core/Button';
import { FEEDBACK_FORM_URL } from '../AppSettings';
import './css/ResultsError.css';

type Props = {
  error: ErrorResult;
  closeResults: () => void;
};

const ResultsError: React.FC<Props> = memo((props: Props) => {
  const { error, closeResults } = props;

  return (
    <div>
      <Alert className="results-error-alert" severity="error">
        <AlertTitle>There was a problem doing your search</AlertTitle>
        <div className="results-error-message">
          {error.friendlyErrorMessage}
        </div>
        <Button
          className="report-problem-button"
          variant="outlined"
          href={FEEDBACK_FORM_URL}
          target="_blank"
          rel="noopener"
        >
          Report your problem
        </Button>
      </Alert>
      <BackForwardButton
        customStyling={{ marginLeft: '1.2rem', marginBottom: '1.2rem' }}
        type="back"
        onClick={closeResults}
      />
    </div>
  );
});

export default ResultsError;
