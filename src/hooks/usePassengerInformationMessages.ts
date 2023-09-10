import { useEffect, useMemo, useState } from 'react';

export type PassengerInformationMessage = {
  id: string;
  version: number;
  creationDateTime: string;
  startValidity: string;
  endValidity: string;
  stations: string[];
  trainNumber?: number;
  trainDepartureDate?: string;
  audio?: {
    text?: PassengerInformationTextContent;
    deliveryRules?: DeliveryRules;
  };
  video?: {
    text?: PassengerInformationTextContent;
    deliveryRules?: DeliveryRules;
  };
};

type PassengerInformationTextContent = {
  fi?: string;
  sv?: string;
  en?: string;
};

type DeliveryRules = {
  deliveryType?:
    | 'NOW'
    | 'DELIVERY_AT'
    | 'REPEAT_EVERY'
    | 'ON_SCHEDULE'
    | 'ON_EVENT';
};

type PassengerInformationMessageQuery = {
  skip?: boolean;
  stationCode?: string;
  trainNumber?: number;
  trainDepartureDate?: string;
  onlyGeneral?: boolean;
  refetchIntervalMs: number;
};

export default function usePassengerInformationMessages({
  skip,
  stationCode,
  trainNumber,
  trainDepartureDate,
  onlyGeneral,
  refetchIntervalMs = 10000,
}: PassengerInformationMessageQuery) {
  const [messages, setMessages] = useState<PassengerInformationMessage[]>();
  const [error, setError] = useState<unknown>();

  const params = useMemo(() => {
    return new URLSearchParams({
      ...(stationCode && { station: stationCode }),
      ...(trainNumber && { train_number: trainNumber?.toString() }),
      ...(trainDepartureDate && { train_departure_date: trainDepartureDate }),
      ...(onlyGeneral && { only_general: onlyGeneral?.toString() }),
    });
  }, [onlyGeneral, stationCode, trainDepartureDate, trainNumber]);

  useEffect(() => {
    let interval: NodeJS.Timer | null = null;
    if (!skip) {
      const fetchData = async () => {
        try {
          setError(undefined);
          const res = await fetch(
            `https://rata.digitraffic.fi/api/v1/passenger-information/active?${params}`
          );
          const allMessages =
            (await res.json()) as PassengerInformationMessage[];
          const relevantMessages = allMessages.filter((m) => {
            const passengerInformationContent = m.video ?? m.audio;
            return (
              passengerInformationContent?.deliveryRules == null ||
              passengerInformationContent?.deliveryRules?.deliveryType !==
                'ON_EVENT'
            );
          });
          setMessages(relevantMessages);
        } catch (error) {
          setError(error);
        }
      };
      interval = setInterval(fetchData, refetchIntervalMs);
      fetchData();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [params, refetchIntervalMs, skip]);

  return { messages, error };
}

export function getPassengerInformationMessagesByStation(
  passengerInformationMessages: PassengerInformationMessage[] | undefined
) {
  return passengerInformationMessages?.reduce((acc, message) => {
    // When there are more than one stations, only add this message to the first
    // and last station in the array (which are ordered according to the train
    // schedule).
    const stationsToAdd =
      message.stations.length > 1
        ? [message.stations[0], message.stations[message.stations.length - 1]]
        : message.stations;

    stationsToAdd.forEach((station) => {
      acc[station] = acc[station] || [];
      acc[station].push(message);
    });
    return acc;
  }, {} as Record<string, PassengerInformationMessage[]>);
}
