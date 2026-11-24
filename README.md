# Arteche Bonos

**Fixed-income research and analytics by Grupo Arteche.**

Arteche Bonos is a research workspace for Argentine sovereign, provincial and corporate fixed-income instruments, including negotiable obligations (ON).

## Product scope
- Bond screener by issuer, currency, maturity and instrument type.
- Transparent calculations for price, parity, yield to maturity (TIR), duration and cash flows.
- Instrument comparison with assumptions shown side by side.
- Coupon and principal payment schedules.
- Scenario simulator for price, yield and reinvestment assumptions.
- Issuer and instrument research with links to source documents.
- Exportable analytical summaries.

## Calculation principles
All calculations must state their conventions, cash-flow schedule, settlement date, day-count basis, currency and assumptions. Inputs and source timestamps must be visible. If a field or source is unavailable, show it as unavailable rather than estimating silently.

## Development roadmap
1. Instrument catalogue and source registry.
2. Cash-flow engine with unit tests.
3. TIR, parity and duration calculations with documented conventions.
4. Screener and comparison interface.
5. Scenario simulator and exportable reports.

## Data and compliance
Market prices, terms and issuer documents must be sourced and timestamped. The product is an analytical tool, not a broker, exchange or personalized investment adviser. No recommendation should be presented as guaranteed return.

## Status
Product definition and MVP planning. Production use requires validated market data, reviewed calculation conventions and automated tests.
