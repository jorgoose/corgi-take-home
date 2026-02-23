"use client";

import { FilterState, DEFAULT_FILTERS } from "@/lib/types/screener";
import { cn } from "@/lib/utils";
import {
  REFERENCE_ASSET_OPTIONS,
  BUFFER_TYPE_OPTIONS,
  SERIES_MONTH_OPTIONS,
  toggleAsset,
  toggleBufferType,
  toggleSeries,
  isDefaultFilters,
} from "@/lib/constants/filter-options";

interface ScreenerFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ScreenerFilters({ filters, onChange }: ScreenerFiltersProps) {
  function handleToggleAsset(asset: typeof REFERENCE_ASSET_OPTIONS[number]["value"]) {
    const next = toggleAsset(filters, asset);
    if (next) onChange(next);
  }

  function handleToggleBuffer(type: typeof BUFFER_TYPE_OPTIONS[number]["value"]) {
    const next = toggleBufferType(filters, type);
    if (next) onChange(next);
  }

  function handleToggleSeries(month: typeof SERIES_MONTH_OPTIONS[number]) {
    const next = toggleSeries(filters, month);
    if (next) onChange(next);
  }

  const isDefault = isDefaultFilters(filters);

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      {/* Reference Asset pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Reference Asset</label>
        <div className="flex flex-wrap gap-1.5">
          {REFERENCE_ASSET_OPTIONS.map(({ value }) => {
            const selected = filters.referenceAssets.includes(value);
            const isLastSelected = selected && filters.referenceAssets.length === 1;
            return (
              <button
                key={value}
                onClick={() => handleToggleAsset(value)}
                disabled={isLastSelected}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-input hover:bg-muted",
                  isLastSelected && "opacity-50 cursor-not-allowed"
                )}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buffer Type pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Buffer Type</label>
        <div className="flex flex-wrap gap-1.5">
          {BUFFER_TYPE_OPTIONS.map(({ value, label }) => {
            const selected = filters.bufferTypes.includes(value);
            const isLastSelected = selected && filters.bufferTypes.length === 1;
            return (
              <button
                key={value}
                onClick={() => handleToggleBuffer(value)}
                disabled={isLastSelected}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-input hover:bg-muted",
                  isLastSelected && "opacity-50 cursor-not-allowed"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Series Month pills */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Series Month</label>
        <div className="flex flex-wrap gap-1.5">
          {SERIES_MONTH_OPTIONS.map((month) => {
            const selected = filters.seriesMonths.includes(month);
            const isLastSelected = selected && filters.seriesMonths.length === 1;
            return (
              <button
                key={month}
                onClick={() => handleToggleSeries(month)}
                disabled={isLastSelected}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selected
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-input hover:bg-muted",
                  isLastSelected && "opacity-50 cursor-not-allowed"
                )}
              >
                {month}
              </button>
            );
          })}
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
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
          className="text-xs text-[#FF5C00] hover:underline font-medium"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
