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

type TokenRefreshResponse = {
  accessToken: string;
  expiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
};

type TokenSession = {
  token: string;
  expiresOn: string;
  refreshToken: string;
  refreshTokenExpiresOn: string;
};

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
): Promise<TokenSession> {
  const response = await fetchWithDefaults(
    `${env.VR_API_URL}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    },
    env
  );

  if (!response.ok) {
    throw new Error('Failed to login and fetch new token');
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
  existingToken: TokenSession,
  env: Env
): Promise<TokenSession> {
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
    throw new Error('Failed to refresh token');
  }

  const tokenResponse = await response.json<TokenRefreshResponse>();

  return {
    token: tokenResponse.accessToken,
    expiresOn: tokenResponse.expiresOn,
    refreshToken: tokenResponse.refreshToken,
    refreshTokenExpiresOn: tokenResponse.refreshTokenExpiresOn,
  };
}

async function getTokenSession(env: Env): Promise<TokenSession> {
  const rawExistingTokenResponse = await env.KV.get('vr-token-response');
  const existingTokenResponse: TokenSession | null = rawExistingTokenResponse
    ? JSON.parse(rawExistingTokenResponse)
    : null;

  if (existingTokenResponse) {
    if (new Date() < new Date(existingTokenResponse.expiresOn)) {
      return existingTokenResponse;
    }

    if (new Date() < new Date(existingTokenResponse.refreshTokenExpiresOn)) {
      const refreshedToken = await refreshToken(existingTokenResponse, env);
      await env.KV.put('vr-token-response', JSON.stringify(refreshedToken));
      return refreshedToken;
    }
  }

  const newToken = await fetchNewToken(
    env.VR_API_USERNAME,
    env.VR_API_PASSWORD,
    env
  );
  await env.KV.put('vr-token-response', JSON.stringify(newToken));
  return newToken;
}

type WagonMapDataParams = {
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  authToken: string;
  env: Env;
};

async function getWagonMapData({
  trainNumber,
  departureStation,
  arrivalStation,
  departureTime,
  authToken,
  env,
}: WagonMapDataParams) {
  const params = new URLSearchParams({
    departureStation,
    arrivalStation,
    departureTime,
  });
  const response = await fetchWithDefaults(
    `${env.VR_API_URL}/trains/${trainNumber}/wagonmap/v3?${params}`,
    {
      headers: {
        'x-jwt-token': authToken,
      },
    },
    env
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch wagon map data for train ${trainNumber} departing at ${departureTime}`
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
  const tokenSession = await getTokenSession(context.env);
  const wagonMapDataRequest = await context.request.json<WagonMapDataRequest>();
  const { trainNumber, departureStation, arrivalStation, departureTime } =
    wagonMapDataRequest.variables;
  const wagonMapData = await getWagonMapData({
    trainNumber,
    departureStation,
    arrivalStation,
    departureTime,
    authToken: tokenSession.token,
    env: context.env,
  });
  // Wrap original response body JSON to data field to make response GraphQL compliant
  return new Response(JSON.stringify({ data: wagonMapData }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
