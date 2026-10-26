# Investment model · surplus-annual-v1

Each pool week represents one investment year. The bulletin identifies structural news risks. Resolution selects the headline outcome and sector outcome, then draws correlated regular annual volatility. The same asset returns apply to every team. Every holding is sold to cash; contributions from later football results join the next year. No fixed round-interest bonus applies to new pools.

## Pricing

Government bonds use duration 4.2 and convexity 24 against government yield changes. Corporate debt additionally uses spread duration 4. A spread change does not itself change government yields. Equities reflect earnings, growth, discount rates and risk premia; technology is more rate-sensitive. Property responds to demand, financing and discount rates; energy to growth and inflation; gold to a stylized real-yield/risk proxy. These are conditional channels, not guaranteed headline responses.

`lib/annual-market.mjs` publishes all coefficients. Baseline median annual returns / annual log-return volatility:

| Fund | Median | Volatility |
|---|---:|---:|
| Blue-chip equity | 6% | 18% |
| Government bonds | 3% | 7% |
| Corporate bonds | 4% | 8% |
| Property | 5% | 15% |
| Technology | 8% | 28% |
| Energy | 5% | 30% |
| Gold | 2% | 18% |
| Cash | 3% | 0.5% |

Four shared independent normal factors plus independent residuals generate covariance `B Bᵀ + diagonal residual variance`. A stable seeded hash and Box–Muller draw support replay. Returns equal `exp(log(1+baseline) + news log effect + volatility log draw) - 1`. Components multiply, rather than add. Prices remain positive; returns can exceed the legacy ±8% session limit. Means differ from medians under the lognormal model.

All numerical inputs, outcome probabilities and sensitivities are house assumptions, not empirical estimates. No currency factor, defaults, transaction costs or dynamic rebalancing is modeled. Cash is a low-volatility game fund. Bond duration/convexity is a local approximation, not full repricing. Preview can disable volatility to isolate news; official weekly resolution always includes it.

Theory references are linked in the UI: CFA Institute duration/convexity, discounted cash-flow valuation and portfolio covariance readings. Legacy session APIs remain for replay compatibility; new weekly pools use the annual model.
