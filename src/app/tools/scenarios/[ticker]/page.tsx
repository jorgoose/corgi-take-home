import { notFound } from "next/navigation";
import { getAllFunds, getFundByTicker } from "@/lib/api/funds";
import { FundSelector } from "@/components/fund/fund-selector";
import { BufferTypeBadge } from "@/components/fund/buffer-type-badge";
import { ReferenceAssetBadge } from "@/components/fund/reference-asset-badge";
import { CrossToolNav } from "@/components/shared/cross-tool-nav";
import { DisclaimerBox } from "@/components/shared/disclaimer-box";
import { ScenarioPageClient } from "@/components/scenarios/scenario-page-client";

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  return getAllFunds().map((f) => ({ ticker: f.ticker }));
}

export async function generateMetadata({ params }: PageProps) {
  const { ticker } = await params;
  const fund = getFundByTicker(ticker);
  if (!fund) return { title: "Fund Not Found" };
  return {
    title: `${ticker} Scenarios`,
    description: `Hypothetical scenario analysis for ${fund.name}`,
  };
}

export default async function ScenariosPage({ params }: PageProps) {
  const { ticker } = await params;
  const fund = getFundByTicker(ticker);
  if (!fund) notFound();

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
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <FundSelector currentTicker={ticker} basePath="/tools/scenarios" />
          <CrossToolNav ticker={ticker} currentTool="scenarios" />
        </div>
      </div>

      {/* Client-side scenario content */}
      <ScenarioPageClient fund={fund} />

      {/* Disclaimers */}
      <DisclaimerBox />
    </div>
  );
}
