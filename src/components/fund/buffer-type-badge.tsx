import { cn } from "@/lib/utils";
import { BufferType } from "@/lib/types/fund";

const BADGE_STYLES: Record<BufferType, string> = {
  standard: "bg-green-100 text-green-800 border-green-200",
  deep: "bg-blue-100 text-blue-800 border-blue-200",
  full: "bg-purple-100 text-purple-800 border-purple-200",
};

const LABELS: Record<BufferType, string> = {
  standard: "Standard",
  deep: "Deep",
  full: "Full",
};

export function BufferTypeBadge({ type }: { type: BufferType }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
      BADGE_STYLES[type]
    )}>
      {LABELS[type]}
    </span>
  );
}
