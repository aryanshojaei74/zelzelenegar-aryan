import type { NextRequest } from "next/server";
import { upsertSubscription } from "@/lib/store";
import type { AlertSettings, CityFilter } from "@/lib/types";
import type { PushSubscription } from "web-push";

interface SubscribeBody {
  subscription?: PushSubscription;
  settings?: Partial<AlertSettings>;
}

function normalizeCity(raw: unknown): CityFilter | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  if (
    typeof value.name !== "string" ||
    typeof value.lat !== "number" ||
    typeof value.lon !== "number" ||
    typeof value.radiusKm !== "number"
  ) {
    return null;
  }
  return { name: value.name, lat: value.lat, lon: value.lon, radiusKm: value.radiusKm };
}

export async function POST(request: NextRequest) {
  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  const { subscription, settings } = body;

  if (!subscription?.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
    return Response.json({ error: "اطلاعات اشتراک نامعتبر است." }, { status: 400 });
  }

  const normalizedSettings: AlertSettings = {
    region: settings?.region === "world" ? "world" : "iran",
    minMagnitude:
      typeof settings?.minMagnitude === "number" ? settings.minMagnitude : 4,
    city: normalizeCity(settings?.city),
  };

  await upsertSubscription(subscription, normalizedSettings);

  return Response.json({ success: true });
}
