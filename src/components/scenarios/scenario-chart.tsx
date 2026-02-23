"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import { ScenarioResult } from "@/lib/types/scenarios";
import { SCENARIO_COLORS, CHART_COLORS } from "@/lib/constants/chart-config";

interface ScenarioChartProps {
  scenarios: ScenarioResult[];
  cap: number;
  bufferStartPct: number;
  bufferEndPct: number;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { dataKey: string; name: string; value: number; color: string; fill?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium mb-1">Scenario: {label}%</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.fill || entry.color }}>
          {entry.name}: {entry.value > 0 ? "+" : ""}{entry.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

export function ScenarioChart({ scenarios, cap, bufferStartPct, bufferEndPct }: ScenarioChartProps) {
  const data = scenarios.map((s) => ({
    scenario: s.refReturn > 0 ? `+${s.refReturn}` : `${s.refReturn}`,
    "Ref Asset": s.refReturn,
    "Fund": s.fundReturn,
  }));

  const allValues = scenarios.flatMap((s) => [s.refReturn, s.fundReturn]);
  const minY = Math.min(...allValues, bufferEndPct) - 5;
  const maxY = Math.max(...allValues, cap) + 5;

  return (
    <div className="w-full rounded-lg border bg-card p-4" role="img" aria-label="Bar chart showing hypothetical fund returns vs reference asset returns across scenarios">
      <h3 className="text-sm font-semibold mb-3">Hypothetical Scenario Analysis</h3>
      <span className="sr-only">Bar chart comparing hypothetical fund returns against reference asset returns for various market scenarios, with cap and buffer reference lines.</span>
      <div className="h-[350px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 30, left: 10, bottom: 5 }} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="scenario" tick={{ fontSize: 11 }} />
            <YAxis
              domain={[minY, maxY]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Reference lines */}
            <ReferenceLine
              y={cap}
              stroke={CHART_COLORS.cap}
              strokeDasharray="6 3"
              label={{ value: `Cap ${cap.toFixed(1)}%`, position: "right", fontSize: 10, fill: CHART_COLORS.cap }}
            />
            {bufferEndPct > -100 && (
              <ReferenceLine
                y={bufferEndPct}
                stroke={CHART_COLORS.bufferEnd}
                strokeDasharray="6 3"
                label={{ value: `Buffer End ${bufferEndPct}%`, position: "right", fontSize: 10, fill: CHART_COLORS.bufferEnd }}
              />
            )}
            {bufferStartPct < 0 && (
              <ReferenceLine
                y={bufferStartPct}
                stroke={CHART_COLORS.bufferStart}
                strokeDasharray="6 3"
                label={{ value: `Gap ${bufferStartPct}%`, position: "right", fontSize: 10, fill: CHART_COLORS.bufferStart }}
              />
            )}
            <ReferenceLine y={0} stroke="#a8a29e" strokeWidth={1} />

            <Bar dataKey="Ref Asset" fill={SCENARIO_COLORS.refAsset} radius={[2, 2, 0, 0]}>
              <LabelList
                dataKey="Ref Asset"
                position="top"
                formatter={((v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`) as never}
                style={{ fontSize: 9, fill: SCENARIO_COLORS.refAsset }}
              />
            </Bar>
            <Bar dataKey="Fund" fill={SCENARIO_COLORS.fund} radius={[2, 2, 0, 0]}>
              <LabelList
                dataKey="Fund"
                position="top"
                formatter={((v: number) => `${v > 0 ? "+" : ""}${v.toFixed(1)}%`) as never}
                style={{ fontSize: 9, fill: "#d4d4d8" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
