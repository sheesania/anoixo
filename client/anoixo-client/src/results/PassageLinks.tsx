import React, { memo } from 'react';
import Chip from '@material-ui/core/Chip';
import LaunchIcon from '@material-ui/icons/Launch';
import './css/PassageLinks.css';

type Props = {
};

const PassageLinks: React.FC<Props> = memo((props: Props) => {
  return (
    <div className='passage-card-links'>
      <div className='passage-card-main-links'>
        <Chip
          className='passage-link-chip'
          size='small'
          icon={<LaunchIcon/>}
          label='NET Bible'
          component='a'
          href='https://netbible.org/bible/Ephesians+5'
          target='_blank'
          rel='noopener'
          clickable
        />
        <Chip
          className='passage-link-chip'
          size='small'
          icon={<LaunchIcon/>}
          label='Commentaries'
          component='a'
          href='https://biblehub.com/commentaries/ephesians/1-1.htm'
          target='_blank'
          rel='noopener'
          clickable
        />
      </div>
      <div className='passage-card-translation-links'>
        <Chip
          className='passage-link-chip'
          size='small'
          icon={<LaunchIcon/>}
          label='Compare translations'
          component='a'
          href='https://www.biblegateway.com/passage/?search=Ephesians+5&version=sblgnt;NIV;ESV'
          target='_blank'
          rel='noopener'
          clickable
        />
      </div>
    </div>
  );
});

export default PassageLinks;
