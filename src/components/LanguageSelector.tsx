import { useState } from 'react';

import { Menu, MenuItem, Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

const lngs: Record<string, { shortCode: string }> = {
  en: { shortCode: 'EN' },
  fi: { shortCode: 'FI' },
};

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);

  const handleOpenMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelectLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="switch-language-button"
        aria-controls={isOpen ? 'language-menu' : undefined}
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
          {i18n.resolvedLanguage}
        </Box>
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'switch-language-button',
        }}
      >
        {Object.keys(lngs).map((lng) => (
          <MenuItem key={lng} onClick={() => handleSelectLanguage(lng)}>
            {lngs[lng].shortCode}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
