export type BufferType = "standard" | "deep" | "full";
export type SeriesMonth = "May" | "Jun" | "Jul" | "Aug";
export type ReferenceAsset = "QQQ" | "IWM" | "SPY" | "EFA" | "EEM";

export interface FundDefinition {
  ticker: string;
  name: string;
  fundFamily: string;
  referenceAssetTicker: ReferenceAsset;
  referenceAssetName: string;
  bufferType: BufferType;
  bufferSizePct: number;
  bufferStartPct: number; // 0 for standard/full, -5 for deep
  bufferEndPct: number;   // -10, -15, -35, or -100
  seriesMonth: SeriesMonth;
  expenseRatio: number;
}

export interface OutcomePeriod {
  id: number;
  fundTicker: string;
  startDate: string; // ISO date
  endDate: string;
  startingCapGross: number;
  startingCapNet: number;
  startingFundNav: number;
  startingRefAssetPrice: number;
  refAssetCapValue: number;
  bufferStartRefValue: number;
  bufferEndRefValue: number;
}

export interface DailyValues {
  date: string;
  fundTicker: string;
  fundNav: number;
  fundReturnPtd: number;
  refAssetPrice: number;
  refAssetReturnPtd: number;
  remainingCapGross: number;
  remainingCapNet: number;
  remainingBufferNet: number;
  downsideBeforeBuffer: number;
  refAssetToBufferEnd: number;
  refAssetReturnToCap: number;
  remainingOutcomePeriodDays: number;
}

export interface FundWithCurrentValues extends FundDefinition {
  outcomePeriod: OutcomePeriod;
  currentValues: DailyValues;
}

export interface TimeSeriesPoint {
  date: string;
  fundReturn: number;
  refAssetReturn: number;
}
