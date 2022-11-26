import { Box, IconButton, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ClockAlert } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';

import { TrainTimeTableRowFragment } from '../graphql/generated/digitraffic';

type TimeTableRowTimeProps = {
  row: TrainTimeTableRowFragment;
};

function TimeTableRowTime({ row }: TimeTableRowTimeProps) {
  const { t } = useTranslation();

  const delayInMinutes = row.differenceInMinutes ?? 0;
  const scheduledTime = parseISO(row.scheduledTime);
  const actualTime = row.actualTime
    ? parseISO(row.actualTime)
    : row.liveEstimateTime
    ? parseISO(row.liveEstimateTime)
    : scheduledTime;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {(delayInMinutes > 0 || row.cancelled) && (
        <span
          style={{
            textDecoration: 'line-through',
            fontSize: 'smaller',
            marginTop: '-0.8rem',
          }}
        >
          {scheduledTime ? format(scheduledTime, 'HH:mm') : '?'}
        </span>
      )}
      {!row.cancelled && (
        <Box
          sx={{
            color: delayInMinutes > 0 ? 'error.main' : undefined,
            fontWeight: '500',
          }}
        >
          {format(actualTime, 'HH:mm')}
        </Box>
      )}
      {row.cancelled && (
        <Box sx={{ color: 'error.main', fontWeight: '500' }}>
          {t('canceled')}
        </Box>
      )}
      {row.causes && (
        <Tooltip
          enterTouchDelay={0}
          title={row.causes
            .map(
              (c) =>
                c?.thirdCategoryCode?.name ??
                c?.detailedCategoryCode?.name ??
                c?.categoryCode?.name
            )
            .join(' | ')}
        >
          <IconButton
            aria-label="delay reason"
            color="info"
            sx={{ alignSelf: 'baseline' }}
          >
            <ClockAlert />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}

export default TimeTableRowTime;
