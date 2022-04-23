import { useState } from 'react';

import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { parseISO } from 'date-fns';
import { MapMarkerOff, MapMarkerCheck } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import useInterval from '../hooks/useInterval';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import { getTrainDestinationStationName } from '../utils/train';
import TimeTableRowTime from './TimeTableRowTime';

type StationTimeTableProps = {
  stationCode: string;
  timeTableType: TimeTableRowType;
  trains: TrainByStationFragment[];
  tableRowOnClick: (trainNumber: number, scheduledTime: Date) => void;
};

function StationTimeTable({
  stationCode,
  timeTableType,
  trains,
  tableRowOnClick,
}: StationTimeTableProps) {
  const { t } = useTranslation();
  const [trackedTrains, setTrackedTrains] = useState<Record<number, number>>(
    {}
  );

  useInterval(() => {
    const vehicles = Object.values(vehiclesVar());
    setTrackedTrains(
      vehicles.reduce(
        (s: Record<number, number>, v) => ({ ...s, [v.jrn ?? v.veh]: v.veh }),
        {}
      )
    );
  }, 1000);

  const findVehicleForTrain = (train: TrainByStationFragment) => {
    // TODO: Should also compare scheduled time as the train may appear multiple times in time table
    return trackedTrains[train.trainNumber];
  };

  const handleStationClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <TableContainer sx={{ overflow: 'initial' }}>
      <Table
        size="medium"
        aria-label={
          timeTableType === TimeTableRowType.Departure
            ? t('departure')
            : t('arrival')
        }
        stickyHeader
        sx={{
          'thead tr th': {
            top: '3.5rem',
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>{t('train')}</TableCell>
            <TableCell>{t('destination')}</TableCell>
            <TableCell align="center">
              {timeTableType === TimeTableRowType.Departure
                ? t('departure')
                : t('arrival')}
            </TableCell>
            <TableCell align="right">{t('track')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trains.map((trn) => {
            const vehicleForTrain = findVehicleForTrain(trn);
            const destinationStationName = getTrainDestinationStationName(trn);
            const stationRow = getTimeTableRowForStation(
              stationCode,
              trn,
              timeTableType
            );

            return (
              <TableRow
                key={`${trn.trainNumber}-${stationRow?.scheduledTime}`}
                hover
                onClick={() => {
                  if (stationRow) {
                    tableRowOnClick(
                      trn.trainNumber,
                      parseISO(stationRow.scheduledTime)
                    );
                  }
                }}
              >
                <TableCell component="th" scope="row">
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {!vehicleForTrain && (
                      <MapMarkerOff sx={{ color: 'grey.700' }} />
                    )}
                    {vehicleForTrain && (
                      <MapMarkerCheck sx={{ color: 'success.main' }} />
                    )}
                    {trn.commuterLineid
                      ? trn.commuterLineid
                      : trn.trainType.name + trn.trainNumber}{' '}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/${destinationStationName}`}
                    color="inherit"
                    underline="none"
                    onClick={handleStationClick}
                  >
                    {destinationStationName}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {stationRow ? <TimeTableRowTime row={stationRow} /> : '?'}
                </TableCell>
                <TableCell align="right">
                  {stationRow?.commercialTrack ?? '?'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StationTimeTable;
