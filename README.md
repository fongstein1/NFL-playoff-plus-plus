# NFL Playoff Plus Plus

The Surplus Bowl is an office football pool with actuarial scoring, team portfolios, Super Bowl props and a weekly news cycle. All stakes and returns are virtual points.

Live dashboard: https://surplus-bowl.vercel.app

## Features

- Team guesses: playoff winner picks, probability-based rewards and early-round bonuses.
- Investment results: eight asset classes, causal market scenarios and portfolio impact previews.
- Weekly News: upcoming fictional economic and football stories, group reasoning notes, news-adjusted playoff pool prices, and prior-week recaps with fund attribution.
- Team comparisons: overall funds, investment performance and daily movements.
- Super Bowl: stake up to 100% of a team fund, including on one selection. Whole-point stakes leave any fractional remainder unused. No protected reserve applies. Saving the first submitted prop slip ends investment trading for every team.
- Shared pool: Google Sheets submission log, team codes, commissioner controls, conflict detection and retry deduplication.

Matchups, probabilities, prices and market news are illustrative. No live scores, wagers, market feeds or automatic market sessions are connected.

## Run locally

Use Node.js 24. The app has no third-party runtime dependencies.

```sh
npm test
npm run dev
```

Open http://localhost:4173. Set `PORT` to change the port. Without Google credentials, the app runs as an explicitly labelled browser-local demo. Existing browser demo data is separate from the shared pool.

For a local shared-pool connection, put the variables from `.env.example` in a local `.env.local` file, then run:

```sh
node --env-file=.env.local scripts/dev.mjs
```

Never commit credentials or distribute the private Sheet itself to participants. Give each team only its own access code.

## Vercel and Google Sheets

`vercel.json` serves `public/` and the Node functions in `api/backend/`, with stable `/api/*` rewrites. It overrides framework detection and skips dependency installation. Keep the existing `surplus-bowl` Vercel project and its access controls.

The Sheet ID and session-signing secret are configured in Vercel. Shared saving still needs `GOOGLE_SERVICE_ACCOUNT_JSON` and Editor sharing of the Sheet with that service account. Until configured, `/api/pool` returns HTTP 503 with a setup explanation. Calculator previews and local demo saving work independently.

See [SHARED_POOL.md](SHARED_POOL.md) for the Sheet contract and remaining connection steps, [SCENARIO_MODEL.md](SCENARIO_MODEL.md) for the market assumptions.

## Tests

`npm test` runs seven suites covering scoring, market calculation, API input validation, portfolio previews, credit-spread effects, weekly-news resolution and shared-pool authorization/concurrency. The shared-pool tests use an in-memory store. A live two-device Sheets round trip remains to be verified after installing the Google credential.

See [WEEKLY_NEWS.md](WEEKLY_NEWS.md) for the weekly lifecycle, quote rules and three new fund sensitivities.

## Fonts

The dashboard uses a self-hosted DejaVu Sans subset. Its license is in `public/fonts/LICENSE.txt`.
