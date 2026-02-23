"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TimeSeriesPoint } from "@/lib/types/fund";
import { OutcomePeriod } from "@/lib/types/fund";
import { CHART_COLORS } from "@/lib/constants/chart-config";
import { formatDateShort } from "@/lib/utils/format";

interface PerformanceChartProps {
  timeSeries: TimeSeriesPoint[];
  outcomePeriod: OutcomePeriod;
  bufferStartPct: number;
  bufferEndPct: number;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover p-3 shadow-md text-sm">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value > 0 ? "+" : ""}{entry.value.toFixed(2)}%
        </p>
      ))}
    </div>
  );
}

export function PerformanceChart({ timeSeries, outcomePeriod, bufferStartPct, bufferEndPct }: PerformanceChartProps) {
  // Sample data for reasonable chart density (show ~60 points max)
  const step = Math.max(1, Math.floor(timeSeries.length / 60));
  const data = timeSeries.filter((_, i) => i % step === 0 || i === timeSeries.length - 1).map((p) => ({
    date: formatDateShort(p.date),
    "Fund": p.fundReturn,
    "Reference Asset": p.refAssetReturn,
  }));

  // Calculate y-axis domain
  const allValues = timeSeries.flatMap((p) => [p.fundReturn, p.refAssetReturn]);
  const minY = Math.min(...allValues, bufferEndPct, 0) - 2;
  const maxY = Math.max(...allValues, outcomePeriod.startingCapNet, 0) + 2;

  return (
    <div className="w-full rounded-lg border bg-card p-4">
      <h3 className="text-sm font-semibold mb-3">Outcome Period Performance</h3>
      <div className="h-[350px] sm:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
              tickCount={8}
            />
            <YAxis
              domain={[minY, maxY]}
              tick={{ fontSize: 11 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            {/* Reference lines */}
            <ReferenceLine
              y={outcomePeriod.startingCapNet}
              stroke={CHART_COLORS.cap}
              strokeDasharray="6 3"
              label={{ value: `Cap ${outcomePeriod.startingCapNet.toFixed(1)}%`, position: "right", fontSize: 10, fill: CHART_COLORS.cap }}
            />
            <ReferenceLine
              y={bufferStartPct}
              stroke={CHART_COLORS.bufferStart}
              strokeDasharray="6 3"
              label={{ value: `Buffer Start ${bufferStartPct.toFixed(2)}%`, position: "right", fontSize: 10, fill: CHART_COLORS.bufferStart }}
            />
            <ReferenceLine
              y={bufferEndPct}
              stroke={CHART_COLORS.bufferEnd}
              strokeDasharray="6 3"
              label={{ value: `Buffer End ${bufferEndPct}%`, position: "right", fontSize: 10, fill: CHART_COLORS.bufferEnd }}
            />
            {bufferStartPct !== 0 && <ReferenceLine y={0} stroke="#a8a29e" strokeWidth={1} />}

            {/* Data lines */}
            <Line
              type="monotone"
              dataKey="Fund"
              stroke={CHART_COLORS.fund}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="Reference Asset"
              stroke={CHART_COLORS.refAsset}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
