import React, { useCallback, useEffect, useState } from 'react';
import { useTextSetting } from '../texts/TextSettings';
import { Query } from '../query/QueryTypes';
import {
  ErrorResponse,
  SuccessResponse,
  parseErrorResponse,
  parseSuccessResponse,
} from './ResultTypes';
import { ServerSettings } from '../AppSettings';
import Loading from './Loading';
import ResultsError from './ResultsError';
import ResultsListing from './ResultsListing';
import Drawer from '@material-ui/core/Drawer';
import './css/Results.css';

type Props = {
  query: Query;
  isOpen: boolean;
  closeSelf: () => void;
};

const JSON_PARSING_ERROR_FRIENDLY_MESSAGE =
  "I couldn't understand the server. Check your Internet " +
  "connection. If that doesn't help, there might be a bug in the app, so let us know about this problem so we can " +
  'fix it!';
const REQUEST_SENDING_ERROR_FRIENDLY_MESSAGE =
  "I couldn't send your search to the server. Check your Internet " +
  "connection. If that doesn't help, there might be a bug in the app, so let us know about this problem so we can " +
  'fix it!';

const Results: React.FC<Props> = (props: Props) => {
  const { query, isOpen, closeSelf } = props;
  const [success, setSuccess] = useState<SuccessResponse | undefined>(
    undefined
  );
  const [error, setError] = useState<ErrorResponse | undefined>(undefined);
  const [page, setPage] = useState<number>(1);
  const currentText = useTextSetting();

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleRequestSuccess = (getJson: Promise<any>) => {
    getJson.then((json: any) => {
      try {
        const parsedSuccess = parseSuccessResponse(json);
        setSuccess(parsedSuccess);
      } catch (e) {
        setError({
          error: 'JSON parsing error',
          description:
            'There was a problem parsing the response from the server',
          friendlyErrorMessage: JSON_PARSING_ERROR_FRIENDLY_MESSAGE,
        });
      }
    });
  };
  const handleRequestError = (getJson: Promise<any>) => {
    getJson.then((json: any) => {
      try {
        const parsedError = parseErrorResponse(json);
        setError(parsedError);
      } catch (e) {
        setError({
          error: 'JSON parsing error',
          description:
            'There was a problem parsing the error received from the server',
          friendlyErrorMessage: JSON_PARSING_ERROR_FRIENDLY_MESSAGE,
        });
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setSuccess(undefined);
    setError(undefined);
    const url = `${ServerSettings.apiUrl}/text/${currentText.serverTextId}`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: page,
        ...query,
      }),
    })
      .then(response => {
        const getJson = response.json();
        if (response.ok) {
          handleRequestSuccess(getJson);
        } else {
          handleRequestError(getJson);
        }
      })
      .catch((error: Error) => {
        setError({
          error: `Error sending request: ${error.name}`,
          description: error.message,
          friendlyErrorMessage: REQUEST_SENDING_ERROR_FRIENDLY_MESSAGE,
        });
      });
  }, [isOpen, page, query, currentText]);

  let display;
  if (error) {
    display = <ResultsError error={error} closeResults={closeSelf} />;
  } else if (success) {
    display = (
      <ResultsListing
        query={query}
        response={success}
        goToPage={goToPage}
        closeResults={closeSelf}
      />
    );
    // display = (
    //   <div>
    //     <button
    //       onClick={() => {
    //         goToPage(page + 1);
    //       }}
    //     >
    //       give me the next page
    //     </button>
    //     {JSON.stringify(success)}
    //   </div>
    // );
  } else {
    display = <Loading closeSelf={closeSelf} />;
  }

  return (
    <Drawer
      open={isOpen}
      anchor="right"
      PaperProps={{ classes: { root: 'results-paper' } }}
    >
      <div id="results-content" className="results-content">
        {display}
      </div>
    </Drawer>
  );
};

export default Results;
