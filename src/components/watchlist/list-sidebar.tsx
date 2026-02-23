"use client";

import { Watchlist } from "@/hooks/use-watchlist-store";
import { cn } from "@/lib/utils";

interface ListSidebarProps {
  watchlists: Watchlist[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function ListSidebar({ watchlists, selectedId, onSelect, onCreate }: ListSidebarProps) {
  return (
    <div className="space-y-2">
      <button
        onClick={onCreate}
        className="w-full rounded-md border border-dashed border-[#FF5C00]/40 px-3 py-2 text-sm font-medium text-[#FF5C00] hover:bg-[#FF5C00]/10 transition-colors"
      >
        + Create New List
      </button>
      {watchlists.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">
          No lists yet. Create one to start tracking funds.
        </p>
      )}
      {watchlists.map((list) => (
        <button
          key={list.id}
          onClick={() => onSelect(list.id)}
          className={cn(
            "w-full rounded-md border px-3 py-2 text-left text-sm transition-colors",
            selectedId === list.id
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-foreground border-input hover:bg-muted"
          )}
        >
          <span className="font-medium">{list.name}</span>
          <span className="text-xs ml-2 opacity-60">{list.tickers.length} funds</span>
        </button>
      ))}
    </div>
  );
}
