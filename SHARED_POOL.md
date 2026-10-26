# Shared pool on Google Sheets and Vercel

The Vercel app serves the existing dashboard from `public/` and the Node APIs from `api/`. `vercel.json` skips the Sites/Vinext build for this host. This repository is the portable Node/Vercel source. Calculator route adapters under app/api are retained for regression tests. No Sites runtime is required.

## Current resources

- Vercel project: `surplus-bowl`, project ID `prj_jZEMafglKrx6E8ovZIyYX6A3nUB0`, Starfall Hollow team.
- Google Sheet: https://docs.google.com/spreadsheets/d/15buis_NU9n_u4rsT9QjYv90dxA1lDcrGUX3oMLpLthE/edit
- GitHub repository: https://github.com/fongstein1/NFL-playoff-plus-plus

## Runtime setup

Vercel already has `GOOGLE_SHEET_ID` and a generated sensitive `POOL_SESSION_SECRET`. Add `GOOGLE_SERVICE_ACCOUNT_JSON` as a sensitive environment variable for Production and Preview. Use a Google service account with the Sheets API enabled and share this new Sheet with its `client_email` as Editor. Keep the Sheet restricted. Never commit the JSON key or paste it into a chat message. Redeploy after adding the variable.

The previous NHL dashboard's service-account variable is sensitive and Vercel does not return its value through the connected API. It has not been copied. The new app returns an explicit setup error until its own credential is configured. Calculator previews and local demo mode continue to work.

Link this repository to the existing Vercel project for deployments from main. Do not create another Vercel project with the same name. Its build/install/output overrides are in `vercel.json`.

## Sheet contract

- `Guide`: operating notes and setup status.
- `Access!A2:C8`: six stable team IDs and their access codes, plus `commissioner`. Distribute only the relevant team code; the commissioner code can edit all results and run market sessions. Codes grant access to the shared pool, not to the Sheet itself. Replacing a code blocks new logins; previously issued sessions last up to 24 hours. Rotate the Vercel session secret to invalidate all sessions immediately.
- `Initial!B2`: starting state JSON. The shared pool starts with no results or picks. Matchups, probabilities, teams and prop prices remain illustrative. Configure a real season in the source/starting state before collecting entries. Do not rewrite this cell once Events has submissions.
- `Events!A:E`: append-only audit record. Columns are timestamp (UTC), command ID, actor, action type and event JSON. Never sort, edit or delete these rows in place. Up to 10,000 commands are supported; archive a season before reaching that limit.

Google Sheets is the canonical command record. The server reads the initial state and event log, then deterministically recalculates funds. Browser-calculated balances are never accepted as authority. Simultaneous commands use a base revision: the first valid append wins and a stale command is rejected and reloaded. Repeated command IDs are deduplicated. Rejected concurrent commands remain visible in the log; replay determines acceptance. A network retry reuses its command ID.

The app requires team-code login before reading shared pool data. Team sessions can change only their own open picks, allocations and slips. Commissioner actions are checked on the server. Cookies are signed, HttpOnly, SameSite Strict and Secure on HTTPS, with a 24-hour lifetime. Cross-origin writes are rejected. The private Vercel project retains its default deployment protection. Access to a team code allows viewing the pool's submitted picks and other teams' standings.

Click Refresh to retrieve other devices' latest submissions. Saves also retrieve the current shared state. There is no background polling, automatic market session, live sports feed or automatic Sheet formula model. Export pool JSON for a readable state snapshot; the Sheet holds the durable input record.

## Super Bowl rules

Teams may stake up to 100% of their fund, including on a single selection. Stakes are whole points, so a fractional remainder can remain unused. No 50% reserve or 20% selection cap applies. The prop desk opens once conference results are settled. Saving the first submitted slip ends investment trading for the entire pool, keeping all prop budgets consistent. Merely drafting a slip does not end investments. The internal legacy `market.frozen` flag now represents this phase boundary, not protected capital.

Scenario analysis and the reinsurance lab are under Investments. Both are previews and do not change standings. Only commissioner-run market sessions apply returns to all teams.

## Validation

Run `node tests/scoring.mjs`, `node tests/markets.mjs`, `node tests/api.mjs`, `node tests/preview.mjs`, `node tests/credit-scenarios.mjs`, `node tests/reinsurance.mjs`, and `node tests/shared-pool.mjs`.

The shared-pool suite tests authorization, locked phases, server calculation, deterministic replay, stale submissions, duplicate retries, cookie validation and origin restrictions using an in-memory store. A real two-device Sheets write/read test remains required after the Google credential is installed.
