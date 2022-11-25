import { Box, Container, keyframes } from '@mui/material';
import { useTranslation } from 'react-i18next';

import FavoriteStationList from '../components/FavoriteStationList';
import StationAutocomplete from '../components/StationAutocomplete';
import TrainWagon from '../components/TrainWagon';
import { useTime } from '../hooks/useTime';

const animOffset = 100;
const move = keyframes`
  0% {
    transform: translateX(-${animOffset}px);
  }
  50% {
    transform: translateX(${animOffset}px);
  }
  100% {
    transform: translateX(-${animOffset}px);
  }
`;

const Home = () => {
  const { t } = useTranslation();
  const currentTime = useTime();

  return (
    <>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'center',
          background: theme.palette.common.secondaryBackground.default,
          boxShadow: `inset 0px -40px 0px 0px ${
            theme.palette.mode === 'light'
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark
          }`,
        })}
      >
        <Box
          sx={(theme) => ({
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginY: '1rem',
            borderBottomWidth: '5px',
            borderBottomStyle: 'double',
            borderBottomColor:
              theme.palette.mode === 'light' ? 'grey.700' : 'grey.800',
          })}
        >
          <Box
            sx={{
              maxWidth: '60%',
              marginBottom: '-0.2rem',
              animation: `${move} 8s infinite ease-in-out`,
            }}
          >
            <TrainWagon doorsOpen={currentTime.getSeconds() % 4 === 0} />
          </Box>
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
          <StationAutocomplete />
          <FavoriteStationList />
        </Box>
      </Container>
    </>
  );
};

export default Home;
