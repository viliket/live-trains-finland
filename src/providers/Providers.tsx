'use client';

import { useMemo } from 'react';

import {
  createTheme as createMuiTheme,
  ThemeProvider as MuiThemeProvider,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { fiFI, enUS } from '@mui/material/locale';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/next/pages';
import { useTranslation } from 'react-i18next';
import { MapProvider } from 'react-map-gl/maplibre';

import baseTheme from '../theme';

import '../i18n';
const MuiProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();

  const theme = useMemo(
    () =>
      createMuiTheme(
        {
          cssVariables: {
            colorSchemeSelector: 'data-theme',
          },
          ...baseTheme,
        },
        i18n.resolvedLanguage === 'fi' ? fiFI : enUS
      ),
    [i18n.resolvedLanguage]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      networkMode: 'always',
    },
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => (
  <NuqsAdapter>
    <QueryClientProvider client={queryClient}>
      <MuiProvider>
        <MapProvider>{children}</MapProvider>
      </MuiProvider>
    </QueryClientProvider>
  </NuqsAdapter>
);

export default Providers;
