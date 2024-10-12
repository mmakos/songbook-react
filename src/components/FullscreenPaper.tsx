import { Paper, useTheme } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const FullscreenPaper: FC<PropsWithChildren> = ({ children }) => {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        my: '1em',
        mx: '10em',
        [theme.breakpoints.down('lg')]: {
          mx: '5em',
        },
        [theme.breakpoints.down('md')]: {
          mx: '1em',
        },
        padding: '1em 2em',
      }}
    >
      {children}
    </Paper>
  );
};

export default FullscreenPaper;
