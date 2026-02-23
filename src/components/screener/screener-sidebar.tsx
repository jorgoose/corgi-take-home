"use client";

import { FilterState, DEFAULT_FILTERS } from "@/lib/types/screener";
import { ReferenceAsset, BufferType, SeriesMonth } from "@/lib/types/fund";

interface ScreenerSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const REFERENCE_ASSETS: { value: ReferenceAsset; label: string }[] = [
  { value: "QQQ", label: "QQQ — Invesco QQQ Trust" },
  { value: "IWM", label: "IWM — iShares Russell 2000" },
  { value: "SPY", label: "SPY — SPDR S&P 500" },
  { value: "EFA", label: "EFA — iShares MSCI EAFE" },
  { value: "EEM", label: "EEM — iShares MSCI EM" },
];

const BUFFER_TYPES: { value: BufferType; label: string }[] = [
  { value: "standard", label: "Standard Buffer" },
  { value: "deep", label: "Deep Buffer" },
  { value: "full", label: "Full Buffer" },
];

const SERIES_MONTHS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

export function ScreenerSidebar({ filters, onChange }: ScreenerSidebarProps) {
  function toggleAsset(asset: ReferenceAsset) {
    const current = filters.referenceAssets;
    const next = current.includes(asset)
      ? current.filter((a) => a !== asset)
      : [...current, asset];
    if (next.length === 0) return;
    onChange({ ...filters, referenceAssets: next });
  }

  function toggleBuffer(type: BufferType) {
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
    <div className="space-y-5">
      {/* Reference Assets — checkbox list */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Reference Assets
        </label>
        <div className="space-y-1.5">
          {REFERENCE_ASSETS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.referenceAssets.includes(value)}
                onChange={() => toggleAsset(value)}
                className="accent-[#FF5C00] h-3.5 w-3.5"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Strategies (Buffer Type) — checkbox list */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Strategies
        </label>
        <div className="space-y-1.5">
          {BUFFER_TYPES.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.bufferTypes.includes(value)}
                onChange={() => toggleBuffer(value)}
                className="accent-[#FF5C00] h-3.5 w-3.5"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Series Type — dropdown */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Series Type
        </label>
        <div className="space-y-1.5">
          {SERIES_MONTHS.map((month) => (
            <label key={month} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.seriesMonths.includes(month)}
                onChange={() => toggleSeries(month)}
                className="accent-[#FF5C00] h-3.5 w-3.5"
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {month} Series
              </span>
            </label>
          ))}
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
          onClick={resetFilters}
          disabled={isDefault}
          className="w-full rounded-md border border-input px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
