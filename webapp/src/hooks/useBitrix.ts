import { useState, useCallback, useEffect } from "react";
import { useCache } from "./useCache";

import type { SearchType, Product, DealRequest, DealResponse } from "../types";

export function useBitrixApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useCache<Product[]>();

  const API_BASE = "http://localhost:4000/api";

  useEffect(() => {
    const interval = setInterval(() => {
      cache.clearExpired();
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [cache]);

  const searchProducts = useCallback(async (type: SearchType, query: string): Promise<Product[]> => {
    if (!query.trim()) return [];

    const cacheKey = `${type}:${query.toLowerCase().trim()}`;

    const cached = cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/catalog/${type}/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      cache.set(cacheKey, data);
      
      return data;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createDeal = useCallback(async (dealData: DealRequest): Promise<DealResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/deals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create deal");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deal");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { searchProducts, createDeal, loading, error, setError };
}
