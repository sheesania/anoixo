import React, {memo} from 'react';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {withStyles} from '@material-ui/styles';

type Props = {
    onClick: () => void;
    type: 'search' | 'back';
    customStyling?: React.CSSProperties;
}

const BackForwardButton: React.FC<Props> = memo((props: Props) => {
  const CustomButton = withStyles(() => ({
    root: {
      color: 'white',
      backgroundColor: '#77cc64',
      '&:hover': {
        backgroundColor: '#4c8240',
      },
      ...props.customStyling
    },
  }))(Button);

  let icon, text;
  if (props.type === 'search') {
      icon = {endIcon: <ArrowForwardIcon/>};
      text = 'Search';
  } else {  //type is 'back'
      icon = {startIcon: <ArrowBackIcon/>};
      text = 'Back to Search';
  }
  return (
    <CustomButton onClick={props.onClick} size='large' {...icon}>
        {text}
    </CustomButton>
  );
});

export default BackForwardButton;
