'use client';

import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import Icon from '../assets/icon.svg';
import Logo from '../assets/logo.svg';

import { LanguageSelector } from './LanguageSelector';
import { ThemeSelector } from './ThemeSelector';

export function TopNavBar() {
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
              color: 'inherit',
              textDecoration: 'none',
            }}
            component={Link}
            href="/"
          >
            <Box
              sx={(theme) => ({
                height: '1.6rem',
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                ...theme.applyStyles('dark', {
                  color: theme.palette.grey[300],
                }),
              })}
            >
              <Box
                sx={(theme) => ({
                  height: '2rem',
                  marginRight: '4px',
                  bgcolor: 'primary.main',
                  color: 'primary.main',
                  borderRadius: '50%',
                  padding: '3px',
                  paddingLeft: '2px',
                  paddingRight: '4px',
                  ...theme.applyStyles('dark', {
                    bgcolor: 'primary.dark',
                    color: 'primary.dark',
                  }),
                })}
              >
                <Icon style={{ verticalAlign: 'super' }} />
              </Box>
              <Logo />
            </Box>
          </Typography>
          <LanguageSelector />
          <ThemeSelector />
        </Toolbar>
      </AppBar>
    </div>
  );
}
