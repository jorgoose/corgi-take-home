export interface ScenarioResult {
  refReturn: number;
  fundReturn: number;
  note: string;
}

export type ScenarioMode = "inception" | "current";

export interface ScenarioConfig {
  mode: ScenarioMode;
  cap: number;
  bufferStartPct: number;
  bufferEndPct: number;
  remainingBuffer: number;
  downsideBeforeBuffer: number;
}

// --- Scenario Analysis (Tool 4) types ---

export type AnalysisMode = "all-funds" | "series-blend";

export interface BlendWeights {
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
}

export const DEFAULT_BLEND_WEIGHTS: BlendWeights = {
  May: 25,
  Jun: 25,
  Jul: 25,
  Aug: 25,
};

export const DEFAULT_SCENARIO_RETURNS = [-30, -20, -10, -5, 0, 5, 10, 20, 30];
