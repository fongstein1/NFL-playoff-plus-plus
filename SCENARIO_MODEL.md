# Surplus Bowl market model

The server exposes GET /api/scenarios (catalog and assumptions) and POST /api/scenarios (a calculated scenario). Pool balances, football picks and allocations remain browser-local demo state. The API is stateless: its deterministic draws are reproducible, not secret or suitable as competitive anti-cheat protection. A shared pool requires persistent league records, identity-to-team membership, commissioner authorization, sealed picks and a server-owned daily event.

## Course grounding

This is a fictional football-pool market model. All coefficients, frequencies and outcomes are house assumptions.

## Economic model

Six house factors: growth, inflation, yield shock in basis points, risk-premium shock in basis points, earnings and property demand. Eighteen hand-authored scenarios cover expansion, disinflation, inflation, recession, risk-off and neutral regimes. Regime transitions use explicit house weights; event draws are seeded for reproducibility.

Returns are percentages per game session. Let dy = ratesBps / 10000:

- Government bonds: 0.02 + 100 × (−4.2 × dy + 0.5 × 24 × dy²).
- Equities: 0.025 + 0.85 growth − 0.45 inflation − 0.025 ratesBps − 0.035 riskBps + earnings.
- Property: 0.015 + 0.65 growth − 0.30 inflation − 0.045 ratesBps − 0.025 riskBps + property demand.
- Cash: 0.01.

Asset returns are capped at ±8%. These are accelerated game assumptions, not daily forecasts or course calibration. Government bonds have no corporate spread exposure. Both stocks and bonds can fall under inflation shocks.

Allocations lock before a session; the same asset returns apply to all teams. The fund rebalances to its saved weights before each session. New football contributions enter before the next session, with no retroactive gains. Existing 25% round bonuses are already included in football capital. Market P&L is kept separately. Freezing funds ends investment movements and fixes prop budgets. Correcting football results clears the market ledger and all prop slips to preserve consistency.

## Charts

Overall fund snapshots include capital and market results; Now adds subsequent contributions and settled prop gains/losses. Pending prop stakes remain at cost. The investment index chains session returns from 100, excluding contribution effects and props. Daily bars support points and percentage returns. Exact per-session values accompany the charts.

## Primary references for general concepts

- MSRB, Evaluating Interest Rate Risk (duration and convexity): https://www.msrb.org/sites/default/files/Evaluating-Interest-Rate-Risk.pdf

These support general scenario and bond-risk concepts, not the game's coefficients.

## Verification

Run `node tests/scoring.mjs` and `node tests/markets.mjs`. Browser QA covers server scenario draws, all-team attribution, allocation locking, fund/index charts and daily points/percent selection. Shared persistence, real headlines, scheduled execution and production anti-cheat are not implemented.

## Scenario lab

The portfolio preview endpoint `POST /api/scenarios/preview` is independent of session settlement. It accepts validated current funds and target allocations and returns asset contributions, portfolio returns and hypothetical closing funds. It has no write path into the pool ledger.

Direct asset shocks allow −50% to +50%, providing stress tests outside normal daily game limits. Economic-driver previews use the existing model and its ±8% cap. Presets and generated scenarios scale factors by 0.5, 1 or 1.8 for mild, moderate and severe strength, with factor limits preserved. The lab draws across the scenario deck; severe draws omit the quiet-session card. It does not change the regime-weighted draws used by official market sessions.

Generation is reproducible from the seed returned in the API response. Preview percentages and points are rounded for display; attribution retains full precision. The browser ignores superseded responses when inputs change. Preview outcomes are not saved as actual investment performance.

`node tests/preview.mjs` checks an independently worked allocation example, immutable inputs, asset contribution reconciliation, zero moves, rejected invalid allocations and shocks, API responses and 300 generated scenarios across all strengths.

## Version 2: event-led scenarios and corporate bonds

The lab now begins with an event and event strength. Asset-return and economic-factor editing remain supported by the API for compatibility but are no longer the lab's primary interface. Each event returns its assumed government-yield and corporate-spread shocks, a transmission explanation, asset returns, bond-return attribution and portfolio impacts.

The asset set now contains equities, government bonds, investment-grade corporate bonds, property and cash. Existing portfolios receive 0% corporate bonds; historical balances and contributions are preserved. Legacy sessions mark corporate returns as not modelled. New allocation presets divide some fixed-income exposure between government and corporate bonds.

The event library contains 22 scenarios. Added cases include a lending squeeze after loan losses, a banking backstop, rating downgrades, and a case where rising government yields more than offset the gain from narrowing corporate spreads.

A separate creditBps factor distinguishes credit-spread changes from benchmark yields and broad risk appetite. Corporate total return, before the ±8% game cap, is:

0.03 + 100 × [−4.2 × dy − 4.0 × ds + 0.5 × 24 × (dy + ds)²], where dy = government yield shock / 10000 and ds = corporate credit-spread shock / 10000.

The 0.03% carry, durations and convexity are illustrative house parameters for a game session. A 30 bp spread tightening with unchanged government yields contributes approximately +1.20% from spread duration alone; convexity and carry give +1.2408% in this model. No government-bond spread gain is invented. Narrower spreads lift existing corporate bond prices but reduce the extra yield on new purchases.

Primary conceptual reference: CFA Institute, Credit Risk: https://www.cfainstitute.org/insights/professional-learning/refresher-readings/2026/credit-risk . This supports the relationship and duration method, not the game's calibration or assumed news responses.

Version 3 adds technology, energy and gold as optional holdings. Existing allocations migrate with zero exposure to the new funds; prior numerical gains remain unchanged. See WEEKLY_NEWS.md for sensitivities and weekly sector overlays.
