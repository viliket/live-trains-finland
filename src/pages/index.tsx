'use client';

import { Box, Card, CardContent, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FavoriteStationList from '../components/FavoriteStationList';
import FindNearest from '../components/FindNearest';
import Hero from '../components/Hero';
import StationSearch from '../components/StationSearch';

export default function Home() {
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
            marginTop: '2rem',
          }}
        >
          <Hero />
        </Box>
      </Box>
      <Container
        maxWidth="md"
        sx={{
          mt: 4,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <StationSearch />
            <FindNearest />
            <FavoriteStationList />
          </Box>
          <Card
            sx={{
              mt: 4,
              borderRadius: 4,
              bgcolor: 'common.secondaryBackground.default',
            }}
            elevation={0}
          >
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {t('home.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('home.welcome_text')}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
}
