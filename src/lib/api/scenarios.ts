import { ScenarioResult, ScenarioMode, ScenarioConfig } from "../types/scenarios";
import { getFundByTicker } from "./funds";
import { calculateScenarios, calculateCustomScenario } from "../calculations/scenario-engine";

export function getScenarioData(ticker: string, mode: ScenarioMode = "inception"): {
  scenarios: ScenarioResult[];
  config: ScenarioConfig;
} | null {
  const fund = getFundByTicker(ticker);
  if (!fund) return null;

  const config: ScenarioConfig = mode === "inception"
    ? {
        mode,
        cap: fund.outcomePeriod.startingCapNet,
        bufferStartPct: fund.bufferStartPct,
        bufferEndPct: fund.bufferEndPct,
        remainingBuffer: fund.bufferSizePct,
        downsideBeforeBuffer: Math.abs(fund.bufferStartPct),
      }
    : {
        mode,
        cap: fund.currentValues.remainingCapNet,
        bufferStartPct: -fund.currentValues.downsideBeforeBufferGross,
        bufferEndPct: -(fund.currentValues.downsideBeforeBufferGross + fund.currentValues.remainingBufferGross),
        remainingBuffer: fund.currentValues.remainingBufferNet,
        downsideBeforeBuffer: fund.currentValues.downsideBeforeBuffer,
      };

  const scenarios = calculateScenarios(config, fund.bufferType);

  return { scenarios, config };
}

export function getCustomScenario(
  ticker: string,
  refReturnPct: number,
  mode: ScenarioMode = "inception"
): ScenarioResult | null {
  const fund = getFundByTicker(ticker);
  if (!fund) return null;

  if (mode === "inception") {
    return calculateCustomScenario(
      refReturnPct,
      fund.outcomePeriod.startingCapNet,
      fund.bufferStartPct,
      fund.bufferEndPct
    );
  }

  return calculateCustomScenario(
    refReturnPct,
    fund.currentValues.remainingCapNet,
    -fund.currentValues.downsideBeforeBufferGross,
    -(fund.currentValues.downsideBeforeBufferGross + fund.currentValues.remainingBufferGross)
  );
}
