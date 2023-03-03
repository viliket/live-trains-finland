import { useState, useMemo, useEffect } from 'react';

import {
  createTheme,
  CssBaseline,
  Theme,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { fiFI, enUS } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import { Route, Routes } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { TopNavBar } from './components/TopNavBar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Station from './pages/Station';
import Train from './pages/Train';
import { darkTheme, lightTheme } from './theme';

const updateThemeColor = (prefersDarkMode: boolean, theme: Theme): void => {
  const themeColorElements = document.querySelectorAll(
    'meta[name="theme-color"]'
  );
  const systemColorScheme = prefersDarkMode ? 'dark' : 'light';

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

function App() {
  const { i18n } = useTranslation();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkMode, setIsDarkMode] = useState(prefersDarkMode);

  const theme = useMemo(
    () =>
      createTheme(
        {
          ...(isDarkMode ? darkTheme : lightTheme),
        },
        i18n.resolvedLanguage === 'fi' ? fiFI : enUS
      ),
    [isDarkMode, i18n.resolvedLanguage]
  );

  useEffect(() => {
    updateThemeColor(prefersDarkMode, theme);
  }, [prefersDarkMode, theme]);

  useEffect(() => {
    setIsDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((isDarkMode) => !isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToTop />
      <div className={`App ${isDarkMode ? 'dark' : ''}`} data-testid="app">
        <TopNavBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <Routes>
          <Route
            path="/train/:trainNumber/:departureDate"
            element={<Train />}
          />
          <Route path="/:station" element={<Station />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
