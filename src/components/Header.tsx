export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/90 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-700">
          <svg viewBox="0 0 100 100" className="h-6 w-6" fill="none">
            <polyline
              points="0,55 18,55 28,25 40,82 52,30 64,68 76,55 100,55"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-base font-bold leading-tight">زلزله‌نگار آریان</h1>
          <p className="truncate text-xs text-slate-400 leading-tight">
            رصد لحظه‌ای زلزله‌های ایران و جهان
          </p>
        </div>
      </div>
    </header>
  );
}
