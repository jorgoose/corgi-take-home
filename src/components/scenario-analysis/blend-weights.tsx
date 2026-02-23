"use client";

import { BlendWeights, DEFAULT_BLEND_WEIGHTS } from "@/lib/types/scenarios";
import { SeriesMonth } from "@/lib/types/fund";

interface BlendWeightsProps {
  weights: BlendWeights;
  onChange: (weights: BlendWeights) => void;
}

const MONTHS: SeriesMonth[] = ["May", "Jun", "Jul", "Aug"];

export function BlendWeightsEditor({ weights, onChange }: BlendWeightsProps) {
  const total = MONTHS.reduce((sum, m) => sum + weights[m], 0);
  const isValid = Math.abs(total - 100) < 0.01;

  function setWeight(month: SeriesMonth, value: number) {
    onChange({ ...weights, [month]: value });
  }

  function equalWeight() {
    onChange({ ...DEFAULT_BLEND_WEIGHTS });
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Series Weights (must sum to 100%)
        </label>
        <button
          onClick={equalWeight}
          className="text-xs text-[#FF5C00] hover:underline font-medium"
        >
          Equal Weight
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MONTHS.map((month) => (
          <div key={month}>
            <label className="text-xs text-muted-foreground mb-1 block">{month}</label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={weights[month]}
                onChange={(e) => setWeight(month, Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full rounded-md border bg-background px-2 py-1.5 text-sm font-mono"
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>
      <div className={`text-xs font-medium ${isValid ? "text-green-400" : "text-red-400"}`}>
        Total: {total.toFixed(0)}%{!isValid && " — must equal 100%"}
      </div>
    </div>
  );
}
