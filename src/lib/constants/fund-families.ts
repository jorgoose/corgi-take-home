import { BufferType, ReferenceAsset } from "../types/fund";

export interface FundFamilyConfig {
  id: string;
  name: string;
  shortName: string;
  referenceAssetTicker: ReferenceAsset;
  referenceAssetName: string;
  bufferType: BufferType;
  bufferSizePct: number;
  bufferStartPct: number;
  bufferEndPct: number;
  expenseRatio: number;
  tickerPrefix: string; // for generating tickers
  typicalCapRange: [number, number]; // min/max realistic cap for mock data
}

export const FUND_FAMILIES: FundFamilyConfig[] = [
  {
    id: "tech-leaders-10",
    name: "Technology Leaders 10% Structured Buffer ETF",
    shortName: "Technology Leaders 10%",
    referenceAssetTicker: "QQQ",
    referenceAssetName: "Invesco QQQ Trust",
    bufferType: "standard",
    bufferSizePct: 10,
    bufferStartPct: 0,
    bufferEndPct: -10,
    expenseRatio: 0.0079,
    tickerPrefix: "CQ",
    typicalCapRange: [12, 18],
  },
  {
    id: "small-cap-15",
    name: "U.S. Small-Cap 15% Structured Buffer ETF",
    shortName: "U.S. Small-Cap 15%",
    referenceAssetTicker: "IWM",
    referenceAssetName: "iShares Russell 2000 ETF",
    bufferType: "standard",
    bufferSizePct: 15,
    bufferStartPct: 0,
    bufferEndPct: -15,
    expenseRatio: 0.0079,
    tickerPrefix: "CR",
    typicalCapRange: [13, 20],
  },
  {
    id: "us-equities-deep-30",
    name: "U.S. Equities 30% Structured Buffer ETF",
    shortName: "U.S. Equities 30% Deep",
    referenceAssetTicker: "SPY",
    referenceAssetName: "SPDR S&P 500 ETF Trust",
    bufferType: "deep",
    bufferSizePct: 30,
    bufferStartPct: -5,
    bufferEndPct: -35,
    expenseRatio: 0.0079,
    tickerPrefix: "CS",
    typicalCapRange: [8, 14],
  },
  {
    id: "us-equities-full-100",
    name: "U.S. Equities 100% Structured Buffer ETF",
    shortName: "U.S. Equities 100% Full",
    referenceAssetTicker: "SPY",
    referenceAssetName: "SPDR S&P 500 ETF Trust",
    bufferType: "full",
    bufferSizePct: 100,
    bufferStartPct: 0,
    bufferEndPct: -100,
    expenseRatio: 0.0079,
    tickerPrefix: "CF",
    typicalCapRange: [2, 5],
  },
  {
    id: "intl-developed-15",
    name: "International Developed Equities 15% Structured Buffer ETF",
    shortName: "International Developed 15%",
    referenceAssetTicker: "EFA",
    referenceAssetName: "iShares MSCI EAFE ETF",
    bufferType: "standard",
    bufferSizePct: 15,
    bufferStartPct: 0,
    bufferEndPct: -15,
    expenseRatio: 0.0079,
    tickerPrefix: "CE",
    typicalCapRange: [10, 16],
  },
  {
    id: "emerging-markets-15",
    name: "Emerging Markets Equities 15% Structured Buffer ETF",
    shortName: "Emerging Markets 15%",
    referenceAssetTicker: "EEM",
    referenceAssetName: "iShares MSCI Emerging Markets ETF",
    bufferType: "standard",
    bufferSizePct: 15,
    bufferStartPct: 0,
    bufferEndPct: -15,
    expenseRatio: 0.0079,
    tickerPrefix: "CM",
    typicalCapRange: [11, 18],
  },
];

// Series month suffixes for ticker generation
export const SERIES_SUFFIXES: Record<string, string> = {
  May: "MB",
  Jun: "JB",
  Jul: "LB",
  Aug: "AB",
};

// Reference asset starting prices (realistic as of ~2026)
export const REF_ASSET_PRICES: Record<string, number> = {
  QQQ: 520.45,
  IWM: 225.30,
  SPY: 585.20,
  EFA: 82.15,
  EEM: 44.80,
};
