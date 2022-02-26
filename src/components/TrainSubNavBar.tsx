import { Chip } from '@mui/material';

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
          <>{'...'}</>
        ) : (
          <>
            <Chip
              label={
                train?.trainType?.trainCategory?.name === 'Commuter'
                  ? `${train.commuterLineid} ${train.trainNumber}`
                  : `${train.trainType?.name} ${train.trainNumber}`
              }
              variant="filled"
            />
            <span style={{ verticalAlign: 'middle', marginLeft: '1ch' }}>
              {train &&
                `${getTrainDepartureStationName(
                  train
                )} - ${getTrainDestinationStationName(train)}`}
            </span>
          </>
        )}
      </h4>
    </SubNavBar>
  );
}

export default TrainSubNavBar;
