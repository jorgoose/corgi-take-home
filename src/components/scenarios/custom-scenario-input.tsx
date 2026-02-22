"use client";

import { useState } from "react";
import { ScenarioResult } from "@/lib/types/scenarios";
import { cn } from "@/lib/utils";

interface CustomScenarioInputProps {
  onCalculate: (refReturn: number) => ScenarioResult | null;
}

export function CustomScenarioInput({ onCalculate }: CustomScenarioInputProps) {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);

  function handleCalculate() {
    const value = parseFloat(input);
    if (isNaN(value)) return;
    const res = onCalculate(value);
    setResult(res);
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <h4 className="text-sm font-semibold mb-2">Custom Scenario</h4>
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground whitespace-nowrap">Ref Asset Return:</label>
        <div className="relative flex-1 max-w-32">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
            placeholder="-10"
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
        </div>
        <button
          onClick={handleCalculate}
          className="rounded-md bg-[#FF5C00] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#FF5C00]/90 transition-colors"
        >
          Calculate
        </button>
      </div>
      {result && (
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">Fund Return:</span>
          <span className={cn("font-mono font-semibold", result.fundReturn >= 0 ? "text-green-700" : "text-red-600")}>
            {result.fundReturn > 0 ? "+" : ""}{result.fundReturn.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">— {result.note}</span>
        </div>
      )}
    </div>
  );
}
