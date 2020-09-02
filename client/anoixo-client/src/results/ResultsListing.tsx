import React, { useCallback, useEffect, useState } from 'react';
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
  results: SuccessResponse;
  closeResults: () => void;
};

const PAGE_SIZE = 10;

const ResultsListing: React.FC<Props> = (props: Props) => {
  const [page, setPage] = useState(1);
  const handlePageChange = useCallback(
    (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    },
    [setPage]
  );

  useEffect(() => {
    // Temporary hack for scrolling to top of page after page changes
    const resultsDrawer = document.getElementById('results-content');
    resultsDrawer && resultsDrawer.scrollIntoView(true);
  }, [page]);

  const hasResults = props.results.results.length > 0;
  let resultsView;

  if (hasResults) {
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageEnd = pageStart + PAGE_SIZE;
    const totalPages = Math.ceil(props.results.results.length / PAGE_SIZE);
    const resultsForPage = props.results.results.slice(pageStart, pageEnd);
    const pagination = (
      <Pagination
        className="results-item results-pagination"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        showFirstButton
        showLastButton
      />
    );

    resultsView = (
      <div>
        {pagination}
        {resultsForPage.map((passage, index) => (
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
};

export default ResultsListing;
