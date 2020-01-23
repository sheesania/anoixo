import React from 'react';
import {Query} from '../query/QueryTypes';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

type Props = {
    query: Query;
    isOpen: boolean;
    closeSelf: () => void;
}

const Results: React.FC<Props> = (props: Props) => {
    return (
        <Drawer className='Results' open={props.isOpen} anchor='right'>
            results for query: {JSON.stringify(props.query)}
            <Button onClick={props.closeSelf}>&lt;&lt;Back to Search</Button>
        </Drawer>
    );
}

export default Results;
