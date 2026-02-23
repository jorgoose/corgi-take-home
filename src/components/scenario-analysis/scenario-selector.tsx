"use client";

import { useState } from "react";
import { DEFAULT_SCENARIO_RETURNS } from "@/lib/types/scenarios";
import { cn } from "@/lib/utils";

interface ScenarioSelectorProps {
  selected: number[];
  onChange: (returns: number[]) => void;
}

export function ScenarioSelector({ selected, onChange }: ScenarioSelectorProps) {
  const [customInput, setCustomInput] = useState("");

  function togglePreset(value: number) {
    if (selected.includes(value)) {
      if (selected.length <= 1) return;
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value].sort((a, b) => a - b));
    }
  }

  function addCustom() {
    const val = parseFloat(customInput);
    if (isNaN(val) || val < -100 || val > 200) return;
    const rounded = Math.round(val * 100) / 100;
    if (!selected.includes(rounded)) {
      onChange([...selected, rounded].sort((a, b) => a - b));
    }
    setCustomInput("");
  }

  function resetToDefaults() {
    onChange([...DEFAULT_SCENARIO_RETURNS]);
  }

  const isDefault =
    selected.length === DEFAULT_SCENARIO_RETURNS.length &&
    selected.every((v, i) => v === DEFAULT_SCENARIO_RETURNS[i]);

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Market Scenarios (Ref Asset Return %)
        </label>
        {!isDefault && (
          <button
            onClick={resetToDefaults}
            className="text-xs text-[#FF5C00] hover:underline font-medium"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {DEFAULT_SCENARIO_RETURNS.map((val) => (
          <button
            key={val}
            onClick={() => togglePreset(val)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              selected.includes(val)
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-muted-foreground border-input hover:bg-muted"
            )}
          >
            {val > 0 ? "+" : ""}
            {val}%
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
          placeholder="Custom %"
          className="w-28 rounded-md border bg-background px-3 py-1.5 text-sm"
        />
        <button
          onClick={addCustom}
          className="rounded-md bg-[#FF5C00] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#FF5C00]/90 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
