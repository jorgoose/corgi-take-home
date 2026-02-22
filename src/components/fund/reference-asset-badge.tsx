import { cn } from "@/lib/utils";
import { ReferenceAsset } from "@/lib/types/fund";

const BADGE_STYLES: Record<ReferenceAsset, string> = {
  QQQ: "bg-amber-50 text-amber-800 border-amber-200",
  IWM: "bg-sky-50 text-sky-800 border-sky-200",
  SPY: "bg-emerald-50 text-emerald-800 border-emerald-200",
  EFA: "bg-violet-50 text-violet-800 border-violet-200",
  EEM: "bg-rose-50 text-rose-800 border-rose-200",
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
