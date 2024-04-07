'use client';

import { useEffect, useMemo } from 'react';

import {
  createTheme as createMuiTheme,
  Theme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { fiFI, enUS } from '@mui/material/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { lightTheme, darkTheme } from '../theme';

import { ThemeProvider, useTheme } from './ThemeProvider';

import '../i18n';

const getPreferredScheme = () =>
  window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
    ? 'dark'
    : 'light';

const updateMetaThemeColor = (theme: Theme): void => {
  const themeColorElements = document.querySelectorAll(
    'meta[name="theme-color"]'
  );
  const systemColorScheme = getPreferredScheme();

  themeColorElements.forEach((meta) => {
    const mediaAttr = meta.getAttribute('media');

    if (mediaAttr?.includes(systemColorScheme)) {
      meta.setAttribute(
        'content',
        theme.palette.common.secondaryBackground.default
      );
    }
  });
};

const MuiProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const { theme: themeName } = useTheme();

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

  useEffect(() => {
    updateMetaThemeColor(theme);
  }, [theme]);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      networkMode: 'always',
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <NextThemeProvider>
      <MuiProvider>{children}</MuiProvider>
    </NextThemeProvider>
  </QueryClientProvider>
);

export default Providers;
