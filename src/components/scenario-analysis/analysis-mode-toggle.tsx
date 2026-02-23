"use client";

import { AnalysisMode } from "@/lib/types/scenarios";
import { cn } from "@/lib/utils";

interface AnalysisModeToggleProps {
  mode: AnalysisMode;
  onChange: (mode: AnalysisMode) => void;
}

export function AnalysisModeToggle({ mode, onChange }: AnalysisModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border bg-muted p-0.5">
      <button
        onClick={() => onChange("all-funds")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "all-funds"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        All Funds
      </button>
      <button
        onClick={() => onChange("series-blend")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "series-blend"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Series Blend
      </button>
    </div>
  );
}
