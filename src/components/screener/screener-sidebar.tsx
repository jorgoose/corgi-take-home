"use client";

import { FilterState, DEFAULT_FILTERS } from "@/lib/types/screener";
import {
  REFERENCE_ASSET_OPTIONS,
  BUFFER_TYPE_OPTIONS,
  SERIES_MONTH_OPTIONS,
  toggleAsset,
  toggleBufferType,
  toggleSeries,
  isDefaultFilters,
} from "@/lib/constants/filter-options";

interface ScreenerSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function ScreenerSidebar({ filters, onChange }: ScreenerSidebarProps) {
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
    <div className="space-y-5">
      {/* Reference Assets — checkbox list */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Reference Assets
        </label>
        <div className="space-y-1.5">
          {REFERENCE_ASSET_OPTIONS.map(({ value, label }) => {
            const checked = filters.referenceAssets.includes(value);
            const isLastSelected = checked && filters.referenceAssets.length === 1;
            return (
              <label key={value} className={`flex items-center gap-2 group ${isLastSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={isLastSelected}
                  onChange={() => handleToggleAsset(value)}
                  className="accent-[#FF5C00] h-3.5 w-3.5"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Strategies (Buffer Type) — checkbox list */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Strategies
        </label>
        <div className="space-y-1.5">
          {BUFFER_TYPE_OPTIONS.map(({ value, label }) => {
            const checked = filters.bufferTypes.includes(value);
            const isLastSelected = checked && filters.bufferTypes.length === 1;
            return (
              <label key={value} className={`flex items-center gap-2 group ${isLastSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={isLastSelected}
                  onChange={() => handleToggleBuffer(value)}
                  className="accent-[#FF5C00] h-3.5 w-3.5"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Series Type — dropdown */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Series Type
        </label>
        <div className="space-y-1.5">
          {SERIES_MONTH_OPTIONS.map((month) => {
            const checked = filters.seriesMonths.includes(month);
            const isLastSelected = checked && filters.seriesMonths.length === 1;
            return (
              <label key={month} className={`flex items-center gap-2 group ${isLastSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={isLastSelected}
                  onChange={() => handleToggleSeries(month)}
                  className="accent-[#FF5C00] h-3.5 w-3.5"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {month} Series
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Remaining Buffer range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
          Remaining Buffer
        </label>
        <div className="text-xs text-muted-foreground mb-1.5">
          {filters.remainingBufferMin.toFixed(0)}% to {filters.remainingBufferMax.toFixed(0)}%
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.remainingBufferMin}
          onChange={(e) =>
            onChange({
              ...filters,
              remainingBufferMin: Math.min(Number(e.target.value), filters.remainingBufferMax),
            })
          }
          className="w-full accent-[#FF5C00]"
        />
        <input
          type="range"
          min={0}
          max={100}
          value={filters.remainingBufferMax}
          onChange={(e) =>
            onChange({
              ...filters,
              remainingBufferMax: Math.max(Number(e.target.value), filters.remainingBufferMin),
            })
          }
          className="w-full accent-[#FF5C00]"
        />
      </div>

      {/* Remaining Cap range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
          Remaining Cap
        </label>
        <div className="text-xs text-muted-foreground mb-1.5">
          {filters.remainingCapMin.toFixed(0)}% to {filters.remainingCapMax.toFixed(0)}%
        </div>
        <input
          type="range"
          min={0}
          max={50}
          value={filters.remainingCapMin}
          onChange={(e) =>
            onChange({
              ...filters,
              remainingCapMin: Math.min(Number(e.target.value), filters.remainingCapMax),
            })
          }
          className="w-full accent-[#FF5C00]"
        />
        <input
          type="range"
          min={0}
          max={50}
          value={filters.remainingCapMax}
          onChange={(e) =>
            onChange({
              ...filters,
              remainingCapMax: Math.max(Number(e.target.value), filters.remainingCapMin),
            })
          }
          className="w-full accent-[#FF5C00]"
        />
      </div>

      {/* Remaining Outcome Period range */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">
          Remaining Outcome Period
        </label>
        <div className="text-xs text-muted-foreground mb-1.5">
          {filters.daysRemainingMin} to {filters.daysRemainingMax} days
        </div>
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
          className="w-full accent-[#FF5C00]"
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
          className="w-full accent-[#FF5C00]"
        />
      </div>

      {/* Reset button */}
      <div className="pt-1">
        <button
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
          disabled={isDefault}
          className="w-full rounded-md border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
