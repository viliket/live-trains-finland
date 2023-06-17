import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

import {
  TimeTableRowType,
  TrainByStationFragment,
} from '../graphql/generated/digitraffic';
import getTimeTableRowForStation from '../utils/getTimeTableRowForStation';
import StationTimeTableRow from './StationTimeTableRow';

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
            top: '3rem',
            zIndex: 1002,
            backgroundColor: theme.palette.common.secondaryBackground.default,
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
            const stationRow = getTimeTableRowForStation(
              stationCode,
              trn,
              timeTableType
            );

            return (
              <StationTimeTableRow
                key={`${trn.trainNumber}-${stationRow?.scheduledTime}`}
                train={trn}
                stationCode={stationCode}
                timeTableType={timeTableType}
                tableRowOnClick={tableRowOnClick}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StationTimeTable;
