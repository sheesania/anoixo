import React, {memo} from 'react';
import {WordQuery} from './QueryTypes';
import {Paper} from '@material-ui/core';
import './css/WordBuilder.css';

type Props = {
    word: WordQuery;
};

const WordBuilder: React.FC<Props> = memo((props: Props) => {
  return (
    <Paper className='WordBuilder' elevation={3}>
        look at my word: {JSON.stringify(props.word)}
    </Paper>
  );
})

export default WordBuilder;
