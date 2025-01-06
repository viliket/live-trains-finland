import { Avatar, Box } from '@mui/material';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic/graphql';
import { useTrainSpeed } from '../hooks/useTrainSpeed';
import {
  getTrainDepartureStationName,
  getTrainDestinationStationName,
} from '../utils/train';

import SubNavBar from './SubNavBar';

type TrainSubNavBarProps = {
  train?: TrainDetailsFragment | null;
};

function TrainSubNavBar({ train }: TrainSubNavBarProps) {
  const trainSpeed = useTrainSpeed(train);

  return (
    <SubNavBar
      rightElement={trainSpeed != null && <>{train && trainSpeed}km/h</>}
    >
      <h4 style={{ display: 'flex', alignItems: 'center' }}>
        {!train ? (
          <>
            <Avatar sx={{ mr: 1, bgcolor: 'divider' }}> </Avatar>
            {'...'}
          </>
        ) : (
          <>
            {train.commuterLineid && (
              <Box
                sx={{
                  mr: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Avatar
                  sx={{
                    color: 'white',
                    bgcolor: 'secondary.main',
                    width: '32px',
                    height: '32px',
                    mt: '-8px',
                  }}
                >
                  {train.commuterLineid || train.trainType?.name}
                </Avatar>
                <Box
                  sx={{
                    fontSize: '0.6rem',
                    color: 'text.secondary',
                    position: 'absolute',
                    bottom: '-14px',
                  }}
                >
                  {train.trainNumber}
                </Box>
              </Box>
            )}
            {!train.commuterLineid && (
              <Avatar
                sx={{
                  mr: 1,
                  color: 'text.primary',
                  bgcolor: 'divider',
                  fontSize: '0.7rem',
                  textAlign: 'center',
                }}
              >
                {train.trainType?.name}
                <br />
                {train.trainNumber}
              </Avatar>
            )}
            <Box
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ fontWeight: 500 }}>
                {train &&
                  `${getTrainDepartureStationName(
                    train
                  )} - ${getTrainDestinationStationName(train)}`}
              </Box>
            </Box>
          </>
        )}
      </h4>
    </SubNavBar>
  );
}

export default TrainSubNavBar;
