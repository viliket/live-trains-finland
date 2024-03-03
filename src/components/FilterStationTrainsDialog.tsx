import { useEffect, useState } from 'react';

import {
  Autocomplete,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  TextField,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useTranslation } from 'react-i18next';

import { Station, TimeTableRowType } from '../graphql/generated/digitraffic';
import { getTrainStationName } from '../utils/train';

type StationFragment = Pick<Station, 'name' | 'shortCode'>;

type FilterStationTrainsDialogProps = {
  onClose: () => void;
  open: boolean;
  stationOptions: StationFragment[];
  stationCodeFilter?: string;
  setStationCodeFilter: (stationCode: string) => void;
  timeTableType: TimeTableRowType;
};

const FilterStationTrainsDialog = (props: FilterStationTrainsDialogProps) => {
  const {
    onClose,
    open,
    stationOptions,
    setStationCodeFilter,
    stationCodeFilter,
    timeTableType,
  } = props;
  const { t } = useTranslation();
  const [station, setStation] = useState<StationFragment | null>(null);

  const handleClose = () => {
    onClose();
  };

  const handleChange = (_event: unknown, station: StationFragment | null) => {
    if (station) {
      setStation(station);
      setStationCodeFilter(station.shortCode);
    } else {
      setStation(null);
      setStationCodeFilter('');
    }
  };

  useEffect(() => {
    // Reset selection when station code filter is cleared from the parent
    if (!stationCodeFilter) {
      setStation(null);
    }
  }, [stationCodeFilter]);

  return (
    <Dialog onClose={handleClose} open={open} fullWidth maxWidth="sm">
      <DialogTitle>{t('filter_trains')}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <Autocomplete
            id="train-destination-or-arrival-station-filter"
            value={station}
            options={stationOptions}
            getOptionLabel={(o) => getTrainStationName(o)}
            getOptionKey={(o) => o.shortCode}
            isOptionEqualToValue={(o, v) => o.shortCode === v.shortCode}
            renderInput={(params) => (
              <TextField
                {...params}
                label={
                  timeTableType == TimeTableRowType.Departure
                    ? t('to')
                    : t('from')
                }
              />
            )}
            onChange={handleChange}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterStationTrainsDialog;
