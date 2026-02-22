import { notFound } from "next/navigation";
import { getPerformanceData } from "@/lib/api/performance";
import { getAllFunds, getAsOfDate } from "@/lib/api/funds";
import { FundSelector } from "@/components/fund/fund-selector";
import { BufferTypeBadge } from "@/components/fund/buffer-type-badge";
import { ReferenceAssetBadge } from "@/components/fund/reference-asset-badge";
import { PerformanceChart } from "@/components/performance/performance-chart";
import { MetricsTable } from "@/components/performance/metrics-table";
import { DefinitionsGlossary } from "@/components/performance/definitions-glossary";
import { CrossToolNav } from "@/components/shared/cross-tool-nav";
import { DisclaimerBox } from "@/components/shared/disclaimer-box";
import { DataTimestamp } from "@/components/shared/data-timestamp";

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  return getAllFunds().map((f) => ({ ticker: f.ticker }));
}

export async function generateMetadata({ params }: PageProps) {
  const { ticker } = await params;
  const data = getPerformanceData(ticker);
  if (!data) return { title: "Fund Not Found" };
  return {
    title: `${ticker} Performance`,
    description: `Outcome period performance for ${data.fund.name}`,
  };
}

export default async function PerformancePage({ params }: PageProps) {
  const { ticker } = await params;
  const data = getPerformanceData(ticker);
  if (!data) notFound();

  const { fund, outcomePeriod, currentValues, timeSeries } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{fund.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono font-semibold text-[#FF5C00]">{fund.ticker}</span>
            <ReferenceAssetBadge asset={fund.referenceAssetTicker} />
            <BufferTypeBadge type={fund.bufferType} />
            <DataTimestamp date={getAsOfDate()} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <FundSelector currentTicker={ticker} basePath="/tools/performance" />
          <CrossToolNav ticker={ticker} currentTool="performance" />
        </div>
      </div>

      {/* Chart */}
      <PerformanceChart
        timeSeries={timeSeries}
        outcomePeriod={outcomePeriod}
        bufferStartPct={fund.bufferStartPct}
        bufferEndPct={fund.bufferEndPct}
      />

      {/* Metrics */}
      <MetricsTable
        fund={fund}
        outcomePeriod={outcomePeriod}
        currentValues={currentValues}
      />

      {/* Glossary */}
      <DefinitionsGlossary />

      {/* Disclaimers */}
      <DisclaimerBox />
    </div>
  );
}
