import { ScenarioResult, ScenarioConfig } from "../types/scenarios";
import { BufferType } from "../types/fund";
import { calculateFundReturnPct, getScenarioNote } from "./buffer-calculations";

/**
 * Get the default scenario return values based on buffer type
 */
function getDefaultScenarios(bufferType: BufferType, capPct: number, bufferStartPct: number, bufferEndPct: number): number[] {
  switch (bufferType) {
    case "standard":
      return [30, 20, capPct, 10, 5, 0, bufferEndPct / 2, bufferEndPct, -25, -50];
    case "deep":
      return [30, 20, capPct, 10, 5, 0, -3, bufferStartPct, -15, -25, bufferEndPct, -50];
    case "full":
      return [30, 20, capPct, 5, 0, -10, -25, -50, -75, -100];
    default:
      return [30, 20, 10, 0, -10, -25, -50];
  }
}

/**
 * Calculate scenarios for a fund
 */
export function calculateScenarios(config: ScenarioConfig, bufferType: BufferType): ScenarioResult[] {
  const { cap, bufferStartPct, bufferEndPct } = config;

  const scenarioReturns = getDefaultScenarios(bufferType, cap, bufferStartPct, bufferEndPct);

  // Deduplicate and sort descending
  const unique = [...new Set(scenarioReturns.map(r => Math.round(r * 100) / 100))].sort((a, b) => b - a);

  return unique.map((refReturnPct) => {
    const fundReturnPct = calculateFundReturnPct(refReturnPct, cap, bufferStartPct, bufferEndPct);
    return {
      refReturn: Math.round(refReturnPct * 100) / 100,
      fundReturn: Math.round(fundReturnPct * 100) / 100,
      note: getScenarioNote(refReturnPct, fundReturnPct, cap, bufferStartPct, bufferEndPct),
    };
  });
}

/**
 * Calculate a single custom scenario
 */
export function calculateCustomScenario(
  refReturnPct: number,
  cap: number,
  bufferStartPct: number,
  bufferEndPct: number
): ScenarioResult {
  const fundReturnPct = calculateFundReturnPct(refReturnPct, cap, bufferStartPct, bufferEndPct);
  return {
    refReturn: refReturnPct,
    fundReturn: Math.round(fundReturnPct * 100) / 100,
    note: getScenarioNote(refReturnPct, fundReturnPct, cap, bufferStartPct, bufferEndPct),
  };
}
