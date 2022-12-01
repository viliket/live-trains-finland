import { alpha, createTheme } from '@mui/material';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    secondaryBackground: {
      default: string;
      text: string;
    };
  }
}

const baseTheme = createTheme({
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.common.secondaryBackground.default,
          color: theme.palette.primary.main,
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    background: {
      default: '#232323',
    },
    primary: {
      main: '#066fdb',
    },
    secondary: {
      main: '#00A651',
    },
    error: {
      main: '#d67a7a',
    },
    common: {
      secondaryBackground: {
        default: '#1e1e1e',
        text: '#eee',
      },
    },
    divider: '#2b2b2b',
  },
});

darkTheme.components = {
  ...baseTheme.components,
  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme, ownerState }) => {
        const selectedColor =
          ownerState.color && ownerState.color !== 'standard'
            ? theme.palette[ownerState.color].main
            : theme.palette.primary.main;
        return {
          textTransform: 'none',
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
      main: '#004994',
    },
    secondary: {
      main: '#00A651',
    },
    error: {
      main: '#b72727',
    },
    text: {
      primary: 'rgb(26, 32, 39)',
    },
    common: {
      secondaryBackground: {
        default: 'rgb(249, 249, 251)',
        text: 'rgba(0, 0, 0, 0.87)',
      },
    },
    divider: '#eee',
  },
});

export { darkTheme, lightTheme };
