"use client";

import { useRouter } from "next/navigation";
import { getAllFunds } from "@/lib/api/funds";
import { FundWithCurrentValues } from "@/lib/types/fund";

interface FundSelectorProps {
  currentTicker: string;
  basePath: string; // "/tools/performance" or "/tools/scenarios"
}

// Group funds by family
function groupByFamily(funds: FundWithCurrentValues[]) {
  const groups: Record<string, FundWithCurrentValues[]> = {};
  for (const fund of funds) {
    if (!groups[fund.fundFamily]) groups[fund.fundFamily] = [];
    groups[fund.fundFamily].push(fund);
  }
  return groups;
}

export function FundSelector({ currentTicker, basePath }: FundSelectorProps) {
  const router = useRouter();
  const funds = getAllFunds();
  const grouped = groupByFamily(funds);
  const current = funds.find(f => f.ticker === currentTicker);

  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium text-muted-foreground mb-1 block">Select Fund</label>
      <select
        value={currentTicker}
        onChange={(e) => router.push(`${basePath}/${e.target.value}`)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        {Object.entries(grouped).map(([family, familyFunds]) => (
          <optgroup key={family} label={family}>
            {familyFunds.map((fund) => (
              <option key={fund.ticker} value={fund.ticker}>
                {fund.ticker} — {fund.seriesMonth} Series
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {current && (
        <p className="mt-1 text-xs text-muted-foreground">
          {current.referenceAssetName} ({current.referenceAssetTicker}) · {current.bufferType} buffer
        </p>
      )}
    </div>
  );
}
