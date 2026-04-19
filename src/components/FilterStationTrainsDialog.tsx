import { useMemo } from 'react';

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

import {
  Station,
  TimeTableRowType,
} from '../graphql/generated/digitraffic/graphql';
import { trainStations } from '../utils/stations';
import { getTrainStationName } from '../utils/train';

type StationFragment = Pick<Station, 'name' | 'shortCode'>;

type FilterStationTrainsDialogProps = {
  onClose: () => void;
  open: boolean;
  stationOptions: StationFragment[];
  stationCodeFilter: string | null;
  setStationCodeFilter: (stationCode: string | null) => void;
  timeTableType: TimeTableRowType;
};

const getStationByCode = (stationCode: string): StationFragment | null => {
  const station = trainStations.find((s) => s.stationShortCode === stationCode);
  if (!station) return null;
  return {
    name: station.stationName,
    shortCode: station.stationShortCode,
  };
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
  const station = useMemo(
    () => (stationCodeFilter ? getStationByCode(stationCodeFilter) : null),
    [stationCodeFilter]
  );

  const handleClose = () => {
    onClose();
  };

  const resetFilters = () => {
    setStationCodeFilter(null);
  };

  const handleChange = (_event: unknown, station: StationFragment | null) => {
    if (station) {
      setStationCodeFilter(station.shortCode);
    } else {
      resetFilters();
    }
  };

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
        <Button onClick={resetFilters}>{t('reset')}</Button>
        <Button onClick={handleClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterStationTrainsDialog;
