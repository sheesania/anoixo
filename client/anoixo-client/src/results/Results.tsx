import React, {useEffect, useState} from 'react';
import {Query} from '../query/QueryTypes';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

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
        <Drawer className='Results' open={isOpen} anchor='right'>
            {results ? (
                <div>{results}</div>
            ) : (
                <div>Loading...</div>
            )}
            <Button onClick={closeSelf}>&lt;&lt;Back to Search</Button>
        </Drawer>
    );
}

export default Results;
