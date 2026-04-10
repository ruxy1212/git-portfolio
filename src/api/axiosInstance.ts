import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// 1. Initialize axios with the cache interceptor
const api = setupCache(axios.create(), {
  // Default TTL (e.g., 30 minutes)
  ttl: 1000 * 60 * 30,
  cacheTakeover: false,
});

export const fetchAction = async (
  url: string,
  headers: Record<string, string> = {},
  { useCache = true, ttl = 1800000 } = {},
) => {
  const repoResponse = await api.get(url, {
    headers: headers,
    // 2. Configure caching behavior via the request object
    cache: useCache ? { ttl } : false,
  });
  return repoResponse;
};

export const postAction = async (
  url: string,
  data = {},
  headers: Record<string, string> = {},
) => {
  const response = await api.post(url, data, {
    headers: headers,
    cache: false,
  });
  return response;
};
