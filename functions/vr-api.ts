interface Env {
  KV: KVNamespace;
  VR_API_URL: string;
  VR_API_KEY: string;
  VR_API_USERNAME: string;
  VR_API_PASSWORD: string;
  VR_ID_API: string;
  VR_CLIENT_ID: string;
  VR_ID_TENANT: string;
  VR_ID_CONNECTION: string;
  VR_ID_CHANNEL_ID: string;
}

type CachedAuth = { bffToken: string; expiresOn: string };

const authCacheKey = 'vr-ciam-auth';
const tokenExpiryBufferMs = 2 * 60 * 1000;
const maxRedirects = 10;

const base64Url = (bytes: Uint8Array): string =>
  bytes.toBase64({ alphabet: 'base64url', omitPadding: true });

const sha256 = async (input: string): Promise<string> =>
  base64Url(
    new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input))
    )
  );

const randomVerifier = (): string =>
  base64Url(crypto.getRandomValues(new Uint8Array(48)));

// Cookie-aware redirect follower. Workers' fetch(redirect:'follow') does not
// carry Set-Cookie between hops, which the Auth0 login chain requires.
const chase = async (
  startUrl: string,
  init: RequestInit,
  jar: Map<string, string>
): Promise<Response> => {
  let url = startUrl;
  let nextInit = init;
  for (let hop = 0; hop < maxRedirects; hop++) {
    const headers = new Headers(nextInit.headers);
    if (jar.size)
      headers.set('Cookie', [...jar].map(([k, v]) => `${k}=${v}`).join('; '));
    const response = await fetch(url, {
      ...nextInit,
      headers,
      redirect: 'manual',
    });
    for (const value of response.headers.getSetCookie()) {
      const eq = value.indexOf('=');
      if (eq > 0)
        jar.set(
          value.slice(0, eq).trim(),
          value
            .slice(eq + 1)
            .split(';')[0]
            .trim()
        );
    }
    const isRedirect = response.status >= 300 && response.status < 400;
    if (!isRedirect) return response;
    const location = response.headers.get('location');
    if (!location) return response;
    url = new URL(location, url).toString();
    const preserveMethod = response.status === 307 || response.status === 308;
    if (!preserveMethod) nextInit = { method: 'GET' };
  }
  throw new Error('CIAM: too many redirects');
};

// Decodes raw HTML entities that Auth0 embeds in <input> values (&#34; in wctx
// JSON, etc.).
const decodeEntities = (s: string): string =>
  s.replaceAll('&#34;', '"').replaceAll('&amp;', '&');

const vrHeaders = (env: Env, extra?: HeadersInit): Headers => {
  const h = new Headers(extra);
  h.set('User-Agent', 'Junaan.fi');
  h.set('aste-apikey', env.VR_API_KEY);
  return h;
};

const ciamLogin = async (env: Env): Promise<CachedAuth> => {
  const jar = new Map<string, string>();
  const verifier = randomVerifier();

  const initParams = new URLSearchParams({
    redirect_uri: 'https://www.vr.fi/ciam-authorization',
    channel_id: env.VR_ID_CHANNEL_ID,
    code_challenge: await sha256(verifier),
    code_challenge_method: 'S256',
    locale: 'fi',
  });
  const loginPage = await chase(
    `${env.VR_ID_API}/vrgroup/uaa/v1/api/login?${initParams}`,
    { method: 'GET' },
    jar
  );
  const sessionKey = jar.get('session_key');
  if (!sessionKey) throw new Error('CIAM init: session_key cookie missing');
  let auth0Config: string | undefined;
  await new HTMLRewriter()
    .on('[data-auth0config]', {
      element(el) {
        auth0Config = el.getAttribute('data-auth0config') ?? undefined;
      },
    })
    .transform(loginPage)
    .arrayBuffer();
  if (!auth0Config) throw new Error('CIAM init: data-auth0config missing');
  const state = (
    JSON.parse(atob(auth0Config)) as { extraParams: { state: string } }
  ).extraParams.state;

  const formPage = await chase(
    `${env.VR_ID_API}/usernamepassword/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: env.VR_CLIENT_ID,
        tenant: env.VR_ID_TENANT,
        response_type: 'token',
        connection: env.VR_ID_CONNECTION,
        state,
        username: env.VR_API_USERNAME,
        password: env.VR_API_PASSWORD,
      }),
    },
    jar
  );
  if (!formPage.ok)
    throw new Error(
      `usernamepassword/login: ${formPage.status} ${await formPage.text()}`
    );

  const fields: Record<string, string> = {};
  await new HTMLRewriter()
    .on('input[name][value]', {
      element(el) {
        const name = el.getAttribute('name');
        const value = el.getAttribute('value');
        if (name && value != null) fields[name] = decodeEntities(value);
      },
    })
    .transform(formPage)
    .arrayBuffer();
  if (!fields.wa || !fields.wresult || !fields.wctx)
    throw new Error('Login form: missing wa/wresult/wctx');

  const callback = await chase(
    `${env.VR_ID_API}/login/callback`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields).toString(),
    },
    jar
  );
  if (!callback.ok)
    throw new Error(
      `login/callback: ${callback.status} ${await callback.text()}`
    );

  const tokensResp = await fetch(`${env.VR_API_URL}/ciam/tokens`, {
    method: 'POST',
    headers: vrHeaders(env, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ sessionKey, verifier }),
  });
  if (!tokensResp.ok)
    throw new Error(
      `ciam/tokens: ${tokensResp.status} ${await tokensResp.text()}`
    );
  return tokensResp.json<CachedAuth>();
};

const getAuth = async (env: Env, forceLogin = false): Promise<CachedAuth> => {
  const cached = forceLogin
    ? null
    : await env.KV.get<CachedAuth>(authCacheKey, 'json');

  if (
    cached &&
    new Date(cached.expiresOn).getTime() - tokenExpiryBufferMs > Date.now()
  )
    return cached;

  if (cached) {
    const refresh = await fetch(`${env.VR_API_URL}/auth/token`, {
      method: 'POST',
      headers: vrHeaders(env, {
        'Content-Type': 'application/json',
        'x-jwt-token': cached.bffToken,
      }),
      body: '{}',
    });
    if (refresh.ok) {
      const refreshed = await refresh.json<CachedAuth>();
      await env.KV.put(authCacheKey, JSON.stringify(refreshed));
      return refreshed;
    }
    console.warn(
      `CIAM refresh failed (${refresh.status}), falling back to full login`
    );
  }

  const fresh = await ciamLogin(env);
  await env.KV.put(authCacheKey, JSON.stringify(fresh));
  return fresh;
};

type WagonMapVariables = {
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  trainNumber: string;
  trainType: string;
};

const fetchWagonMapData = async (
  vars: WagonMapVariables,
  env: Env
): Promise<unknown> => {
  const get = (auth: CachedAuth) =>
    fetch(
      `${env.VR_API_URL}/trains/${vars.trainNumber}/wagonmap/v3?` +
        new URLSearchParams({
          departureStation: vars.departureStation,
          arrivalStation: vars.arrivalStation,
          departureTime: vars.departureTime,
        }),
      {
        headers: vrHeaders(env, { 'x-jwt-token': auth.bffToken }),
      }
    );

  let response = await get(await getAuth(env));
  if (response.status === 401) {
    response = await get(await getAuth(env, true));
  }
  if (!response.ok)
    throw new Error(
      `wagonmap/v3 train ${vars.trainNumber}: ${response.status} ${response.statusText}`
    );
  return response.json();
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const { variables } = await context.request.json<{
    variables: WagonMapVariables;
  }>();
  const wagonMapData = await fetchWagonMapData(variables, context.env);
  return Response.json({ data: wagonMapData });
};
