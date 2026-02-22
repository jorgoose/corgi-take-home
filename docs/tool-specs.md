# Tool Specifications: Corgi Buffer ETF Website Tools

## Tool A: Fund Screener

### Overview
A filterable, sortable table of all 24 Corgi buffer ETFs with current outcome period values updated daily.

### User Stories
1. As an advisor, I want to filter funds by reference asset so I can find buffer ETFs tied to a specific index.
2. As an advisor, I want to sort by remaining cap to find the fund with the most upside potential.
3. As an advisor, I want to filter by buffer type to compare standard vs deep vs full protection products.
4. As an investor, I want to see which funds are nearest to their outcome period reset date.

### UI Components

#### Filter Bar (Top)
- **Reference Asset**: Multi-select pill buttons (QQQ | IWM | SPY | EFA | EEM) - all selected by default
- **Buffer Type**: Multi-select pill buttons (Standard | Deep | Full) - all selected by default
- **Series Month**: Multi-select checkboxes (May | Jun | Jul | Aug) - all checked by default
- **Remaining Outcome Period**: Dual-handle range slider (0 to 365 days)
- **Reset Filters** button

#### Results Table
Sortable data grid with the following columns:

| Column | Width | Sortable | Format |
|---|---|---|---|
| Ticker | 80px | Yes | Link to Tool B |
| Fund Name | 300px | Yes | Text |
| Reference Asset | 80px | Yes | Ticker badge |
| Buffer Type | 100px | Yes | Colored badge (green=standard, blue=deep, purple=full) |
| Starting Cap (Net) | 100px | Yes | X.XX% |
| Remaining Cap (Net) | 120px | Yes | X.XX% with color indicator |
| Remaining Buffer (Net) | 120px | Yes | X.XX% with color indicator |
| Downside Before Buffer | 120px | Yes | X.XX% (highlight if > 0) |
| Days Remaining | 100px | Yes | N days |
| Period End | 100px | Yes | MM/DD/YYYY |

#### Additional Features
- **Export button**: Download as CSV/Excel
- **Row count**: "Showing X of 24 funds"
- **Last updated timestamp**: "Data as of MM/DD/YYYY"
- **Color coding**: Remaining buffer < 3% = red, < 5% = yellow, > 5% = green

### Responsive Behavior
- Desktop: Full table with all columns
- Tablet: Hide "Fund Name" (show on row expand), compress widths
- Mobile: Card layout with key metrics per fund

---

## Tool B: Outcome Period Performance Dashboard

### Overview
Interactive performance chart and detailed metrics table for a single fund's current or historical outcome period. This is a **compliance requirement** per the prospectus.

### User Stories
1. As an investor, I want to see how my fund is performing relative to the underlying ETF during the current outcome period.
2. As an advisor, I want to visualize where the fund currently sits relative to its cap and buffer levels.
3. As an investor, I want to review the outcomes of completed historical periods.

### UI Components

#### Header
- **Fund Selector**: Dropdown grouped by fund family
  - Technology Leaders (QQQ): May | Jun | Jul | Aug
  - U.S. Small-Cap (IWM): May | Jun | Jul | Aug
  - U.S. Equities 30% Deep (SPY): May | Jun | Jul | Aug
  - U.S. Equities 100% Full (SPY): May | Jun | Jul | Aug
  - International Developed (EFA): May | Jun | Jul | Aug
  - Emerging Markets (EEM): May | Jun | Jul | Aug
- **Outcome Period Selector**: Dropdown (current period + historical periods)
- **Download Chart** button (PNG export)

#### Performance Chart
- **Chart type**: Line chart (e.g., using Chart.js, Highcharts, or D3)
- **X-axis**: Date (within outcome period)
- **Y-axis**: Return (%) - centered at 0%
- **Lines**:
  - Fund return: Solid blue line with data points
  - Reference Asset return: Solid orange/gold line
- **Reference lines** (horizontal dashed):
  - Cap level: Green dashed line at +[Cap]%
  - Buffer Start: Gray dashed line at 0% (or -5% for deep buffer)
  - Buffer End: Red dashed line at -[Buffer End]%
- **Interactivity**:
  - Hover tooltip showing date, fund return, ref asset return
  - Click and drag to zoom into a date range
  - Double-click to reset zoom
- **Legend**: Below chart showing Fund and Reference Asset with toggle visibility

#### Key Metrics Table (Two-Column Layout)

**Left Column: Outcome Period Values**
| Metric | Value |
|---|---|
| Series | May |
| Reference Asset | Invesco QQQ Trust |
| Outcome Period | 05/01/2026 - 04/30/2027 |
| Fund Cap (Gross / Net) | 15.50% / 14.71% |
| Buffer (Gross / Net) | 10.00% / 10.00% |
| Starting Fund Value | $25.00 |
| Starting Ref Asset Value | $520.45 |
| Ref Asset Cap Value | $601.12 |
| Buffer Start % / Ref Asset Value | 0.00% / $520.45 |
| Buffer End % / Ref Asset Value | -10.00% / $468.41 |

**Right Column: Current Values (as of date)**
| Metric | Value |
|---|---|
| Remaining Outcome Period | 320 days |
| Fund Value / Return | $25.43 / 1.72% |
| Reference Asset Value / Return | $528.90 / 1.62% |
| Remaining Cap (Gross / Net) | 13.78% / 12.99% |
| Remaining Buffer (Net) | 10.00% |
| Downside Before Buffer | 0.00% |
| Ref Asset to Buffer End | -11.62% |
| Ref Asset Return to Realize Cap | 13.49% |

#### Definitions Section (Expandable/Collapsible)
Full glossary of all terms used in the metrics table. Key definitions include:
- **Remaining Cap**: The maximum additional upside if held to period end
- **Remaining Buffer**: Current downside protection remaining
- **Downside Before Buffer**: How much the fund can lose before the buffer takes effect
- **Reference Asset to Buffer End**: How far the reference asset must fall to consume the entire buffer

#### Disclaimers
- "Outcome values may only be realized for an investor who holds shares for the outcome period shown."
- "Past performance is not a guarantee of future results."
- Standard prospectus disclaimer language

---

## Tool C: Hypothetical Scenario Visualizer

### Overview
Interactive visualization showing hypothetical fund outcomes under various market scenarios. Provides both inception-level and current mid-period views.

### User Stories
1. As an investor, I want to understand what happens to my fund if the market goes up 20% or down 30%.
2. As an advisor, I want to show a client the risk/return tradeoff of a buffer ETF in different market environments.
3. As a mid-period buyer, I want to see my expected outcomes based on where the fund currently stands.

### UI Components

#### Controls
- **Fund Selector**: Dropdown (same as Tool B)
- **View Toggle**: "At Inception" | "Current (Mid-Period)" - pill toggle
- **Custom Scenario**: Number input field + "Calculate" button ("Enter a reference asset return %")

#### Scenario Bar Chart
- **Chart type**: Grouped bar chart (e.g., Chart.js or D3)
- **X-axis**: Scenario labels ("Strongly Negative", "Negative", "Flat", "Positive", "Strongly Positive")
- **Y-axis**: Return (%)
- **Bars per scenario**:
  - Orange bar: Reference Asset (Underlying ETF) return
  - Gray bar: Fund return
- **Reference lines**:
  - Horizontal green dashed line at Cap level
  - Horizontal red dashed line at Buffer End (or Buffer Start for deep buffer)
  - For deep buffer: additional line at -5% (gap level)
- **Labels on bars**: Show exact percentages

#### Scenario Table (Below Chart)

**Columns:**
| Underlying ETF Return | Fund Return | Difference | What Happens |
|---|---|---|---|
| +30% | +[Cap]% | Gains capped at cap level | |
| ... | ... | ... | ... |

**Pre-populated scenarios vary by buffer type:**

**Standard Buffer (e.g., 10%):**
- +30%, +20%, +Cap%, +10%, +5%, 0%, -5%, -10%, -15%, -25%, -50%

**Deep Buffer (e.g., -5% to -35%):**
- +30%, +20%, +Cap%, +10%, +5%, 0%, -3%, -5%, -15%, -25%, -35%, -50%

**Full Protection (100%):**
- +30%, +20%, +Cap%, +5%, 0%, -10%, -25%, -50%, -75%, -100%

#### Educational Callout Box
Contextual explanation that changes based on the selected buffer type:

**For Standard Buffer:**
> "This fund provides a buffer against the first [X]% of losses in [Reference Asset]. You participate in gains up to the [Cap]% cap. Losses beyond the buffer are borne by the investor."

**For Deep Buffer:**
> "This fund provides a buffer for losses between -5% and -35% of [Reference Asset]. You bear the first 5% of losses (the 'gap'), the buffer absorbs the next 30%, and losses beyond -35% are borne by the investor."

**For Full Protection:**
> "This fund provides 100% downside protection against losses in [Reference Asset]. The tradeoff is a lower cap on upside gains ([Cap]%)."

#### Mid-Period Mode
When "Current (Mid-Period)" is selected:
- Chart updates to use remaining cap and remaining buffer values
- Banner at top: "You are viewing outcomes based on current fund values as of [date]. These differ from inception values because [X days] have elapsed in the outcome period."
- If buffer has been partially consumed, show a warning: "The fund's buffer has been partially used. Remaining buffer: [X]%"

---

## Cross-Tool Navigation

All tools should link to each other:
- Clicking a ticker in Tool A opens Tool B for that fund
- Tool B has a "View Scenarios" button that opens Tool C for the same fund
- Tool C has a "View Performance" button that opens Tool B
- All tools have a "Back to Screener" link

## Shared Components
- **Fund selector dropdown** (reused across Tools B and C)
- **Disclaimer footer** (standard prospectus language)
- **Last Updated timestamp** (shows data freshness)
- **Glossary/Definitions** (shared term definitions)
