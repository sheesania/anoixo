import React, {useEffect, useState} from 'react';
import {Query} from '../query/QueryTypes';
import Loading from './Loading';
import BackForwardButton from '../common/BackForwardButton';
import Drawer from '@material-ui/core/Drawer';
import './css/Results.css';

type Props = {
    query: Query;
    isOpen: boolean;
    closeSelf: () => void;
}

const Results: React.FC<Props> = (props: Props) => {
    const {isOpen, closeSelf} = props;
    const [results, setResults] = useState<string|undefined>(undefined);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        setResults(undefined);
        const promiseTimeout = (time: number) => new Promise(resolve => setTimeout(resolve, time));
        promiseTimeout(1000).then(() => {
            setResults('got results');
        });
    }, [isOpen]);

    return (
        <Drawer open={isOpen} anchor='right'>
            <div className='results-content'>
                {results ? (
                    <div>
                        {results}
                        <BackForwardButton type='back' onClick={closeSelf}/>
                    </div>
                ) : (
                    <Loading closeSelf={closeSelf}/>
                )}
            </div>
        </Drawer>
    );
}

export default Results;
