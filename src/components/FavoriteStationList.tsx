import { Fragment } from 'react';

import { Chip, Stack } from '@mui/material';
import { Star } from 'mdi-material-ui';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useLocalStorageState from 'use-local-storage-state';

import { trainStations } from '../utils/stations';

const FavoriteStationList = () => {
  const { t } = useTranslation();
  const [favStationCodes] = useLocalStorageState('favoriteStations', {
    defaultValue: [] as string[],
  });

  const favStations = trainStations.filter((s) =>
    favStationCodes.includes(s.stationShortCode)
  );

  return (
    <div>
      <h2>
        {t('favorite_stations')}{' '}
        <Star color="primary" sx={{ verticalAlign: 'middle' }} />
      </h2>
      {favStations.length !== 0 && (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {favStations.map((station, i) => (
            <Fragment key={station.stationShortCode}>
              <Chip
                component={Link}
                href={`/${station.stationName}`}
                label={station.stationName}
                clickable
              />
            </Fragment>
          ))}
        </Stack>
      )}
      {favStations.length === 0 && t('no_favorite_stations')}
    </div>
  );
};

export default FavoriteStationList;
