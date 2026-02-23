"use client";

import { useState, useMemo } from "react";
import { FundWithCurrentValues } from "@/lib/types/fund";
import { ScenarioMode, ScenarioResult } from "@/lib/types/scenarios";
import { getScenarioData, getCustomScenario } from "@/lib/api/scenarios";
import { getAsOfDate } from "@/lib/api/funds";
import { ScenarioChart } from "./scenario-chart";
import { ViewToggle } from "./view-toggle";
import { ScenarioTable } from "./scenario-table";
import { EducationalCallout } from "./educational-callout";
import { CustomScenarioInput } from "./custom-scenario-input";
import { DataTimestamp } from "@/components/shared/data-timestamp";

interface ScenarioPageClientProps {
  fund: FundWithCurrentValues;
}

export function ScenarioPageClient({ fund }: ScenarioPageClientProps) {
  const [mode, setMode] = useState<ScenarioMode>("inception");

  const scenarioData = useMemo(
    () => getScenarioData(fund.ticker, mode),
    [fund.ticker, mode]
  );

  if (!scenarioData) return null;

  const { scenarios, config } = scenarioData;

  function handleCustomCalculate(refReturn: number): ScenarioResult | null {
    return getCustomScenario(fund.ticker, refReturn, mode);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <ViewToggle mode={mode} onChange={setMode} />
        <DataTimestamp date={getAsOfDate()} />
      </div>

      {mode === "current" && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-400">
          You are viewing outcomes based on current fund values as of {getAsOfDate()}.
          These differ from inception values because {fund.currentValues.remainingOutcomePeriodDays} days remain in the outcome period.
          {fund.currentValues.remainingBufferNet < fund.bufferSizePct && (
            <span className="font-medium">
              {" "}The fund&apos;s buffer has been partially used. Remaining buffer: {fund.currentValues.remainingBufferNet.toFixed(2)}%.
            </span>
          )}
        </div>
      )}

      <EducationalCallout fund={fund} cap={config.cap} />

      <ScenarioChart
        scenarios={scenarios}
        cap={config.cap}
        bufferStartPct={fund.bufferStartPct}
        bufferEndPct={fund.bufferEndPct}
      />

      <ScenarioTable scenarios={scenarios} />

      <CustomScenarioInput onCalculate={handleCustomCalculate} />
    </div>
  );
}
