"use client";

import { useState, useMemo } from "react";
import { FilterState, DEFAULT_FILTERS, SortConfig } from "@/lib/types/screener";
import { getAllFunds, getFilteredFunds, getSortedFunds } from "@/lib/api/funds";
import { getAsOfDate } from "@/lib/api/funds";
import { ScreenerFilters } from "@/components/screener/screener-filters";
import { ScreenerTable } from "@/components/screener/screener-table";
import { DataTimestamp } from "@/components/shared/data-timestamp";
import { exportFundsToCSV } from "@/lib/utils/export-csv";

export default function ScreenerPage() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortConfig>({ column: "ticker", direction: "asc" });
  const allFunds = useMemo(() => getAllFunds(), []);

  const filteredFunds = useMemo(() => getFilteredFunds(filters), [filters]);
  const sortedFunds = useMemo(() => getSortedFunds(filteredFunds, sort), [filteredFunds, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fund Screener</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Filter and compare all 24 Corgi buffer ETFs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DataTimestamp date={getAsOfDate()} />
          <button
            onClick={() => exportFundsToCSV(sortedFunds)}
            className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
          >
            Export CSV
          </button>
        </div>
      </div>

      <ScreenerFilters filters={filters} onChange={setFilters} />
      <ScreenerTable
        funds={sortedFunds}
        sort={sort}
        onSort={setSort}
        totalCount={allFunds.length}
      />
    </div>
  );
}
