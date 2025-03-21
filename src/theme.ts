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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'kbd': {
          border: '1px solid',
          borderRadius: 4,
          padding: '0 2px',
          background: '#121212',
          fontWeight: 'bold',
        }
      }
    }
  }
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
