"use client";

import { cn } from "@/lib/utils";

type WatchlistTab = "lists" | "alerts";

interface WatchlistTabsProps {
  tab: WatchlistTab;
  onChange: (tab: WatchlistTab) => void;
}

export function WatchlistTabs({ tab, onChange }: WatchlistTabsProps) {
  return (
    <div className="inline-flex rounded-lg border bg-muted p-0.5">
      <button
        onClick={() => onChange("lists")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          tab === "lists"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        My Lists
      </button>
      <button
        onClick={() => onChange("alerts")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          tab === "alerts"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Alerts
      </button>
    </div>
  );
}

export type { WatchlistTab };
