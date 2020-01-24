import React, {memo} from 'react'
import BackForwardButton from '../common/BackForwardButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import './css/Loading.css';

type Props = {
    closeSelf: () => void;
};

const Loading: React.FC<Props> = memo((props: Props) => {
  return (
      <div className='loading-screen'>
          <CircularProgress size='8rem' thickness={2} style={{color: '#4c8240'}}/>
          <BackForwardButton type='back' onClick={props.closeSelf}/>
      </div>
  );
});

export default Loading;
