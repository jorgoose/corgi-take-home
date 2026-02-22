import { OutcomePeriod, DailyValues, FundWithCurrentValues, FundDefinition, TimeSeriesPoint } from "../types/fund";
import { FUND_FAMILIES, REF_ASSET_PRICES } from "../constants/fund-families";
import { FUND_DEFINITIONS } from "./fund-definitions";
import { createFundRandom, randomInRange } from "./seed-helpers";
import { generateMockTimeSeries, MockTimeSeriesConfig } from "./mock-time-series";

// Outcome period start dates based on series month (2026)
const SERIES_START_DATES: Record<string, string> = {
  May: "2026-05-01",
  Jun: "2026-06-01",
  Jul: "2026-07-01",
  Aug: "2026-08-03",
};

// Current mock date (mid-period for most funds)
export const MOCK_AS_OF_DATE = "2026-10-15";

function getOutcomePeriodEndDate(startDate: string): string {
  const start = new Date(startDate + "T00:00:00");
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  end.setDate(end.getDate() - 1);
  return end.toISOString().split("T")[0];
}

function getTradingDaysBetween(start: string, end: string): number {
  const startDate = new Date(start + "T00:00:00");
  const endDate = new Date(end + "T00:00:00");
  let count = 0;
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
}

function getDaysRemaining(endDate: string, asOfDate: string): number {
  const end = new Date(endDate + "T00:00:00");
  const asOf = new Date(asOfDate + "T00:00:00");
  return Math.max(0, Math.round((end.getTime() - asOf.getTime()) / (1000 * 60 * 60 * 24)));
}

function generateOutcomePeriod(fund: FundDefinition): OutcomePeriod {
  const rng = createFundRandom(fund.ticker + "_period");
  const family = FUND_FAMILIES.find(f => f.shortName === fund.fundFamily)!;

  const startDate = SERIES_START_DATES[fund.seriesMonth];
  const endDate = getOutcomePeriodEndDate(startDate);
  const startingRefPrice = REF_ASSET_PRICES[fund.referenceAssetTicker];

  // Generate a realistic cap within the family's range
  const startingCapGross = randomInRange(rng, family.typicalCapRange[0], family.typicalCapRange[1]);
  const startingCapNet = startingCapGross - (fund.expenseRatio * 100);

  const startingFundNav = 25.00;

  // Calculate reference values
  const refAssetCapValue = startingRefPrice * (1 + startingCapGross / 100);
  const bufferStartRefValue = startingRefPrice * (1 + fund.bufferStartPct / 100);
  const bufferEndRefValue = startingRefPrice * (1 + fund.bufferEndPct / 100);

  return {
    id: 1,
    fundTicker: fund.ticker,
    startDate,
    endDate,
    startingCapGross: Math.round(startingCapGross * 100) / 100,
    startingCapNet: Math.round(startingCapNet * 100) / 100,
    startingFundNav,
    startingRefAssetPrice: startingRefPrice,
    refAssetCapValue: Math.round(refAssetCapValue * 100) / 100,
    bufferStartRefValue: Math.round(bufferStartRefValue * 100) / 100,
    bufferEndRefValue: Math.round(bufferEndRefValue * 100) / 100,
  };
}

function generateCurrentValues(fund: FundDefinition, outcomePeriod: OutcomePeriod): { dailyValues: DailyValues; timeSeries: TimeSeriesPoint[] } {
  const tradingDaysElapsed = getTradingDaysBetween(outcomePeriod.startDate, MOCK_AS_OF_DATE);

  const config: MockTimeSeriesConfig = {
    ticker: fund.ticker,
    referenceAssetTicker: fund.referenceAssetTicker,
    startingRefPrice: outcomePeriod.startingRefAssetPrice,
    startDate: outcomePeriod.startDate,
    capNet: outcomePeriod.startingCapNet,
    bufferStartPct: fund.bufferStartPct,
    bufferEndPct: fund.bufferEndPct,
    tradingDays: tradingDaysElapsed,
  };

  const timeSeries = generateMockTimeSeries(config);
  const lastPoint = timeSeries[timeSeries.length - 1];

  const refAssetReturnPtd = lastPoint.refAssetReturn;
  const fundReturnPtd = lastPoint.fundReturn;

  const refAssetPrice = outcomePeriod.startingRefAssetPrice * (1 + refAssetReturnPtd / 100);
  const fundNav = outcomePeriod.startingFundNav * (1 + fundReturnPtd / 100);

  // Calculate remaining values
  const remainingCapNet = outcomePeriod.startingCapNet - Math.max(0, fundReturnPtd);
  const remainingCapGross = outcomePeriod.startingCapGross - Math.max(0, fundReturnPtd);

  // Remaining buffer depends on how much the ref asset has declined
  let remainingBufferNet = fund.bufferSizePct;
  let downsideBeforeBuffer = Math.abs(fund.bufferStartPct);

  if (refAssetReturnPtd < fund.bufferStartPct) {
    // Buffer has been partially consumed
    const bufferUsed = Math.min(
      fund.bufferSizePct,
      Math.abs(refAssetReturnPtd - fund.bufferStartPct)
    );
    remainingBufferNet = Math.max(0, fund.bufferSizePct - bufferUsed);
    downsideBeforeBuffer = 0; // gap already breached for deep buffer
  } else if (refAssetReturnPtd < 0 && fund.bufferStartPct < 0) {
    // In the gap for deep buffer
    downsideBeforeBuffer = Math.max(0, Math.abs(fund.bufferStartPct) - Math.abs(refAssetReturnPtd));
  }

  const refAssetToBufferEnd = ((outcomePeriod.bufferEndRefValue / refAssetPrice) - 1) * 100;
  const refAssetReturnToCap = ((outcomePeriod.refAssetCapValue / refAssetPrice) - 1) * 100;
  const daysRemaining = getDaysRemaining(outcomePeriod.endDate, MOCK_AS_OF_DATE);

  const dailyValues: DailyValues = {
    date: MOCK_AS_OF_DATE,
    fundTicker: fund.ticker,
    fundNav: Math.round(fundNav * 100) / 100,
    fundReturnPtd: Math.round(fundReturnPtd * 100) / 100,
    refAssetPrice: Math.round(refAssetPrice * 100) / 100,
    refAssetReturnPtd: Math.round(refAssetReturnPtd * 100) / 100,
    remainingCapGross: Math.round(Math.max(0, remainingCapGross) * 100) / 100,
    remainingCapNet: Math.round(Math.max(0, remainingCapNet) * 100) / 100,
    remainingBufferNet: Math.round(remainingBufferNet * 100) / 100,
    downsideBeforeBuffer: Math.round(downsideBeforeBuffer * 100) / 100,
    refAssetToBufferEnd: Math.round(refAssetToBufferEnd * 100) / 100,
    refAssetReturnToCap: Math.round(refAssetReturnToCap * 100) / 100,
    remainingOutcomePeriodDays: daysRemaining,
  };

  return { dailyValues, timeSeries };
}

// Cache for generated data
let _allFundsCache: FundWithCurrentValues[] | null = null;
let _timeSeriesCache: Map<string, TimeSeriesPoint[]> | null = null;

export function getAllFundsWithCurrentValues(): FundWithCurrentValues[] {
  if (_allFundsCache) return _allFundsCache;

  _allFundsCache = [];
  _timeSeriesCache = new Map();

  for (const fund of FUND_DEFINITIONS) {
    const outcomePeriod = generateOutcomePeriod(fund);
    const { dailyValues, timeSeries } = generateCurrentValues(fund, outcomePeriod);

    _allFundsCache.push({
      ...fund,
      outcomePeriod,
      currentValues: dailyValues,
    });

    _timeSeriesCache.set(fund.ticker, timeSeries);
  }

  return _allFundsCache;
}

export function getTimeSeriesForFund(ticker: string): TimeSeriesPoint[] {
  if (!_timeSeriesCache) {
    getAllFundsWithCurrentValues(); // Populate cache
  }
  return _timeSeriesCache?.get(ticker) || [];
}
