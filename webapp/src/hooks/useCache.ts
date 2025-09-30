import { useRef, useCallback } from "react";

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function useCache<T>(defaultTTL = 5 * 60 * 1000) {
  const cache = useRef(new Map<string, CacheItem<T>>());

  const get = useCallback((key: string): T | null => {
    const item = cache.current.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      cache.current.delete(key);
      return null;
    }

    return item.data;
  }, []);

  const set = useCallback(
    (key: string, data: T, ttl: number = defaultTTL) => {
      cache.current.set(key, {
        data,
        timestamp: Date.now(),
        ttl,
      });
    },
    [defaultTTL]
  );

  const clear = useCallback(() => {
    cache.current.clear();
  }, []);

  const clearExpired = useCallback(() => {
    const now = Date.now();
    for (const [key, item] of cache.current.entries()) {
      if (now - item.timestamp > item.ttl) {
        cache.current.delete(key);
      }
    }
  }, []);

  return { get, set, clear, clearExpired };
}
