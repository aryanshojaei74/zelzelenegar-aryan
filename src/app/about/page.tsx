export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 text-sm leading-7 text-slate-300">
      <div>
        <h2 className="text-lg font-bold text-slate-100">درباره زلزله‌نگار آریان</h2>
        <p className="mt-1">
          زلزله‌نگار آریان یک اپلیکیشن وب (PWA) است که اطلاعات زلزله‌های ایران و جهان را به‌صورت لحظه‌ای
          نمایش می‌دهد و در صورت فعال‌سازی، برای زلزله‌های مهم به کاربر هشدار ارسال می‌کند.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4">
        <h3 className="font-semibold text-slate-100">منبع داده</h3>
        <p className="mt-1">
          داده‌های زلزله از سرویس عمومی{" "}
          <a
            href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php"
            target="_blank"
            rel="noreferrer"
            className="text-red-400 underline"
          >
            USGS Earthquake Hazards Program
          </a>{" "}
          دریافت می‌شود. موقعیت شهرهای ایران نیز برای محاسبه نزدیک‌ترین شهر به کانون زلزله استفاده
          می‌شود.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4">
        <h3 className="font-semibold text-slate-100">راهنمای رنگ‌ها</h3>
        <ul className="mt-2 flex flex-col gap-1">
          <li>🟢 خرد — کمتر از ۳ ریشتر</li>
          <li>🟡 کوچک — بین ۳ تا ۴ ریشتر</li>
          <li>🟠 متوسط — بین ۴ تا ۵ ریشتر</li>
          <li>🔴 نسبتاً قوی — بین ۵ تا ۶ ریشتر</li>
          <li>🟥 قوی — بین ۶ تا ۷ ریشتر</li>
          <li>🟣 فاجعه‌بار — ۷ ریشتر و بیشتر</li>
        </ul>
      </div>

      <div className="rounded-2xl bg-slate-900 p-4">
        <h3 className="font-semibold text-slate-100">سلب مسئولیت</h3>
        <p className="mt-1">
          این اپلیکیشن یک ابزار اطلاع‌رسانی غیررسمی است و جایگزین هشدارهای رسمی سازمان‌های مدیریت
          بحران و مرکز لرزه‌نگاری کشور نیست. در صورت احساس لرزش، نکات ایمنی را رعایت کنید.
        </p>
      </div>
    </div>
  );
}
