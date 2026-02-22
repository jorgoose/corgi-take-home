"use client";

import { ScenarioMode } from "@/lib/types/scenarios";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  mode: ScenarioMode;
  onChange: (mode: ScenarioMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="inline-flex rounded-lg border bg-muted p-0.5">
      <button
        onClick={() => onChange("inception")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "inception"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        At Inception
      </button>
      <button
        onClick={() => onChange("current")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          mode === "current"
            ? "bg-white text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Current (Mid-Period)
      </button>
    </div>
  );
}
