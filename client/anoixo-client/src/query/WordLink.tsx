import React, {memo} from 'react';
import Arrow from './Arrow';
import Typography from '@material-ui/core/Typography';
import './css/WordLink.css';

type Props = {
    type: 'active' | 'inactive';
    id: number;
};

const WordLink: React.FC<Props> = memo((props: Props) => {
    const id = `arrow${props.id}`;

    return (
        <div className='word-link'>
            <Arrow type={props.type} id={id}/>
            {props.type === 'active' && 
                <Typography variant='subtitle1' component='label' htmlFor={id}>
                    followed by a
                </Typography>
            }
        </div>
    );
});

export default WordLink;
