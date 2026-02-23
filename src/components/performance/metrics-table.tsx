import { OutcomePeriod, DailyValues, FundDefinition } from "@/lib/types/fund";
import { formatPercent, formatPercentUnsigned, formatCurrency, formatDate, formatDaysRemaining } from "@/lib/utils/format";

interface MetricsTableProps {
  fund: FundDefinition;
  outcomePeriod: OutcomePeriod;
  currentValues: DailyValues;
}

interface MetricRow {
  label: string;
  value: string;
}

export function MetricsTable({ fund, outcomePeriod, currentValues }: MetricsTableProps) {
  const periodMetrics: MetricRow[] = [
    { label: "Series", value: fund.seriesMonth },
    { label: "Reference Asset", value: `${fund.referenceAssetName} (${fund.referenceAssetTicker})` },
    { label: "Outcome Period", value: `${formatDate(outcomePeriod.startDate)} — ${formatDate(outcomePeriod.endDate)}` },
    { label: "Fund Cap (Net)", value: `${formatPercentUnsigned(outcomePeriod.startingCapGross)} (${formatPercentUnsigned(outcomePeriod.startingCapNet)})` },
    { label: "Buffer (Net)", value: `${formatPercentUnsigned(outcomePeriod.startingBufferGross)} (${formatPercentUnsigned(outcomePeriod.startingBufferNet)})` },
    { label: "Starting Fund Value", value: formatCurrency(outcomePeriod.startingFundNav) },
    { label: "Fund Cap Value", value: formatCurrency(outcomePeriod.fundCapValue) },
    { label: "Reference Asset Cap", value: formatPercentUnsigned(outcomePeriod.refAssetCap) },
    { label: "Starting Ref Asset Value", value: formatCurrency(outcomePeriod.startingRefAssetPrice) },
    { label: "Ref Asset Cap Value", value: formatCurrency(outcomePeriod.refAssetCapValue) },
    { label: "Buffer Start % / Ref Asset Value", value: `${formatPercentUnsigned(Math.abs(fund.bufferStartPct))} / ${formatCurrency(outcomePeriod.bufferStartRefValue)}` },
    { label: "Buffer End % / Ref Asset Value", value: `${formatPercent(fund.bufferEndPct)} / ${formatCurrency(outcomePeriod.bufferEndRefValue)}` },
  ];

  const currentMetrics: MetricRow[] = [
    { label: "Remaining Outcome Period", value: formatDaysRemaining(currentValues.remainingOutcomePeriodDays) },
    { label: "Fund Value / Return", value: `${formatCurrency(currentValues.fundNav)} / ${formatPercent(currentValues.fundReturnPtd)}` },
    { label: "Ref Asset Value / Return", value: `${formatCurrency(currentValues.refAssetPrice)} / ${formatPercent(currentValues.refAssetReturnPtd)}` },
    { label: "Remaining Cap (Net)", value: `${formatPercentUnsigned(currentValues.remainingCapGross)} (${formatPercentUnsigned(currentValues.remainingCapNet)})` },
    { label: "Ref Asset Return to Realize Cap", value: formatPercent(currentValues.refAssetReturnToCap) },
    { label: "Remaining Buffer (Net)", value: `${formatPercentUnsigned(currentValues.remainingBufferGross)} (${formatPercentUnsigned(currentValues.remainingBufferNet)})` },
    { label: "Downside Before Buffer (Net)", value: `${formatPercent(-currentValues.downsideBeforeBufferGross)} (${formatPercent(-currentValues.downsideBeforeBuffer)})` },
    { label: "Ref Asset to Buffer End", value: formatPercent(currentValues.refAssetToBufferEnd) },
    { label: "Unrealized Option Payoff (Net)", value: `${formatPercent(currentValues.unrealizedOptionPayoffGross)} (${formatPercent(currentValues.unrealizedOptionPayoffNet)})` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Outcome Period Values</h3>
        <dl className="space-y-2">
          {periodMetrics.map((m) => (
            <div key={m.label} className="flex justify-between gap-4 text-sm">
              <dt className="text-muted-foreground">{m.label}</dt>
              <dd className="font-mono text-right">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-semibold mb-3">Current Values <span className="font-normal text-muted-foreground">as of {formatDate(currentValues.date)}</span></h3>
        <dl className="space-y-2">
          {currentMetrics.map((m) => (
            <div key={m.label} className="flex justify-between gap-4 text-sm">
              <dt className="text-muted-foreground">{m.label}</dt>
              <dd className="font-mono text-right">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
