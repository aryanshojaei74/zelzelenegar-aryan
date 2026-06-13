"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useEarthquakes } from "@/hooks/useEarthquakes";
import type { Region } from "@/lib/types";
import RegionToggle from "./RegionToggle";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-slate-400">
      در حال بارگذاری نقشه...
    </div>
  ),
});

export default function EarthquakeMap() {
  const [region, setRegion] = useState<Region>("iran");
  const { earthquakes, loading, error } = useEarthquakes(region);

  return (
    <div className="flex h-[calc(100dvh-9rem)] flex-col gap-3 px-4 py-4">
      <div className="flex items-center justify-between">
        <RegionToggle region={region} onChange={setRegion} />
        {loading && <span className="text-xs text-slate-400">در حال به‌روزرسانی...</span>}
      </div>

      {error && (
        <p className="rounded-xl bg-red-950 p-3 text-center text-sm text-red-300">{error}</p>
      )}

      <div className="flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10">
        <LeafletMap earthquakes={earthquakes} region={region} />
      </div>
    </div>
  );
}
