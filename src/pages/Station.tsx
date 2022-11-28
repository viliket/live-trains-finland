import { useCallback, useEffect, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { format } from 'date-fns';
import { orderBy } from 'lodash';
import { ClockStart, ClockEnd } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import FavoriteStation from '../components/FavoriteStation';
import StationTimeTable from '../components/StationTimeTable';
import SubNavBar from '../components/SubNavBar';
import VehicleMapContainer from '../components/VehicleMapContainer';
import { gqlClients, vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  useTrainsByStationQuery,
} from '../graphql/generated/digitraffic';
import { useRoutesForRailLazyQuery } from '../graphql/generated/digitransit';
import useTrainLiveTracking from '../hooks/useTrainLiveTracking';
import { isDefined } from '../utils/common';
import getRouteForTrain from '../utils/getRouteForTrain';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import { trainStations } from '../utils/stations';
import { getTimeTableRowRealTime } from '../utils/train';
import NotFound from './NotFound';

const Station = () => {
  const { station: stationName } = useParams<{ station: string }>();
  const [timeTableType, setTimeTableType] = useState(
    TimeTableRowType.Departure
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );
  const [selectedTrainNo, setSelectedTrainNo] = useState<number | null>(null);
  const [executeRouteSearch, { data: routeData }] = useRoutesForRailLazyQuery();
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

  const handleVehicleIdSelected = useCallback((vehicleId: number) => {
    setSelectedVehicleId(vehicleId);
    const trainNumber = vehiclesVar()[vehicleId].jrn;
    setSelectedTrainNo(trainNumber);
  }, []);

  const handleTimeTableRowClick = useCallback(
    (trainNumber: number, scheduledTime: Date) => {
      navigate(
        `/train/${trainNumber}/${format(
          scheduledTime,
          'yyyy-MM-dd'
        )}?station=${stationCode}`
      );
    },
    [navigate, stationCode]
  );

  const selectedTrain = selectedTrainNo
    ? data?.trainsByStationAndQuantity?.find(
        (t) => t?.trainNumber === selectedTrainNo
      )
    : null;
  const selectedRoute = getRouteForTrain(selectedTrain, routeData);

  useEffect(() => {
    if (selectedTrain) {
      executeRouteSearch({
        variables: {
          name:
            selectedTrain.commuterLineid ||
            selectedTrain.trainNumber.toString(),
        },
      });
    }
  }, [selectedTrain, executeRouteSearch]);

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

  if (!stationCode) {
    return <NotFound />;
  }

  const trains = data?.trainsByStationAndQuantity
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
        <VehicleMapContainer
          selectedVehicleId={selectedVehicleId}
          station={station}
          route={selectedRoute}
          routeStationCodes={
            selectedTrain?.timeTableRows
              ? Array.from(
                  new Set(
                    selectedTrain.timeTableRows
                      .filter((r) => r?.station && r.station.shortCode)
                      .map((r) => r?.station.shortCode as string)
                  )
                )
              : undefined
          }
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
      </Box>
      {!loading && data?.trainsByStationAndQuantity && (
        <StationTimeTable
          stationCode={stationCode}
          timeTableType={timeTableType}
          trains={trains}
          tableRowOnClick={handleTimeTableRowClick}
        />
      )}
      {loading && getLoadingSkeleton()}
      {error && (
        <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
      )}
    </div>
  );
};

export default Station;
