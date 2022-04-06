import { useEffect, useState } from 'react';

import mqtt from 'mqtt';

const useMqttClient = (brokerUrl: string, opts?: mqtt.IClientOptions) => {
  const [client, setClient] = useState<mqtt.MqttClient>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const client = mqtt.connect(brokerUrl, opts);

    client.on('connect', () => {
      setClient(client);
      setError(undefined);
    });

    client.on('error', (err) => {
      setError(err);
    });

    return () => {
      client.end(true);
    };
  }, [brokerUrl, opts]);

  return { client, error };
};

export default useMqttClient;
