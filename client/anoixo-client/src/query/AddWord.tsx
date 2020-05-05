import React, { memo } from 'react';
import { useUID } from 'react-uid';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import './css/AddWord.css';

type Props = {
  addWord: () => void;
};

const AddWord: React.FC<Props> = memo((props: Props) => {
  const uid = 'add-word-' + useUID();

  return (
    <ButtonBase
      id={uid}
      className="add-word"
      component="div"
      onClick={props.addWord}
      disableRipple
    >
      <Typography
        className="add-word-label"
        variant="subtitle1"
        component="label"
        align="center"
        htmlFor={uid}
      >
        Add a<br />
        following word
      </Typography>
      <AddCircleIcon className="add-word-icon" fontSize="large" />
    </ButtonBase>
  );
});

export default AddWord;
