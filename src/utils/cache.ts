import { CACHE_EXPIRATION_TIME } from '../constants';

// Define a cache object to store key-value pairs
const cache: { [key: string]: { value: number; timestamp:number} } = {};

// Retrieve a value from the cache based on the key
export const getCache = (key: string) => {
  const cacheEntry = cache[key];

  // Check if the cache entry exists and if it has not expired
  if (cacheEntry && Date.now() - cacheEntry.timestamp < (CACHE_EXPIRATION_TIME as number) * 1000) {
    return cacheEntry.value;
  }
  return undefined; // Return undefined if the cache entry doesn't exist or has expired
};

// Set a value in the cache for the specified key
export const setCache = (key: string, value: number) => {
  cache[key] = {
    value, // Set the value for the cache entry
    timestamp: Date.now(), // Record the current timestamp for expiration calculation
  };
};
