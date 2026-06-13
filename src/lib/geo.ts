import { IRAN_CITIES, type City } from "./cities";

const EARTH_RADIUS_KM = 6371;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCity(
  lat: number,
  lon: number
): { city: City; distanceKm: number } {
  let best: { city: City; distanceKm: number } | null = null;
  for (const city of IRAN_CITIES) {
    const distanceKm = haversineKm(lat, lon, city.lat, city.lon);
    if (!best || distanceKm < best.distanceKm) {
      best = { city, distanceKm };
    }
  }
  return best as { city: City; distanceKm: number };
}
