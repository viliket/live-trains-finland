import React from 'react';

import {
  alpha,
  Box,
  IconButton,
  Link,
  TableCell,
  TableRow,
} from '@mui/material';
import { Airplane, ChevronRight } from 'mdi-material-ui';
import RouterLink from 'next/link';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic/graphql';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import {
  getTrainDepartureStation,
  getTrainDestinationStation,
  getTrainDisplayName,
  getTrainStationName,
} from '../utils/train';

import TimeTableRowTime from './TimeTableRowTime';
import VehicleTrackingIcon from './VehicleTrackingIcon';

type StationTimeTableRowProps = {
  train: TrainByStationFragment;
  stationCode: string;
  timeTableType: TimeTableRowType;
  tableRowOnClick: (trainNumber: number, departureDate: string) => void;
};

function StationTimeTableRow({
  train,
  stationCode,
  timeTableType,
  tableRowOnClick,
}: StationTimeTableRowProps) {
  const handleStationClick = (e: React.MouseEvent) => e.stopPropagation();

  const trainNumber = train.trainNumber;
  const departureDate = train.departureDate;
  const trainName = getTrainDisplayName(train);
  const deptOrDestStation =
    timeTableType === TimeTableRowType.Departure
      ? getTrainDestinationStation(train, stationCode)
      : getTrainDepartureStation(train);
  const deptOrDestStationName = deptOrDestStation
    ? getTrainStationName(deptOrDestStation)
    : null;

  const stationRow = getTimeTableRowForStation(
    stationCode,
    train,
    timeTableType
  );

  return (
    <TableRow
      key={`${trainNumber}-${stationRow?.scheduledTime}`}
      hover
      sx={{
        cursor: 'pointer',
      }}
      onClick={() => tableRowOnClick(trainNumber, departureDate)}
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
            {trainName}
            <VehicleTrackingIcon
              trainNumber={trainNumber}
              departureDate={departureDate}
            />
          </Box>
        </span>
      </TableCell>
      <TableCell>
        <Link
          component={RouterLink}
          href={`/${deptOrDestStationName}`}
          underline="none"
          onClick={handleStationClick}
          sx={{
            color: 'inherit',
          }}
        >
          {deptOrDestStationName}
          {deptOrDestStation?.shortCode === 'LEN' && (
            <Airplane sx={{ position: 'absolute', fontSize: '1.3rem' }} />
          )}
        </Link>
      </TableCell>
      <TableCell align="center">
        {stationRow ? <TimeTableRowTime row={stationRow} /> : '?'}
      </TableCell>
      <TableCell align="right">
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 'normal',
          }}
        >
          {stationRow?.commercialTrack ?? '?'}
          <IconButton
            sx={{ color: 'grey.400', marginRight: '-8px', padding: 0 }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}

export default React.memo(
  StationTimeTableRow,
  (prevProps, nextProps) =>
    prevProps.train.version === nextProps.train.version &&
    (Object.keys(prevProps) as Array<keyof typeof prevProps>)
      .filter((k) => k !== 'train')
      .every((k) => prevProps[k] === nextProps[k])
);
