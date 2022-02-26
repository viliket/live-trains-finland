import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import {
  RouteForRailFragment,
  RoutesForRailQuery,
} from '../graphql/generated/digitransit';
import {
  getTrainDepartureStationName,
  getTrainDestinationStationName,
} from './train';

export default function getRouteForTrain(
  train?: TrainByStationFragment | null,
  routeData?: RoutesForRailQuery
) {
  if (!train) return null;
  const departureStationName = getTrainDepartureStationName(train);
  const destinationStationName = getTrainDestinationStationName(train);

  let selectedRoute: RouteForRailFragment | null = null;
  if (routeData?.routes && departureStationName && destinationStationName) {
    selectedRoute =
      routeData.routes.find(
        (r) =>
          ((train.commuterLineid && r?.shortName === train.commuterLineid) ||
            r?.shortName === train.trainNumber.toString()) &&
          r?.longName
            ?.toLowerCase()
            .includes(departureStationName.toLowerCase()) &&
          r?.longName
            ?.toLowerCase()
            .includes(destinationStationName.toLowerCase())
      ) ?? null;
  }
  return selectedRoute;
}
