import { Avatar, Box, Typography } from '@mui/material';

import { TrainDetailsFragment } from '../graphql/generated/digitraffic';
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
            <Avatar sx={{ mr: 1 }}> </Avatar>
            {'...'}
          </>
        ) : (
          <>
            <Avatar sx={{ mr: 1, color: 'white', bgcolor: 'secondary.main' }}>
              {train.commuterLineid || train.trainType?.name}
            </Avatar>
            <Box>
              <Typography
                variant="caption"
                display="block"
                sx={{ fontSize: '1rem', fontWeight: 500 }}
              >
                {train &&
                  `${getTrainDepartureStationName(
                    train
                  )} - ${getTrainDestinationStationName(train)}`}
              </Typography>
              <Typography variant="caption" display="block">
                {train?.trainType?.trainCategory?.name === 'Commuter'
                  ? `${train.trainNumber}`
                  : `${train.trainType?.name} ${train.trainNumber}`}
              </Typography>
            </Box>
          </>
        )}
      </h4>
    </SubNavBar>
  );
}

export default TrainSubNavBar;
