import {
  formatDepthKm,
  formatDistanceKm,
  formatPersianDateTime,
  formatRelativeTime,
} from "@/lib/format";
import { getMagnitudeLevel } from "@/lib/magnitude";
import type { NormalizedEarthquake } from "@/lib/types";
import MagnitudeBadge from "./MagnitudeBadge";

export default function EarthquakeCard({ quake }: { quake: NormalizedEarthquake }) {
  const level = getMagnitudeLevel(quake.magnitude);

  return (
    <a
      href={quake.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-2xl bg-slate-900 p-4 ring-1 ring-white/5 transition hover:ring-white/20"
    >
      <MagnitudeBadge magnitude={quake.magnitude} />

      <div className="min-w-0 flex-1">
        {quake.nearestCity ? (
          <p className="truncate font-semibold text-slate-100">
            {formatDistanceKm(quake.nearestCity.distanceKm)} از {quake.nearestCity.name}
          </p>
        ) : (
          <p className="truncate font-semibold text-slate-100">{quake.place}</p>
        )}
        {quake.nearestCity && (
          <p className="truncate text-xs text-slate-500">{quake.place}</p>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
          <span>عمق {formatDepthKm(quake.depth)}</span>
          <span title={formatPersianDateTime(quake.time)}>
            {formatRelativeTime(quake.time)}
          </span>
          <span style={{ color: level.background }} className="font-medium">
            {level.label}
          </span>
        </div>
      </div>

      {quake.tsunami && (
        <span className="shrink-0 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-medium text-white">
          هشدار تسونامی
        </span>
      )}
    </a>
  );
}
