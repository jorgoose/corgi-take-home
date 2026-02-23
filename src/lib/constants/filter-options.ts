import { ReferenceAsset, BufferType, SeriesMonth } from "../types/fund";
import { FilterState, DEFAULT_FILTERS } from "../types/screener";

export const REFERENCE_ASSET_OPTIONS: { value: ReferenceAsset; label: string }[] = [
  { value: "QQQ", label: "QQQ — Invesco QQQ Trust" },
  { value: "IWM", label: "IWM — iShares Russell 2000" },
  { value: "SPY", label: "SPY — SPDR S&P 500" },
  { value: "EFA", label: "EFA — iShares MSCI EAFE" },
  { value: "EEM", label: "EEM — iShares MSCI EM" },
];

export const BUFFER_TYPE_OPTIONS: { value: BufferType; label: string }[] = [
  { value: "standard", label: "Standard Buffer" },
  { value: "deep", label: "Deep Buffer" },
  { value: "full", label: "Full Protection" },
];

export const SERIES_MONTH_OPTIONS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

/** Toggle an item in a filter array, enforcing at least one selection. */
function toggleInArray<T>(current: T[], item: T): T[] | null {
  const next = current.includes(item)
    ? current.filter((v) => v !== item)
    : [...current, item];
  return next.length === 0 ? null : next;
}

export function toggleAsset(filters: FilterState, asset: ReferenceAsset): FilterState | null {
  const next = toggleInArray(filters.referenceAssets, asset);
  return next ? { ...filters, referenceAssets: next } : null;
}

export function toggleBufferType(filters: FilterState, type: BufferType): FilterState | null {
  const next = toggleInArray(filters.bufferTypes, type);
  return next ? { ...filters, bufferTypes: next } : null;
}

export function toggleSeries(filters: FilterState, month: SeriesMonth): FilterState | null {
  const next = toggleInArray(filters.seriesMonths, month);
  return next ? { ...filters, seriesMonths: next } : null;
}

export function isDefaultFilters(filters: FilterState): boolean {
  return JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);
}
