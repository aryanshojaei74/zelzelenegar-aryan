"use client";

import { useMemo, useState } from "react";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import { useMyCity } from "@/hooks/useMyCity";
import { haversineKm } from "@/lib/geo";
import { formatMagnitude, formatRelativeTime, toPersianDigits } from "@/lib/format";
import type { Region } from "@/lib/types";
import CitySelector from "./CitySelector";
import EarthquakeCard from "./EarthquakeCard";
import RegionToggle from "./RegionToggle";

export default function EarthquakeList() {
  const [region, setRegion] = useState<Region>("iran");
  const [nearMeOnly, setNearMeOnly] = useState(false);
  const { earthquakes, loading, error, generatedAt, refresh } = useEarthquakes(region);
  const { city, cityName, setCityName, radiusKm, setRadiusKm } = useMyCity();

  const visibleEarthquakes = useMemo(() => {
    if (!nearMeOnly || !city) return earthquakes;
    return earthquakes.filter(
      (quake) => haversineKm(quake.latitude, quake.longitude, city.lat, city.lon) <= radiusKm
    );
  }, [earthquakes, nearMeOnly, city, radiusKm]);

  const strongest = useMemo(() => {
    if (visibleEarthquakes.length === 0) return null;
    return visibleEarthquakes.reduce((max, quake) =>
      quake.magnitude > max.magnitude ? quake : max
    );
  }, [visibleEarthquakes]);

  const periodLabel = region === "iran" ? "در ۱۴ روز گذشته" : "در ۴۸ ساعت گذشته";

  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div className="flex items-center justify-between">
        <RegionToggle region={region} onChange={setRegion} />
        <button
          type="button"
          onClick={refresh}
          className="rounded-full px-3 py-1.5 text-xs text-slate-400 ring-1 ring-white/10 transition hover:text-slate-200"
        >
          به‌روزرسانی
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setNearMeOnly((value) => !value)}
          className={`self-start rounded-full px-4 py-1.5 text-sm font-medium transition ${
            nearMeOnly ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          {nearMeOnly ? "نمایش همه زلزله‌ها" : "فقط نزدیک شهر من"}
        </button>

        {nearMeOnly && (
          <CitySelector
            cityName={cityName}
            radiusKm={radiusKm}
            onCityChange={setCityName}
            onRadiusChange={setRadiusKm}
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-900 p-3 text-center">
          <p className="text-2xl font-extrabold">{toPersianDigits(visibleEarthquakes.length)}</p>
          <p className="text-xs text-slate-400">
            زلزله {nearMeOnly && city ? `نزدیک ${city.name}` : ""} {periodLabel}
          </p>
        </div>
        <div className="rounded-xl bg-slate-900 p-3 text-center">
          <p className="text-2xl font-extrabold">
            {strongest ? formatMagnitude(strongest.magnitude) : "—"}
          </p>
          <p className="text-xs text-slate-400">بزرگ‌ترین زلزله</p>
        </div>
      </div>

      {generatedAt && (
        <p className="text-center text-xs text-slate-500">
          آخرین به‌روزرسانی: {formatRelativeTime(generatedAt)}
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-950 p-3 text-center text-sm text-red-300">{error}</p>
      )}

      {nearMeOnly && !city ? (
        <p className="py-8 text-center text-sm text-slate-400">
          برای نمایش زلزله‌های نزدیک، ابتدا شهر خود را از لیست بالا انتخاب کنید.
        </p>
      ) : loading && visibleEarthquakes.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">در حال دریافت اطلاعات زلزله...</p>
      ) : visibleEarthquakes.length === 0 && !error ? (
        <p className="py-8 text-center text-sm text-slate-400">
          در بازه زمانی انتخاب‌شده زلزله‌ای ثبت نشده است.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visibleEarthquakes.map((quake) => (
            <EarthquakeCard key={quake.id} quake={quake} />
          ))}
        </div>
      )}
    </div>
  );
}
