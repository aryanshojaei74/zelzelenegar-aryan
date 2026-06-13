import type { NextRequest } from "next/server";
import { fetchEarthquakes } from "@/lib/earthquakes";
import type { Region } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region: Region = searchParams.get("region") === "world" ? "world" : "iran";
  const minMagnitudeParam = searchParams.get("minMagnitude");
  const hoursParam = searchParams.get("hours");

  try {
    const earthquakes = await fetchEarthquakes({
      region,
      minMagnitude: minMagnitudeParam ? Number(minMagnitudeParam) : undefined,
      hours: hoursParam ? Number(hoursParam) : undefined,
    });

    return Response.json({
      earthquakes,
      generatedAt: Date.now(),
    });
  } catch (error) {
    console.error("Failed to fetch earthquakes from USGS", error);
    return Response.json(
      { error: "دریافت اطلاعات زلزله از سرویس USGS با خطا مواجه شد." },
      { status: 502 }
    );
  }
}
