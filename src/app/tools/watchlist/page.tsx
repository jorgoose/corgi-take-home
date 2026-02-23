"use client";

import { useMemo, useState } from "react";
import { getAllFunds, getAsOfDate } from "@/lib/api/funds";
import { useWatchlistStore } from "@/hooks/use-watchlist-store";
import { WatchlistTabs, type WatchlistTab } from "@/components/watchlist/watchlist-tabs";
import { ListSidebar } from "@/components/watchlist/list-sidebar";
import { ListDetail } from "@/components/watchlist/list-detail";
import { AlertCreator } from "@/components/watchlist/alert-creator";
import { AlertList } from "@/components/watchlist/alert-list";
import { DataTimestamp } from "@/components/shared/data-timestamp";
import { DisclaimerBox } from "@/components/shared/disclaimer-box";

export default function WatchlistPage() {
  const [tab, setTab] = useState<WatchlistTab>("lists");
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const allFunds = useMemo(() => getAllFunds(), []);
  const store = useWatchlistStore();

  const selectedList = store.watchlists.find((w) => w.id === selectedListId) ?? null;

  function handleCreateList() {
    const id = store.createWatchlist(`List ${store.watchlists.length + 1}`);
    setSelectedListId(id);
  }

  function handleDeleteList() {
    if (selectedListId) {
      store.deleteWatchlist(selectedListId);
      setSelectedListId(null);
    }
  }

  if (!store.hydrated) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personal Lists & Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Personal Lists & Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create watchlists and set threshold-based alerts for your funds
          </p>
        </div>
        <DataTimestamp date={getAsOfDate()} />
      </div>

      <WatchlistTabs tab={tab} onChange={setTab} />

      {tab === "lists" ? (
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          <ListSidebar
            watchlists={store.watchlists}
            selectedId={selectedListId}
            onSelect={setSelectedListId}
            onCreate={handleCreateList}
          />
          <div>
            {selectedList ? (
              <ListDetail
                watchlist={selectedList}
                allFunds={allFunds}
                onRename={(name) => store.renameWatchlist(selectedList.id, name)}
                onDelete={handleDeleteList}
                onAddTicker={(ticker) => store.addTicker(selectedList.id, ticker)}
                onRemoveTicker={(ticker) => store.removeTicker(selectedList.id, ticker)}
              />
            ) : (
              <div className="rounded-lg border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                {store.watchlists.length === 0
                  ? "Create a list to get started."
                  : "Select a list from the sidebar."}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <AlertCreator watchlists={store.watchlists} onAdd={store.addAlert} />
          <AlertList
            alerts={store.alerts}
            watchlists={store.watchlists}
            allFunds={allFunds}
            onDelete={store.deleteAlert}
          />
        </div>
      )}

      <DisclaimerBox />
    </div>
  );
}
