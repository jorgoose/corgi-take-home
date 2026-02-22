import Link from "next/link";

interface CrossToolNavProps {
  ticker: string;
  currentTool: "performance" | "scenarios";
}

export function CrossToolNav({ ticker, currentTool }: CrossToolNavProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <Link href="/tools/screener" className="text-muted-foreground hover:text-foreground transition-colors">
        &larr; Back to Screener
      </Link>
      <span className="text-muted-foreground/40">|</span>
      {currentTool === "performance" ? (
        <Link href={`/tools/scenarios/${ticker}`} className="text-[#FF5C00] hover:underline font-medium">
          View Scenarios &rarr;
        </Link>
      ) : (
        <Link href={`/tools/performance/${ticker}`} className="text-[#FF5C00] hover:underline font-medium">
          View Performance &rarr;
        </Link>
      )}
    </div>
  );
}
