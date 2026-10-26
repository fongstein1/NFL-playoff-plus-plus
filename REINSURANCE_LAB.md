# Reinsurance teaching lab

The lab is a separate one-period insurance-book exercise, reached through Investment results → Reinsurance lab. It does not insure investment losses or write to pool balances. All amounts are virtual points. Default starting funds are 1,000; the selected team's investment fund can be copied into the exercise without modifying that team.

## Insured book

Risks A/B/C have sums insured 100/300/600 and original earned premiums 12/24/36. Five loss patterns demonstrate quiet experience, one large claim, many small claims, a common event and the same losses in unrelated events. Claims on a risk in one event cannot exceed that risk's sum insured. Repeated claim records are grouped before applying per-risk cover.

## Covers

Each is an independent alternative, never stacked with the others.

- No cover: keep premiums and claims.
- Quota share: one cession percentage applied to every covered risk, its original premium and losses; fixed ceding commission on ceded premium.
- Surplus share: ceded sum = min(max(sum insured − retained line, 0), retained line × number of lines). Ceded percentage is ceded sum / sum insured, fixed before claims and applied from the first point of premium and loss. When capacity is exhausted, retained sum can exceed one retained line.
- Per-risk XoL: apply min(max(loss − attachment, 0), limit) to each risk/event group. Amounts above the layer remain with the insurer.
- Event/catastrophe XoL: apply the layer to each event's total subject to a configurable minimum affected-risk count (default two, making the example a catastrophe cover).
- Aggregate stop loss: apply the layer once to all period losses, attaching at a percentage of this example's gross original premium.

Per-risk and event layers reset at each occurrence/event. No annual aggregate XoL limits, reinstatement charges or inuring covers are modelled. Allocating event/aggregate recoveries pro rata to individual claims is for display only.

## Premium and funds accounting

Ending funds = starting funds + original premium − proportional premium ceded + ceding commission − non-proportional premium − retained losses.

All cover prices and commissions are editable illustrative inputs. The model excludes expenses, taxes, investment income, reserve changes, exclusions and collection delays/defaults. It assumes recoveries are fully collectible. Ending funds are not statutory capital or a solvency measure. Cover comparison is a hindsight cash-result exercise, not a recommendation or pricing model.

Insurer underwriting result + reinsurer result reconciles to gross original premium − gross claims. The tests verify the independent default examples, risk/event grouping, above-layer loss, stop-loss limits, commissions and quiet-period costs.

## Life basics

The guide separates automatic/facultative placement from economic reinsurance forms. It introduces YRT, coinsurance, modco and funds withheld, with a one-policy YRT arithmetic example. It explicitly distinguishes life excess-of-retention cessions from a claim-based XoL layer. The original treaty determines the risk, reserve, asset and settlement details.

## Sources

- Swiss Re, Proportional and non-proportional reinsurance: https://www.swissre.com/dam/jcr:1ec8b4cd-dafc-411f-aafd-385d6517ccfd/pub_proportional_non_proportional_en.pdf
- Munich Re glossary: https://www.munichre.com/ca-non-life/en/solutions/glossary.html
- SOA life and annuity reinsurance seminar: https://www.soa.org/globalassets/assets/files/e-business/pd/events/2017/reinsurance-seminar/2017-life-and-annuity-reinsurance-presentations.pdf
- RGA annual report, reinsurance structures: https://investor.rgare.com/static-files/833316a0-10f3-427e-9666-34213c5415bd

The formulas and numbers are house-authored educational examples, not copied course exercises or treaty terms.

## Typography

Self-hosted subset DejaVu Sans regular and bold replace the serif heading system. Font license is distributed at public/fonts/LICENSE.txt. WOFF assets work without external font services.

## Validation

`node tests/reinsurance.mjs` checks the model and API handler. Browser QA covers quota share, event grouping and life basics. Existing football, market, portfolio-preview and credit-scenario tests remain applicable.
