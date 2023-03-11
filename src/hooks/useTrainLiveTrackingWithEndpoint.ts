import { useCallback, useEffect, useRef } from 'react';

import { TrainByStationFragment } from '../graphql/generated/digitraffic';
import { isDefined } from '../utils/common';
import useMqttClient from './useMqttClient';

type MqttConfig = {
  endpointUrl: string;
  getTopic: (train: TrainByStationFragment) => string | null;
  handleMessage: (
    topic: string,
    message: Buffer,
    topicToTrain: Map<string, TrainByStationFragment>
  ) => void;
};

function useTrainLiveTrackingWithEndpoint(
  { endpointUrl, getTopic, handleMessage }: MqttConfig,
  trains?: TrainByStationFragment[]
) {
  const { client, error } = useMqttClient(endpointUrl);
  const subscribedTopics = useRef(new Map<string, TrainByStationFragment>());

  useEffect(() => {
    const callback = (topic: string, message: Buffer) =>
      handleMessage(topic, message, subscribedTopics.current);

    if (client) {
      client.on('message', callback);
    }

    return () => {
      if (client) {
        client.off('message', callback);
      }
    };
  }, [client, handleMessage]);

  useEffect(() => {
    if (client && trains) {
      const topics = trains
        .map((t) => ({ topic: getTopic(t), train: t }))
        .filter((e): e is { topic: string; train: TrainByStationFragment } =>
          isDefined(e.topic)
        );
      const newTopics = topics.filter(
        ({ topic }) => !subscribedTopics.current.has(topic)
      );
      client.subscribe(newTopics.map(({ topic }) => topic));
      newTopics.forEach((e) => subscribedTopics.current.set(e.topic, e.train));
    }
  }, [client, getTopic, trains]);

  const unsubscribeAll = useCallback(
    (cb?: () => void) => {
      if (client) {
        let subsRemaining = subscribedTopics.current.size;
        subscribedTopics.current.forEach((_, t) => {
          client.unsubscribe(t, () => {
            subsRemaining -= 1;
            if (subsRemaining === 0) {
              if (cb) {
                cb();
              }
            }
          });
        });
        subscribedTopics.current = new Map<string, TrainByStationFragment>();
      }
    },
    [client]
  );

  return { error, unsubscribeAll };
}

export default useTrainLiveTrackingWithEndpoint;
