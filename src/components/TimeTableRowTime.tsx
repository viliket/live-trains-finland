import { Box, IconButton, Tooltip } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { ClockAlert } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';

import { TrainTimeTableRowFragment } from '../graphql/generated/digitraffic/graphql';

type TimeTableRowTimeProps = {
  row: TrainTimeTableRowFragment;
};

function TimeTableRowTime({ row }: TimeTableRowTimeProps) {
  const { t } = useTranslation();

  const delayInMinutes = row.differenceInMinutes ?? 0;
  const scheduledTime = parseISO(row.scheduledTime);
  const actualTime = parseISO(
    row.actualTime ?? row.liveEstimateTime ?? row.scheduledTime
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {(delayInMinutes > 0 || row.cancelled) && (
        <Box
          sx={{
            textDecoration: 'line-through',
            fontSize: 'smaller',
            marginTop: '-0.8rem',
            color: 'text.secondary',
          }}
        >
          {scheduledTime ? format(scheduledTime, 'HH:mm') : '?'}
        </Box>
      )}
      {!row.cancelled && (
        <Box
          sx={[
            {
              fontWeight: '500',
            },
            delayInMinutes > 0 && {
              color: 'error.main',
            },
          ]}
        >
          {format(actualTime, 'HH:mm')}
        </Box>
      )}
      {row.cancelled && (
        <Box sx={{ color: 'error.main', fontWeight: '500' }}>
          {t('canceled')}
        </Box>
      )}
      {row.causes && row.causes.length > 0 && (
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
