import { nearestCity } from "./geo";
import type {
  NormalizedEarthquake,
  Region,
  UsgsEarthquakeCollection,
} from "./types";

const USGS_QUERY_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

// Bounding box covering Iran and its immediate seismic neighborhood.
export const IRAN_BBOX = {
  minlatitude: 24,
  maxlatitude: 40,
  minlongitude: 43,
  maxlongitude: 64,
};

// Slightly wider box used to decide whether to attach a "nearest Iranian city" label
// to earthquakes that occurred outside Iran but close to its borders.
const IRAN_VICINITY_BBOX = {
  minlatitude: IRAN_BBOX.minlatitude - 5,
  maxlatitude: IRAN_BBOX.maxlatitude + 5,
  minlongitude: IRAN_BBOX.minlongitude - 5,
  maxlongitude: IRAN_BBOX.maxlongitude + 5,
};

const DEFAULTS: Record<Region, { hours: number; minMagnitude: number }> = {
  iran: { hours: 24 * 14, minMagnitude: 2.5 },
  world: { hours: 24 * 2, minMagnitude: 4.5 },
};

export interface FetchEarthquakesOptions {
  region: Region;
  hours?: number;
  minMagnitude?: number;
  limit?: number;
}

function isNearIran(lat: number, lon: number): boolean {
  return (
    lat >= IRAN_VICINITY_BBOX.minlatitude &&
    lat <= IRAN_VICINITY_BBOX.maxlatitude &&
    lon >= IRAN_VICINITY_BBOX.minlongitude &&
    lon <= IRAN_VICINITY_BBOX.maxlongitude
  );
}

export async function fetchEarthquakes({
  region,
  hours,
  minMagnitude,
  limit = 200,
}: FetchEarthquakesOptions): Promise<NormalizedEarthquake[]> {
  const defaults = DEFAULTS[region];
  const endTime = new Date();
  const startTime = new Date(
    endTime.getTime() - (hours ?? defaults.hours) * 60 * 60 * 1000
  );

  const params = new URLSearchParams({
    format: "geojson",
    starttime: startTime.toISOString(),
    endtime: endTime.toISOString(),
    minmagnitude: String(minMagnitude ?? defaults.minMagnitude),
    orderby: "time",
    limit: String(limit),
  });

  if (region === "iran") {
    Object.entries(IRAN_BBOX).forEach(([key, value]) => {
      params.set(key, String(value));
    });
  }

  const response = await fetch(`${USGS_QUERY_URL}?${params.toString()}`, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`USGS request failed with status ${response.status}`);
  }

  const data = (await response.json()) as UsgsEarthquakeCollection;

  return data.features.map((feature) => {
    const [longitude, latitude, depth] = feature.geometry.coordinates;
    const properties = feature.properties;

    return {
      id: feature.id,
      magnitude: properties.mag ?? 0,
      magType: properties.magType ?? "",
      place: properties.place ?? "نامشخص",
      time: properties.time,
      updated: properties.updated,
      longitude,
      latitude,
      depth,
      url: properties.url,
      tsunami: properties.tsunami === 1,
      felt: properties.felt,
      status: properties.status,
      significance: properties.sig,
      nearestCity: isNearIran(latitude, longitude)
        ? (() => {
            const { city, distanceKm } = nearestCity(latitude, longitude);
            return { name: city.name, distanceKm: Math.round(distanceKm) };
          })()
        : null,
    } satisfies NormalizedEarthquake;
  });
}
