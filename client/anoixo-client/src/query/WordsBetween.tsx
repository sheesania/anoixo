import React, { memo, useEffect, useState } from 'react';
import { useUID } from 'react-uid';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import './css/WordsBetween.css';

type Props = {
  allowedWordsBetween: number | undefined;
  updateAllowedWordsBetween: (
    newAllowedWordsBetween: number | undefined
  ) => void;
};

const WordsBetween: React.FC<Props> = memo((props: Props) => {
  const { allowedWordsBetween, updateAllowedWordsBetween } = props;
  const uid = 'words-between-' + useUID();
  const [checked, setChecked] = useState(
    allowedWordsBetween || allowedWordsBetween === 0 ? true : false
  );
  const [textFieldValue, setTextFieldValue] = useState(
    (allowedWordsBetween || 0).toString()
  );
  const [error, setError] = useState(false);

  // Validate and update allowedWordsBetween when the checkbox or text field is changed
  useEffect(() => {
    const parsedTextFieldValue = parseInt(textFieldValue, 10);
    if (Number.isNaN(parsedTextFieldValue)) {
      setError(true);
      if (checked) return; // there is no valid new value, so don't update
    } else {
      setError(false);
    }

    let newAllowedWordsBetween = undefined;
    if (checked) {
      newAllowedWordsBetween = parsedTextFieldValue;
    }
    if (newAllowedWordsBetween !== allowedWordsBetween) {
      updateAllowedWordsBetween(newAllowedWordsBetween);
    }
  }, [
    checked,
    textFieldValue,
    setError,
    allowedWordsBetween,
    updateAllowedWordsBetween,
  ]);

  return (
    <div className="words-between">
      <Checkbox
        id={`${uid}-checkbox`}
        checked={checked}
        onChange={event => setChecked(event.target.checked)}
        inputProps={{
          'aria-label': 'Restrict number of words between',
        }}
      />
      <div>
        <Typography
          id={`${uid}-up-to`}
          className="words-between-label"
          variant="subtitle1"
          component="label"
          htmlFor={`${uid}-checkbox`}
        >
          up to
        </Typography>
        <TextField
          id={`${uid}-num-words`}
          className="words-between-allowed-words-div"
          variant="outlined"
          inputProps={{
            className: 'words-between-allowed-words-input',
            size: 2,
            'aria-labelledby': `${uid}-up-to ${uid}-num-words ${uid}-words-in-between`,
          }}
          value={textFieldValue}
          onChange={event => setTextFieldValue(event.target.value)}
          error={error}
          helperText={error ? 'Not a number' : undefined}
        />
        <br />
        <Typography
          id={`${uid}-words-in-between`}
          className="words-between-label"
          variant="subtitle1"
          component="label"
          htmlFor={`${uid}-checkbox`}
        >
          words in between
        </Typography>
      </div>
    </div>
  );
});

export default WordsBetween;
