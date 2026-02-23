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
  Legend,
  Cell,
} from "recharts";
import { BlendedScenarioResult } from "@/lib/api/scenario-analysis";
import { CHART_COLORS, SCENARIO_COLORS } from "@/lib/constants/chart-config";
import { formatPercent } from "@/lib/utils/format";
import { SeriesMonth } from "@/lib/types/fund";

interface BlendResultsProps {
  results: BlendedScenarioResult[];
}

const MONTHS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

const NAME_MAP: Record<string, string> = {
  refReturn: "Ref Asset Return",
  blendedReturn: "Blended Fund Return",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BlendTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: { dataKey: string; value: number; color: string }) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {NAME_MAP[entry.dataKey] ?? entry.dataKey}: {formatPercent(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function BlendResults({ results }: BlendResultsProps) {
  if (results.length === 0) return null;

  const chartData = results.map((r) => ({
    label: `${r.refReturn > 0 ? "+" : ""}${r.refReturn}%`,
    refReturn: r.refReturn,
    blendedReturn: r.blendedFundReturn,
  }));

  return (
    <div className="space-y-6">
      {/* Bar chart */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="text-sm font-medium mb-4">Blended Fund Return vs. Reference Scenario</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickFormatter={(v: number) => `${v}%`}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip content={<BlendTooltip />} />
            <Legend
              formatter={(value: string) => NAME_MAP[value] ?? value}
            />
            <ReferenceLine y={0} stroke="hsl(var(--border))" />
            <Bar dataKey="refReturn" fill={SCENARIO_COLORS.refAsset} radius={[4, 4, 0, 0]} />
            <Bar dataKey="blendedReturn" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.label}
                  fill={entry.blendedReturn >= 0 ? CHART_COLORS.positive : CHART_COLORS.negative}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Ref Return</th>
              {MONTHS.map((m) => (
                <th key={m} className="px-3 py-2 text-center font-medium text-muted-foreground">
                  {m}
                </th>
              ))}
              <th className="px-3 py-2 text-center font-medium text-[#FF5C00]">Blend</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row.refReturn} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-3 py-2 font-mono text-xs">
                  {formatPercent(row.refReturn)}
                </td>
                {MONTHS.map((m) => (
                  <td key={m} className="px-3 py-2 text-center font-mono text-xs">
                    {row.seriesReturns[m] !== undefined ? formatPercent(row.seriesReturns[m]) : "—"}
                  </td>
                ))}
                <td
                  className={`px-3 py-2 text-center font-mono text-xs font-medium ${
                    row.blendedFundReturn >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatPercent(row.blendedFundReturn)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
