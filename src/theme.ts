import { createTheme } from '@mui/material';

export const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#ff6f26',
    },
    secondary: {
      main: '#26b6ff',
    },
    mode: 'dark',
  },
});

export const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#ff6f26',
    },
    secondary: {
      main: '#26b6ff',
    },
    mode: 'light',
  },
});
