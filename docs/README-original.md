# Corgi ETF Trust - Buffer ETF Tools Analysis

Analysis and implementation plan for recreating First Trust's Target Outcome Tools for Corgi's buffer ETF product lineup.

## Contents

- [Full Analysis](./analysis.md) - Comprehensive breakdown of First Trust's tools, Corgi's SEC filing, and implementation plan
- [Data Model](./data-model.md) - Database schema and data pipeline design
- [Tool Specifications](./tool-specs.md) - Detailed specs for each tool to be built

## Overview

Corgi Strategies, LLC has filed for 24 buffer ETFs (SEC filing 485APOS, Feb 6, 2026) across 6 fund families. This repo contains the analysis of comparable tools from First Trust and a plan to build equivalent tools for www.corgifunds.com.

### Corgi's Product Lineup

| Fund Family | Underlying ETF | Buffer Type | Buffer Range |
|---|---|---|---|
| Technology Leaders 10% Structured Buffer | QQQ | Standard | 0% to -10% |
| U.S. Small-Cap 15% Structured Buffer | IWM | Standard | 0% to -15% |
| U.S. Equities 30% Structured Buffer | SPY | Deep (gapped) | -5% to -35% |
| U.S. Equities 100% Structured Buffer | SPY | Full protection | 0% to -100% |
| International Developed Equities 15% Structured Buffer | EFA | Standard | 0% to -15% |
| Emerging Markets Equities 15% Structured Buffer | EEM | Standard | 0% to -15% |

Each family has 4 monthly series (May, Jun, Jul, Aug) = 24 total funds.

### Priority Tools

1. **Fund Screener** - Filter/search across all 24 products
2. **Outcome Period Performance Dashboard** - Daily performance tracking (compliance requirement)
3. **Hypothetical Scenario Visualizer** - Interactive what-if analysis
