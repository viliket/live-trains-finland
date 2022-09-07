import { Fragment } from 'react';

import { Divider, List, ListItem, ListItemText } from '@mui/material';
import { Star } from 'mdi-material-ui';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
        <List>
          {favStations.map((station, i) => (
            <Fragment key={station.stationShortCode}>
              <ListItem button component={Link} to={`/${station.stationName}`}>
                <ListItemText primary={station.stationName} />
              </ListItem>
              {i !== favStations.length - 1 && <Divider />}
            </Fragment>
          ))}
        </List>
      )}
      {favStations.length === 0 && t('no_favorite_stations')}
    </div>
  );
};

export default FavoriteStationList;
