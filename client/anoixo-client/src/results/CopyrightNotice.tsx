import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';
import './css/CopyrightNotice.css';

const CopyrightNotice: React.FC = memo(() => {
  return (
    <Typography className="copyright-notice" variant="caption" component="p">
      Scripture quotations are from the{' '}
      <a href="http://www.esv.org/">ESV® Bible</a> (The Holy Bible, English
      Standard Version®), copyright © 2001 by Crossway, a publishing ministry of
      Good News Publishers. Used by permission. All rights reserved. You may not
      copy or download more than 500 consecutive verses of the ESV Bible or more
      than one half of any book of the ESV Bible.
    </Typography>
  );
});

export default CopyrightNotice;
