"use client";

import "leaflet/dist/leaflet.css";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import {
  formatDepthKm,
  formatDistanceKm,
  formatMagnitude,
  formatRelativeTime,
} from "@/lib/format";
import { getMagnitudeLevel } from "@/lib/magnitude";
import type { NormalizedEarthquake, Region } from "@/lib/types";

const REGION_CENTER: Record<Region, [number, number]> = {
  iran: [32.5, 53],
  world: [20, 30],
};

const REGION_ZOOM: Record<Region, number> = {
  iran: 5,
  world: 2,
};

export default function LeafletMap({
  earthquakes,
  region,
}: {
  earthquakes: NormalizedEarthquake[];
  region: Region;
}) {
  return (
    <MapContainer
      key={region}
      center={REGION_CENTER[region]}
      zoom={REGION_ZOOM[region]}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {earthquakes.map((quake) => {
        const level = getMagnitudeLevel(quake.magnitude);
        const radius = Math.max(4, quake.magnitude * 2.5);

        return (
          <CircleMarker
            key={quake.id}
            center={[quake.latitude, quake.longitude]}
            radius={radius}
            pathOptions={{
              color: level.background,
              fillColor: level.background,
              fillOpacity: 0.6,
              weight: 1,
            }}
          >
            <Popup>
              <div dir="rtl" className="text-right">
                <p className="font-bold">{formatMagnitude(quake.magnitude)} ریشتر</p>
                {quake.nearestCity && (
                  <p>
                    {formatDistanceKm(quake.nearestCity.distanceKm)} از {quake.nearestCity.name}
                  </p>
                )}
                <p className="text-xs">{quake.place}</p>
                <p className="text-xs">عمق {formatDepthKm(quake.depth)}</p>
                <p className="text-xs">{formatRelativeTime(quake.time)}</p>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
