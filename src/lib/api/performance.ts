import { PerformanceData } from "../types/performance";
import { getFundByTicker } from "./funds";
import { getTimeSeriesForFund } from "../data/mock-daily-values";

export function getPerformanceData(ticker: string): PerformanceData | null {
  const fund = getFundByTicker(ticker);
  if (!fund) return null;

  const timeSeries = getTimeSeriesForFund(ticker);

  return {
    fund,
    outcomePeriod: fund.outcomePeriod,
    currentValues: fund.currentValues,
    timeSeries,
  };
}
