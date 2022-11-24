import { alpha, createTheme } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    secondaryBackground: {
      default: string;
      text: string;
    };
  }
}

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
    common: {
      secondaryBackground: {
        default: '#1e1e1e',
        text: '#eee',
      },
    },
  },
});

darkTheme.components = {
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => {
        const selectedColor =
          ownerState.color && ownerState.color !== 'standard'
            ? theme.palette[ownerState.color].main
            : theme.palette.primary.main;
        return {
          color: theme.palette.grey[300],
          '&.Mui-selected': {
            color: '#fff',
            borderColor: alpha(selectedColor, 0.2),
            backgroundColor: alpha(selectedColor, 0.2),
            '&:hover': {
              backgroundColor: alpha(selectedColor, 0.3),
            },
          },
        };
      },
    },
  },
};

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
    common: {
      secondaryBackground: {
        default: '#f9f9fb',
        text: 'rgba(0, 0, 0, 0.87)',
      },
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
