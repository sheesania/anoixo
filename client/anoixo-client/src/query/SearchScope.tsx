import React, {memo} from 'react';
import Typography from '@material-ui/core/Typography';

const SearchScope: React.FC = memo(() => {
  return (
    <div className='SearchScope'>
      <Typography variant='h4' component='h1'>Search for <strong>sentences</strong> that contain a...</Typography>
    </div>
  );
})

export default SearchScope;
