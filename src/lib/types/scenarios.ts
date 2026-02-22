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
