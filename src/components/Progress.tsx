import { LinearProgress, useTheme } from '@mui/material';

const Progress = () => {
  const theme = useTheme();

  return (
    <LinearProgress
      color={theme.palette.mode === 'dark' ? 'primary' : 'secondary'}
      sx={{ position: 'absolute', left: 0, top: {xs: 55, sm: 63}, width: '100%' }}
    />
  );
};

export default Progress;
