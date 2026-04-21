import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const api = setupCache(axios.create(), {
  ttl: 1000 * 60 * 30,
});

const PROXY_ENDPOINT = '/api/proxy';

export const fetchAction = async (
  url: string,
  headers: Record<string, string> = {},
  { useCache = true, ttl = 1800000 } = {},
) => {
  const response = await api.post(
    PROXY_ENDPOINT,
    {
      url,
      method: 'GET',
      headers,
    },
    {
      id: url,
      cache: useCache ? { ttl } : false,
    },
  );

  return response;
};

export const postAction = async (
  url: string,
  data = {},
  headers: Record<string, string> = {},
) => {
  const response = await api.post(
    PROXY_ENDPOINT,
    {
      url,
      method: 'POST',
      data,
      headers,
    },
    {
      cache: false, // Don't cache POST requests
    },
  );

  return response;
};
