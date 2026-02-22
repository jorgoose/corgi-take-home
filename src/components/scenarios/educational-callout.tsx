import { BufferType, FundDefinition } from "@/lib/types/fund";

interface EducationalCalloutProps {
  fund: FundDefinition;
  cap: number;
}

function getCalloutContent(fund: FundDefinition, cap: number): { title: string; description: string } {
  switch (fund.bufferType) {
    case "standard":
      return {
        title: "Standard Buffer",
        description: `This fund provides a buffer against the first ${Math.abs(fund.bufferEndPct)}% of losses in ${fund.referenceAssetTicker}. You participate in gains up to the ${cap.toFixed(2)}% cap. Losses beyond the buffer are borne by the investor.`,
      };
    case "deep":
      return {
        title: "Deep Buffer",
        description: `This fund provides a buffer for losses between ${fund.bufferStartPct}% and ${fund.bufferEndPct}% of ${fund.referenceAssetTicker}. You bear the first ${Math.abs(fund.bufferStartPct)}% of losses (the "gap"), the buffer absorbs the next ${fund.bufferSizePct}%, and losses beyond ${fund.bufferEndPct}% are borne by the investor.`,
      };
    case "full":
      return {
        title: "Full Protection",
        description: `This fund provides 100% downside protection against losses in ${fund.referenceAssetTicker}. The tradeoff is a lower cap on upside gains (${cap.toFixed(2)}%).`,
      };
  }
}

export function EducationalCallout({ fund, cap }: EducationalCalloutProps) {
  const { title, description } = getCalloutContent(fund, cap);

  return (
    <div className="rounded-lg border-l-4 border-l-[#FF5C00] bg-orange-50 p-4">
      <h4 className="text-sm font-semibold text-[#FF5C00] mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
