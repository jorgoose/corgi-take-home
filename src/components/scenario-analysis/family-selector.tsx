"use client";

import { FUND_FAMILIES, FundFamilyConfig } from "@/lib/constants/fund-families";

interface FamilySelectorProps {
  selectedFamilyId: string;
  onChange: (familyId: string) => void;
}

export function FamilySelector({ selectedFamilyId, onChange }: FamilySelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground block">Fund Family</label>
      <select
        value={selectedFamilyId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
      >
        {FUND_FAMILIES.map((family: FundFamilyConfig) => (
          <option key={family.id} value={family.id}>
            {family.shortName} ({family.referenceAssetTicker})
          </option>
        ))}
      </select>
    </div>
  );
}
