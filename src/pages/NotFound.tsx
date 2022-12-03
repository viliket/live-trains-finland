import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Hero from '../components/Hero';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          background: theme.palette.common.secondaryBackground.default,
        })}
      >
        <Box
          sx={{
            width: '100%',
            marginTop: '1rem',
          }}
        >
          <Hero />
        </Box>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          textAlign: 'center',
        }}
      >
        <Box>
          <h1>{t('page_not_found')}</h1>
        </Box>
      </Container>
    </>
  );
};

export default NotFound;
