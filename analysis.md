# Comprehensive Analysis: Recreating First Trust Target Outcome Tools for Corgi

## Part 1: What First Trust's Tools Actually Do

First Trust offers **5 tools** at `ftportfolios.com/Retail/etf/TargetOutcomeToolsHome.aspx` for their ~90 buffer/defined-outcome ETFs:

### Tool 1: Target Outcome Fund Matching Tool (Public)

A **multi-criteria search/screener** that helps investors find buffer ETFs matching their goals.

**Inputs:**
- **Investment Goal** (radio buttons): Level of Protection (Buffer / Floor / Digital Return), Growth, or Income
- **Reference Assets** (multi-select): EEM, EFA, GLD, IWM, QQQ, RSP, SPY
- **Series Type**: All, Annual, Quarterly
- **Strategies** (multi-select): 12 strategy types (Buffer, Deep Buffer, Max Buffer, Moderate Buffer, Conservative Buffer, Dual Directional, Dynamic, Floor, etc.)
- **Range sliders**: Remaining Buffer (0-100%), Remaining Cap (0-50%), Remaining Outcome Period (0-365 days)

**Output:** Sortable data table with columns: Ticker, Fund Name, Reference Asset, Remaining Cap (Net), Remaining Buffer (Net), Remaining Outcome Period (Days)

### Tool 2: Outcome Period Performance (Public)

A **fund-specific performance dashboard** for current and historical outcome periods.

**Inputs:** Fund selector dropdown, Outcome Period selector

**Output:**
- **Interactive time-series chart**: Fund return (blue line) vs Reference Asset return (orange line) over the outcome period, with horizontal dashed lines for Cap level, Buffer Start (0%), and Buffer End
- **Two-column data table** with ~20 metrics including: Series, Reference Asset, Outcome Period dates, Fund Cap (Net/Gross), Buffer (Net/Gross), Starting Fund Value, Starting Ref Asset Value, Fund Value/Return, Ref Asset Value/Return, Remaining Cap (Net), Remaining Buffer, Downside Before Buffer, Reference Asset to Buffer End, Unrealized Option Payoff (Net), Remaining Outcome Period
- **Full definitions glossary** for every metric
- **Download button**: Export chart as image

### Tool 3: Target Outcome Calculator (Login Required)

A **hypothetical scenario/what-if tool** for a specific fund. Allows users to model outcomes using custom execution values and dates (e.g., "What if I buy this fund at $X on date Y?"). Critical for mid-period entry analysis.

### Tool 4: Hypothetical Scenario Analysis (Login Required)

A **multi-fund scenario comparison tool** that shows hypothetical scenarios for filtered lists of funds or standard/custom blends of a series. Enables portfolio construction analysis.

### Tool 5: Personal Lists and Alerts (Login Required)

**Watchlist + alerts system** for creating personalized fund lists and setting threshold notifications.

### Supporting Pages (Not tools, but data views)

- **Buffer Fund List**: Master table of all funds with live outcome period values (Ticker, Strategy Type, Series, Reference Asset, Fund Value/Return, Ref Asset Value/Return, Remaining Cap, Remaining Buffer, Downside Before Buffer, Remaining Outcome Period, Fact Sheet)
- **Starting Cap and Buffer Levels**: Shows initial parameters for each fund's current outcome period (Ticker, Fund Name, Series, Reference Asset, Starting Cap, Remaining Cap, Buffer Start, Buffer End, Outcome Period Start/End Dates)
- **Performance Recap**: Historical completed outcome period results with risk metrics (Predetermined Net Cap, Net Return, Reference Asset Return, Beta, Standard Deviation, Reference Asset Standard Deviation, Max Drawdown, Reference Asset Max Drawdown, Period Start/End Dates)

---

## Part 2: Corgi's Buffer ETF Product Lineup (from SEC Filing)

**Filing**: 485APOS, Filed Feb 6, 2026, Corgi ETF Trust I
**Adviser**: Corgi Strategies, LLC (425 Bush St, Suite 500, San Francisco, CA 94104)
**Website**: www.corgifunds.com

### 24 Funds Across 6 Families (4 Monthly Series Each: May, Jun, Jul, Aug)

| # | Fund Family | Underlying ETF (Ticker) | Buffer Structure | Buffer Range |
|---|---|---|---|---|
| 1 | Technology Leaders 10% Structured Buffer | Invesco QQQ Trust (QQQ) | Standard (first-loss) | 0% to -10% |
| 2 | U.S. Small-Cap 15% Structured Buffer | iShares Russell 2000 ETF (IWM) | Standard (first-loss) | 0% to -15% |
| 3 | U.S. Equities 30% Structured Buffer | SPDR S&P 500 ETF Trust (SPY) | Deep buffer (gapped) | -5% to -35% |
| 4 | U.S. Equities 100% Structured Buffer | SPDR S&P 500 ETF Trust (SPY) | Full protection | 0% to -100% |
| 5 | International Developed Equities 15% Structured Buffer | iShares MSCI EAFE ETF (EFA) | Standard (first-loss) | 0% to -15% |
| 6 | Emerging Markets Equities 15% Structured Buffer | iShares MSCI Emerging Markets ETF (EEM) | Standard (first-loss) | 0% to -15% |

### Key Structural Details

- **Instrument**: FLEX Options on the underlying ETF
- **Outcome Periods**: Annual (~1 year), staggered monthly (May-Aug start dates)
- **Upside Cap**: Set at beginning of each outcome period (TBD in filing, shown as [ ]%)
- **No Dividends**: Funds are not income-oriented
- **Prospectus requires** daily disclosure on www.corgifunds.com of: current cap/buffer levels, outcome period dates, and illustrative outcome information

### Buffer Structure Explanations

#### Standard Buffer (10% and 15% funds)
- Buffer absorbs the **first** X% of losses in the underlying ETF
- Example (15% buffer): If underlying falls 20%, fund loses only 5% (buffer absorbed first 15%)
- Investor participates in upside up to the Cap

#### Deep Buffer (30% fund, -5% to -35%)
- Investor bears the **first 5%** of losses (the "gap")
- Buffer absorbs the **next 30 percentage points** of losses (from -5% to -35%)
- Investor bears losses beyond -35%
- Example: If underlying falls 25%, investor loses 5% (gap) and buffer absorbs the remaining 20%

#### Full Protection (100% fund)
- Buffer absorbs **100% of losses** in the underlying ETF
- Tradeoff: Very low upside cap (potentially 2-4% annually)
- Essentially a principal-protection product

### Notable Design Choice: 4-Month Series Gap

Corgi offers May-August series only, creating an **8-month gap** (Sep-Apr) where no new outcome periods begin. This is unusual vs. competitors who offer monthly (12 series) or quarterly (4 evenly-spaced) series. Tools should surface this clearly.

---

## Part 3: Tool-by-Tool Implementation Plan for Corgi

### Priority 1 (Must-Have at Launch)

#### Tool A: Fund Screener / Matching Tool

**Why**: Investors need to navigate 24 products across 5 reference assets and 3 buffer types.

**Filters:**
- Reference Asset: QQQ, IWM, SPY, EFA, EEM (dropdown or pill selector)
- Buffer Type: Standard Buffer, Deep Buffer, Full Protection (radio or pills)
- Series Month: May, Jun, Jul, Aug (checkboxes)
- Remaining Outcome Period: Range slider (0-365 days)

**Results Table Columns:**

| Column | Description |
|---|---|
| Ticker | Fund ticker symbol |
| Fund Name | Full name |
| Reference Asset | Underlying ETF ticker |
| Buffer Type | Standard / Deep / Full |
| Starting Cap (Net) | Cap at outcome period start |
| Remaining Cap (Net) | Current remaining upside |
| Remaining Buffer (Net) | Current remaining downside protection |
| Downside Before Buffer | Losses before buffer kicks in (critical for deep buffer) |
| Remaining Outcome Period | Days remaining |
| Next Reset Date | When the outcome period refreshes |

**Technical Notes:**
- All columns sortable
- Export to Excel/CSV
- Responsive design for mobile
- Consider adding a "Next Reset Date" or "Outcome Period Calendar" to address the 8-month gap

---

#### Tool B: Outcome Period Performance Dashboard

**Why**: **Compliance requirement** - the prospectus directs investors to www.corgifunds.com for daily outcome information. This is not optional.

**Components:**

1. **Fund Selector**: Dropdown of all 24 funds (grouped by family)
2. **Outcome Period Selector**: Current period + historical completed periods
3. **Interactive Performance Chart**:
   - X-axis: Date (within outcome period)
   - Y-axis: Return (%)
   - Lines: Fund return (blue), Reference Asset return (orange/gold)
   - Horizontal dashed lines: Cap level (top), Buffer Start 0% (middle), Buffer End (bottom)
   - Tooltip on hover showing exact values for both lines
   - Click and drag to zoom
4. **Key Metrics Table** (two-column layout):

   | Outcome Period Values | Current Values (as of date) |
   |---|---|
   | Series | Remaining Outcome Period (days) |
   | Reference Asset | Fund Value / Return |
   | Outcome Period (start - end) | Reference Asset Value / Return |
   | Fund Cap (Gross / Net) | Remaining Cap (Gross / Net) |
   | Buffer (Gross / Net) | Remaining Buffer (Net) |
   | Starting Fund Value | Downside Before Buffer |
   | Starting Reference Asset Value | Ref Asset to Buffer End |
   | Buffer Start % / Ref Asset Value | Ref Asset Return to Realize Cap |
   | Buffer End % / Ref Asset Value | |

5. **Definitions Section**: Glossary of all terms
6. **Download Button**: Export chart as image

---

#### Tool C: Hypothetical Scenario Visualizer

**Why**: The SEC filing includes static scenario bar charts. A dynamic interactive version is materially more valuable, especially for mid-period buyers.

**Components:**

1. **Fund Selector**: Choose a specific fund
2. **Toggle**: "At Inception" vs "Current Values" (mid-period view)
3. **Scenario Bar Chart** (matching the SEC filing's visual style):
   - 5-7 scenarios showing underlying ETF return vs fund return
   - Cap and buffer levels shown as horizontal reference lines
   - Color coding: orange for underlying, gray for fund
4. **Custom Scenario Input**: Text field where users enter any reference asset return
5. **Tabular View**:

   **Standard Buffer Example (15%):**

   | Underlying ETF Return | Fund Return | Buffer Effect |
   |---|---|---|
   | +30% | +[Cap]% | Capped |
   | +15% | +15% | Full participation |
   | 0% | 0% | No change |
   | -10% | 0% | Buffer absorbs all |
   | -20% | -5% | Buffer absorbs 15%, investor bears 5% |
   | -50% | -35% | Buffer absorbs 15%, investor bears 35% |

   **Deep Buffer Example (-5% to -35%):**

   | Underlying ETF Return | Fund Return | Buffer Effect |
   |---|---|---|
   | +20% | +[Cap]% | Capped |
   | +10% | +10% | Full participation |
   | 0% | 0% | No change |
   | -3% | -3% | Below gap, investor bears loss |
   | -5% | -5% | Gap fully realized |
   | -20% | -5% | Buffer absorbing (investor capped at -5%) |
   | -35% | -5% | Buffer fully consumed |
   | -50% | -20% | Beyond buffer, investor bears excess |

---

### Priority 2 (Post-Launch)

#### Tool D: Fund Comparison Tool
Side-by-side comparison of 2-3 funds with overlaid charts and key metrics comparison. Key use cases:
- Same underlying, different buffer (SPY 30% deep vs SPY 100% full)
- Same buffer, different underlying (QQQ 10% vs IWM 15%)
- Different series of same fund (May vs Aug timing comparison)

#### Tool E: Outcome Period Calendar / Timeline
Gantt-chart-style visual showing all 24 funds' outcome periods on a timeline. Helps advisors plan entry points and see which funds are nearest to reset. Particularly important given the 8-month gap in Corgi's series.

### Priority 3 (Nice-to-Have)

#### Tool F: Personal Lists & Alerts
Watchlist management with threshold alerts (e.g., "Alert when remaining buffer drops below 5%").

#### Tool G: Blend / Portfolio Analysis
Model outcomes for a portfolio of multiple Corgi buffer ETFs combined.

---

## Part 4: Key Risks and Edge Cases

1. **100% Buffer Fund Low Cap**: May have an extremely low cap (2-4%). UI must handle this gracefully - charts and visualizations should not break or become unreadable with very small positive cap values.

2. **Deep Buffer Gap Communication**: The 5% gap on the U.S. Equities 30% fund needs crystal-clear communication. The "Downside Before Buffer" metric is critical here. Mid-period investors need to understand whether that 5% gap has already been breached.

3. **8-Month Series Gap**: No new outcome periods start Sep-Apr. Tools should show "Next Reset Date" and explain entry point implications. An investor in January will see all funds mid-period with no imminent reset.

4. **Mid-Period Entry**: The most critical investor education point. Tools B and C must clearly communicate that buying mid-period means inheriting the fund's current position relative to cap and buffer, not the starting values. This is a common source of confusion.

5. **Gross vs Net Caps**: Always display both. The difference represents the embedded cost of the buffer protection (fees reduce the effective cap). This is important for cost transparency.

6. **Historical Data Archival**: When an outcome period ends, all daily data for that period should be archived for the Performance Recap / historical view. Design the data pipeline to snapshot at period close.

7. **Data Pipeline Dependency**: The most complex operational piece is the daily calculation of remaining cap and buffer values. This requires the options sub-adviser to mark the FLEX options portfolio to market daily. This is the critical path dependency for Tools A and B.
