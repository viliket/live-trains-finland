import { CssVarsThemeOptions, alpha } from '@mui/material';

import type {} from '@mui/material/themeCssVarsAugmentation';

declare module '@mui/material/styles/createPalette' {
  interface CommonColors {
    secondaryBackground: {
      default: string;
      text: string;
    };
  }
}

const baseTheme: CssVarsThemeOptions = {
  colorSchemes: {
    light: {
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
    },
    dark: {
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
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: ({ theme }) => ({
          backgroundColor:
            theme.vars.palette.common.secondaryBackground.default,
          color: theme.vars.palette.primary.main,
          ...theme.applyStyles('dark', {
            backgroundColor:
              theme.vars.palette.common.secondaryBackground.default,
            color: theme.vars.palette.primary.main,
          }),
        }),
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          variants: [
            {
              props: { color: 'primary' },
              style: {
                ...theme.applyStyles('dark', {
                  color: theme.palette.grey[300],
                  '&.Mui-selected': {
                    color: '#fff',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  },
                }),
              },
            },
          ],
        }),
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '24px',
          textTransform: 'none',
        },
      },
    },
  },
};

export default baseTheme;
