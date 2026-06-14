export type Region = "iran" | "world";

export interface UsgsEarthquakeProperties {
  mag: number | null;
  place: string | null;
  time: number;
  updated: number;
  url: string;
  felt: number | null;
  alert: string | null;
  status: string;
  tsunami: number;
  sig: number;
  magType: string | null;
  type: string;
  title: string;
}

export interface UsgsEarthquakeFeature {
  type: "Feature";
  properties: UsgsEarthquakeProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
  };
  id: string;
}

export interface UsgsEarthquakeCollection {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    count: number;
  };
  features: UsgsEarthquakeFeature[];
}

export interface NearestCity {
  name: string;
  distanceKm: number;
}

export interface NormalizedEarthquake {
  id: string;
  magnitude: number;
  magType: string;
  place: string;
  time: number;
  updated: number;
  longitude: number;
  latitude: number;
  depth: number;
  url: string;
  tsunami: boolean;
  felt: number | null;
  status: string;
  significance: number;
  nearestCity: NearestCity | null;
}

export interface CityFilter {
  name: string;
  lat: number;
  lon: number;
  radiusKm: number;
}

export interface AlertSettings {
  region: Region;
  minMagnitude: number;
  city: CityFilter | null;
}

export interface EarthquakesResponse {
  earthquakes: NormalizedEarthquake[];
  generatedAt: number;
}
