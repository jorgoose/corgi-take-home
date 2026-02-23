import { cn } from "@/lib/utils";
import { ReferenceAsset } from "@/lib/types/fund";

const BADGE_STYLES: Record<ReferenceAsset, string> = {
  QQQ: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  IWM: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  SPY: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  EFA: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  EEM: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export function ReferenceAssetBadge({ asset }: { asset: ReferenceAsset }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded border px-1.5 py-0.5 text-xs font-mono font-medium",
      BADGE_STYLES[asset]
    )}>
      {asset}
    </span>
  );
}
