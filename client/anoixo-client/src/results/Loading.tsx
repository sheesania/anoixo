import React, { memo } from 'react';
import BackForwardButton from '../common/BackForwardButton';
import LoadingGif from './Loading.gif';
import './css/Loading.css';

type Props = {
  closeSelf: () => void;
};

const Loading: React.FC<Props> = memo((props: Props) => {
  return (
    <div className="loading-screen">
      <img
        src={LoadingGif}
        alt="Loading animation"
        style={{ maxWidth: '450px' }}
      />
      <BackForwardButton
        type="back"
        onClick={props.closeSelf}
        customStyling={{ marginTop: '2rem' }}
      />
    </div>
  );
});

export default Loading;
