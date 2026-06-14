"use client";

import { useEffect, useState } from "react";
import { useMyCity } from "@/hooks/useMyCity";
import { IRAN_CITIES } from "@/lib/cities";
import { formatMagnitude, toPersianDigits } from "@/lib/format";
import type { CityFilter, Region } from "@/lib/types";
import CitySelector from "./CitySelector";

const MAGNITUDE_OPTIONS = [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];
type AlertMode = "region" | "city";

function buildCityFilter(mode: AlertMode, cityName: string | null, radiusKm: number): CityFilter | null {
  if (mode !== "city" || !cityName) return null;
  const city = IRAN_CITIES.find((candidate) => candidate.name === cityName);
  if (!city) return null;
  return { name: city.name, lat: city.lat, lon: city.lon, radiusKm };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [region, setRegion] = useState<Region>("iran");
  const [minMagnitude, setMinMagnitude] = useState(4);
  const [alertMode, setAlertMode] = useState<AlertMode>("region");
  const { cityName, setCityName, radiusKm, setRadiusKm } = useMyCity();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Push/service-worker support can only be detected after mount (browser-only APIs).
    /* eslint-disable react-hooks/set-state-in-effect */
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setReady(true);
      return;
    }
    setIsSupported(true);
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((sub) => setSubscription(sub))
      .finally(() => setReady(true));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  async function saveSettings(
    sub: PushSubscription,
    nextRegion: Region,
    nextMinMagnitude: number,
    nextCity: CityFilter | null
  ) {
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscription: sub.toJSON(),
        settings: { region: nextRegion, minMagnitude: nextMinMagnitude, city: nextCity },
      }),
    });
  }

  async function subscribe() {
    setBusy(true);
    setStatus(null);
    try {
      const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!publicKey) {
        setStatus("کلید عمومی VAPID روی سرور تنظیم نشده است.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("اجازه ارسال اعلان داده نشد.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await saveSettings(sub, region, minMagnitude, buildCityFilter(alertMode, cityName, radiusKm));
      setSubscription(sub);
      setStatus("هشدارهای زلزله فعال شد.");
    } catch (error) {
      console.error("Failed to subscribe to push notifications", error);
      setStatus("فعال‌سازی هشدار با خطا مواجه شد.");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    if (!subscription) return;
    setBusy(true);
    setStatus(null);
    try {
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      await subscription.unsubscribe();
      setSubscription(null);
      setStatus("هشدارهای زلزله غیرفعال شد.");
    } catch (error) {
      console.error("Failed to unsubscribe from push notifications", error);
      setStatus("غیرفعال‌سازی هشدار با خطا مواجه شد.");
    } finally {
      setBusy(false);
    }
  }

  async function sendTest() {
    if (!subscription) return;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch("/api/push/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
      const data = await response.json();
      setStatus(response.ok ? "اعلان آزمایشی ارسال شد." : data.error ?? "ارسال اعلان ناموفق بود.");
    } catch (error) {
      console.error("Failed to send test notification", error);
      setStatus("ارسال اعلان آزمایشی ناموفق بود.");
    } finally {
      setBusy(false);
    }
  }

  function handleRegionChange(nextRegion: Region) {
    setRegion(nextRegion);
    if (subscription) {
      saveSettings(subscription, nextRegion, minMagnitude, buildCityFilter(alertMode, cityName, radiusKm));
    }
  }

  function handleMagnitudeChange(value: number) {
    setMinMagnitude(value);
    if (subscription) {
      saveSettings(subscription, region, value, buildCityFilter(alertMode, cityName, radiusKm));
    }
  }

  function handleAlertModeChange(mode: AlertMode) {
    setAlertMode(mode);
    if (subscription) {
      saveSettings(subscription, region, minMagnitude, buildCityFilter(mode, cityName, radiusKm));
    }
  }

  function handleAlertCityChange(nextCityName: string) {
    setCityName(nextCityName);
    if (subscription) {
      saveSettings(subscription, region, minMagnitude, buildCityFilter(alertMode, nextCityName, radiusKm));
    }
  }

  function handleAlertRadiusChange(nextRadiusKm: number) {
    setRadiusKm(nextRadiusKm);
    if (subscription) {
      saveSettings(subscription, region, minMagnitude, buildCityFilter(alertMode, cityName, nextRadiusKm));
    }
  }

  if (!ready) {
    return <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-400">در حال بررسی وضعیت اعلان‌ها...</div>;
  }

  if (!isSupported) {
    return (
      <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">
        مرورگر یا دستگاه شما از اعلان‌های فشاری پشتیبانی نمی‌کند. در آیفون، ابتدا اپلیکیشن را به صفحه اصلی
        اضافه کنید و سپس از همان‌جا باز کنید.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-900 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">دریافت هشدار زلزله</p>
          <p className="text-xs text-slate-400">
            وضعیت: {subscription ? "فعال" : "غیرفعال"}
          </p>
        </div>
        <button
          type="button"
          onClick={subscription ? unsubscribe : subscribe}
          disabled={busy}
          className={`rounded-full px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
            subscription ? "bg-slate-800 text-slate-200" : "bg-red-600 text-white"
          }`}
        >
          {subscription ? "غیرفعال‌سازی" : "فعال‌سازی"}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-300">نوع هشدار</p>
        <div className="inline-flex rounded-full bg-slate-800 p-1 text-sm">
          {(["region", "city"] as AlertMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => handleAlertModeChange(mode)}
              className={`rounded-full px-4 py-1.5 font-medium transition ${
                alertMode === mode ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {mode === "region" ? "بر اساس منطقه" : "فقط شهر من"}
            </button>
          ))}
        </div>
      </div>

      {alertMode === "region" ? (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-300">منطقه دریافت هشدار</p>
          <div className="inline-flex rounded-full bg-slate-800 p-1 text-sm">
            {(["iran", "world"] as Region[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRegionChange(value)}
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  region === value ? "bg-red-600 text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {value === "iran" ? "ایران" : "جهان"}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-300">
            فقط زلزله‌های نزدیک شهر انتخاب‌شده هشدار می‌دهند.
          </p>
          <CitySelector
            cityName={cityName}
            radiusKm={radiusKm}
            onCityChange={handleAlertCityChange}
            onRadiusChange={handleAlertRadiusChange}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-300">
          حداقل بزرگی زلزله برای دریافت هشدار: <span className="font-bold">{formatMagnitude(minMagnitude)}</span>
        </p>
        <input
          type="range"
          min={0}
          max={MAGNITUDE_OPTIONS.length - 1}
          step={1}
          value={MAGNITUDE_OPTIONS.indexOf(minMagnitude)}
          onChange={(event) => handleMagnitudeChange(MAGNITUDE_OPTIONS[Number(event.target.value)])}
          className="w-full accent-red-600"
        />
        <div className="flex justify-between text-xs text-slate-500">
          <span>{toPersianDigits(MAGNITUDE_OPTIONS[0])}</span>
          <span>{toPersianDigits(MAGNITUDE_OPTIONS[MAGNITUDE_OPTIONS.length - 1])}</span>
        </div>
      </div>

      {subscription && (
        <button
          type="button"
          onClick={sendTest}
          disabled={busy}
          className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
        >
          ارسال اعلان آزمایشی
        </button>
      )}

      {status && <p className="text-sm text-slate-300">{status}</p>}
    </div>
  );
}
