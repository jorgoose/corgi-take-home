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
        bufferStartPct: fund.bufferStartPct,
        bufferEndPct: fund.bufferEndPct,
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

  const cap = mode === "inception"
    ? fund.outcomePeriod.startingCapNet
    : fund.currentValues.remainingCapNet;

  return calculateCustomScenario(
    refReturnPct,
    cap,
    fund.bufferStartPct,
    fund.bufferEndPct
  );
}
