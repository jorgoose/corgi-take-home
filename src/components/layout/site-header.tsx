import Link from "next/link";

const NAV_LINKS = [
  { href: "/tools/screener", label: "Screener" },
  { href: "/tools/performance", label: "Performance" },
  { href: "/tools/scenarios", label: "Scenarios" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[#FF5C00]">Corgi</span>
          <span>Funds</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav />
      </div>
    </header>
  );
}

// Simple mobile nav - just show links in a row at small sizes
function MobileNav() {
  return (
    <nav className="flex sm:hidden items-center gap-4">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-xs font-medium text-muted-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
