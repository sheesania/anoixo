import React, { memo } from 'react';
import { useUID } from 'react-uid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

type Props = {
  allowedWordsBetween: number | undefined;
  updateAllowedWordsBetween: (newAllowedWordsBetween: number | undefined) => void;
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

  const onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAllowedWordsBetween = parseInt(event.target.value, 10);
    if (Number.isNaN(newAllowedWordsBetween)) {
      props.updateAllowedWordsBetween(undefined);
    } else {
      props.updateAllowedWordsBetween(newAllowedWordsBetween);
    }
  };

  return (
    <div style={divStyle}>
      <Checkbox id={uid} />
      <Typography style={labelStyle} variant='subtitle1' component='label' htmlFor={uid}>
        up to 
        <TextField
          style={fieldDivStyle}
          value={props.allowedWordsBetween || 0}
          variant='outlined'
          inputProps={{ style: inputStyle, size: 2 }}
          onChange={onTextFieldChange}
        />
        <br />
        words in between 
      </Typography>
    </div> 
  );
});

export default WordsBetween;
