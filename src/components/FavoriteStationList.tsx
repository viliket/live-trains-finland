import { Chip, Skeleton, Stack } from '@mui/material';
import { Star } from 'mdi-material-ui';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import useLocalStorageState from 'use-local-storage-state';

import { useHasMounted } from '../hooks/useHasMounted';
import { trainStations } from '../utils/stations';

const FavoriteStationList = () => {
  const { t } = useTranslation();
  const [favStationCodes] = useLocalStorageState('favoriteStations', {
    defaultValue: [] as string[],
  });
  const hasMounted = useHasMounted();

  const favStations = trainStations.filter((s) =>
    favStationCodes.includes(s.stationShortCode)
  );

  return (
    <div>
      <h2>
        {t('favorite_stations')}{' '}
        <Star color="primary" sx={{ verticalAlign: 'middle' }} />
      </h2>
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
          <Chip
            key={station.stationShortCode}
            component={Link}
            href={`/${station.stationName}`}
            label={station.stationName}
            clickable
          />
        ))}
        {hasMounted && favStations.length === 0 && t('no_favorite_stations')}
        {!hasMounted && <Skeleton variant="rounded" width="80%" height={30} />}
      </Stack>
    </div>
  );
};

export default FavoriteStationList;
