"use client";

import type { Region } from "@/lib/types";

const OPTIONS: { value: Region; label: string }[] = [
  { value: "iran", label: "ایران" },
  { value: "world", label: "جهان" },
];

export default function RegionToggle({
  region,
  onChange,
}: {
  region: Region;
  onChange: (region: Region) => void;
}) {
  return (
    <div className="inline-flex rounded-full bg-slate-800 p-1 text-sm">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-1.5 font-medium transition ${
            region === option.value
              ? "bg-red-600 text-white"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
