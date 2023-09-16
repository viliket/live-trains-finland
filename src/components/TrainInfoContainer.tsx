import { useState } from 'react';

import { Box, Skeleton } from '@mui/material';

import { gqlClients } from '../graphql/client';
import {
  TrainDetailsFragment,
  useTrainQuery,
  Wagon,
} from '../graphql/generated/digitraffic';
import { formatEET } from '../utils/date';
import { getTrainScheduledDepartureTime } from '../utils/train';

import TrainComposition from './TrainComposition';
import TrainStationTimeline from './TrainStationTimeline';
import TrainWagonDetailsDialog from './TrainWagonDetailsDialog';

type TrainInfoContainerProps = {
  train?: TrainDetailsFragment | null;
};

function TrainInfoContainer({ train }: TrainInfoContainerProps) {
  const [wagonDialogOpen, setWagonDialogOpen] = useState(false);
  const [selectedWagon, setSelectedWagon] = useState<Wagon | null>(null);
  const departureDate = train ? getTrainScheduledDepartureTime(train) : null;
  const { error, data: realTimeData } = useTrainQuery(
    train && departureDate
      ? {
          variables: {
            trainNumber: train.trainNumber,
            departureDate: formatEET(departureDate, 'yyyy-MM-dd'),
          },
          context: { clientName: gqlClients.digitraffic },
          pollInterval: 10000,
          fetchPolicy: 'network-only',
          notifyOnNetworkStatusChange: true,
        }
      : { skip: true }
  );

  const realTimeTrain = realTimeData?.train?.[0];

  const handleWagonDialogClose = () => {
    setWagonDialogOpen(false);
  };

  const handleWagonClick = (w: Wagon) => {
    setSelectedWagon(w);
    setWagonDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          paddingTop: 2,
          paddingX: 1,
          backgroundColor: theme.palette.common.secondaryBackground.default,
          borderTop: `solid 1px ${theme.palette.divider}`,
        })}
      >
        {error && (
          <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
        )}
        {realTimeTrain && (
          <TrainComposition
            train={realTimeTrain}
            onWagonClick={handleWagonClick}
          />
        )}
        {!realTimeTrain && !error && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton
              variant="rectangular"
              sx={{
                aspectRatio: 5.5,
                width: '100%',
                height: 'auto',
                maxWidth: 260,
              }}
            />
          </Box>
        )}
      </Box>
      <TrainStationTimeline
        train={train}
        realTimeTrain={realTimeTrain}
        onWagonClick={handleWagonClick}
      />
      {train && (
        <TrainWagonDetailsDialog
          train={train}
          selectedWagon={selectedWagon}
          open={wagonDialogOpen}
          onClose={handleWagonDialogClose}
        />
      )}
    </>
  );
}

export default TrainInfoContainer;
