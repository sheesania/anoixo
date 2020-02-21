import React, { memo } from 'react';
import Typography from '@material-ui/core/Typography';

const SearchScope: React.FC = memo(() => {
  return (
    <Typography variant="h4" component="h1" gutterBottom>
      Search for <strong>sentences</strong> that contain a...
    </Typography>
  );
});

export default SearchScope;
