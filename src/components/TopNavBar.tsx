import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Brightness7, Brightness3 } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ReactComponent as Icon } from '../icon.svg';
import { ReactComponent as Logo } from '../logo.svg';

const lngs: Record<string, { shortCode: string }> = {
  en: { shortCode: 'EN' },
  fi: { shortCode: 'FI' },
};

type TopNavBarProps = {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
};

export function TopNavBar({ toggleDarkMode, isDarkMode }: TopNavBarProps) {
  const { i18n } = useTranslation();

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
            to="/"
          >
            <Box
              sx={(theme) => ({
                height: '1.6rem',
                display: 'flex',
                color:
                  theme.palette.mode === 'light'
                    ? 'primary.main'
                    : theme.palette.grey[300],
              })}
            >
              <Icon style={{ marginRight: '4px' }} />
              <Logo />
            </Box>
          </Typography>
          {Object.keys(lngs).map((lng) => (
            <Button
              key={lng}
              size="small"
              color={i18n.resolvedLanguage === lng ? 'primary' : 'inherit'}
              variant="contained"
              disableElevation
              aria-label={lngs[lng].shortCode}
              sx={(theme) => ({
                mr: 1,
                minWidth: 'auto',
                fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal',
                borderColor: 'divider',
                color:
                  i18n.resolvedLanguage === lng
                    ? 'white'
                    : theme.palette.primary.main,
                backgroundColor:
                  i18n.resolvedLanguage === lng ? 'primary' : 'divider',
              })}
              type="submit"
              onClick={() => i18n.changeLanguage(lng)}
            >
              {lngs[lng].shortCode}
            </Button>
          ))}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="mode"
            onClick={() => toggleDarkMode()}
          >
            {icon}
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
