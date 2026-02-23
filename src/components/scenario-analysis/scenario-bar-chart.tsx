"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { MultiFundScenarioRow } from "@/lib/api/scenario-analysis";
import { CHART_COLORS } from "@/lib/constants/chart-config";
import { formatPercent } from "@/lib/utils/format";

interface ScenarioBarChartProps {
  rows: MultiFundScenarioRow[];
  selectedScenario: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-mono font-medium mb-1">{label}</p>
      <p>Fund Return: {formatPercent(payload[0].value)}</p>
    </div>
  );
}

export function ScenarioBarChart({ rows, selectedScenario }: ScenarioBarChartProps) {
  const data = rows
    .map(({ fund, results }) => ({
      ticker: fund.ticker,
      fundReturn: results[selectedScenario]?.fundReturn ?? 0,
      bufferType: fund.bufferType,
    }))
    .sort((a, b) => b.fundReturn - a.fundReturn);

  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-sm font-medium mb-4">
        Fund Returns When Reference Asset Returns{" "}
        <span className="text-[#FF5C00] font-mono">
          {selectedScenario > 0 ? "+" : ""}
          {selectedScenario}%
        </span>
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 28)}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatPercent(v)}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            type="category"
            dataKey="ticker"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}
            width={48}
          />
          <Tooltip content={<BarTooltip />} />
          <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={1} />
          <ReferenceLine
            x={selectedScenario}
            stroke={CHART_COLORS.refAsset}
            strokeDasharray="4 4"
            strokeWidth={1.5}
            label={{
              value: `Ref: ${formatPercent(selectedScenario)}`,
              position: "top",
              fill: CHART_COLORS.refAsset,
              fontSize: 11,
            }}
          />
          <Bar dataKey="fundReturn" radius={[0, 4, 4, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.ticker}
                fill={entry.fundReturn >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
