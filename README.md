# زلزله‌نگار آریان (Zelzelenegar Aryan)

اپلیکیشن وب پیشرفته (PWA) برای رصد لحظه‌ای زلزله‌های ایران و جهان، با قابلیت
نصب روی اندروید و آیفون و دریافت هشدار زلزله از طریق Web Push.

🔗 **نسخه آنلاین:** [zelzelenegar-aryan.vercel.app](https://zelzelenegar-aryan.vercel.app)

## ویژگی‌ها

- نمایش لیست زلزله‌های اخیر ایران (با نام نزدیک‌ترین شهر و فاصله) و جهان
- ثبت «شهر من» و فیلتر کردن لیست برای نمایش فقط زلزله‌های نزدیک شهر شما (با شعاع قابل تنظیم)
- نقشه تعاملی زلزله‌ها (Leaflet + OpenStreetMap)
- رابط کاربری کاملاً فارسی و راست‌به‌چپ
- قابل نصب روی صفحه اصلی اندروید/آیفون (PWA)
- هشدار زلزله از طریق Web Push با تنظیم آستانه بزرگی، و دو حالت: بر اساس منطقه
  (ایران/جهان) یا فقط زلزله‌های نزدیک شهر شما

## شروع توسعه

```bash
npm install
npm run dev
```

سپس [http://localhost:3000](http://localhost:3000) را باز کنید.

## تنظیم هشدارهای Push (Web Push / VAPID)

برای فعال شدن هشدارها باید کلیدهای VAPID تنظیم شوند:

```bash
npx web-push generate-vapid-keys
```

مقادیر را در فایل `.env.local` قرار دهید (نمونه در `.env.example`):

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_CONTACT_EMAIL=mailto:you@example.com
CRON_SECRET=یک-رشته-تصادفی
```

## منبع داده

داده‌های زلزله از [USGS Earthquake Hazards Program](https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php)
از طریق `src/lib/earthquakes.ts` دریافت می‌شود:

- **ایران**: زلزله‌های با بزرگی ≥ ۲.۵ در محدوده جغرافیایی ایران، در ۱۴ روز گذشته
- **جهان**: زلزله‌های با بزرگی ≥ ۴.۵ در سراسر جهان، در ۴۸ ساعت گذشته

## معماری

```
src/
  app/
    page.tsx              صفحه اصلی (لیست زلزله‌ها)
    map/page.tsx          صفحه نقشه
    alerts/page.tsx        صفحه هشدارها
    about/page.tsx         درباره
    manifest.ts            مانیفست PWA
    icon.tsx, apple-icon.tsx  آیکون‌های مولد
    api/
      earthquakes/route.ts       دریافت داده از USGS
      push/subscribe/route.ts    ثبت اشتراک Push
      push/unsubscribe/route.ts  حذف اشتراک
      push/test/route.ts         ارسال اعلان آزمایشی
      cron/check/route.ts        بررسی دوره‌ای زلزله‌های جدید و ارسال هشدار
  components/              کامپوننت‌های UI
  hooks/useEarthquakes.ts   هوک دریافت و رفرش داده
  lib/                      منطق هسته (USGS، جغرافیا، فرمت‌دهی، ذخیره‌سازی)
public/sw.js                Service Worker برای دریافت Push
```

## هشدار خودکار (Cron)

مسیر `/api/cron/check` باید به‌صورت دوره‌ای (مثلاً هر ۵ تا ۱۰ دقیقه) فراخوانی
شود تا زلزله‌های جدید بررسی و در صورت نیاز هشدار Push ارسال شود. اگر
`CRON_SECRET` تنظیم شده باشد، درخواست باید هدر
`Authorization: Bearer <CRON_SECRET>` را داشته باشد.

در `vercel.json` یک Vercel Cron روزانه (`0 0 * * *`) تعریف شده است (طرح
رایگان/Hobby ووکر فقط Cronهای روزانه را پشتیبانی می‌کند). برای دریافت هشدار
نزدیک به لحظه‌ای، یک سرویس Cron خارجی و رایگان مثل
[cron-job.org](https://cron-job.org) را تنظیم کنید تا هر ۵ تا ۱۰ دقیقه آدرس
زیر را با هدر `Authorization` فراخوانی کند:

```
GET https://<your-app>.vercel.app/api/cron/check
Authorization: Bearer <CRON_SECRET>
```

(در صورت ارتقا به Pro، می‌توانید `schedule` در `vercel.json` را به
`*/10 * * * *` برگردانید.)

اشتراک‌های Push و وضعیت آخرین بررسی به‌صورت فایل JSON در پوشه `data/` (که در
گیت نادیده گرفته می‌شود) ذخیره می‌شوند — برای استفاده در مقیاس واقعی، این
بخش را به یک پایگاه داده واقعی منتقل کنید.

## آیکون‌ها

آیکون‌های PWA با اسکریپت `scripts/generate-icons.js` و با استفاده از
`next/og` تولید شده‌اند:

```bash
npm run generate-icons
```
