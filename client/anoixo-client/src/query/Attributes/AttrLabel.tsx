import React, {memo} from 'react';
import Typography from '@material-ui/core/Typography';

type Props = {
    id: string;
    text: string;
}

const AttrLabel: React.FC<Props> = memo((props: Props) => {
  return (
    <Typography id={props.id} variant='subtitle1' component='label'>{props.text}</Typography>
  );
})

export default AttrLabel;
