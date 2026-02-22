"use client";

import Link from "next/link";
import { FundWithCurrentValues } from "@/lib/types/fund";
import { SortConfig } from "@/lib/types/screener";
import { BufferTypeBadge } from "@/components/fund/buffer-type-badge";
import { ReferenceAssetBadge } from "@/components/fund/reference-asset-badge";
import { formatPercentUnsigned, formatPercent, formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface ScreenerTableProps {
  funds: FundWithCurrentValues[];
  sort: SortConfig;
  onSort: (sort: SortConfig) => void;
  totalCount: number;
}

interface Column {
  key: string;
  label: string;
  shortLabel?: string;
  className?: string;
}

const COLUMNS: Column[] = [
  { key: "ticker", label: "Ticker", className: "w-20" },
  { key: "referenceAsset", label: "Ref Asset", className: "w-20" },
  { key: "bufferType", label: "Buffer", className: "w-24" },
  { key: "startingCapNet", label: "Starting Cap", shortLabel: "Start Cap", className: "w-24 text-right" },
  { key: "remainingCapNet", label: "Remaining Cap", shortLabel: "Rem Cap", className: "w-28 text-right" },
  { key: "remainingBufferNet", label: "Remaining Buffer", shortLabel: "Rem Buf", className: "w-28 text-right" },
  { key: "downsideBeforeBuffer", label: "Downside Before Buf", shortLabel: "Pre-Buf", className: "w-28 text-right" },
  { key: "daysRemaining", label: "Days Left", className: "w-24 text-right" },
  { key: "periodEnd", label: "Period End", className: "w-28 text-right" },
];

function SortIcon({ column, sort }: { column: string; sort: SortConfig }) {
  if (sort.column !== column) return <span className="text-muted-foreground/30 ml-1">{"\u2195"}</span>;
  return <span className="text-[#FF5C00] ml-1">{sort.direction === "asc" ? "\u2191" : "\u2193"}</span>;
}

function bufferHealthColor(remaining: number): string {
  if (remaining < 3) return "text-red-600 font-semibold";
  if (remaining < 5) return "text-amber-600";
  return "text-green-700";
}

export function ScreenerTable({ funds, sort, onSort, totalCount }: ScreenerTableProps) {
  function handleSort(column: string) {
    if (sort.column === column) {
      onSort({ column, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      onSort({ column, direction: "desc" });
    }
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-2">
        Showing {funds.length} of {totalCount} funds
      </p>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    "px-3 py-2 font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none whitespace-nowrap",
                    col.className
                  )}
                >
                  <span className="hidden lg:inline">{col.label}</span>
                  <span className="lg:hidden">{col.shortLabel || col.label}</span>
                  <SortIcon column={col.key} sort={sort} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.ticker} className="border-b hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2">
                  <Link
                    href={`/tools/performance/${fund.ticker}`}
                    className="font-mono font-semibold text-[#FF5C00] hover:underline"
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
                <td className="px-3 py-2 text-right font-mono">
                  {formatPercentUnsigned(fund.outcomePeriod.startingCapNet)}
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {formatPercentUnsigned(fund.currentValues.remainingCapNet)}
                </td>
                <td className={cn("px-3 py-2 text-right font-mono", bufferHealthColor(fund.currentValues.remainingBufferNet))}>
                  {formatPercentUnsigned(fund.currentValues.remainingBufferNet)}
                </td>
                <td className={cn("px-3 py-2 text-right font-mono", fund.currentValues.downsideBeforeBuffer > 0 ? "text-amber-600 font-medium" : "")}>
                  {formatPercentUnsigned(fund.currentValues.downsideBeforeBuffer)}
                </td>
                <td className="px-3 py-2 text-right font-mono">
                  {fund.currentValues.remainingOutcomePeriodDays}
                </td>
                <td className="px-3 py-2 text-right">
                  {formatDate(fund.outcomePeriod.endDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {funds.map((fund) => (
          <div key={fund.ticker} className="rounded-lg border bg-card p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Link
                href={`/tools/performance/${fund.ticker}`}
                className="font-mono font-bold text-lg text-[#FF5C00] hover:underline"
              >
                {fund.ticker}
              </Link>
              <div className="flex items-center gap-2">
                <ReferenceAssetBadge asset={fund.referenceAssetTicker} />
                <BufferTypeBadge type={fund.bufferType} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{fund.name}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Starting Cap:</span>
                <span className="font-mono">{formatPercentUnsigned(fund.outcomePeriod.startingCapNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rem Cap:</span>
                <span className="font-mono">{formatPercentUnsigned(fund.currentValues.remainingCapNet)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rem Buffer:</span>
                <span className={cn("font-mono", bufferHealthColor(fund.currentValues.remainingBufferNet))}>
                  {formatPercentUnsigned(fund.currentValues.remainingBufferNet)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Days Left:</span>
                <span className="font-mono">{fund.currentValues.remainingOutcomePeriodDays}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
