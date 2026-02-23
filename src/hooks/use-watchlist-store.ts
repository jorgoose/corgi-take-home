"use client";

import { useState, useEffect, useCallback } from "react";

// --- Types ---

export interface Watchlist {
  id: string;
  name: string;
  tickers: string[];
}

export type AlertMetric =
  | "remainingBufferNet"
  | "remainingCapNet"
  | "downsideBeforeBuffer"
  | "remainingOutcomePeriodDays"
  | "fundReturnPtd";

export interface AlertRule {
  id: string;
  metric: AlertMetric;
  condition: "lt" | "gt";
  threshold: number;
  appliedTo: "all" | string; // "all" or watchlist id
}

interface WatchlistStore {
  watchlists: Watchlist[];
  alerts: AlertRule[];
  // Watchlist CRUD
  createWatchlist: (name: string) => string;
  deleteWatchlist: (id: string) => void;
  renameWatchlist: (id: string, name: string) => void;
  addTicker: (watchlistId: string, ticker: string) => void;
  removeTicker: (watchlistId: string, ticker: string) => void;
  // Alert CRUD
  addAlert: (rule: Omit<AlertRule, "id">) => void;
  deleteAlert: (id: string) => void;
  // Hydration state
  hydrated: boolean;
}

const WATCHLISTS_KEY = "corgi-watchlists";
const ALERTS_KEY = "corgi-alerts";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function useWatchlistStore(): WatchlistStore {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [alerts, setAlerts] = useState<AlertRule[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedWatchlists = localStorage.getItem(WATCHLISTS_KEY);
      if (savedWatchlists) setWatchlists(JSON.parse(savedWatchlists));
      const savedAlerts = localStorage.getItem(ALERTS_KEY);
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch (e) {
      console.warn("Failed to parse saved watchlist data from localStorage:", e);
    }
    setHydrated(true);
  }, []);

  // Persist watchlists
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(WATCHLISTS_KEY, JSON.stringify(watchlists)); } catch (e) { console.warn("Failed to persist watchlists:", e); }
    }
  }, [watchlists, hydrated]);

  // Persist alerts
  useEffect(() => {
    if (hydrated) {
      try { localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); } catch (e) { console.warn("Failed to persist alerts:", e); }
    }
  }, [alerts, hydrated]);

  const createWatchlist = useCallback((name: string): string => {
    const id = generateId();
    setWatchlists((prev) => [...prev, { id, name, tickers: [] }]);
    return id;
  }, []);

  const deleteWatchlist = useCallback((id: string) => {
    setWatchlists((prev) => prev.filter((w) => w.id !== id));
    // Also clean up alerts that reference this watchlist
    setAlerts((prev) => prev.map((a) => (a.appliedTo === id ? { ...a, appliedTo: "all" } : a)));
  }, []);

  const renameWatchlist = useCallback((id: string, name: string) => {
    setWatchlists((prev) => prev.map((w) => (w.id === id ? { ...w, name } : w)));
  }, []);

  const addTicker = useCallback((watchlistId: string, ticker: string) => {
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === watchlistId && !w.tickers.includes(ticker)
          ? { ...w, tickers: [...w.tickers, ticker] }
          : w
      )
    );
  }, []);

  const removeTicker = useCallback((watchlistId: string, ticker: string) => {
    setWatchlists((prev) =>
      prev.map((w) =>
        w.id === watchlistId ? { ...w, tickers: w.tickers.filter((t) => t !== ticker) } : w
      )
    );
  }, []);

  const addAlert = useCallback((rule: Omit<AlertRule, "id">) => {
    setAlerts((prev) => [...prev, { ...rule, id: generateId() }]);
  }, []);

  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    watchlists,
    alerts,
    createWatchlist,
    deleteWatchlist,
    renameWatchlist,
    addTicker,
    removeTicker,
    addAlert,
    deleteAlert,
    hydrated,
  };
}
