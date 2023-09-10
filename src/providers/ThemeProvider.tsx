import React, {
  useState,
  useContext,
  PropsWithChildren,
  useEffect,
} from 'react';

import { useMediaQuery } from '@mui/material';

type Theme = 'light' | 'dark';
type ThemeContext = { theme: Theme; toggleTheme: () => void };

export const ThemeContext = React.createContext<ThemeContext>(
  {} as ThemeContext
);

export const useTheme = () => useContext(ThemeContext);

const getThemeBasedOnPreference = (prefersDarkMode: boolean) =>
  prefersDarkMode ? 'dark' : 'light';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = useState<Theme>(
    getThemeBasedOnPreference(prefersDarkMode)
  );
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Change theme when CSS media feature prefers-color-scheme changes
    setTheme(getThemeBasedOnPreference(prefersDarkMode));
  }, [prefersDarkMode]);

  useEffect(() => {
    const d = document.documentElement;
    d.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
