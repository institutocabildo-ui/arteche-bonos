# Arteche Bonos

**Fixed-income research and analytics by Grupo Arteche.**

Arteche Bonos is an early-stage research workspace for Argentine sovereign, provincial and corporate fixed-income instruments, including negotiable obligations (ON).

## Current MVP

- Local bond cash-flow calculator for regular periods.
- Bullet and linear principal amortization models.
- Estimated periodic yield and annual effective yield (TIR).
- Macaulay and modified duration.
- Present-value calculation and projected cash-flow table.
- Input validation and explicit error when a yield cannot be bracketed.
- No backend or market-data connection is currently required; calculations run in the browser.

## Calculation assumptions and limitations

The current calculator assumes regular, equally spaced periods. It does not yet model settlement dates, accrued interest, business-day calendars, market day-count conventions, taxes, fees, amortization schedules specific to an instrument, or reinvestment. The output is an educational estimate, not a market quote or investment recommendation.

Before production use, calculations must be checked against independently verified bond examples and reviewed by a fixed-income specialist. Automated unit tests and a documented convention library remain required work.

## Product roadmap

1. Build an instrument catalogue and source registry with timestamps.
2. Add a validated cash-flow engine with automated unit tests.
3. Support real settlement dates, day-count bases and instrument-specific conventions.
4. Add screener, comparison and scenario analysis.
5. Add source-linked issuer research and exportable analytical reports.

## Data, transparency and compliance

Market prices, terms and issuer documents must be sourced and timestamped. Missing data must be shown as unavailable rather than silently estimated. The product is an analytical tool, not a broker, exchange or personalized investment adviser. No return is guaranteed.

## Status

Early MVP under active development. Not ready for production investment decisions.
