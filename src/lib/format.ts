const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function formatMagnitude(magnitude: number): string {
  return toPersianDigits(magnitude.toFixed(1));
}

export function formatDepthKm(depth: number): string {
  return `${toPersianDigits(Math.round(depth))} کیلومتر`;
}

export function formatDistanceKm(distanceKm: number): string {
  return `${toPersianDigits(Math.round(distanceKm))} کیلومتر`;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("fa", {
  numeric: "auto",
});

const RELATIVE_DIVISIONS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 60 * 60 * 24 * 365 },
  { unit: "month", seconds: 60 * 60 * 24 * 30 },
  { unit: "day", seconds: 60 * 60 * 24 },
  { unit: "hour", seconds: 60 * 60 },
  { unit: "minute", seconds: 60 },
  { unit: "second", seconds: 1 },
];

export function formatRelativeTime(timestamp: number, now: number = Date.now()): string {
  const diffSeconds = Math.round((timestamp - now) / 1000);
  for (const { unit, seconds } of RELATIVE_DIVISIONS) {
    if (Math.abs(diffSeconds) >= seconds || unit === "second") {
      return relativeTimeFormatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return relativeTimeFormatter.format(0, "second");
}

const persianDateTimeFormatter = new Intl.DateTimeFormat("fa-IR", {
  calendar: "persian",
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Asia/Tehran",
});

export function formatPersianDateTime(timestamp: number): string {
  return persianDateTimeFormatter.format(new Date(timestamp));
}
