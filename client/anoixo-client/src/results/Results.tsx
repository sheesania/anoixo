import React from 'react';
import {Query} from '../query/QueryTypes';
import Button from '@material-ui/core/Button';

type Props = {
    query: Query;
    closeResults: () => void;
}

const Results: React.FC<Props> = (props: Props) => {
    return (
        <div className='Results'>
            results for query: {JSON.stringify(props.query)}
            <Button onClick={props.closeResults}>&lt;&lt;Back to Search</Button>
        </div>
    );
}

export default Results;
