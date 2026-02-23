export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  { term: "Outcome Period", definition: "The approximately one-year period over which the fund's defined outcome parameters (cap and buffer) apply. At the end of each outcome period, the fund resets with new parameters." },
  { term: "Cap (Gross)", definition: "The maximum potential return of the fund before fees over the outcome period. This represents the upper limit of participation in the reference asset's gains." },
  { term: "Cap (Net)", definition: "The maximum potential return of the fund after deducting the fund's expense ratio. This is the effective cap an investor would experience." },
  { term: "Buffer", definition: "The amount of downside protection provided by the fund. A 15% buffer absorbs the first 15% of losses in the reference asset." },
  { term: "Buffer Start", definition: "The reference asset return level where the buffer protection begins. For standard buffers this is 0% (first-loss protection). For deep buffers, this is -5% (gapped protection)." },
  { term: "Buffer End", definition: "The reference asset return level where the buffer protection is fully consumed. Losses beyond this point are borne by the investor." },
  { term: "Remaining Cap (Net)", definition: "The maximum additional upside potential available if the fund is held to the end of the current outcome period, after fees. This decreases as the fund appreciates." },
  { term: "Remaining Buffer (Net)", definition: "The current amount of downside protection remaining. This may decrease if the reference asset has already declined." },
  { term: "Downside Before Buffer", definition: "The amount of loss an investor would experience before the buffer protection begins. For standard buffers this is 0%. For deep buffers, this represents the 'gap' that the investor bears." },
  { term: "Reference Asset to Buffer End", definition: "How much further the reference asset would need to decline from its current level to fully consume the buffer protection." },
  { term: "Reference Asset Return to Realize Cap", definition: "The additional reference asset appreciation needed from current levels for the fund to reach its cap." },
  { term: "Fund Return (Period-to-Date)", definition: "The fund's total return since the beginning of the current outcome period, calculated as (Current NAV / Starting NAV - 1)." },
  { term: "Reference Asset Return (Period-to-Date)", definition: "The reference asset's total return since the beginning of the current outcome period." },
  { term: "Series", definition: "The month in which a fund's outcome period begins. Corgi offers May, June, July, and August series." },
  { term: "Starting Fund Value", definition: "The fund's Net Asset Value (NAV) at the beginning of the current outcome period." },
  { term: "Deep Buffer", definition: "A buffer structure where the investor bears the first portion of losses (the 'gap'), and the buffer absorbs losses within a defined range. For example, a -5% to -35% deep buffer means the investor bears the first 5% of losses, the buffer absorbs the next 30%, and the investor bears losses beyond -35%." },
  { term: "Full Protection", definition: "A buffer structure that absorbs 100% of reference asset losses. The tradeoff is a significantly lower upside cap." },
  { term: "Fund Cap Value", definition: "The maximum value of the fund at the end of the Target Outcome Period if the fund realizes its return at its maximum cap." },
  { term: "Reference Asset Cap", definition: "The price return needed on the reference asset for the fund to realize the return of its maximum cap." },
  { term: "Unrealized Option Payoff (Net)", definition: "Based on the fund's value, the potential price return of the fund, before fees and expenses, if held to the end of the Target Outcome Period assuming the current Reference Asset Value remains unchanged. This is due to the intrinsic value of the underlying options positions that create the fund's buffer range." },
  { term: "Net", definition: "After fees and expenses, excluding brokerage commissions, trading fees, taxes and extraordinary expenses not included in the fund's management fee." },
  { term: "FLEX Options", definition: "FLexible EXchange Options - customizable exchange-traded option contracts used to structure the fund's defined outcome parameters." },
];
