"use client";

import { useState } from "react";
import type { AlertMetric, Watchlist } from "@/hooks/use-watchlist-store";
import { ALERT_METRIC_LABELS } from "@/lib/utils/alert-evaluation";

interface AlertCreatorProps {
  watchlists: Watchlist[];
  onAdd: (rule: { metric: AlertMetric; condition: "lt" | "gt"; threshold: number; appliedTo: "all" | string }) => void;
}

const METRICS: AlertMetric[] = [
  "remainingBufferNet",
  "remainingCapNet",
  "downsideBeforeBuffer",
  "remainingOutcomePeriodDays",
  "fundReturnPtd",
];

export function AlertCreator({ watchlists, onAdd }: AlertCreatorProps) {
  const [metric, setMetric] = useState<AlertMetric>("remainingBufferNet");
  const [condition, setCondition] = useState<"lt" | "gt">("lt");
  const [threshold, setThreshold] = useState("");
  const [appliedTo, setAppliedTo] = useState<"all" | string>("all");

  function handleAdd() {
    const val = parseFloat(threshold);
    if (isNaN(val)) return;
    onAdd({ metric, condition, threshold: val, appliedTo });
    setThreshold("");
  }

  const thresholdUnit = metric === "remainingOutcomePeriodDays" ? "days" : "%";

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <label className="text-xs font-medium text-muted-foreground block">Create Alert Rule</label>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
        {/* Metric */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Metric</label>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value as AlertMetric)}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            {METRICS.map((m) => (
              <option key={m} value={m}>
                {ALERT_METRIC_LABELS[m]}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as "lt" | "gt")}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            <option value="lt">Less than</option>
            <option value="gt">Greater than</option>
          </select>
        </div>

        {/* Threshold */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Threshold ({thresholdUnit})
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={thresholdUnit === "days" ? "30" : "5"}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          />
        </div>

        {/* Scope */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Apply to</label>
          <select
            value={appliedTo}
            onChange={(e) => setAppliedTo(e.target.value)}
            className="w-full rounded-md border bg-background px-2 py-1.5 text-sm"
          >
            <option value="all">All Funds</option>
            {watchlists.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Add button */}
        <button
          onClick={handleAdd}
          disabled={!threshold}
          className="rounded-md bg-[#FF5C00] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#FF5C00]/90 disabled:opacity-40 transition-colors"
        >
          Add Alert
        </button>
      </div>
    </div>
  );
}
