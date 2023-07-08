import { CACHE_EXPIRATION_TIME } from '../constants';

const cache: { [key: string]: { value: number; timestamp:number} } = {};

export const getCache = (key: string) => {
  const cacheEntry = cache[key];
  if (cacheEntry && Date.now() - cacheEntry.timestamp < (CACHE_EXPIRATION_TIME as number) * 1000) {
    return cacheEntry.value;
  }
  return undefined;
};

export const setCache = (key: string, value: number) => {
  cache[key] = {
    value,
    timestamp: Date.now(),
  };
};
