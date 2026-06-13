export interface MagnitudeLevel {
  label: string;
  color: string;
  background: string;
}

// Classification thresholds roughly follow common seismic intensity scales.
export function getMagnitudeLevel(magnitude: number): MagnitudeLevel {
  if (magnitude >= 7) {
    return { label: "فاجعه‌بار", color: "#ffffff", background: "#7c3aed" };
  }
  if (magnitude >= 6) {
    return { label: "قوی", color: "#ffffff", background: "#b91c1c" };
  }
  if (magnitude >= 5) {
    return { label: "نسبتاً قوی", color: "#ffffff", background: "#dc2626" };
  }
  if (magnitude >= 4) {
    return { label: "متوسط", color: "#1c1917", background: "#f97316" };
  }
  if (magnitude >= 3) {
    return { label: "کوچک", color: "#1c1917", background: "#facc15" };
  }
  return { label: "خرد", color: "#ffffff", background: "#16a34a" };
}
