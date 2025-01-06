interface Env {
  KV: KVNamespace;
  VR_API_URL: string;
  VR_API_KEY: string;
  VR_API_USERNAME: string;
  VR_API_PASSWORD: string;
}

type LoginResponse = {
  identityToken: string;
  expiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
};

type RefreshTokenResponse = {
  accessToken: string;
  expiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
};

type AuthCredentials = {
  token: string;
  expiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
};

const authCredentialsCacheKey = 'vr-auth-credentials';

function fetchWithDefaults(
  url: string,
  options: RequestInit,
  env: Env
): Promise<Response> {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'Junaan.fi',
    'aste-apikey': env.VR_API_KEY,
    ...options.headers,
  };

  return fetch(url, { ...options, headers: defaultHeaders });
}

async function fetchNewToken(
  username: string,
  password: string,
  env: Env
): Promise<AuthCredentials> {
  const response = await fetchWithDefaults(
    `${env.VR_API_URL}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
    env
  );

  if (!response.ok) {
    throw new Error(
      `Failed to login and fetch new token: ${response.statusText}`
    );
  }

  const tokenResponse = await response.json<LoginResponse>();

  return {
    token: tokenResponse.identityToken,
    expiresOn: tokenResponse.expiresOn,
    refreshToken: tokenResponse.refreshToken,
    refreshTokenExpiresOn: tokenResponse.refreshTokenExpiresOn,
  };
}

async function refreshToken(
  existingToken: AuthCredentials,
  env: Env
): Promise<AuthCredentials> {
  const response = await fetchWithDefaults(
    `${env.VR_API_URL}/auth/token`,
    {
      method: 'POST',
      headers: {
        'x-jwt-token': existingToken.token,
      },
      body: JSON.stringify({ refreshToken: existingToken.refreshToken }),
    },
    env
  );

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const tokenResponse = await response.json<RefreshTokenResponse>();

  return {
    token: tokenResponse.accessToken,
    expiresOn: tokenResponse.expiresOn,
    refreshToken: tokenResponse.refreshToken,
    refreshTokenExpiresOn: tokenResponse.refreshTokenExpiresOn,
  };
}

async function getToken(env: Env): Promise<AuthCredentials> {
  const rawExistingAuthCredentials = await env.KV.get(authCredentialsCacheKey);
  const existingAuthCredentials: AuthCredentials | null =
    rawExistingAuthCredentials ? JSON.parse(rawExistingAuthCredentials) : null;

  if (existingAuthCredentials) {
    const now = new Date();
    if (now < new Date(existingAuthCredentials.expiresOn)) {
      return existingAuthCredentials;
    }

    if (now < new Date(existingAuthCredentials.refreshTokenExpiresOn)) {
      try {
        const refreshedToken = await refreshToken(existingAuthCredentials, env);
        await env.KV.put(
          authCredentialsCacheKey,
          JSON.stringify(refreshedToken)
        );
        return refreshedToken;
      } catch (error) {
        console.warn('Failed to refresh token:', error);
      }
    }
  }

  const newAuthCredentials = await fetchNewToken(
    env.VR_API_USERNAME,
    env.VR_API_PASSWORD,
    env
  );
  await env.KV.put(authCredentialsCacheKey, JSON.stringify(newAuthCredentials));
  return newAuthCredentials;
}

type WagonMapDataParams = {
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  token: string;
  env: Env;
};

async function getWagonMapData({
  trainNumber,
  departureStation,
  arrivalStation,
  departureTime,
  token,
  env,
}: WagonMapDataParams): Promise<unknown> {
  const params = new URLSearchParams({
    departureStation,
    arrivalStation,
    departureTime,
  });
  const response = await fetchWithDefaults(
    `${env.VR_API_URL}/trains/${trainNumber}/wagonmap/v3?${params}`,
    {
      headers: {
        'x-jwt-token': token,
      },
    },
    env
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch wagon map data for train ${trainNumber} departing at ${departureTime}: ${response.statusText}`
    );
  }

  return response.json();
}

type WagonMapDataRequest = {
  variables: {
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    trainNumber: string;
    trainType: string;
  };
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const authCredentials = await getToken(context.env);
  const wagonMapDataRequest = await context.request.json<WagonMapDataRequest>();
  const { trainNumber, departureStation, arrivalStation, departureTime } =
    wagonMapDataRequest.variables;
  const wagonMapData = await getWagonMapData({
    trainNumber,
    departureStation,
    arrivalStation,
    departureTime,
    token: authCredentials.token,
    env: context.env,
  });
  // Wrap original response body JSON to data field to make response GraphQL compliant
  return new Response(JSON.stringify({ data: wagonMapData }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
