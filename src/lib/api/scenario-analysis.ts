import { FundWithCurrentValues, SeriesMonth } from "../types/fund";
import { ScenarioResult } from "../types/scenarios";
import { calculateCustomScenario } from "../calculations/scenario-engine";

export interface MultiFundScenarioRow {
  fund: FundWithCurrentValues;
  results: Record<number, ScenarioResult>; // keyed by refReturn %
}

/**
 * Calculate scenario results for multiple funds across a set of ref returns.
 * Uses each fund's inception-level cap/buffer for a standardized comparison.
 */
export function getMultiFundScenarios(
  funds: FundWithCurrentValues[],
  refReturns: number[]
): MultiFundScenarioRow[] {
  return funds.map((fund) => {
    const results: Record<number, ScenarioResult> = {};
    for (const refReturn of refReturns) {
      results[refReturn] = calculateCustomScenario(
        refReturn,
        fund.outcomePeriod.startingCapNet,
        fund.bufferStartPct,
        fund.bufferEndPct
      );
    }
    return { fund, results };
  });
}

export interface BlendedScenarioResult {
  refReturn: number;
  blendedFundReturn: number;
  seriesReturns: Record<SeriesMonth, number>;
}

/**
 * Calculate blended scenario results for a fund family across series months.
 * Weights are percentages that sum to 100.
 */
export function getBlendedFamilyScenarios(
  familyFunds: FundWithCurrentValues[],
  weights: Record<SeriesMonth, number>,
  refReturns: number[]
): BlendedScenarioResult[] {
  return refReturns.map((refReturn) => {
    const seriesReturns = {} as Record<SeriesMonth, number>;
    let blendedFundReturn = 0;

    for (const fund of familyFunds) {
      const result = calculateCustomScenario(
        refReturn,
        fund.outcomePeriod.startingCapNet,
        fund.bufferStartPct,
        fund.bufferEndPct
      );
      seriesReturns[fund.seriesMonth] = result.fundReturn;
      blendedFundReturn += result.fundReturn * (weights[fund.seriesMonth] / 100);
    }

    return {
      refReturn,
      blendedFundReturn: Math.round(blendedFundReturn * 100) / 100,
      seriesReturns,
    };
  });
}
