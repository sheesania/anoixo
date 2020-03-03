import React, { memo } from 'react';
import { Link } from './QueryTypes';
import Arrow from './Arrow';
import WordsBetween from './WordsBetween';
import Typography from '@material-ui/core/Typography';
import './css/WordLink.css';

type Props = {
  link: Link | undefined;
  type: 'active' | 'inactive';
  id: number;
};

const WordLink: React.FC<Props> = memo((props: Props) => {
  const id = `arrow${props.id}`;

  return (
    <div className="word-link">
      {props.type === 'active' && (
        <Typography variant="subtitle1" component="label" htmlFor={id}>
          followed by a
        </Typography>
      )}
      <Arrow type={props.type} id={id} />
      {props.type === 'active' &&
        <WordsBetween allowedWordsBetween={props.link ? props.link.allowedWordsBetween : undefined} />}
    </div>
  );
});

export default WordLink;
