'use client';

import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Brightness7, Brightness3 } from 'mdi-material-ui';
import Link from 'next/link';

import Icon from '../assets/icon.svg';
import Logo from '../assets/logo.svg';
import { useTheme } from '../providers/ThemeProvider';

import { LanguageSelector } from './LanguageSelector';

export function TopNavBar() {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const icon = !isDarkMode ? <Brightness7 /> : <Brightness3 />;

  return (
    <div>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              marginRight: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            component={Link}
            color="inherit"
            style={{ textDecoration: 'none' }}
            href="/"
          >
            <Box
              sx={(theme) => ({
                height: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                color:
                  theme.palette.mode === 'light'
                    ? 'primary.main'
                    : theme.palette.grey[300],
              })}
            >
              <Box
                sx={(theme) => ({
                  height: '2rem',
                  marginRight: '4px',
                  bgcolor:
                    theme.palette.mode === 'light'
                      ? 'primary.main'
                      : 'primary.dark',
                  color:
                    theme.palette.mode === 'light'
                      ? 'primary.main'
                      : 'primary.dark',
                  borderRadius: '50%',
                  padding: '3px',
                  paddingLeft: '2px',
                  paddingRight: '4px',
                })}
              >
                <Icon style={{ verticalAlign: 'super' }} />
              </Box>
              <Logo />
            </Box>
          </Typography>
          <LanguageSelector />
          <IconButton
            edge="end"
            color="inherit"
            aria-label="mode"
            onClick={() => toggleTheme()}
          >
            {icon}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
