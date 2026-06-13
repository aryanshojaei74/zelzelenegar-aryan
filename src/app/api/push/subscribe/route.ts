import type { NextRequest } from "next/server";
import { upsertSubscription } from "@/lib/store";
import type { AlertSettings } from "@/lib/types";
import type { PushSubscription } from "web-push";

interface SubscribeBody {
  subscription?: PushSubscription;
  settings?: Partial<AlertSettings>;
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
  };

  await upsertSubscription(subscription, normalizedSettings);

  return Response.json({ success: true });
}
