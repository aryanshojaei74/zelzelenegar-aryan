"use client";

import { useEffect, useState } from "react";
import { IRAN_CITIES, type City } from "@/lib/cities";

const STORAGE_KEY = "zelzelenegar:my-city";
export const DEFAULT_RADIUS_KM = 100;

interface StoredMyCity {
  cityName: string | null;
  radiusKm: number;
}

interface UseMyCityResult {
  city: City | null;
  cityName: string | null;
  setCityName: (cityName: string) => void;
  radiusKm: number;
  setRadiusKm: (radiusKm: number) => void;
}

export function useMyCity(): UseMyCityResult {
  const [cityName, setCityName] = useState<string | null>(null);
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StoredMyCity>;
        if (typeof parsed.cityName === "string") setCityName(parsed.cityName);
        if (typeof parsed.radiusKm === "number") setRadiusKm(parsed.radiusKm);
      }
    } catch {
      // ignore invalid stored data
    }
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const data: StoredMyCity = { cityName, radiusKm };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [cityName, radiusKm, loaded]);

  const city = cityName ? IRAN_CITIES.find((c) => c.name === cityName) ?? null : null;

  return { city, cityName, setCityName, radiusKm, setRadiusKm };
}
