'use client';

import { useCallback, useEffect, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { orderBy } from 'lodash';
import { ClockStart, ClockEnd } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

import FavoriteStation from '../components/FavoriteStation';
import MapLayout, { VehicleMapContainerPortal } from '../components/MapLayout';
import PassengerInformationMessageAlert from '../components/PassengerInformationMessageAlert';
import PassengerInformationMessagesDialog from '../components/PassengerInformationMessagesDialog';
import StationTimeTable from '../components/StationTimeTable';
import SubNavBar from '../components/SubNavBar';
import { gqlClients, vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  useTrainsByStationQuery,
} from '../graphql/generated/digitraffic';
import { useRouteLazyQuery } from '../graphql/generated/digitransit';
import usePassengerInformationMessages from '../hooks/usePassengerInformationMessages';
import useTrainLiveTracking from '../hooks/useTrainLiveTracking';
import { isDefined } from '../utils/common';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import { trainStations } from '../utils/stations';
import { getTimeTableRowRealTime, getTrainRouteGtfsId } from '../utils/train';

import { NextPageWithLayout } from './_app';

const Station: NextPageWithLayout = () => {
  const router = useRouter();
  const stationName = router.query.station as string | undefined;
  const [timeTableType, setTimeTableType] = useState(
    TimeTableRowType.Departure
  );
  const { t } = useTranslation();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [selectedTrainNo, setSelectedTrainNo] = useState<number | null>(null);
  const [stationAlertDialogOpen, setStationAlertDialogOpen] = useState(false);
  const [executeRouteSearch, { data: routeData }] = useRouteLazyQuery();
  const station = stationName
    ? trainStations.find(
        (s) => s.stationName.toUpperCase() === stationName.toUpperCase()
      )
    : undefined;
  const stationCode = station?.stationShortCode;
  const { loading, error, data } = useTrainsByStationQuery({
    variables: stationCode
      ? {
          station: stationCode,
          departingTrains: 100,
          departedTrains: 0,
          arrivingTrains: 100,
          arrivedTrains: 0,
        }
      : undefined,
    skip: stationCode == null,
    context: { clientName: gqlClients.digitraffic },
    pollInterval: 10000,
    fetchPolicy: 'no-cache',
  });
  useTrainLiveTracking(data?.trainsByStationAndQuantity?.filter(isDefined));
  const { messages: passengerInformationMessages } =
    usePassengerInformationMessages({
      skip: stationCode == null,
      refetchIntervalMs: 20000,
      onlyGeneral: true,
      stationCode: stationCode,
    });

  const handleVehicleIdSelected = useCallback((vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    const trainNumber = vehiclesVar()[vehicleId].jrn;
    setSelectedTrainNo(trainNumber);
  }, []);

  const handleTimeTableRowClick = useCallback(
    (trainNumber: number, departureDate: string) => {
      router.push(
        `/train/${trainNumber}/${departureDate}?station=${stationCode}`
      );
    },
    [router, stationCode]
  );

  const selectedTrain = selectedTrainNo
    ? data?.trainsByStationAndQuantity?.find(
        (t) => t?.trainNumber === selectedTrainNo
      )
    : null;
  const selectedRoute = routeData?.route;

  useEffect(() => {
    if (selectedTrain) {
      executeRouteSearch({
        variables: {
          id: getTrainRouteGtfsId(selectedTrain),
        },
      });
    }
  }, [selectedTrain, executeRouteSearch]);

  const getLoadingSkeleton = () => {
    return (
      <Box sx={{ padding: '1rem' }}>
        {Array.from(Array(7).keys()).map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width="100%"
            height={50}
            sx={{ marginTop: '1rem' }}
          />
        ))}
      </Box>
    );
  };

  const trains =
    stationCode && data?.trainsByStationAndQuantity
      ? orderBy(
          data.trainsByStationAndQuantity.filter(isDefined),
          (t) =>
            getTimeTableRowForStation(stationCode, t, timeTableType)
              ?.scheduledTime
        ).filter((t) => {
          const row = getTimeTableRowForStation(stationCode, t, timeTableType);
          if (!row) return false;
          return getTimeTableRowRealTime(row) >= new Date();
        })
      : [];

  const handleTimeTableTypeChange = (
    _event: unknown,
    timeTableType: TimeTableRowType | null
  ) => {
    if (timeTableType) {
      setTimeTableType(timeTableType);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <SubNavBar>
        <h4>{station?.stationName}</h4>
        {station && (
          <FavoriteStation stationShortCode={station.stationShortCode} />
        )}
      </SubNavBar>
      <Box sx={{ height: '30vh' }}>
        <VehicleMapContainerPortal
          selectedVehicleId={selectedVehicleId}
          station={station}
          route={selectedRoute}
          train={selectedTrain}
          onVehicleSelected={handleVehicleIdSelected}
        />
      </Box>
      <Box
        sx={{
          padding: '0.5rem',
          bgcolor: 'common.secondaryBackground.default',
        }}
      >
        <ToggleButtonGroup
          color="primary"
          value={timeTableType}
          exclusive
          fullWidth
          onChange={handleTimeTableTypeChange}
          sx={{
            borderRadius: '24px',
            button: {
              borderRadius: '24px',
            },
          }}
        >
          <ToggleButton value={TimeTableRowType.Departure}>
            {t('departures')} <ClockStart />
          </ToggleButton>
          <ToggleButton value={TimeTableRowType.Arrival}>
            <ClockEnd /> {t('arrivals')}
          </ToggleButton>
        </ToggleButtonGroup>
        <Box paddingY={1}>
          {passengerInformationMessages && (
            <PassengerInformationMessageAlert
              onClick={() => setStationAlertDialogOpen(true)}
              passengerInformationMessages={passengerInformationMessages}
            />
          )}
        </Box>
      </Box>
      {stationCode && !loading && data?.trainsByStationAndQuantity && (
        <StationTimeTable
          stationCode={stationCode}
          timeTableType={timeTableType}
          trains={trains}
          tableRowOnClick={handleTimeTableRowClick}
        />
      )}
      {(!stationCode || loading) && getLoadingSkeleton()}
      {error && (
        <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
      )}
      <PassengerInformationMessagesDialog
        open={stationAlertDialogOpen}
        passengerInformationMessages={passengerInformationMessages}
        onClose={() => setStationAlertDialogOpen(false)}
      />
    </div>
  );
};

Station.getLayout = function getLayout(page) {
  return <MapLayout>{page}</MapLayout>;
};

export default Station;
