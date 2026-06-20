"use client";

import { useEffect, useMemo, useState } from "react";
import { IRAN_CITIES } from "@/lib/cities";
import { nearestCity } from "@/lib/geo";
import { toPersianDigits } from "@/lib/format";

const RADIUS_OPTIONS = [50, 100, 150, 200, 300];

interface CitySelectorProps {
  cityName: string | null;
  radiusKm: number;
  onCityChange: (cityName: string) => void;
  onRadiusChange: (radiusKm: number) => void;
}

export default function CitySelector({
  cityName,
  radiusKm,
  onCityChange,
  onRadiusChange,
}: CitySelectorProps) {
  const [province, setProvince] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  // Sync province chip whenever cityName changes from the parent (geolocation,
  // localStorage rehydration, or picking a city in the dropdown).
  useEffect(() => {
    if (cityName) {
      const found = IRAN_CITIES.find((c) => c.name === cityName);
      if (found) setProvince(found.province);
    }
  }, [cityName]);

  const provinces = useMemo(
    () => Array.from(new Set(IRAN_CITIES.map((c) => c.province))).sort(),
    []
  );

  const filteredCities = useMemo(
    () => (province ? IRAN_CITIES.filter((c) => c.province === province) : IRAN_CITIES),
    [province]
  );

  function handleLocate() {
    if (!navigator.geolocation) {
      setLocError("مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.");
      return;
    }
    setLocating(true);
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { city } = nearestCity(position.coords.latitude, position.coords.longitude);
        onCityChange(city.name);
        setLocating(false);
      },
      () => {
        setLocError("دسترسی به موقعیت رد شد. لطفاً شهر را دستی انتخاب کنید.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  }

  function handleProvinceClick(p: string) {
    setProvince(p);
    // If the current city belongs to a different province, clear it so the
    // controlled <select> doesn't end up with a value that's missing from the
    // filtered option list (which causes the browser to auto-highlight the
    // first option and swallow the next onChange).
    const currentProvince = cityName
      ? IRAN_CITIES.find((c) => c.name === cityName)?.province
      : null;
    if (cityName && currentProvince !== p) {
      onCityChange("");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={handleLocate}
        disabled={locating}
        className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-600 active:scale-95 disabled:opacity-50"
      >
        {locating ? (
          "در حال موقعیت‌یابی..."
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4 shrink-0">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 0 0 .281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 1 0 3 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 0 0 2.273 1.765 11.842 11.842 0 0 0 .976.544l.062.029.018.008.006.003ZM10 11.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" clipRule="evenodd" />
            </svg>
            موقعیت فعلی من
          </>
        )}
      </button>

      {locError && <p className="text-xs text-red-400">{locError}</p>}

      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-slate-500">انتخاب استان</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setProvince(null)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              province === null
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            همه
          </button>
          {provinces.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleProvinceClick(p)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                province === p
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <select
        value={cityName ?? ""}
        onChange={(event) => {
          onCityChange(event.target.value);
        }}
        className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200"
      >
        <option value="" disabled>
          انتخاب شهر...
        </option>
        {filteredCities.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-slate-500">شعاع بررسی زلزله</p>
        <div className="flex flex-wrap gap-2">
          {RADIUS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRadiusChange(option)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                radiusKm === option
                  ? "bg-red-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              تا {toPersianDigits(option)} کیلومتری
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
