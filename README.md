# Corgi Buffer ETF Tools

Interactive web tools for analyzing Corgi's 24 structured buffer ETFs, built as a take-home assignment for Corgi Strategies, LLC.

## Tools

1. **Fund Screener** (`/tools/screener`) — Filter and compare all 24 funds by reference asset, buffer type, series month, and remaining values. Sortable table with CSV export.

2. **Outcome Period Performance** (`/tools/performance/[ticker]`) — Interactive line chart showing fund vs. reference asset returns over the outcome period, with reference lines for cap and buffer levels. Detailed metrics table and glossary.

3. **Scenario Visualizer** (`/tools/scenarios/[ticker]`) — Hypothetical market scenario analysis with grouped bar charts. Toggle between inception and mid-period views. Custom scenario calculator.

## Tech Stack

- **Next.js 15** (App Router, TypeScript, Turbopack)
- **Tailwind CSS v4** with CSS variables
- **shadcn/ui** component patterns
- **Recharts** for interactive charts
- **Vercel** deployment target

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── page.tsx            # Landing page with tool cards
│   └── tools/
│       ├── screener/       # Tool A: Fund Screener
│       ├── performance/    # Tool B: Outcome Performance
│       └── scenarios/      # Tool C: Scenario Visualizer
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, footer
│   ├── fund/               # Fund selector, badges
│   ├── screener/           # Filter bar, data table
│   ├── performance/        # Chart, metrics, glossary
│   ├── scenarios/          # Bar chart, toggle, callout
│   └── shared/             # Timestamp, disclaimers, nav
└── lib/
    ├── types/              # TypeScript interfaces
    ├── constants/          # Fund families, glossary, colors
    ├── calculations/       # Buffer math engine
    ├── data/               # Fund definitions, mock generators
    ├── api/                # Data access layer
    └── utils/              # Formatters, CSV export
```

## Mock Data

Since the funds haven't launched yet, the app uses deterministic mock data seeded from each fund's ticker via a mulberry32 PRNG. Reference asset prices follow Geometric Brownian Motion with realistic volatilities. The data access layer (`src/lib/api/`) is designed to be swapped for real API calls later.

## Fund Lineup (24 funds)

| Family | Reference Asset | Buffer Type | Buffer Range |
|--------|----------------|-------------|--------------|
| Technology Leaders 10% | QQQ | Standard | 0% to -10% |
| U.S. Small-Cap 15% | IWM | Standard | 0% to -15% |
| U.S. Equities 30% Deep | SPY | Deep | -5% to -35% |
| U.S. Equities 100% Full | SPY | Full | 0% to -100% |
| International Developed 15% | EFA | Standard | 0% to -15% |
| Emerging Markets 15% | EEM | Standard | 0% to -15% |

Each family has 4 monthly series (May, Jun, Jul, Aug) = 24 total funds.
