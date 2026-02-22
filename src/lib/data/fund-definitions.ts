import { FundDefinition, SeriesMonth } from "../types/fund";
import { FUND_FAMILIES, SERIES_SUFFIXES } from "../constants/fund-families";

const SERIES_MONTHS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

export const FUND_DEFINITIONS: FundDefinition[] = FUND_FAMILIES.flatMap((family) =>
  SERIES_MONTHS.map((month): FundDefinition => ({
    ticker: `${family.tickerPrefix}${SERIES_SUFFIXES[month]}`,
    name: `${family.name} - ${month} Series`,
    fundFamily: family.shortName,
    referenceAssetTicker: family.referenceAssetTicker,
    referenceAssetName: family.referenceAssetName,
    bufferType: family.bufferType,
    bufferSizePct: family.bufferSizePct,
    bufferStartPct: family.bufferStartPct,
    bufferEndPct: family.bufferEndPct,
    seriesMonth: month,
    expenseRatio: family.expenseRatio,
  }))
);

export function getFundByTicker(ticker: string): FundDefinition | undefined {
  return FUND_DEFINITIONS.find((f) => f.ticker === ticker);
}

export function getFundsByFamily(familyName: string): FundDefinition[] {
  return FUND_DEFINITIONS.filter((f) => f.fundFamily === familyName);
}
