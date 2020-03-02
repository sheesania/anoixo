import React, { memo } from 'react';
import { useUID } from 'react-uid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

type Props = {
};

const divStyle = {
  marginTop: '1em',
  display: 'flex',
  alignItems: 'flex-start',
}

const labelStyle = {
  lineHeight: '1.4',
}

const fieldDivStyle = {
  marginLeft: '0.5em',
  verticalAlign: 'baseline',
}

const inputStyle = {
  padding: '2px',
}

const WordsBetween: React.FC<Props> = memo((props: Props) => {
  const uid = 'words-between-' + useUID();
  return (
    <div style={divStyle}>
      <Checkbox id={uid} />
      <Typography style={labelStyle} variant='subtitle1' component='label' htmlFor={uid}>
        up to 
        <TextField
          style={fieldDivStyle}
          defaultValue={0}
          variant='outlined'
          inputProps={{ style: inputStyle, size: 2 }} />
        <br />
        words in between 
      </Typography>
    </div> 
  );
});

export default WordsBetween;
