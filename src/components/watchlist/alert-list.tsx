"use client";

import { useState } from "react";
import Link from "next/link";
import type { AlertRule, Watchlist } from "@/hooks/use-watchlist-store";
import { FundWithCurrentValues } from "@/lib/types/fund";
import { describeAlert, getTriggeredFunds, getMetricValue, ALERT_METRIC_LABELS } from "@/lib/utils/alert-evaluation";
import { formatPercent, formatDaysRemaining } from "@/lib/utils/format";

interface AlertListProps {
  alerts: AlertRule[];
  watchlists: Watchlist[];
  allFunds: FundWithCurrentValues[];
  onDelete: (id: string) => void;
}

function formatMetricValue(metric: string, value: number): string {
  if (metric === "remainingOutcomePeriodDays") return formatDaysRemaining(value);
  return formatPercent(value);
}

export function AlertList({ alerts, watchlists, allFunds, onDelete }: AlertListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        No alerts created yet. Use the form above to set up threshold-based alerts.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const triggered = getTriggeredFunds(allFunds, alert, watchlists);
        const isExpanded = expandedId === alert.id;

        return (
          <div key={alert.id} className="rounded-lg border bg-card">
            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
              onClick={() => setExpandedId(isExpanded ? null : alert.id)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                    triggered.length > 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-green-500/20 text-green-400"
                  }`}
                >
                  {triggered.length}
                </span>
                <div>
                  <p className="text-sm font-medium">{describeAlert(alert, watchlists)}</p>
                  <p className="text-xs text-muted-foreground">
                    {triggered.length} fund{triggered.length !== 1 ? "s" : ""} triggered
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(alert.id);
                  }}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  Delete
                </button>
                <span className="text-xs text-muted-foreground">{isExpanded ? "▲" : "▼"}</span>
              </div>
            </div>

            {isExpanded && triggered.length > 0 && (
              <div className="border-t px-4 py-3">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left">
                        <th className="pr-3 py-1 text-xs font-medium text-muted-foreground">Ticker</th>
                        <th className="pr-3 py-1 text-xs font-medium text-muted-foreground">Fund</th>
                        <th className="pr-3 py-1 text-xs font-medium text-muted-foreground text-right">
                          {ALERT_METRIC_LABELS[alert.metric]}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {triggered.map((fund) => (
                        <tr key={fund.ticker} className="border-t border-muted">
                          <td className="pr-3 py-1.5">
                            <Link
                              href={`/tools/performance/${fund.ticker}`}
                              className="font-mono text-xs text-[#FF5C00] hover:underline"
                            >
                              {fund.ticker}
                            </Link>
                          </td>
                          <td className="pr-3 py-1.5 text-xs text-muted-foreground truncate max-w-[200px]">
                            {fund.name}
                          </td>
                          <td className="pr-3 py-1.5 text-right font-mono text-xs">
                            {formatMetricValue(alert.metric, getMetricValue(fund, alert.metric))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {isExpanded && triggered.length === 0 && (
              <div className="border-t px-4 py-3 text-xs text-muted-foreground text-center">
                No funds currently trigger this alert.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
