import { useState } from 'react';

import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { Train } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TrainStation, trainStations } from '../utils/stations';

const trainStationsWithPassengerTraffic = trainStations.filter(
  (s) => s.passengerTraffic
);

export default function StationAutocomplete() {
  const [value, setValue] = useState<TrainStation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<TrainStation[]>([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Autocomplete
      style={{ width: '100%' }}
      getOptionLabel={(option) =>
        typeof option === 'string' ? option : option.stationName
      }
      options={trainStationsWithPassengerTraffic}
      autoComplete
      includeInputInList
      filterSelectedOptions={false}
      value={value}
      onChange={(_event, station) => {
        setOptions(station ? [station, ...options] : options);
        setValue(station);
        if (station) {
          navigate(`/${station.stationName}`);
        }
      }}
      onInputChange={(_event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus
          label={t('search_station_by_name')}
          placeholder={t('search_station_by_name_placeholder') ?? undefined}
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(props, option) => {
        if (!option || !option.stationName) return null;
        const matches = match(option.stationName, inputValue);
        const parts = parse(option.stationName, matches);

        return (
          <li {...props}>
            <Train />
            {parts.map((part, index) => (
              <span
                key={index}
                style={{
                  fontWeight: part.highlight ? 'bold' : 'regular',
                  whiteSpace: 'pre',
                }}
              >
                {part.text}
              </span>
            ))}
          </li>
        );
      }}
    />
  );
}
