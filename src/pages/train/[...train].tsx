'use client';

import { useCallback, useEffect, useState } from 'react';

import { Box, Snackbar } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import MapLayout, {
  VehicleMapContainerPortal,
} from '../../components/MapLayout';
import TrainInfoContainer from '../../components/TrainInfoContainer';
import TrainSubNavBar from '../../components/TrainSubNavBar';
import useTrainLiveTracking from '../../hooks/useTrainLiveTracking';
import useTrainQuery from '../../hooks/useTrainQuery';
import { useTripQuery } from '../../hooks/useTripQuery';
import useVehicleStore from '../../hooks/useVehicleStore';
import getHeadTrainVehicleId from '../../utils/getHeadTrainVehicleId';
import { trainStations } from '../../utils/stations';
import { getTrainRouteGtfsId } from '../../utils/train';
import NotFound from '../404';
import { NextPageWithLayout } from '../_app';

const Train: NextPageWithLayout = () => {
  const router = useRouter();
  const trainParams = router.query.train as string[] | undefined;
  const [trainNumberParam, departureDate] = trainParams ?? [null, null];
  const trainNumber = trainNumberParam
    ? Number.parseInt(trainNumberParam, 10)
    : null;
  const searchParams = useSearchParams();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const removeAllExceptVehicleWithTrainNumber = useVehicleStore(
    (state) => state.removeAllExceptVehicleWithTrainNumber
  );

  const {
    isLoading,
    error,
    data: train,
  } = useTrainQuery(trainNumber, departureDate);
  const { data: tripData } = useTripQuery(
    train
      ? {
          departureDate: train.departureDate,
          routeId: getTrainRouteGtfsId(train),
          departureTime: train.timeTableRows?.[0]?.scheduledTime,
        }
      : {}
  );

  useEffect(() => {
    // Stop tracking any already tracked vehicles except current train
    if (trainNumber) {
      removeAllExceptVehicleWithTrainNumber(trainNumber);
    }
  }, [trainNumber, removeAllExceptVehicleWithTrainNumber]);

  useTrainLiveTracking(train ? [train] : []);

  const stationCode = searchParams.get('station');
  const station = trainStations.find((s) => s.stationShortCode === stationCode);
  const selectedTrip = tripData?.fuzzyTrip;

  const handleVehicleIdSelected = useCallback(
    (vehicleId: number) => setSelectedVehicleId(vehicleId),
    []
  );

  useEffect(() => {
    if (train) {
      const headTrainVehicleId = getHeadTrainVehicleId(train);
      if (headTrainVehicleId) {
        // set the first unit of the train as selected vehicle
        setSelectedVehicleId(headTrainVehicleId);
      }
    }
  }, [train]);

  if (trainNumber && departureDate && !isLoading && !train && !error) {
    return <NotFound />;
  }

  return (
    <div style={{ width: '100%' }}>
      <TrainSubNavBar train={train} />
      <Box sx={{ height: '30vh' }}>
        <VehicleMapContainerPortal
          selectedVehicleId={selectedVehicleId}
          station={station}
          trip={selectedTrip}
          train={train}
          onVehicleSelected={handleVehicleIdSelected}
        />
      </Box>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        message={error?.message}
      />
      <TrainInfoContainer train={train} />
    </div>
  );
};

Train.getLayout = function getLayout(page) {
  return <MapLayout>{page}</MapLayout>;
};

export default Train;
