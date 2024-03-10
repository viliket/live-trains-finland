import { useState } from 'react';

import { Box, Skeleton } from '@mui/material';

import { Wagon } from '../graphql/generated/digitraffic/graphql';
import usePassengerInformationMessages from '../hooks/usePassengerInformationMessages';
import useTrainQuery from '../hooks/useTrainQuery';
import { TrainExtendedDetails } from '../types';
import { getPassengerInformationMessagesByStation } from '../utils/passengerInformationMessages';

import PassengerInformationMessagesDialog from './PassengerInformationMessagesDialog';
import TrainComposition from './TrainComposition';
import TrainStationTimeline from './TrainStationTimeline';
import TrainWagonDetailsDialog from './TrainWagonDetailsDialog';

type TrainInfoContainerProps = {
  train?: TrainExtendedDetails | null;
};

function TrainInfoContainer({ train }: TrainInfoContainerProps) {
  const [wagonDialogOpen, setWagonDialogOpen] = useState(false);
  const [selectedWagon, setSelectedWagon] = useState<Wagon | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [stationAlertDialogOpen, setStationAlertDialogOpen] = useState(false);
  const { error, data: realTimeTrain } = useTrainQuery(
    train?.trainNumber,
    train?.departureDate
  );
  const { messages: passengerInformationMessages } =
    usePassengerInformationMessages({
      skip: !train,
      refetchIntervalMs: 20000,
      trainNumber: train?.trainNumber,
      trainDepartureDate: train?.departureDate,
    });
  const stationMessages = getPassengerInformationMessagesByStation(
    passengerInformationMessages
  );

  const handleWagonDialogClose = () => {
    setWagonDialogOpen(false);
  };

  const handleWagonClick = (w: Wagon) => {
    setSelectedWagon(w);
    setWagonDialogOpen(true);
  };

  const handleStationAlertDialogClose = () => {
    setStationAlertDialogOpen(false);
  };

  const handleStationAlertClick = (stationCode: string) => {
    setSelectedStation(stationCode);
    setStationAlertDialogOpen(true);
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          textAlign: 'center',
          paddingTop: 2,
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
        onStationAlertClick={handleStationAlertClick}
        stationMessages={stationMessages}
      />
      {train && (
        <TrainWagonDetailsDialog
          train={train}
          selectedWagon={selectedWagon}
          open={wagonDialogOpen}
          onClose={handleWagonDialogClose}
        />
      )}
      <PassengerInformationMessagesDialog
        open={stationAlertDialogOpen}
        passengerInformationMessages={
          selectedStation && stationMessages?.[selectedStation]
            ? stationMessages[selectedStation]
            : null
        }
        onClose={handleStationAlertDialogClose}
      />
    </>
  );
}

export default TrainInfoContainer;
