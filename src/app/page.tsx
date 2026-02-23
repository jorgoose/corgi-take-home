import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        <span className="text-[#FF5C00]">Corgi</span> Buffer ETF Tools
      </h1>
      <p className="mt-3 text-muted-foreground">
        Analyze and compare 24 structured buffer ETFs filed with the SEC.
      </p>

      <nav className="mt-10 space-y-3">
        <ToolLink
          href="/tools/screener"
          title="Fund Matching Tool"
          description="Search across all Corgi buffer ETFs to find funds that match your investment goals."
        />
        <ToolLink
          href="/tools/performance"
          title="Outcome Period Performance"
          description="View the period performance of a selected fund, both for current and historical periods."
        />
        <ToolLink
          href="/tools/scenarios"
          title="Target Outcome Calculator"
          description="View hypothetical scenario analysis of a specific fund, using existing or custom execution values."
        />
        <ToolLink
          href="/tools/scenario-analysis"
          title="Hypothetical Scenario Analysis"
          description="Run hypothetical market scenarios across all funds or create blended portfolio views."
        />
        <ToolLink
          href="/tools/watchlist"
          title="Personal Lists & Alerts"
          description="Create watchlists and set threshold-based alerts for your funds."
        />
      </nav>
    </div>
  );
}

function ToolLink({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg border bg-card px-5 py-4 transition-colors hover:border-[#FF5C00]/40"
    >
      <div>
        <span className="font-semibold">{title}</span>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="ml-4 text-muted-foreground">&rarr;</span>
    </Link>
  );
}
