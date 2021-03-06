import { useState, useMemo } from 'react';

import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { fiFI, enUS } from '@mui/material/locale';
import { useTranslation } from 'react-i18next';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './App.css';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { TopNavBar } from './components/TopNavBar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Station from './pages/Station';
import Train from './pages/Train';
import { darkTheme, lightTheme } from './theme';

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

  const toggleDarkMode = () => {
    setIsDarkMode((isDarkMode) => !isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <div className={`App ${isDarkMode ? 'dark' : ''}`}>
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
      </Router>
    </ThemeProvider>
  );
}

export default App;
