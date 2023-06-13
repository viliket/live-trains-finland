import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FavoriteStationList from '../components/FavoriteStationList';
import Hero from '../components/Hero';
import StationSearch from '../components/StationSearch';

const Home = () => {
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
          <h2>{t('home.title')}</h2>
          <p>{t('home.welcome_text')}</p>
        </Box>
        <Box>
          <StationSearch />
          <FavoriteStationList />
        </Box>
      </Container>
    </>
  );
};

export default Home;
