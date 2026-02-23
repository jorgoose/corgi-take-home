"use client";

import { useState } from "react";
import { Watchlist } from "@/hooks/use-watchlist-store";
import { FundWithCurrentValues } from "@/lib/types/fund";
import { WatchlistFundTable } from "./watchlist-fund-table";

interface ListDetailProps {
  watchlist: Watchlist;
  allFunds: FundWithCurrentValues[];
  onRename: (name: string) => void;
  onDelete: () => void;
  onAddTicker: (ticker: string) => void;
  onRemoveTicker: (ticker: string) => void;
}

export function ListDetail({
  watchlist,
  allFunds,
  onRename,
  onDelete,
  onAddTicker,
  onRemoveTicker,
}: ListDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(watchlist.name);
  const [addTicker, setAddTicker] = useState("");

  const listFunds = allFunds.filter((f) => watchlist.tickers.includes(f.ticker));
  const availableFunds = allFunds.filter((f) => !watchlist.tickers.includes(f.ticker));

  function handleSaveName() {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  }

  function handleAdd() {
    if (addTicker) {
      onAddTicker(addTicker);
      setAddTicker("");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with name + delete */}
      <div className="flex items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm font-medium"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="text-xs text-[#FF5C00] hover:underline font-medium"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(watchlist.name);
              }}
              className="text-xs text-muted-foreground hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{watchlist.name}</h3>
            <button
              onClick={() => {
                setEditName(watchlist.name);
                setIsEditing(true);
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Rename
            </button>
          </div>
        )}
        <button
          onClick={onDelete}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Delete List
        </button>
      </div>

      {/* Add fund dropdown */}
      <div className="flex items-center gap-2">
        <select
          value={addTicker}
          onChange={(e) => setAddTicker(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="">Add a fund...</option>
          {availableFunds.map((f) => (
            <option key={f.ticker} value={f.ticker}>
              {f.ticker} — {f.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!addTicker}
          className="rounded-md bg-[#FF5C00] px-4 py-2 text-sm font-medium text-white hover:bg-[#FF5C00]/90 disabled:opacity-40 transition-colors"
        >
          Add
        </button>
      </div>

      {/* Fund table */}
      <WatchlistFundTable funds={listFunds} onRemove={onRemoveTicker} />
    </div>
  );
}
