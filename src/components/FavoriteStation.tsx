import { IconButton } from '@mui/material';
import { Star, StarOutline } from 'mdi-material-ui';
import useLocalStorageState from 'use-local-storage-state';

type FavoriteStationProps = {
  stationShortCode: string;
};

const FavoriteStation = ({ stationShortCode }: FavoriteStationProps) => {
  const [favStationCodes, setFavStationCodes] = useLocalStorageState(
    'favoriteStations',
    {
      defaultValue: [] as string[],
    }
  );
  const isFavorite = favStationCodes.includes(stationShortCode);

  const toggleIsFavorite = () => {
    const existingIdx = favStationCodes.indexOf(stationShortCode);
    if (existingIdx === -1) {
      setFavStationCodes([...favStationCodes, stationShortCode]);
    } else {
      setFavStationCodes([
        ...favStationCodes.slice(0, existingIdx),
        ...favStationCodes.slice(existingIdx + 1),
      ]);
    }
  };

  return (
    <IconButton color="primary" onClick={toggleIsFavorite}>
      {isFavorite ? <Star /> : <StarOutline />}
    </IconButton>
  );
};

export default FavoriteStation;
