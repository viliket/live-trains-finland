import { GraphQLClient } from 'graphql-request';

export const digitrafficClient = new GraphQLClient(
  'https://rata.digitraffic.fi/api/v2/graphql/graphql',
  {
    headers: {
      'Digitraffic-User': 'Junaan.fi',
    },
  }
);

export const digitransitClient = new GraphQLClient(
  'https://api.digitransit.fi/routing/v2/finland/gtfs/v1',
  {
    headers: {
      'digitransit-subscription-key':
        process.env.NEXT_PUBLIC_DIGITRANSIT_SUBSCRIPTION_KEY ?? '',
    },
  }
);
