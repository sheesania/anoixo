import React, { useCallback } from 'react';
import { SuccessResponse } from './ResultTypes';
import { Query } from '../query/QueryTypes';
import BackForwardButton from '../common/BackForwardButton';
import CopyrightNotice from './CopyrightNotice';
import PassageCard from './PassageCard';
import VerbalizedQuery from './VerbalizedQuery';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import Typography from '@material-ui/core/Typography';
import './css/ResultsListing.css';

type Props = {
  query: Query;
  response: SuccessResponse;
  goToPage: (page: number) => void;
  closeResults: () => void;
};

const ResultsListing: React.FC<Props> = (props: Props) => {
  const { query, response, goToPage, closeResults } = props;
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, pageNumber: number) => {
      goToPage(pageNumber);
    },
    [goToPage]
  );

  const hasResults = response.results.length > 0;
  let resultsView;

  if (hasResults) {
    const pagination = (
      <Pagination
        className="results-item results-pagination"
        count={response.pagination.totalPages}
        page={response.pagination.page}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    );

    resultsView = (
      <div>
        {pagination}
        {response.results.map((passage, index) => (
          <PassageCard key={index} passage={passage} passageIndex={index} />
        ))}
        {pagination}
      </div>
    );
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
          onClick={closeResults}
          customStyling={{ marginLeft: '1.2rem' }}
        />
        {hasResults && <CopyrightNotice />}
      </div>
      <VerbalizedQuery query={query} />
      {resultsView}
      <BackForwardButton
        type="back"
        onClick={closeResults}
        customStyling={{ marginLeft: '1.2rem', marginBottom: '1.2rem' }}
      />
    </div>
  );
};

export default ResultsListing;
