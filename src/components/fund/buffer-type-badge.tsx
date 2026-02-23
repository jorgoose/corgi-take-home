import { cn } from "@/lib/utils";
import { BufferType } from "@/lib/types/fund";

const BADGE_STYLES: Record<BufferType, string> = {
  standard: "bg-green-500/15 text-green-400 border-green-500/30",
  deep: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  full: "bg-purple-500/15 text-purple-400 border-purple-500/30",
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
