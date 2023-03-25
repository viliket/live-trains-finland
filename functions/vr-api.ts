interface Env {
  KV: KVNamespace;
}

const vrApiUrl = 'https://www.vr.fi/api/v6';

export const onRequest: PagesFunction<Env> = async (context) => {
  const proxyRequest = new Request(vrApiUrl, context.request);
  return fetch(proxyRequest);
};
