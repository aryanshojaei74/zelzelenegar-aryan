export interface City {
  name: string;
  lat: number;
  lon: number;
}

// Major Iranian cities used to describe earthquake locations relative to populated areas.
export const IRAN_CITIES: City[] = [
  { name: "تهران", lat: 35.6892, lon: 51.389 },
  { name: "مشهد", lat: 36.2605, lon: 59.6168 },
  { name: "اصفهان", lat: 32.6546, lon: 51.668 },
  { name: "کرج", lat: 35.84, lon: 50.9391 },
  { name: "شیراز", lat: 29.5918, lon: 52.5837 },
  { name: "تبریز", lat: 38.08, lon: 46.2919 },
  { name: "قم", lat: 34.6401, lon: 50.8764 },
  { name: "اهواز", lat: 31.3183, lon: 48.6706 },
  { name: "کرمانشاه", lat: 34.3142, lon: 47.065 },
  { name: "ارومیه", lat: 37.5527, lon: 45.0761 },
  { name: "رشت", lat: 37.2808, lon: 49.5832 },
  { name: "زاهدان", lat: 29.4963, lon: 60.8629 },
  { name: "کرمان", lat: 30.2839, lon: 57.0834 },
  { name: "اراک", lat: 34.0917, lon: 49.6892 },
  { name: "یزد", lat: 31.8974, lon: 54.3569 },
  { name: "بندرعباس", lat: 27.1865, lon: 56.2808 },
  { name: "ساری", lat: 36.5633, lon: 53.0601 },
  { name: "همدان", lat: 34.7992, lon: 48.5146 },
  { name: "بجنورد", lat: 37.4747, lon: 57.329 },
  { name: "بم", lat: 29.106, lon: 58.357 },
  { name: "سرپل ذهاب", lat: 34.5167, lon: 45.8667 },
  { name: "زنجان", lat: 36.6736, lon: 48.4787 },
  { name: "قزوین", lat: 36.28, lon: 50.0041 },
  { name: "بوشهر", lat: 28.9684, lon: 50.8385 },
  { name: "ایلام", lat: 33.6374, lon: 46.4227 },
  { name: "سنندج", lat: 35.3146, lon: 46.9923 },
  { name: "گرگان", lat: 36.8456, lon: 54.4392 },
  { name: "بیرجند", lat: 32.8649, lon: 59.2262 },
];
