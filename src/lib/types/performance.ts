import { FundDefinition, OutcomePeriod, DailyValues, TimeSeriesPoint } from "./fund";

export interface PerformanceData {
  fund: FundDefinition;
  outcomePeriod: OutcomePeriod;
  currentValues: DailyValues;
  timeSeries: TimeSeriesPoint[];
}
