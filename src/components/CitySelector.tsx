"use client";

import { IRAN_CITIES } from "@/lib/cities";
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
  return (
    <div className="flex flex-col gap-2">
      <select
        value={cityName ?? ""}
        onChange={(event) => onCityChange(event.target.value)}
        className="w-full rounded-xl bg-slate-800 px-3 py-2 text-sm text-slate-200"
      >
        <option value="" disabled>
          انتخاب شهر...
        </option>
        {IRAN_CITIES.map((city) => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

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
  );
}
