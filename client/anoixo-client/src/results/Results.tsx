import React, {useEffect, useState} from 'react';
import {Query} from '../query/QueryTypes';
import {ErrorResult, SuccessResult, parseErrorResult, parseSuccessResult} from './ResultTypes';
import Loading from './Loading';
import BackForwardButton from '../common/BackForwardButton';
import Drawer from '@material-ui/core/Drawer';
import './css/Results.css';

// In the future, the server settings for a text could be grabbed dynamically from a dictionary depending on which text
// the user selected. For now I am just hardcoding the NLF server.
import {NLFServerSettings} from '../AppSettings';

type Props = {
    query: Query;
    isOpen: boolean;
    closeSelf: () => void;
}

const Results: React.FC<Props> = (props: Props) => {
    const {query, isOpen, closeSelf} = props;
    const [results, setResults] = useState<SuccessResult|undefined>(undefined);
    const [error, setError] = useState<ErrorResult|undefined>(undefined);

    const handleRequestSuccess = (getJson: Promise<any>) => {
        getJson.then((json: any) => {
            try {
                const parsedResult = parseSuccessResult(json);
                setResults(parsedResult);
            } catch (e) {
                setError({
                    error: 'JSON parsing error',
                    description: 'There was a problem parsing the response from the server',
                });
            }
        });
    }
    const handleRequestError = (getJson: Promise<any>) => {
        getJson.then((json: any) => {
            try {
                const parsedError = parseErrorResult(json);
                setError(parsedError);
            } catch (e) {
                setError({
                    error: 'JSON parsing error',
                    description: 'There was a problem parsing the error received from the server',
                });
            }
        });
    };

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setResults(undefined);
        setError(undefined);
        fetch(NLFServerSettings.textServerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query),
        })
        .then((response) => {
            const getJson = response.json();
            if (response.ok) {
                handleRequestSuccess(getJson);
            } else {
                handleRequestError(getJson);
            }
        });
    }, [isOpen, query]);

    let display;
    if (error) {
        display = <div>{JSON.stringify(error)} <BackForwardButton type='back' onClick={closeSelf}/></div>;
    } else if (results) {
        display = <div>{JSON.stringify(results)} <BackForwardButton type='back' onClick={closeSelf}/></div>;
    } else {
        display = <Loading closeSelf={closeSelf}/>;
    }

    return (
        <Drawer open={isOpen} anchor='right'>
            <div className='results-content'>
                {display}
            </div>
        </Drawer>
    );
}

export default Results;
