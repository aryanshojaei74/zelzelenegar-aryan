"use client";

import { useCallback, useEffect, useState } from "react";
import type { NormalizedEarthquake, Region } from "@/lib/types";

const REFRESH_INTERVAL_MS = 60_000;

interface UseEarthquakesResult {
  earthquakes: NormalizedEarthquake[];
  loading: boolean;
  error: string | null;
  generatedAt: number | null;
  refresh: () => void;
}

export function useEarthquakes(region: Region): UseEarthquakesResult {
  const [earthquakes, setEarthquakes] = useState<NormalizedEarthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const response = await fetch(`/api/earthquakes?region=${region}`, {
          cache: "no-store",
        });
        const data = await response.json();
        if (cancelled) return;

        if (!response.ok) {
          setError(data.error ?? "خطایی رخ داده است.");
          return;
        }

        setEarthquakes(data.earthquakes);
        setGeneratedAt(data.generatedAt);
        setError(null);
      } catch {
        if (!cancelled) {
          setError("ارتباط با سرور برقرار نشد.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    const interval = setInterval(load, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [region, reloadToken]);

  return { earthquakes, loading, error, generatedAt, refresh };
}
