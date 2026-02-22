# Data Model: Corgi Buffer ETF Tools

## Core Daily-Updated Data Points (Per Fund)

### Static Fields (Set Once Per Fund)

| Field | Type | Example | Notes |
|---|---|---|---|
| fund_ticker | string | "CQMB" | Assigned when fund launches |
| fund_name | string | "Technology Leaders 10% Structured Buffer ETF - May Series" | |
| fund_family | string | "Technology Leaders 10%" | For grouping |
| reference_asset_ticker | string | "QQQ" | QQQ, IWM, SPY, EFA, or EEM |
| reference_asset_name | string | "Invesco QQQ Trust" | Full name |
| buffer_type | enum | "standard" | standard, deep, full |
| buffer_size_pct | decimal | 10.00 | The stated buffer percentage |
| buffer_start_pct | decimal | 0.00 | 0% for standard, -5% for deep |
| buffer_end_pct | decimal | -10.00 | -10%, -15%, -35%, or -100% |
| series_month | string | "May" | May, Jun, Jul, Aug |
| expense_ratio | decimal | 0.0079 | Annual management fee |

### Per-Outcome-Period Fields (Set at Period Start)

| Field | Type | Example | Notes |
|---|---|---|---|
| outcome_period_id | integer | 1 | Auto-increment |
| fund_ticker | string | "CQMB" | FK to fund |
| outcome_period_start | date | 2026-05-01 | First day of period |
| outcome_period_end | date | 2027-04-30 | Last day of period |
| starting_cap_gross | decimal | 15.50 | Pre-fee cap, set by market conditions |
| starting_cap_net | decimal | 14.71 | Post-fee cap |
| starting_fund_nav | decimal | 25.00 | NAV on day 1 |
| starting_ref_asset_price | decimal | 520.45 | Reference price on day 1 |
| ref_asset_cap_value | decimal | 601.12 | Price at which cap is reached |
| buffer_start_ref_value | decimal | 520.45 | Ref price at buffer start (0% for standard) |
| buffer_end_ref_value | decimal | 468.41 | Ref price at buffer end |

### Daily Updated Fields

| Field | Type | Example | Source | Notes |
|---|---|---|---|---|
| date | date | 2026-06-15 | System | As-of date |
| fund_ticker | string | "CQMB" | System | FK to fund |
| fund_nav | decimal | 25.43 | Fund admin | Current NAV |
| fund_return_ptd | decimal | 1.72 | Calculated | (NAV / starting_nav - 1) * 100 |
| ref_asset_price | decimal | 528.90 | Market data | Current underlying price |
| ref_asset_return_ptd | decimal | 1.62 | Calculated | (price / starting_price - 1) * 100 |
| remaining_cap_gross | decimal | 13.78 | Options desk | Current remaining upside cap |
| remaining_cap_net | decimal | 12.99 | Options desk | Post-fee remaining cap |
| remaining_buffer_net | decimal | 10.00 | Options desk | Current remaining buffer |
| downside_before_buffer | decimal | 0.00 | Options desk | Loss before buffer kicks in |
| ref_asset_to_buffer_end | decimal | -11.62 | Calculated | How far ref asset is from buffer end |
| ref_asset_return_to_cap | decimal | 13.49 | Calculated | Ref asset move needed to hit cap |
| remaining_outcome_period | integer | 320 | Calculated | Days until period end |
| shares_outstanding | integer | 1500000 | Fund admin | For AUM calculation |

### Historical Outcome Period Summary (Archived at Period Close)

| Field | Type | Notes |
|---|---|---|
| outcome_period_id | integer | FK to outcome period |
| fund_ticker | string | |
| period_start_date | date | |
| period_end_date | date | |
| predetermined_net_cap | decimal | Cap at inception |
| net_return | decimal | Fund's total return for the period |
| ref_asset_return | decimal | Underlying ETF's total return |
| beta | decimal | Fund beta vs reference asset |
| standard_deviation | decimal | Fund return volatility |
| ref_asset_std_dev | decimal | Reference asset volatility |
| max_drawdown | decimal | Fund's worst peak-to-trough |
| ref_asset_max_drawdown | decimal | Reference asset worst drawdown |

---

## Data Pipeline Architecture

```
+------------------+     +------------------+     +------------------+
|  Fund Admin /    |     |  Market Data     |     |  Options Desk /  |
|  Custodian       |     |  Feed            |     |  Sub-Adviser     |
|                  |     |                  |     |                  |
|  - Fund NAV      |     |  - Ref Asset     |     |  - Remaining Cap |
|  - Shares Out    |     |    Price         |     |  - Remaining Buf |
+--------+---------+     +--------+---------+     |  - Downside      |
         |                        |                +--------+---------+
         |                        |                         |
         v                        v                         v
    +----+------------------------+-------------------------+----+
    |                    Data Ingestion Layer                     |
    |          (Daily after market close, ~5-6 PM ET)            |
    +------------------------------------------------------------+
                                  |
                                  v
    +------------------------------------------------------------+
    |                   Calculation Engine                        |
    |                                                            |
    |  - Fund Return PTD = (NAV / Starting NAV - 1)             |
    |  - Ref Asset Return PTD = (Price / Starting Price - 1)    |
    |  - Remaining Outcome Period = End Date - Today             |
    |  - Ref Asset to Buffer End = (Buffer End Price / Current   |
    |    Price - 1)                                              |
    |  - Ref Asset Return to Cap = (Cap Price / Current Price    |
    |    - 1)                                                    |
    +------------------------------------------------------------+
                                  |
                                  v
    +------------------------------------------------------------+
    |                      Database                              |
    |  (PostgreSQL / similar)                                    |
    |                                                            |
    |  Tables:                                                   |
    |  - funds (static fund info)                                |
    |  - outcome_periods (per-period parameters)                 |
    |  - daily_values (daily updated metrics)                    |
    |  - historical_periods (archived completed periods)         |
    +------------------------------------------------------------+
                                  |
                                  v
    +------------------------------------------------------------+
    |                      API Layer                              |
    |  (REST or GraphQL)                                         |
    |                                                            |
    |  Endpoints:                                                |
    |  GET /funds - List all funds with current values           |
    |  GET /funds/:ticker - Single fund detail                   |
    |  GET /funds/:ticker/performance - Time series data         |
    |  GET /funds/:ticker/scenarios - Hypothetical outcomes      |
    |  GET /funds/search - Filtered search                       |
    +------------------------------------------------------------+
                                  |
                                  v
    +------------------------------------------------------------+
    |                   Frontend (Web App)                        |
    |                                                            |
    |  - Fund Screener (Tool A)                                  |
    |  - Outcome Period Performance (Tool B)                     |
    |  - Scenario Visualizer (Tool C)                            |
    +------------------------------------------------------------+
```

---

## API Endpoint Specifications

### GET /api/funds
Returns all funds with current daily values. Supports query params for filtering.

**Query Params:**
- `reference_asset` - Filter by underlying (QQQ, IWM, SPY, EFA, EEM)
- `buffer_type` - Filter by type (standard, deep, full)
- `series` - Filter by month (may, jun, jul, aug)
- `sort_by` - Column to sort by
- `sort_dir` - asc or desc

**Response:**
```json
{
  "as_of_date": "2026-06-15",
  "count": 24,
  "funds": [
    {
      "ticker": "CQMB",
      "name": "Technology Leaders 10% Structured Buffer ETF - May Series",
      "reference_asset": "QQQ",
      "buffer_type": "standard",
      "series": "May",
      "starting_cap_net": 14.71,
      "remaining_cap_net": 12.99,
      "remaining_buffer_net": 10.00,
      "downside_before_buffer": 0.00,
      "remaining_outcome_period_days": 320,
      "outcome_period_end": "2027-04-30",
      "fund_nav": 25.43,
      "fund_return_ptd": 1.72,
      "ref_asset_return_ptd": 1.62
    }
  ]
}
```

### GET /api/funds/:ticker/performance
Returns time-series data for the outcome period performance chart.

**Query Params:**
- `period_id` - Specific outcome period (default: current)

**Response:**
```json
{
  "fund": { "ticker": "CQMB", "name": "..." },
  "outcome_period": {
    "start": "2026-05-01",
    "end": "2027-04-30",
    "starting_cap_gross": 15.50,
    "starting_cap_net": 14.71,
    "starting_buffer": 10.00,
    "buffer_start_pct": 0.00,
    "buffer_end_pct": -10.00,
    "starting_fund_nav": 25.00,
    "starting_ref_asset_price": 520.45
  },
  "current_values": {
    "as_of_date": "2026-06-15",
    "fund_nav": 25.43,
    "fund_return_ptd": 1.72,
    "ref_asset_price": 528.90,
    "ref_asset_return_ptd": 1.62,
    "remaining_cap_net": 12.99,
    "remaining_buffer_net": 10.00,
    "downside_before_buffer": 0.00,
    "ref_asset_to_buffer_end": -11.62,
    "ref_asset_return_to_cap": 13.49,
    "remaining_outcome_period_days": 320
  },
  "time_series": [
    { "date": "2026-05-01", "fund_return": 0.00, "ref_asset_return": 0.00 },
    { "date": "2026-05-02", "fund_return": 0.12, "ref_asset_return": 0.15 },
    "..."
  ]
}
```

### GET /api/funds/:ticker/scenarios
Returns hypothetical outcome calculations.

**Query Params:**
- `mode` - "inception" or "current" (default: current)
- `custom_return` - Optional specific return to calculate

**Response:**
```json
{
  "fund": { "ticker": "CQMB", "name": "..." },
  "mode": "current",
  "cap": 12.99,
  "buffer_remaining": 10.00,
  "scenarios": [
    { "ref_return": 30.0, "fund_return": 12.99, "note": "Capped" },
    { "ref_return": 12.99, "fund_return": 12.99, "note": "At cap" },
    { "ref_return": 10.0, "fund_return": 10.0, "note": "Below cap" },
    { "ref_return": 0.0, "fund_return": 0.0, "note": "Flat" },
    { "ref_return": -5.0, "fund_return": 0.0, "note": "Buffer absorbs" },
    { "ref_return": -10.0, "fund_return": 0.0, "note": "Buffer fully used" },
    { "ref_return": -20.0, "fund_return": -10.0, "note": "Beyond buffer" },
    { "ref_return": -50.0, "fund_return": -40.0, "note": "Beyond buffer" }
  ]
}
```
