import React, {memo} from 'react'
import {useUID} from 'react-uid';
import {makeStyles} from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import './css/AddWord.css';

type Props = {
  addWord: () => void;
};

const useOverriddenButtonStyles = makeStyles({
  root: {
    flexShrink: 0,
    margin: '0.5rem',
    padding: '1.2rem',
    width: '20rem',

    /* Dashed border. Using a background image instead of `border-style: dashed` since what it exactly looks like is
       implementation-dependent. */
    backgroundImage: "url(\"data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='4' ry='4' stroke='%23333' stroke-width='2' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e\")",
    backgroundClip: 'padding-box',
    borderRadius: '4px',
    border: '2px solid transparent', /* necessary to avoid contents jumping around when I add a border on hover */

    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  const overriddenTypographyStyle = useOverriddenTypographyStyles();
  const overriddenButtonStyle = useOverriddenButtonStyles();

  return (
      <ButtonBase id={uid} classes={{root: overriddenButtonStyle.root}} className='AddWord' component='div'
        onClick={props.addWord} disableRipple>
        <Typography classes={{subtitle1: overriddenTypographyStyle.subtitle1}} variant='subtitle1' component='label' 
          align='center' htmlFor={uid}>
            followed by<br/>a word...
        </Typography>
        <AddCircleIcon className='add-word-icon' fontSize='large'/>
      </ButtonBase>
    
  );
})

export default AddWord;
