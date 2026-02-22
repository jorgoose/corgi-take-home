import { TimeSeriesPoint } from "../types/fund";
import { createFundRandom, randomNormal } from "./seed-helpers";

// Annual volatilities for each reference asset (realistic)
const ASSET_VOLATILITY: Record<string, number> = {
  QQQ: 0.22,
  IWM: 0.25,
  SPY: 0.18,
  EFA: 0.20,
  EEM: 0.24,
};

// Annual drift (expected return)
const ASSET_DRIFT: Record<string, number> = {
  QQQ: 0.10,
  IWM: 0.08,
  SPY: 0.09,
  EFA: 0.06,
  EEM: 0.07,
};

/**
 * Generate a reference asset price path using GBM
 */
function generatePricePath(
  rng: () => number,
  startPrice: number,
  tradingDays: number,
  annualVol: number,
  annualDrift: number,
): number[] {
  const dt = 1 / 252; // daily time step
  const dailyDrift = (annualDrift - 0.5 * annualVol * annualVol) * dt;
  const dailyVol = annualVol * Math.sqrt(dt);

  const prices = [startPrice];
  for (let i = 1; i <= tradingDays; i++) {
    const shock = randomNormal(rng);
    const prevPrice = prices[i - 1];
    const newPrice = prevPrice * Math.exp(dailyDrift + dailyVol * shock);
    prices.push(newPrice);
  }
  return prices;
}

/**
 * Simple fund return model: tracks ref asset with buffer/cap constraints applied at observation
 * This is a simplified model - real buffer ETFs use options pricing.
 * For mock data, we use a linear interpolation approach.
 */
function calculateFundReturnFromRefReturn(
  refReturn: number,
  capNet: number,
  bufferStartPct: number,
  bufferEndPct: number,
  dayFraction: number, // 0 to 1, how far through the period
): number {
  // Scale cap and buffer based on time elapsed (simplified model)
  // In reality, options pricing is more complex, but this gives realistic-looking data
  const effectiveCap = capNet;

  // Apply buffer/cap logic
  if (refReturn >= effectiveCap) return effectiveCap;
  if (refReturn >= 0) return refReturn;

  // Negative returns
  if (refReturn >= bufferStartPct) return refReturn; // in gap for deep, or above buffer for standard
  if (refReturn >= bufferEndPct) return bufferStartPct; // buffer absorbing
  return bufferStartPct + (refReturn - bufferEndPct); // beyond buffer
}

/**
 * Generate a date string array for trading days between start and end
 */
function generateTradingDates(startDate: string, numDays: number): string[] {
  const dates: string[] = [];
  const start = new Date(startDate + "T00:00:00");
  const current = new Date(start);

  while (dates.length < numDays) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) { // Skip weekends
      dates.push(current.toISOString().split("T")[0]);
    }
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

export interface MockTimeSeriesConfig {
  ticker: string;
  referenceAssetTicker: string;
  startingRefPrice: number;
  startDate: string;
  capNet: number;
  bufferStartPct: number; // as negative decimal e.g., 0 or -5
  bufferEndPct: number;   // as negative decimal e.g., -10, -15, -35, -100
  tradingDays: number;
}

export function generateMockTimeSeries(config: MockTimeSeriesConfig): TimeSeriesPoint[] {
  const rng = createFundRandom(config.ticker);
  const vol = ASSET_VOLATILITY[config.referenceAssetTicker] || 0.20;
  const drift = ASSET_DRIFT[config.referenceAssetTicker] || 0.08;

  const prices = generatePricePath(rng, config.startingRefPrice, config.tradingDays, vol, drift);
  const dates = generateTradingDates(config.startDate, config.tradingDays + 1);

  const points: TimeSeriesPoint[] = [];
  for (let i = 0; i < Math.min(prices.length, dates.length); i++) {
    const refReturn = ((prices[i] / config.startingRefPrice) - 1) * 100;
    const dayFraction = i / config.tradingDays;
    const fundReturn = calculateFundReturnFromRefReturn(
      refReturn / 100,
      config.capNet / 100,
      config.bufferStartPct / 100,
      config.bufferEndPct / 100,
      dayFraction,
    ) * 100;

    points.push({
      date: dates[i],
      fundReturn: Math.round(fundReturn * 100) / 100,
      refAssetReturn: Math.round(refReturn * 100) / 100,
    });
  }

  return points;
}
