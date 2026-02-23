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
          title="Fund Screener"
          description="Filter and compare all funds by asset, buffer type, and remaining values."
        />
        <ToolLink
          href="/tools/performance"
          title="Outcome Performance"
          description="Track fund vs. reference asset returns with charts and metrics."
        />
        <ToolLink
          href="/tools/scenarios"
          title="Scenario Visualizer"
          description="Model hypothetical market scenarios across buffer types."
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
