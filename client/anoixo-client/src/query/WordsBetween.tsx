import React, { memo, useEffect, useState } from 'react';
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
  const { allowedWordsBetween, updateAllowedWordsBetween } = props;
  const uid = 'words-between-' + useUID();
  const [checked, setChecked] = useState((allowedWordsBetween || allowedWordsBetween === 0) ? true : false);
  const [textFieldValue, setTextFieldValue] = useState(allowedWordsBetween || 0);
  
  useEffect(() => {
    let newAllowedWordsBetween = undefined;
    if (checked) {
      newAllowedWordsBetween = textFieldValue;
    }
    if (newAllowedWordsBetween !== allowedWordsBetween) {
      updateAllowedWordsBetween(newAllowedWordsBetween);
    }
  }, [checked, textFieldValue, allowedWordsBetween, updateAllowedWordsBetween]);

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(parseInt(event.target.value, 10));
  };

  return (
    <div style={divStyle}>
      <Checkbox id={uid} checked={checked} onChange={onCheckboxChange} />
      <Typography style={labelStyle} variant='subtitle1' component='label' htmlFor={uid}>
        up to 
        <TextField
          style={fieldDivStyle}
          value={textFieldValue}
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
