import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';

import TrainWagon from '../components/TrainWagon';
import { useTime } from '../hooks/useTime';

const NotFound = () => {
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
            transform: 'rotate(180deg)',
          }}
        >
          <TrainWagon doorsOpen={currentTime.getSeconds() % 4 === 0} />
        </Box>
      </Box>
      <Box>
        <h1>{t('page_not_found')}</h1>
      </Box>
    </Container>
  );
};

export default NotFound;
