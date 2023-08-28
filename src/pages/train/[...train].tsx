'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import React from 'react';

import { Box, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

import TrainInfoContainer from '../../components/TrainInfoContainer';
import TrainSubNavBar from '../../components/TrainSubNavBar';
import { gqlClients, vehiclesVar } from '../../graphql/client';
import { useTrainLazyQuery } from '../../graphql/generated/digitraffic';
import { useRoutesForRailLazyQuery } from '../../graphql/generated/digitransit';
import useTrainLiveTracking from '../../hooks/useTrainLiveTracking';
import { isDefined } from '../../utils/common';
import getHeadTrainVehicleId from '../../utils/getHeadTrainVehicleId';
import getRouteForTrain from '../../utils/getRouteForTrain';
import { trainStations } from '../../utils/stations';
import NotFound from '../404';

const VehicleMapContainer = dynamic(
  () => import('../../components/map/VehicleMapContainer'),
  { ssr: false }
);

const Train = () => {
  const router = useRouter();
  const trainParams = router.query.train as string[] | undefined;
  const [trainNumber, departureDate] = trainParams ?? [null, null];
  const searchParams = useSearchParams();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [executeRouteSearch, { data: routeData }] = useRoutesForRailLazyQuery({
    fetchPolicy: 'no-cache',
  });

  const [
    getTrain,
    { loading, error, data: trainData, called: getTrainCalled },
  ] = useTrainLazyQuery();

  useEffect(() => {
    if (trainNumber != null && departureDate) {
      const trainNumberInt = parseInt(trainNumber, 10);
      getTrain({
        variables: {
          trainNumber: trainNumberInt,
          departureDate: departureDate,
        },
        context: { clientName: gqlClients.digitraffic },
      });
    }
  }, [trainNumber, departureDate, getTrain]);

  useEffect(() => {
    // Stop tracking any already tracked vehicles except current train
    const vehicles = vehiclesVar();
    Object.keys(vehicles).forEach((v) => {
      const vId = Number.parseInt(v, 10);
      if (vehicles[vId].jrn?.toString() !== trainNumber) {
        delete vehicles[vId];
      }
    });
    vehiclesVar(vehicles);
  }, [trainNumber]);

  useTrainLiveTracking(trainData?.train?.filter(isDefined));

  const train = trainData?.train?.[0];
  const stationCode = searchParams.get('station');
  const station = trainStations.find((s) => s.stationShortCode === stationCode);
  const selectedRoute = getRouteForTrain(train, routeData);

  const handleVehicleIdSelected = useCallback(
    (vehicleId: number) => setSelectedVehicleId(vehicleId),
    []
  );

  useEffect(() => {
    if (train) {
      executeRouteSearch({
        variables: {
          name: train.commuterLineid || train.trainNumber.toString(),
        },
      });
    }
  }, [train, executeRouteSearch]);

  useEffect(() => {
    if (train) {
      const headTrainVehicleId = getHeadTrainVehicleId(train);
      if (headTrainVehicleId) {
        // set the first unit of the train as selected vehicle
        setSelectedVehicleId(headTrainVehicleId);
      }
    }
  }, [train]);

  const getLoadingSkeleton = () => {
    const row = (
      <Skeleton
        variant="rectangular"
        width="100%"
        height={50}
        sx={{ marginTop: '1rem' }}
      />
    );
    return (
      <Box sx={{ padding: '1rem' }}>
        {row}
        {row}
        {row}
      </Box>
    );
  };

  if (getTrainCalled && !loading && !train) {
    return <NotFound />;
  }

  return (
    <div style={{ width: '100%' }}>
      <TrainSubNavBar train={train} />
      <Box sx={{ height: '30vh' }}>
        <VehicleMapContainer
          selectedVehicleId={selectedVehicleId}
          station={station}
          route={selectedRoute}
          train={train}
          onVehicleSelected={handleVehicleIdSelected}
        />
      </Box>
      {train && <TrainInfoContainer train={train} />}
      {loading && getLoadingSkeleton()}
      {error && (
        <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
      )}
    </div>
  );
};

export default Train;
