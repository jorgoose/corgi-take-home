/**
 * Core buffer ETF return calculation.
 *
 * Given a reference asset return and fund parameters, calculates the fund's return.
 *
 * Buffer types:
 * - Standard (0% to -X%): absorbs first X% of losses
 * - Deep (-5% to -35%): investor bears first 5%, buffer absorbs next 30%
 * - Full (0% to -100%): absorbs all losses
 *
 * @param refReturn - Reference asset return (e.g., -0.20 for -20%)
 * @param cap - Fund's cap (e.g., 0.15 for 15%)
 * @param bufferStartPct - Where buffer starts (0 for standard/full, -0.05 for deep)
 * @param bufferEndPct - Where buffer ends (-0.10, -0.15, -0.35, or -1.00)
 * @returns Fund return as a decimal
 */
export function calculateFundReturn(
  refReturn: number,
  cap: number,
  bufferStartPct: number,
  bufferEndPct: number
): number {
  // Upside: capped at cap level
  if (refReturn >= cap) {
    return cap;
  }

  // Positive return below cap: full participation
  if (refReturn >= 0) {
    return refReturn;
  }

  // Negative returns - depends on buffer structure

  // Above buffer start (in the "gap" for deep buffer, or no loss for standard)
  // For standard buffer: bufferStartPct = 0, so this won't trigger for negative returns
  // For deep buffer: bufferStartPct = -0.05, so returns between 0 and -5% pass through
  if (refReturn >= bufferStartPct) {
    return refReturn;
  }

  // Within buffer zone: losses are absorbed
  if (refReturn >= bufferEndPct) {
    return bufferStartPct; // investor's loss is capped at the buffer start
  }

  // Beyond buffer: investor bears excess losses
  return bufferStartPct + (refReturn - bufferEndPct);
}

/**
 * Same as calculateFundReturn but takes percentage inputs (e.g., -20 not -0.20)
 */
export function calculateFundReturnPct(
  refReturnPct: number,
  capPct: number,
  bufferStartPct: number,
  bufferEndPct: number
): number {
  return calculateFundReturn(
    refReturnPct / 100,
    capPct / 100,
    bufferStartPct / 100,
    bufferEndPct / 100
  ) * 100;
}

/**
 * Generate a note/description for a given scenario result
 */
export function getScenarioNote(
  refReturnPct: number,
  fundReturnPct: number,
  capPct: number,
  bufferStartPct: number,
  bufferEndPct: number
): string {
  if (refReturnPct >= capPct) return "Capped";
  if (refReturnPct >= 0) return refReturnPct === 0 ? "Flat" : "Below cap";

  // Negative returns
  if (bufferStartPct < 0 && refReturnPct > bufferStartPct) {
    return "Investor bears loss (in gap)";
  }
  if (refReturnPct === bufferStartPct && bufferStartPct < 0) {
    return "Gap fully realized";
  }
  if (refReturnPct > bufferEndPct) {
    if (fundReturnPct === 0 || fundReturnPct === bufferStartPct) {
      return "Buffer absorbs all loss";
    }
    return "Buffer absorbing";
  }
  if (refReturnPct === bufferEndPct) {
    return "Buffer fully consumed";
  }
  return "Beyond buffer";
}
