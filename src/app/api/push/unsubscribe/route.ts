import type { NextRequest } from "next/server";
import { removeSubscription } from "@/lib/store";

export async function POST(request: NextRequest) {
  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "بدنه درخواست نامعتبر است." }, { status: 400 });
  }

  if (!body.endpoint) {
    return Response.json({ error: "آدرس اشتراک ارسال نشده است." }, { status: 400 });
  }

  await removeSubscription(body.endpoint);

  return Response.json({ success: true });
}
