import { IRAN_CITIES, type City } from "./cities";

const EARTH_RADIUS_KM = 6371;

// Province capitals — these are weighted heavily so earthquake reports prefer
// recognizable major cities over geographically closer but unknown small towns.
const PROVINCE_CAPITALS = new Set([
  "تبریز", "ارومیه", "اردبیل", "اصفهان", "کرج", "ایلام", "بوشهر",
  "تهران", "شهرکرد", "بیرجند", "مشهد", "بجنورد", "اهواز", "زنجان",
  "سمنان", "زاهدان", "شیراز", "قزوین", "قم", "سنندج", "کرمان",
  "کرمانشاه", "یاسوج", "گرگان", "رشت", "خرم‌آباد", "ساری", "اراک",
  "بندرعباس", "همدان", "یزد",
]);

// Minor cities need to be this many times closer than a province capital to win.
// E.g. with 3.5: a small town at 35 km is only preferred over a provincial
// capital if that capital is farther than 35 × 3.5 = 122.5 km.
const MINOR_CITY_WEIGHT = 3.5;

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
  let bestEffective = Infinity;
  for (const city of IRAN_CITIES) {
    const distanceKm = haversineKm(lat, lon, city.lat, city.lon);
    const effective = PROVINCE_CAPITALS.has(city.name)
      ? distanceKm
      : distanceKm * MINOR_CITY_WEIGHT;
    if (effective < bestEffective) {
      best = { city, distanceKm };
      bestEffective = effective;
    }
  }
  return best as { city: City; distanceKm: number };
}
