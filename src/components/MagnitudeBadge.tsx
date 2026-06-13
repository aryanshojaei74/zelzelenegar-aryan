import { formatMagnitude } from "@/lib/format";
import { getMagnitudeLevel } from "@/lib/magnitude";

const SIZE_CLASSES: Record<"sm" | "md" | "lg", string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
};

export default function MagnitudeBadge({
  magnitude,
  size = "md",
}: {
  magnitude: number;
  size?: "sm" | "md" | "lg";
}) {
  const level = getMagnitudeLevel(magnitude);

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold ${SIZE_CLASSES[size]}`}
      style={{ backgroundColor: level.background, color: level.color }}
    >
      {formatMagnitude(magnitude)}
    </div>
  );
}
