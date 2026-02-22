"use client";

import { FilterState, DEFAULT_FILTERS } from "@/lib/types/screener";
import { ReferenceAsset, BufferType, SeriesMonth } from "@/lib/types/fund";
import { cn } from "@/lib/utils";

interface ScreenerFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const REFERENCE_ASSETS: ReferenceAsset[] = ["QQQ", "IWM", "SPY", "EFA", "EEM"];
const BUFFER_TYPES: { value: BufferType; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "deep", label: "Deep" },
  { value: "full", label: "Full" },
];
const SERIES_MONTHS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

export function ScreenerFilters({ filters, onChange }: ScreenerFiltersProps) {
  function toggleAsset(asset: ReferenceAsset) {
    const current = filters.referenceAssets;
    const next = current.includes(asset)
      ? current.filter((a) => a !== asset)
      : [...current, asset];
    if (next.length === 0) return; // Don't allow empty
    onChange({ ...filters, referenceAssets: next });
  }

  function toggleBufferType(type: BufferType) {
    const current = filters.bufferTypes;
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    if (next.length === 0) return;
    onChange({ ...filters, bufferTypes: next });
  }

  function toggleSeries(month: SeriesMonth) {
    const current = filters.seriesMonths;
    const next = current.includes(month)
      ? current.filter((m) => m !== month)
      : [...current, month];
    if (next.length === 0) return;
    onChange({ ...filters, seriesMonths: next });
  }

  function resetFilters() {
    onChange({ ...DEFAULT_FILTERS });
  }

  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Reference Asset pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reference Asset</label>
        <div className="flex flex-wrap gap-1.5">
          {REFERENCE_ASSETS.map((asset) => (
            <button
              key={asset}
              onClick={() => toggleAsset(asset)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filters.referenceAssets.includes(asset)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-input hover:bg-muted"
              )}
            >
              {asset}
            </button>
          ))}
        </div>
      </div>

      {/* Buffer Type pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Buffer Type</label>
        <div className="flex flex-wrap gap-1.5">
          {BUFFER_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleBufferType(value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filters.bufferTypes.includes(value)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-input hover:bg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Series Month pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Series Month</label>
        <div className="flex flex-wrap gap-1.5">
          {SERIES_MONTHS.map((month) => (
            <button
              key={month}
              onClick={() => toggleSeries(month)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                filters.seriesMonths.includes(month)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-muted-foreground border-input hover:bg-muted"
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      {/* Days Remaining range */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
          Days Remaining: {filters.daysRemainingMin} — {filters.daysRemainingMax}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={365}
            value={filters.daysRemainingMin}
            onChange={(e) =>
              onChange({
                ...filters,
                daysRemainingMin: Math.min(Number(e.target.value), filters.daysRemainingMax),
              })
            }
            className="flex-1 accent-[#FF5C00]"
          />
          <input
            type="range"
            min={0}
            max={365}
            value={filters.daysRemainingMax}
            onChange={(e) =>
              onChange({
                ...filters,
                daysRemainingMax: Math.max(Number(e.target.value), filters.daysRemainingMin),
              })
            }
            className="flex-1 accent-[#FF5C00]"
          />
        </div>
      </div>

      {/* Reset button */}
      {!isDefault && (
        <button
          onClick={resetFilters}
          className="text-xs text-[#FF5C00] hover:underline font-medium"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
