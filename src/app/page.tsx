import Link from "next/link";

const TOOLS = [
  {
    title: "Fund Screener",
    description:
      "Filter and compare all 24 Corgi buffer ETFs by reference asset, buffer type, series, and remaining values.",
    href: "/tools/screener",
    icon: "search",
  },
  {
    title: "Outcome Performance",
    description:
      "Track fund vs. reference asset returns with interactive charts and detailed metrics for any outcome period.",
    href: "/tools/performance",
    icon: "chart",
  },
  {
    title: "Scenario Visualizer",
    description:
      "Model hypothetical market scenarios and see how buffer protection affects your returns at inception or mid-period.",
    href: "/tools/scenarios",
    icon: "calculator",
  },
];

function ToolIcon({ type }: { type: string }) {
  switch (type) {
    case "search":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      );
    case "chart":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      );
    case "calculator":
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          <span className="text-[#FF5C00]">Corgi</span> Buffer ETF Tools
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Interactive tools for analyzing Corgi&apos;s 24 structured buffer ETFs.
          Compare funds, track performance, and model hypothetical scenarios.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <span className="rounded-full border px-3 py-1">6 Fund Families</span>
          <span className="rounded-full border px-3 py-1">5 Reference Assets</span>
          <span className="rounded-full border px-3 py-1">3 Buffer Types</span>
          <span className="rounded-full border px-3 py-1">24 Total Funds</span>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group rounded-xl border bg-card p-6 transition-all hover:border-[#FF5C00]/40 hover:shadow-lg hover:shadow-[#FF5C00]/5"
          >
            <div className="mb-4 inline-flex rounded-lg bg-[#FF5C00]/10 p-2.5 text-[#FF5C00]">
              <ToolIcon type={tool.icon} />
            </div>
            <h2 className="text-lg font-semibold group-hover:text-[#FF5C00] transition-colors">
              {tool.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {tool.description}
            </p>
            <span className="mt-4 inline-flex items-center text-sm font-medium text-[#FF5C00]">
              Open Tool &rarr;
            </span>
          </Link>
        ))}
      </div>

      {/* Brief overview */}
      <div className="mt-16 rounded-xl border bg-muted/30 p-8">
        <h2 className="text-lg font-semibold mb-4">About Corgi Buffer ETFs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-1">Standard Buffer</h3>
            <p>Absorbs the first 10-15% of losses in the reference asset. Full upside participation up to the cap.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Deep Buffer</h3>
            <p>Investor bears the first 5% of losses. Buffer absorbs the next 30% (-5% to -35%). Higher cap potential.</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">Full Protection</h3>
            <p>100% downside protection against all reference asset losses. Tradeoff: lower upside cap (2-5%).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
