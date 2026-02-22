import { BufferType, ReferenceAsset, SeriesMonth } from "./fund";

export interface FilterState {
  referenceAssets: ReferenceAsset[];
  bufferTypes: BufferType[];
  seriesMonths: SeriesMonth[];
  daysRemainingMin: number;
  daysRemainingMax: number;
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
};
