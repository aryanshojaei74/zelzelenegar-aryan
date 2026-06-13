import type { NextRequest } from "next/server";
import { getAllSubscriptions, removeSubscription } from "@/lib/store";
import { getWebPush, isPushConfigured } from "@/lib/push";

interface WebPushError {
  statusCode?: number;
}

export async function POST(request: NextRequest) {
  if (!isPushConfigured()) {
    return Response.json(
      { error: "کلیدهای VAPID روی سرور تنظیم نشده‌اند." },
      { status: 500 }
    );
  }

  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  if (!body.endpoint) {
    return Response.json({ error: "آدرس اشتراک ارسال نشده است." }, { status: 400 });
  }

  const subscriptions = await getAllSubscriptions();
  const target = subscriptions.find((entry) => entry.subscription.endpoint === body.endpoint);

  if (!target) {
    return Response.json({ error: "اشتراکی با این مشخصات پیدا نشد." }, { status: 404 });
  }

  const webpush = getWebPush();

  try {
    await webpush.sendNotification(
      target.subscription,
      JSON.stringify({
        title: "زلزله‌نگار آریان",
        body: "این یک پیام آزمایشی است. هشدارهای زلزله به همین شکل برای شما ارسال می‌شوند.",
        url: "/alerts",
      })
    );
    return Response.json({ success: true });
  } catch (error) {
    const webPushError = error as WebPushError;
    if (webPushError.statusCode === 404 || webPushError.statusCode === 410) {
      await removeSubscription(body.endpoint);
      return Response.json(
        { error: "اشتراک منقضی شده و حذف شد. لطفاً دوباره فعال‌سازی کنید." },
        { status: 410 }
      );
    }
    console.error("Failed to send test push notification", error);
    return Response.json({ error: "ارسال اعلان آزمایشی با خطا مواجه شد." }, { status: 500 });
  }
}
