import React, {memo} from 'react'
import {useUID} from 'react-uid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import './css/AddWord.css';

type Props = {
  addWord: () => void;
};

const useOverriddenButtonStyles = makeStyles({
    root: {
      boxShadow: 'none',
      backgroundColor: '#77cc64', //light green
    }
  });

const useOverriddenTypographyStyles = makeStyles({
    subtitle1: {
        lineHeight: '1.2em',
        marginBottom: '5%',
        cursor: 'pointer',
    }
});

const AddWord: React.FC<Props> = memo((props: Props) => {
  const uid = 'add-word-' + useUID();
  const overriddenButtonStyle = useOverriddenButtonStyles();
  const overriddenTypographyStyle = useOverriddenTypographyStyles();

  return (
    <div className='AddWord' onClick={props.addWord}>
      <Typography classes={{subtitle1: overriddenTypographyStyle.subtitle1}} variant='subtitle1' component='label' 
        align='center' htmlFor={uid}>
          followed by<br/>a word...
      </Typography>
      {/* This button also has an onClick for accessibility reasons */}
      <Fab id={uid} onClick={props.addWord} classes={{root: overriddenButtonStyle.root}} size='small' disableRipple>
        <AddIcon className='add-word-icon'/>
      </Fab>
    </div>
  );
})

export default AddWord;
