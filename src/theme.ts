import { createTheme } from '@mui/material';

const baseTheme = createTheme({});
const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    background: {
      default: '#1e1e1e',
    },
    primary: {
      main: '#066fdb',
    },
    secondary: {
      main: '#00A651',
    },
  },
});

const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    background: {
      default: '#fff',
    },
    primary: {
      main: '#023a73',
    },
    secondary: {
      main: '#00A651',
    },
    divider: '#eee',
  },
});

lightTheme.components = {
  MuiAppBar: {
    styleOverrides: {
      colorPrimary: {
        backgroundColor: 'white',
        color: lightTheme.palette.primary.main,
      },
    },
  },
};

export { darkTheme, lightTheme };
