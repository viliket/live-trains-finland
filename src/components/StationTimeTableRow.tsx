import React from 'react';

import { alpha, Box, Link, TableCell, TableRow } from '@mui/material';
import { ChevronRight } from 'mdi-material-ui';
import { Link as RouterLink } from 'react-router-dom';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import {
  getTrainDestinationStationName,
  getTrainScheduledDepartureTime,
} from '../utils/train';
import TimeTableRowTime from './TimeTableRowTime';
import VehicleTrackingIcon from './VehicleTrackingIcon';

type StationTimeTableRowProps = {
  train: TrainByStationFragment;
  stationCode: string;
  timeTableType: TimeTableRowType;
  tableRowOnClick: (trainNumber: number, scheduledTime: Date) => void;
};

function StationTimeTableRow({
  train,
  stationCode,
  timeTableType,
  tableRowOnClick,
}: StationTimeTableRowProps) {
  const handleStationClick = (e: React.MouseEvent) => e.stopPropagation();

  const trainNumber = train.trainNumber;
  const trainName = train.commuterLineid
    ? train.commuterLineid
    : train.trainType.name + train.trainNumber;
  const destinationStationName = getTrainDestinationStationName(train);
  const departureTime = getTrainScheduledDepartureTime(train);
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
      onClick={() => {
        if (departureTime) {
          tableRowOnClick(trainNumber, departureTime);
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
            {trainName}
            <VehicleTrackingIcon trainNumber={trainNumber} />
          </Box>
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
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            lineHeight: 'normal',
          }}
        >
          {stationRow?.commercialTrack ?? '?'}
          <ChevronRight sx={{ color: 'grey.400', marginRight: '-8px' }} />
        </span>
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
