# Weekly News

The news tab is a four-week fictional decision game. It is not a news feed. Each bulletin contains an economic story, a sector story and a football story, each with a discussion prompt. Teams can save up to 1,200 characters of reasoning for the open week. Saved shared-pool notes are visible to the pool. Demo notes stay in the current browser.

## Cycle

1. A published bulletin opens the planning phase. Teams discuss the signals, save target allocations and submit playoff picks.
2. The commissioner closes the week. This applies one investment session to the capital present at closure, closes that round's picks and publishes the outcomes and team results in a recap. It cannot run twice.
3. The commissioner publishes the next bulletin. The previous recap remains visible beside the new stories, with older recaps available in the selector.

There are no scheduled updates. Closing a news week is a commissioner action in the shared pool. Demo controls provide the same flow without writing shared data. Scenario analysis remains an independent preview under Investments. Standalone market sessions still work separately and are not counted as a news-week closure.

The first submitted Super Bowl prop slip ends investment trading for all teams. Finish any desired news-week closures before submitting a slip. Week 4's football item discusses the final prop menu but does not change its prices.

## Outcomes

The economic story has a 70% chance of the stated direction holding; otherwise its alternative macro scenario applies. The sector story has a 65% confirmation chance and adds a small sector-specific move. The football story has a 55% chance of its signal holding, otherwise the recap calls it a false signal. These frequencies are game settings, not estimates of real forecasting accuracy. A football story never determines the game winner.

Shared-pool resolutions derive a seed from the server session secret and command ID, then record the seed in the private event log. The published state exposes only the resolved recap, not that seed. Replay is deterministic, including retries and concurrent submissions. In local demo mode a random seed is sent to a stateless preview endpoint. That endpoint never writes the Sheet.

Recaps show the original headline, what happened, all eight asset returns and the point gain/loss for every team. They retain their period's team outcomes even after later winnings enter the fund. Newly finalized game results preserve investment history. Corrections to an already settled result are blocked once investment sessions exist; a commissioner can explicitly reset the season instead.

## Price rules

`game.p` is the reference probability pair. Until an actual odds provider is configured these are illustrative sample inputs. The two sides sum to one. Football news can move the first side by a maximum of 8 percentage points, with probabilities bounded between 5% and 95%; the other side is its complement. The UI shows both reference and pool probabilities and fair decimal equivalents. These fair prices do not include a bookmaker margin.

New picks record their pool probability in `pickQuotes`. Correct-pick rewards use that recorded probability and the existing round bonus. Later news and recaps never reprice a submitted pick. Picks recorded before this feature retain their original reference probability; historical event commands without the new pricing marker are replayed at reference prices. News does not alter `markets[].odds`, the separate Super Bowl prop menu.

## Additional funds

Technology, energy and gold join the existing equity, government-bond, corporate-bond, property and cash choices. Existing allocations migrate with zero exposure to the three new funds, preserving numerical balances. A new Opportunistic preset provides a starting mix for discussion. Technology overlaps broad equity holdings; adding a sector fund does not automatically create diversification.

All formulas below produce percentage returns per session, capped at plus/minus 8%. Factor units match SCENARIO_MODEL.md: growth, inflation and earnings are game scores, while yields and risk premia are basis-point changes.

| Fund | House sensitivity before weekly sector overlays |
|---|---|
| Technology | 0.035 + 1.15 × growth − 0.70 × inflation − 0.05 × yields − 0.05 × risk premium + 1.60 × earnings |
| Energy | 0.020 + 0.80 × growth + 1.10 × inflation − 0.015 × risk premium + 0.15 × earnings |
| Gold | 0.005 − 0.15 × growth + 0.55 × inflation − 0.03 × yields + 0.025 × risk premium |

Week 1's sector story adds +1.2% or −1.0% to technology; week 2 adds +1.1% or −0.8% to property; week 3 adds +0.9% or −0.7% to gold; week 4 adds −0.9% or +0.8% to energy. The final combined return is capped at 8% in either direction. The existing economic scenario engine supplies the other moves. These are designed teaching examples, not calibrated investment forecasts.

## Checks

`npm test` includes independent weekly P&L reconciliation, old/new allocation handling, immutable pick quotes and reference prices, preserved session history, locked phases, team ownership, repeat-closure rejection, false signals and deterministic event replay. Real shared Sheets write/read verification still depends on the Google service-account setup described in SHARED_POOL.md.
