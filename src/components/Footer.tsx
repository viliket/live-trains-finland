import { Box, Link, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

function Footer() {
  useTranslation();

  return (
    <Box
      sx={{
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'divider',
        padding: '1rem',
        marginTop: '2rem',
      }}
    >
      <Typography variant="body2" gutterBottom>
        <Link
          href="https://github.com/viliket/live-trains-finland"
          underline="none"
          color="inherit"
        >
          © Copyright Junaan.fi 2022
        </Link>
        ,{' '}
        <Link href="https://www.gnu.org/licenses/gpl-3.0.html" color="inherit">
          GPL-3.0
        </Link>
      </Typography>
      <Typography variant="body2" gutterBottom>
        <Trans i18nKey="license_text">
          Traffic data source&nbsp;
          <Link href="https://tmfg.fi/" color="inherit">
            Fintraffic
          </Link>
          &nbsp;/&nbsp;
          <Link href="https://www.digitraffic.fi/" color="inherit">
            Digitraffic
          </Link>
          &nbsp;and&nbsp;
          <Link href="https://hsl.fi/" color="inherit">
            Helsinki regional traffic
          </Link>
          &nbsp;/&nbsp;
          <Link href="https://digitransit.fi/" color="inherit">
            Digitransit
          </Link>
          ,&nbsp;
          <Link
            href="https://creativecommons.org/licenses/by/4.0/"
            color="inherit"
          >
            CC BY 4.0
          </Link>
        </Trans>
      </Typography>
    </Box>
  );
}

export default Footer;
