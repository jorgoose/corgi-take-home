"use client";

import { useMemo, useState } from "react";
import { getAllFunds, getFilteredFunds, getAsOfDate } from "@/lib/api/funds";
import { getMultiFundScenarios, getBlendedFamilyScenarios } from "@/lib/api/scenario-analysis";
import { FUND_FAMILIES } from "@/lib/constants/fund-families";
import {
  AnalysisMode,
  BlendWeights,
  DEFAULT_BLEND_WEIGHTS,
  DEFAULT_SCENARIO_RETURNS,
} from "@/lib/types/scenarios";
import { FilterState, DEFAULT_FILTERS } from "@/lib/types/screener";
import { SeriesMonth } from "@/lib/types/fund";
import { AnalysisModeToggle } from "@/components/scenario-analysis/analysis-mode-toggle";
import { ScenarioSelector } from "@/components/scenario-analysis/scenario-selector";
import { ScenarioHeatmap } from "@/components/scenario-analysis/scenario-heatmap";
import { ScenarioBarChart } from "@/components/scenario-analysis/scenario-bar-chart";
import { FamilySelector } from "@/components/scenario-analysis/family-selector";
import { BlendWeightsEditor } from "@/components/scenario-analysis/blend-weights";
import { BlendResults } from "@/components/scenario-analysis/blend-results";
import { ScreenerFilters } from "@/components/screener/screener-filters";
import { DataTimestamp } from "@/components/shared/data-timestamp";
import { DisclaimerBox } from "@/components/shared/disclaimer-box";

export default function ScenarioAnalysisPage() {
  const [mode, setMode] = useState<AnalysisMode>("all-funds");
  const [scenarioReturns, setScenarioReturns] = useState<number[]>([...DEFAULT_SCENARIO_RETURNS]);
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  // Series Blend state
  const [selectedFamilyId, setSelectedFamilyId] = useState(FUND_FAMILIES[0].id);
  const [weights, setWeights] = useState<BlendWeights>({ ...DEFAULT_BLEND_WEIGHTS });

  const allFunds = useMemo(() => getAllFunds(), []);

  // All Funds mode data
  const filteredFunds = useMemo(() => getFilteredFunds(filters), [filters]);
  const heatmapRows = useMemo(
    () => getMultiFundScenarios(filteredFunds, scenarioReturns),
    [filteredFunds, scenarioReturns]
  );

  // Series Blend mode data
  const familyFunds = useMemo(
    () => allFunds.filter((f) => f.fundFamily === selectedFamilyId),
    [allFunds, selectedFamilyId]
  );
  const blendedResults = useMemo(() => {
    const totalWeight = (["May", "Jun", "Jul", "Aug"] as SeriesMonth[]).reduce(
      (sum, m) => sum + weights[m],
      0
    );
    if (Math.abs(totalWeight - 100) > 0.01) return [];
    return getBlendedFamilyScenarios(
      familyFunds,
      weights as Record<SeriesMonth, number>,
      scenarioReturns
    );
  }, [familyFunds, weights, scenarioReturns]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hypothetical Scenario Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Run hypothetical market scenarios across funds or create blended portfolio views
          </p>
        </div>
        <DataTimestamp date={getAsOfDate()} />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <AnalysisModeToggle mode={mode} onChange={setMode} />
      </div>

      <ScenarioSelector selected={scenarioReturns} onChange={setScenarioReturns} />

      {mode === "all-funds" ? (
        <div className="space-y-6">
          <ScreenerFilters filters={filters} onChange={setFilters} />
          <ScenarioHeatmap
            rows={heatmapRows}
            scenarioReturns={scenarioReturns}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
          {selectedScenario !== null && (
            <ScenarioBarChart rows={heatmapRows} selectedScenario={selectedScenario} />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <FamilySelector
              selectedFamilyId={selectedFamilyId}
              onChange={setSelectedFamilyId}
            />
          </div>
          <BlendWeightsEditor weights={weights} onChange={setWeights} />
          <BlendResults results={blendedResults} />
        </div>
      )}

      <DisclaimerBox />
    </div>
  );
}
