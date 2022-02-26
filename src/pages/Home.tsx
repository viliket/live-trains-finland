import { Box, Container, keyframes } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
      <Box
        sx={{
          width: '60%',
          alignSelf: 'center',
          marginTop: '2rem',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'divider',
        }}
      >
        <Box
          sx={{
            animation: `${move} 8s infinite ease-in-out`,
          }}
        >
          <TrainWagon doorsOpen={currentTime.getSeconds() % 4 === 0} />
        </Box>
      </Box>
      <Box>
        <h1>{t('home.title')}</h1>
        <p>{t('home.welcome_text')}</p>
      </Box>
      <Box>
        <StationAutocomplete />
      </Box>
    </Container>
  );
};

export default Home;
