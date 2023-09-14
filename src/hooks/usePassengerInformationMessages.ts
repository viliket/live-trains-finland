import { useEffect, useMemo, useState } from 'react';

import {
  getPassengerInformationMessagesCurrentlyRelevant,
  PassengerInformationMessage,
} from '../utils/passengerInformationMessages';

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
          const relevantMessages =
            getPassengerInformationMessagesCurrentlyRelevant(allMessages);
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
