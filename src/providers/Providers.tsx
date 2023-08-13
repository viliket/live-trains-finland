'use client';

import { useMemo } from 'react';

import { ApolloProvider } from '@apollo/client';
import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { fiFI, enUS } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';

import { client } from '../graphql/client';
import { lightTheme, darkTheme } from '../theme';
import { ThemeProvider, useTheme } from './ThemeProvider';
import '../i18n';

const DEFAULT_THEME = 'light';

const MuiProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const { theme: themeState } = useTheme();
  const themeName =
    themeState === 'dark' || themeState === 'light'
      ? themeState
      : DEFAULT_THEME;
  const theme = useMemo(
    () =>
      createMuiTheme(
        {
          ...(themeName === 'dark' ? darkTheme : lightTheme),
        },
        i18n.resolvedLanguage === 'fi' ? fiFI : enUS
      ),
    [i18n.resolvedLanguage, themeName]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

const NextThemeProvider = ({ children }: { children: React.ReactNode }) => (
  // Separate ThemeProvider from MUI, so is does not get rerendered on theme switch
  <ThemeProvider>{children}</ThemeProvider>
);

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ApolloProvider client={client}>
    <NextThemeProvider>
      <MuiProvider>{children}</MuiProvider>
    </NextThemeProvider>
  </ApolloProvider>
);

export default Providers;
