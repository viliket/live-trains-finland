import { useState } from 'react';

import {
  alpha,
  Box,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { SignalVariant, ChevronRight } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { vehiclesVar } from '../graphql/client';
import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import useInterval from '../hooks/useInterval';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import {
  getTrainDestinationStationName,
  getTrainScheduledDepartureTime,
} from '../utils/train';
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
        sx={(theme) => ({
          'thead tr th': {
            top: '3.5rem',
            zIndex: 1002,
          },
          'tr td, tr th': {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        })}
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
            const departureTime = getTrainScheduledDepartureTime(trn);
            const stationRow = getTimeTableRowForStation(
              stationCode,
              trn,
              timeTableType
            );

            return (
              <TableRow
                key={`${trn.trainNumber}-${stationRow?.scheduledTime}`}
                hover
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() => {
                  if (departureTime) {
                    tableRowOnClick(trn.trainNumber, departureTime);
                  }
                }}
              >
                <TableCell scope="row">
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      component="span"
                      sx={(theme) => ({
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '1em',
                        textAlign: 'center',
                        backgroundColor: alpha(
                          theme.palette.primary.main,
                          theme.palette.action.selectedOpacity
                        ),
                        minWidth: '1.8em',
                        height: '1.8em',
                        padding: '0.5em',
                        lineHeight: 'normal',
                      })}
                    >
                      {trn.commuterLineid
                        ? trn.commuterLineid
                        : trn.trainType.name + trn.trainNumber}
                      {vehicleForTrain && (
                        <SignalVariant
                          sx={{
                            color: 'success.main',
                            position: 'absolute',
                            width: '0.5em',
                            height: '0.5em',
                            top: '-0.25em',
                            right: '-0.5em',
                          }}
                        />
                      )}
                    </Box>
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    component={RouterLink}
                    to={`/${destinationStationName}`}
                    color="inherit"
                    onClick={handleStationClick}
                  >
                    {destinationStationName}
                  </Link>
                </TableCell>
                <TableCell align="center">
                  {stationRow ? <TimeTableRowTime row={stationRow} /> : '?'}
                </TableCell>
                <TableCell align="right">
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      lineHeight: 'normal',
                    }}
                  >
                    {stationRow?.commercialTrack ?? '?'}
                    <ChevronRight
                      sx={{ color: 'grey.400', marginRight: '-8px' }}
                    />
                  </span>
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
