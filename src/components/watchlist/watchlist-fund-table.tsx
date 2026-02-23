"use client";

import Link from "next/link";
import { FundWithCurrentValues } from "@/lib/types/fund";
import { BufferTypeBadge } from "@/components/fund/buffer-type-badge";
import { ReferenceAssetBadge } from "@/components/fund/reference-asset-badge";
import { formatPercent, formatDaysRemaining } from "@/lib/utils/format";

interface WatchlistFundTableProps {
  funds: FundWithCurrentValues[];
  onRemove?: (ticker: string) => void;
}

export function WatchlistFundTable({ funds, onRemove }: WatchlistFundTableProps) {
  if (funds.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        No funds in this list. Add some using the dropdown above.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Ticker</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Ref</th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">Type</th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">Rem Cap</th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">Rem Buffer</th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">Days Left</th>
            {onRemove && <th className="px-3 py-2 w-10"></th>}
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => (
            <tr key={fund.ticker} className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-3 py-2">
                <Link
                  href={`/tools/performance/${fund.ticker}`}
                  className="font-mono font-medium text-[#FF5C00] hover:underline"
                >
                  {fund.ticker}
                </Link>
              </td>
              <td className="px-3 py-2">
                <ReferenceAssetBadge asset={fund.referenceAssetTicker} />
              </td>
              <td className="px-3 py-2">
                <BufferTypeBadge type={fund.bufferType} />
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs">
                {formatPercent(fund.currentValues.remainingCapNet)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs">
                {formatPercent(fund.currentValues.remainingBufferNet)}
              </td>
              <td className="px-3 py-2 text-right font-mono text-xs">
                {formatDaysRemaining(fund.currentValues.remainingOutcomePeriodDays)}
              </td>
              {onRemove && (
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => onRemove(fund.ticker)}
                    className="text-muted-foreground hover:text-red-400 transition-colors text-xs"
                    title="Remove from list"
                  >
                    ✕
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
