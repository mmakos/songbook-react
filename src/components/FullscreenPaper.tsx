import { Paper, PaperProps, useTheme } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const FullscreenPaper: FC<PropsWithChildren & PaperProps> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Paper
      {...props}
      sx={{
        width: '100%',
        my: '1em',
        mx: '10em',
        [theme.breakpoints.down('lg')]: {
          mx: '5em',
        },
        [theme.breakpoints.down('md')]: {
          mx: '1em',
        },
        minHeight: '100%',
        padding: '1em 2em',
        ...props.sx,
      }}
    >
      {children}
    </Paper>
  );
};

export default FullscreenPaper;
