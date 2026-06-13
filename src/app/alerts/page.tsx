import InstallPrompt from "@/components/InstallPrompt";
import PushNotificationManager from "@/components/PushNotificationManager";

export default function AlertsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4">
      <div>
        <h2 className="text-lg font-bold">هشدار زلزله</h2>
        <p className="mt-1 text-sm text-slate-400">
          با فعال‌سازی هشدار، به‌محض ثبت زلزله‌ای با بزرگی بیشتر از آستانه انتخابی در منطقه مدنظر شما،
          یک اعلان فوری دریافت خواهید کرد.
        </p>
      </div>

      <PushNotificationManager />
      <InstallPrompt />

      <div className="rounded-2xl bg-slate-900 p-4 text-xs leading-6 text-slate-400">
        <p className="mb-1 font-semibold text-slate-300">نکته:</p>
        <p>
          دریافت هشدار نیازمند مجوز اعلان در مرورگر است. برای دریافت هشدار حتی وقتی اپلیکیشن باز نیست،
          توصیه می‌شود اپلیکیشن را به صفحه اصلی گوشی اضافه کنید.
        </p>
      </div>
    </div>
  );
}
