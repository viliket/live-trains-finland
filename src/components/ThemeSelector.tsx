import React, { useEffect, useState } from 'react';

import { Menu, MenuItem, Box, IconButton } from '@mui/material';
import { Theme, useColorScheme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { Brightness7, Brightness3, BrightnessAuto } from 'mdi-material-ui';

const themeOptions: Record<string, { icon: React.ReactElement }> = {
  system: { icon: <BrightnessAuto /> },
  light: { icon: <Brightness7 /> },
  dark: { icon: <Brightness3 /> },
};

const updateMetaThemeColor = (theme: Theme): void => {
  const themeColorElements = document.querySelectorAll(
    'meta[name="theme-color"]'
  );
  themeColorElements.forEach((meta) => {
    meta.setAttribute(
      'content',
      theme.palette.common.secondaryBackground.default
    );
  });
};

export function ThemeSelector() {
  const { mode, setMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const theme = useTheme();

  useEffect(() => {
    updateMetaThemeColor(theme);
  }, [theme]);

  const handleOpenMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = (mode: 'light' | 'dark' | 'system') => {
    setMode(mode);
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!mode) {
    return null;
  }

  return (
    <div>
      <IconButton
        id="switch-theme-button"
        aria-controls={isOpen ? 'theme-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={isOpen ? 'true' : undefined}
        onClick={handleOpenMenuClick}
        color={'primary'}
      >
        <Box
          sx={{
            width: '1.5rem',
            height: '1.5rem',
            lineHeight: '1.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}
        >
          {themeOptions[mode].icon}
        </Box>
      </IconButton>
      <Menu
        id="theme-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'switch-theme-button',
        }}
      >
        {Object.entries(themeOptions).map(([mode, opts]) => (
          <MenuItem
            key={mode}
            onClick={() => handleChange(mode as 'light' | 'dark' | 'system')}
          >
            {opts.icon}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
