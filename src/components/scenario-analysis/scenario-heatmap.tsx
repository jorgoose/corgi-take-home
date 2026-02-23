"use client";

import { MultiFundScenarioRow } from "@/lib/api/scenario-analysis";
import { formatPercentSigned } from "@/lib/utils/format";
import { BufferTypeBadge } from "@/components/fund/buffer-type-badge";
import { ReferenceAssetBadge } from "@/components/fund/reference-asset-badge";

interface ScenarioHeatmapProps {
  rows: MultiFundScenarioRow[];
  scenarioReturns: number[];
  selectedScenario: number | null;
  onSelectScenario: (refReturn: number) => void;
}

function getCellColor(fundReturn: number): string {
  if (fundReturn > 5) return "bg-green-500/20 text-green-400";
  if (fundReturn > 0) return "bg-green-500/10 text-green-400";
  if (fundReturn === 0) return "bg-muted/50 text-muted-foreground";
  if (fundReturn > -5) return "bg-red-500/10 text-red-400";
  if (fundReturn > -15) return "bg-red-500/20 text-red-400";
  return "bg-red-500/30 text-red-300";
}

export function ScenarioHeatmap({
  rows,
  scenarioReturns,
  selectedScenario,
  onSelectScenario,
}: ScenarioHeatmapProps) {
  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
        No funds match the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="sticky left-0 z-10 bg-muted/50 px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
              Fund
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
              Type
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
              Ref
            </th>
            {scenarioReturns.map((ret) => (
              <th
                key={ret}
                onClick={() => onSelectScenario(ret)}
                className={`px-3 py-2 text-center font-medium cursor-pointer transition-colors whitespace-nowrap ${
                  selectedScenario === ret
                    ? "bg-[#FF5C00]/20 text-[#FF5C00]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {ret > 0 ? "+" : ""}
                {ret}%
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ fund, results }) => (
            <tr key={fund.ticker} className="border-b last:border-0 hover:bg-muted/30">
              <td className="sticky left-0 z-10 bg-background px-3 py-2 font-mono font-medium whitespace-nowrap">
                {fund.ticker}
              </td>
              <td className="px-3 py-2">
                <BufferTypeBadge type={fund.bufferType} />
              </td>
              <td className="px-3 py-2">
                <ReferenceAssetBadge asset={fund.referenceAssetTicker} />
              </td>
              {scenarioReturns.map((ret) => {
                const result = results[ret];
                if (!result) return <td key={ret} className="px-3 py-2 text-center">—</td>;
                return (
                  <td
                    key={ret}
                    className={`px-3 py-2 text-center font-mono text-xs ${getCellColor(result.fundReturn)} ${
                      selectedScenario === ret ? "ring-1 ring-[#FF5C00]/40" : ""
                    }`}
                  >
                    {formatPercentSigned(result.fundReturn)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
