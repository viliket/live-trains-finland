import { queryOptions, useQuery } from '@tanstack/react-query';

import { digitrafficClient } from '../graphql/client';
import {
  Locomotive,
  TrainDetailsFragment,
  TrainDocument,
  Wagon,
} from '../graphql/generated/digitraffic/graphql';
import {
  TrainCompositionFragment,
  TrainExtendedDetails,
  TrainJourneySectionFragment,
} from '../types';
import getStationPlatformSide from '../utils/getStationPlatformSide';
import getTimeTableRowsGroupedByStation from '../utils/getTimeTableRowsGroupedByStation';
import getTrainDirection from '../utils/getTrainDirection';
import getTrainVehicleIdFromTrainEuropeanVehicleNumber from '../utils/getTrainVehicleIdFromTrainEuropeanVehicleNumber';

const trainQuery = (
  trainNumber: number | undefined | null,
  departureDate: string | undefined | null
) =>
  queryOptions({
    queryKey: ['train', trainNumber, departureDate],
    queryFn: () => getExtendedTrain(trainNumber, departureDate),
    enabled: Boolean(trainNumber != null && departureDate),
    refetchInterval: 10000,
  });

const useTrainQuery = (
  trainNumber: number | undefined | null,
  departureDate: string | undefined | null
) => useQuery(trainQuery(trainNumber, departureDate));

export default useTrainQuery;

async function getExtendedTrain(
  trainNumber: number | undefined | null,
  departureDate: string | undefined | null
): Promise<TrainExtendedDetails | null> {
  const data = await digitrafficClient.request(TrainDocument, {
    trainNumber: trainNumber ?? 0,
    departureDate: departureDate,
  });
  const train = data.train?.[0];

  if (!train) return null;

  const timeTableGroups = getTimeTableRowsGroupedByStation({
    timeTableRows: train?.timeTableRows,
  });

  const extendedTrain: TrainExtendedDetails = {
    ...train,
    timeTableGroups: timeTableGroups?.map((g) => {
      const timeTableGroupExtended = {
        arrival: g.arrival,
        departure: g.departure,
        trainDirection: getTrainDirection(
          { timeTableGroups } as unknown as TrainDetailsFragment,
          g
        ),
      };
      return {
        ...timeTableGroupExtended,
        stationPlatformSide: getStationPlatformSide(timeTableGroupExtended),
      };
    }),
    compositions: train?.compositions?.map((composition) =>
      composition ? extendComposition(composition, train) : composition
    ),
  };

  return extendedTrain;
}

function extendComposition(
  composition: TrainCompositionFragment,
  train: TrainDetailsFragment
): TrainCompositionFragment {
  return {
    ...composition,
    journeySections: composition?.journeySections?.map((section) =>
      section ? extendJourneySection(section, train) : section
    ),
  };
}

function extendJourneySection(
  section: TrainJourneySectionFragment,
  train: TrainDetailsFragment
): TrainJourneySectionFragment {
  return {
    ...section,
    locomotives: section?.locomotives?.map((locomotive) =>
      locomotive ? extendLocomotive(locomotive) : locomotive
    ),
    wagons: section?.wagons?.map((wagon) =>
      wagon ? extendWagon(wagon, train) : wagon
    ),
  };
}

function extendLocomotive(locomotive: Locomotive): Locomotive {
  return {
    ...locomotive,
    vehicleId: locomotive?.vehicleNumber
      ? getTrainVehicleIdFromTrainEuropeanVehicleNumber(
          locomotive.vehicleNumber,
          locomotive.locomotiveType
        )
      : null,
  };
}

function extendWagon(wagon: Wagon, train: TrainDetailsFragment): Wagon {
  const wagonType = getWagonType(wagon?.wagonType, train);
  return {
    ...wagon,
    vehicleId:
      wagon.vehicleNumber && wagonType
        ? getTrainVehicleIdFromTrainEuropeanVehicleNumber(
            wagon.vehicleNumber,
            wagonType
          )
        : null,
    wagonType: wagonType,
  };
}

function getWagonType(
  wagonType: string | null | undefined,
  train: TrainDetailsFragment
) {
  if (wagonType) {
    // Use actual wagon type if available
    return wagonType;
  }

  if (!train.departureDate || !train.trainNumber || !train.commuterLineid) {
    return null;
  }

  // Fallback: Determine wagon type based on the commuter line ID
  const sm4WagonCommuterLines = ['R', 'Z'];
  if (sm4WagonCommuterLines.includes(train.commuterLineid)) {
    return 'Sm4';
  }
  return 'Sm5';
}
