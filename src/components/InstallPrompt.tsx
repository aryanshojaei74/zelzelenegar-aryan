"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Reads browser-only APIs, so this must run after mount rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) return null;

  return (
    <div className="rounded-2xl bg-slate-900 p-4 text-sm text-slate-300">
      <h3 className="mb-2 font-semibold text-slate-100">نصب زلزله‌نگار آریان روی گوشی</h3>
      {isIOS ? (
        <p>
          در سافاری روی دکمه اشتراک‌گذاری (
          <span role="img" aria-label="share icon">
            ⎋
          </span>
          ) ضربه بزنید و سپس گزینه «Add to Home Screen» را انتخاب کنید تا اپلیکیشن به صفحه اصلی اضافه
          شود.
        </p>
      ) : (
        <p>
          از منوی مرورگر (سه نقطه بالای صفحه) گزینه «Add to Home screen» یا «Install app» را انتخاب کنید
          تا اپلیکیشن مانند یک برنامه نصب‌شده روی گوشی شما اجرا شود.
        </p>
      )}
    </div>
  );
}
