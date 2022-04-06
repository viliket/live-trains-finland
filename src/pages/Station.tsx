import { useEffect, useState } from 'react';

import { Box, Skeleton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { format } from 'date-fns';
import { orderBy } from 'lodash';
import { ClockStart, ClockEnd } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import StationTimeTable from '../components/StationTimeTable';
import SubNavBar from '../components/SubNavBar';
import VehicleMapContainer from '../components/VehicleMapContainer';
import { gqlClients, vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  useTrainsByStationLazyQuery,
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
  const [getTrainsByStation, { loading, error, data, called }] =
    useTrainsByStationLazyQuery();
  const [executeRouteSearch, { data: routeData }] = useRoutesForRailLazyQuery();
  useTrainLiveTracking(data?.trainsByStationAndQuantity?.filter(isDefined));

  const station = stationName
    ? trainStations.find(
        (s) => s.stationName.toUpperCase() === stationName.toUpperCase()
      )
    : undefined;
  const stationCode = station?.stationShortCode;

  useEffect(() => {
    if (stationCode) {
      getTrainsByStation({
        variables: {
          station: stationCode,
          departingTrains: 100,
          departedTrains: 0,
          arrivingTrains: 100,
          arrivedTrains: 0,
        },
        context: { clientName: gqlClients.digitraffic },
      });
    }
  }, [stationCode, timeTableType, getTrainsByStation]);

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
            selectedTrain.commuterLineid ??
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
          onVehicleSelected={(id) => {
            setSelectedVehicleId(id);
            const trainNumber = vehiclesVar()[id].jrn;
            setSelectedTrainNo(trainNumber);
          }}
        />
      </Box>
      <ToggleButtonGroup
        color="secondary"
        value={timeTableType}
        exclusive
        fullWidth
        onChange={handleTimeTableTypeChange}
      >
        <ToggleButton value={TimeTableRowType.Departure}>
          {t('departures')} <ClockStart />
        </ToggleButton>
        <ToggleButton value={TimeTableRowType.Arrival}>
          {t('arrivals')} <ClockEnd />
        </ToggleButton>
      </ToggleButtonGroup>
      {called && !loading && data?.trainsByStationAndQuantity && (
        <StationTimeTable
          stationCode={stationCode}
          timeTableType={timeTableType}
          trains={trains}
          tableRowOnClick={(trainNumber, scheduledTime) => {
            navigate(
              `/train/${trainNumber}/${format(
                scheduledTime,
                'yyyy-MM-dd'
              )}?station=${stationCode}`
            );
          }}
        />
      )}
      {called && loading && getLoadingSkeleton()}
      {error && (
        <Box sx={{ width: '100%', textAlign: 'center' }}>{error.message}</Box>
      )}
    </div>
  );
};

export default Station;
