import { FundWithCurrentValues } from "../types/fund";
import { formatPercent, formatDate, formatDaysRemaining } from "./format";

export function exportFundsToCSV(funds: FundWithCurrentValues[], filename: string = "corgi-buffer-etf-screener.csv"): void {
  const headers = [
    "Ticker",
    "Fund Name",
    "Reference Asset",
    "Buffer Type",
    "Series",
    "Starting Cap (Net)",
    "Remaining Cap (Net)",
    "Remaining Buffer (Net)",
    "Downside Before Buffer",
    "Fund Return PTD",
    "Ref Asset Return PTD",
    "Days Remaining",
    "Period End",
  ];

  const rows = funds.map((f) => [
    f.ticker,
    f.name,
    f.referenceAssetTicker,
    f.bufferType,
    f.seriesMonth,
    f.outcomePeriod.startingCapNet.toFixed(2) + "%",
    f.currentValues.remainingCapNet.toFixed(2) + "%",
    f.currentValues.remainingBufferNet.toFixed(2) + "%",
    f.currentValues.downsideBeforeBuffer.toFixed(2) + "%",
    formatPercent(f.currentValues.fundReturnPtd),
    formatPercent(f.currentValues.refAssetReturnPtd),
    f.currentValues.remainingOutcomePeriodDays.toString(),
    formatDate(f.outcomePeriod.endDate),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
