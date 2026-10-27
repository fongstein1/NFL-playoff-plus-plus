# NFL Playoff Plus Plus · The Surplus Bowl

A virtual-points NFL pool with a football-field dashboard, weekly news, eight investment funds, game detail panels, Super Bowl props and four trophies.

## Play

Read news and allocate the fund → simulate a full investment year and sell to cash → pick playoff winners → enter results → repeat. A correct playoff pick pays `10 / submitted probability`; it costs no stake. New pools have no automatic round-interest multiplier. Earlier winnings instead have more future investment opportunities.

The final sale funds Super Bowl props: up to 100% may be staked, returns include the stake, voids refund it, and pending bets remain valued at cost. Four separate awards recognize final fund, net Super Bowl profit, correct playoff picks and compounded investment percentage return. Ties share an award. The Rules view contains examples and edge cases.

NFL logos cover all 32 clubs. Click a game for pool quotes, entries and trusted NFL/ESPN links. Commissioners can attach an ESPN postseason event; both clubs must match. Event context is fetched server-side and does not alter pool settlement. Demo fixtures, odds and results are illustrative, with absent kickoff/venue information explicitly labeled.

## Run and verify

Node 24; no runtime dependencies. `npm test` runs all suites. `npm run dev` starts the local app. Vercel serves `public/` and rewrites APIs to `api/backend/`.

## Shared saving

See SHARED_POOL.md for Google Sheet structure, role-based command validation, session cookies and environment variables. Shared saving requires GOOGLE_SHEET_ID, POOL_SESSION_SECRET and GOOGLE_SERVICE_ACCOUNT_JSON in the deployment. Browser demo mode is clearly labeled and uses its own v2 storage key. Existing legacy command logs retain their original scoring.

Model details and calibration limits: SCENARIO_MODEL.md. Weekly lifecycle: WEEKLY_NEWS.md. All money-like balances are virtual points. This app does not place real bets or trade securities.
