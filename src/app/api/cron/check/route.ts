import type { NextRequest } from "next/server";
import { fetchEarthquakes } from "@/lib/earthquakes";
import { formatDistanceKm, formatMagnitude } from "@/lib/format";
import { haversineKm } from "@/lib/geo";
import { getWebPush, isPushConfigured } from "@/lib/push";
import {
  getAllSubscriptions,
  getLastCheckTime,
  removeSubscription,
  setLastCheckTime,
} from "@/lib/store";
import type { NormalizedEarthquake } from "@/lib/types";

export const dynamic = "force-dynamic";

interface WebPushError {
  statusCode?: number;
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  if (!isPushConfigured()) {
    return Response.json({ skipped: true, reason: "VAPID keys not configured" });
  }

  const now = Date.now();
  const lastCheck = await getLastCheckTime();

  const [iranQuakes, worldQuakes] = await Promise.all([
    fetchEarthquakes({ region: "iran", minMagnitude: 2, hours: 6 }),
    fetchEarthquakes({ region: "world", minMagnitude: 4, hours: 6 }),
  ]);

  const seen = new Set<string>();
  const newQuakes: NormalizedEarthquake[] = [];
  for (const quake of [...iranQuakes, ...worldQuakes]) {
    if (quake.time > lastCheck && !seen.has(quake.id)) {
      seen.add(quake.id);
      newQuakes.push(quake);
    }
  }

  const subscriptions = await getAllSubscriptions();
  const webpush = getWebPush();
  let sent = 0;

  for (const sub of subscriptions) {
    const cityFilter = sub.settings.city;

    const relevant = newQuakes.filter((quake) => {
      if (quake.magnitude < sub.settings.minMagnitude) return false;
      if (cityFilter) {
        const distanceKm = haversineKm(quake.latitude, quake.longitude, cityFilter.lat, cityFilter.lon);
        return distanceKm <= cityFilter.radiusKm;
      }
      if (sub.settings.region === "iran" && !quake.nearestCity) return false;
      return true;
    });

    for (const quake of relevant) {
      let location: string;
      if (cityFilter) {
        const distanceKm = haversineKm(quake.latitude, quake.longitude, cityFilter.lat, cityFilter.lon);
        location = `${formatDistanceKm(distanceKm)} از ${cityFilter.name}`;
      } else if (quake.nearestCity) {
        location = `${quake.nearestCity.distanceKm} کیلومتری ${quake.nearestCity.name}`;
      } else {
        location = quake.place;
      }

      try {
        await webpush.sendNotification(
          sub.subscription,
          JSON.stringify({
            title: `زلزله ${formatMagnitude(quake.magnitude)} ریشتری`,
            body: location,
            url: "/",
          })
        );
        sent += 1;
      } catch (error) {
        const webPushError = error as WebPushError;
        if (webPushError.statusCode === 404 || webPushError.statusCode === 410) {
          await removeSubscription(sub.subscription.endpoint);
        } else {
          console.error("Failed to send earthquake push notification", error);
        }
      }
    }
  }

  await setLastCheckTime(now);

  return Response.json({
    checkedQuakes: newQuakes.length,
    subscriptions: subscriptions.length,
    notificationsSent: sent,
  });
}
