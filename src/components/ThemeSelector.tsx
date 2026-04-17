import React, { useEffect, useState } from 'react';

import { Menu, MenuItem, Box, IconButton, Skeleton } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { Brightness7, Brightness3, BrightnessAuto } from 'mdi-material-ui';

import { useResolvedPalette } from '../hooks/useResolvedPalette';

const themeOptions: Record<string, { icon: React.ReactElement }> = {
  system: { icon: <BrightnessAuto /> },
  light: { icon: <Brightness7 /> },
  dark: { icon: <Brightness3 /> },
};

export function ThemeSelector() {
  const { mode, setMode } = useColorScheme();
  const { palette } = useResolvedPalette();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  useEffect(() => {
    const color = palette.common.secondaryBackground.default;
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute('content', color);
    });
  }, [palette]);

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
    return (
      <Skeleton
        variant="circular"
        width="1.5rem"
        height="1.5rem"
        sx={{ margin: 1 }}
      />
    );
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
        slotProps={{
          list: {
            'aria-labelledby': 'switch-theme-button',
          },
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
