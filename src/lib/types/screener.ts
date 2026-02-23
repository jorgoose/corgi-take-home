import { BufferType, ReferenceAsset, SeriesMonth } from "./fund";

export interface FilterState {
  referenceAssets: ReferenceAsset[];
  bufferTypes: BufferType[];
  seriesMonths: SeriesMonth[];
  daysRemainingMin: number;
  daysRemainingMax: number;
  remainingBufferMin: number;
  remainingBufferMax: number;
  remainingCapMin: number;
  remainingCapMax: number;
}

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  column: string;
  direction: SortDirection;
}

export const DEFAULT_FILTERS: FilterState = {
  referenceAssets: ["QQQ", "IWM", "SPY", "EFA", "EEM"],
  bufferTypes: ["standard", "deep", "full"],
  seriesMonths: ["May", "Jun", "Jul", "Aug"],
  daysRemainingMin: 0,
  daysRemainingMax: 365,
  remainingBufferMin: 0,
  remainingBufferMax: 100,
  remainingCapMin: 0,
  remainingCapMax: 50,
};
