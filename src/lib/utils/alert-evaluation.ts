import { FundWithCurrentValues } from "../types/fund";
import type { AlertMetric, AlertRule, Watchlist } from "@/hooks/use-watchlist-store";

export const ALERT_METRIC_LABELS: Record<AlertMetric, string> = {
  remainingBufferNet: "Remaining Buffer (Net)",
  remainingCapNet: "Remaining Cap (Net)",
  downsideBeforeBuffer: "Downside Before Buffer",
  remainingOutcomePeriodDays: "Days Remaining",
  fundReturnPtd: "Fund Return PTD",
};

export function getMetricValue(fund: FundWithCurrentValues, metric: AlertMetric): number {
  return fund.currentValues[metric];
}

export function fundTriggersAlert(fund: FundWithCurrentValues, rule: AlertRule): boolean {
  const value = getMetricValue(fund, rule.metric);
  return rule.condition === "lt" ? value < rule.threshold : value > rule.threshold;
}

export function getTriggeredFunds(
  allFunds: FundWithCurrentValues[],
  rule: AlertRule,
  watchlists: Watchlist[]
): FundWithCurrentValues[] {
  let funds = allFunds;

  if (rule.appliedTo !== "all") {
    const watchlist = watchlists.find((w) => w.id === rule.appliedTo);
    if (watchlist) {
      funds = allFunds.filter((f) => watchlist.tickers.includes(f.ticker));
    } else {
      return [];
    }
  }

  return funds.filter((f) => fundTriggersAlert(f, rule));
}

export function describeAlert(rule: AlertRule, watchlists: Watchlist[]): string {
  const metricLabel = ALERT_METRIC_LABELS[rule.metric];
  const condLabel = rule.condition === "lt" ? "<" : ">";
  const thresholdStr =
    rule.metric === "remainingOutcomePeriodDays"
      ? `${rule.threshold} days`
      : `${rule.threshold}%`;
  const scopeLabel =
    rule.appliedTo === "all"
      ? "all funds"
      : watchlists.find((w) => w.id === rule.appliedTo)?.name ?? "unknown list";

  return `${metricLabel} ${condLabel} ${thresholdStr} (${scopeLabel})`;
}
