"use client";

import { useState, useMemo } from "react";
import { FilterState, DEFAULT_FILTERS, SortConfig } from "@/lib/types/screener";
import { getAllFunds, getFilteredFunds, getSortedFunds } from "@/lib/api/funds";
import { getAsOfDate } from "@/lib/api/funds";
import { ScreenerSidebar } from "@/components/screener/screener-sidebar";
import { ScreenerTable } from "@/components/screener/screener-table";
import { exportFundsToCSV } from "@/lib/utils/export-csv";
import { formatDate } from "@/lib/utils/format";

export default function ScreenerPage() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortConfig>({ column: "ticker", direction: "asc" });
  const allFunds = useMemo(() => getAllFunds(), []);
  const asOfDate = getAsOfDate();

  const filteredFunds = useMemo(() => getFilteredFunds(filters), [filters]);
  const sortedFunds = useMemo(() => getSortedFunds(filteredFunds, sort), [filteredFunds, sort]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fund Matching Tool</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search across all Corgi buffer ETFs to find funds that match your criteria
          </p>
        </div>
        <button
          onClick={() => exportFundsToCSV(sortedFunds)}
          className="self-start rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:bg-foreground/90 transition-colors"
        >
          Export CSV
        </button>
      </div>

      {/* Sidebar + Table layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
        {/* Left sidebar filters */}
        <aside className="rounded-lg border bg-card p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Select Criteria
          </h2>
          <ScreenerSidebar filters={filters} onChange={setFilters} />
        </aside>

        {/* Right results area */}
        <div className="min-w-0">
          <ScreenerTable
            funds={sortedFunds}
            sort={sort}
            onSort={setSort}
            totalCount={allFunds.length}
            asOfDate={formatDate(asOfDate)}
          />
        </div>
      </div>
    </div>
  );
}
