# Shared pool on Google Sheets and Vercel

The Vercel app serves the existing dashboard from `public/` and the Node APIs from `api/`. `vercel.json` skips the Sites/Vinext build for this host. This repository is the portable Node/Vercel source. Calculator route adapters under app/api are retained for regression tests. No Sites runtime is required.

## Current resources

- Vercel project: `surplus-bowl`, project ID `prj_jZEMafglKrx6E8ovZIyYX6A3nUB0`, Starfall Hollow team.
- Google Sheet: https://docs.google.com/spreadsheets/d/15buis_NU9n_u4rsT9QjYv90dxA1lDcrGUX3oMLpLthE/edit
- GitHub repository: https://github.com/fongstein1/NFL-playoff-plus-plus

## Runtime setup

Configure `GOOGLE_SHEET_ID`, a generated secret `POOL_SESSION_SECRET`, and secret `GOOGLE_SERVICE_ACCOUNT_JSON` for Production. For Preview testing, use a separate test Sheet. Use a Google service account with the Sheets API enabled and share this new Sheet with its `client_email` as Editor. Keep the Sheet restricted. Never commit the JSON key or paste it into a chat message. Redeploy after adding the variable.

The previous NHL dashboard's service-account variable is sensitive and Vercel does not return its value through the connected API. It has not been copied. The app returns an explicit setup error if its own credential is missing. Calculator previews and local demo mode continue to work.

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

Teams may stake up to 100% of their fund, including on a single selection. Stakes are whole points, so a fractional remainder can remain unused. No 50% reserve or 20% selection cap applies. The prop desk opens once conference results are settled and the final investment year has been sold to cash. Saving the first submitted slip ends investment trading for the entire pool, keeping all prop budgets consistent. Merely drafting a slip does not end investments. The internal legacy `market.frozen` flag now represents this phase boundary, not protected capital.

Scenario analysis remains under Investments as a preview. Weekly News is a separate main tab. Commissioner-run news-week closures and standalone sessions apply returns to every team.

## Validation

Run `node tests/scoring.mjs`, `node tests/markets.mjs`, `node tests/api.mjs`, `node tests/preview.mjs`, `node tests/credit-scenarios.mjs`, `node tests/weekly-news.mjs`, and `node tests/shared-pool.mjs`.

The shared-pool suite tests authorization, locked phases, server calculation, deterministic replay, stale submissions, duplicate retries, cookie validation and origin restrictions using an in-memory store. The commissioner has reported successful setup. Validate shared read/write behavior after credential or hosting changes.

## Rules version 2

New pools use the annual investment lifecycle documented in WEEKLY_NEWS.md. Picks open only after that round's investment sale. Super Bowl slips require the fourth sale. The commissioner locks round picks separately from the sale and must enter final results before advancing. New pools pay 10/probability with no round multiplier. Replay preserves legacy scoring for previously active logs; new event records include schemaVersion 2. Game-source actions fetch and validate matching postseason context server-side. Source context does not change settlement.


## Connection checklist and harmless live test

1. In Google Cloud, select the service account's project and enable Google Sheets API. Create a dedicated service account if needed; project-wide Editor and domain-wide delegation are not required.
2. From IAM & Admin → Service Accounts → the account → Keys → Add key → Create new key, download a JSON key. If you already securely retain the NHL account's JSON, that account can be reused, with access explicitly granted to this Sheet.
3. Share the pool Sheet with the JSON client_email as Editor, leaving general access Restricted. Keep the JSON private.
4. In Vercel's existing surplus-bowl project, add GOOGLE_SERVICE_ACCOUNT_JSON as a Production Secret (Sensitive in older UI). Paste the entire raw JSON object, not just private_key or a filename. GOOGLE_SHEET_ID and POOL_SESSION_SECRET are already present. Use a separate test Sheet for Preview if adding Preview credentials.
5. Redeploy the latest main commit after saving. Environment changes do not affect an existing deployment.
6. Open the production dashboard, choose Team sign in, then use a team's code from the private Access tab. Browser-demo changes do not automatically migrate to the shared pool.
7. While an investment week is in planning, save the team’s intended fund allocation. Verify an allocation row in Events, refresh the dashboard, then sign in as the same team in a separate browser and verify the weights after Refresh. Preserve the audit rows.
8. Confirm a team login has no active commissioner controls. Do not run years, lock picks or enter results for this connection test. Keep Initial!B2 and Events unchanged manually.

Expected troubleshooting: setup-incomplete means missing deployment variables; Google-authentication failure means malformed/revoked credentials; Sheet-read failure means sharing, Sheet ID or API setup; rejected login means the selected team and code do not match. Recheck production read/write behavior after changing credentials.


## In-person discussion

The site no longer displays discussion forms, notes or team-table questions. Existing discussion commands remain replayable so the audit history stays valid. New bulletins include authored multi-paragraph fictional stories; the story prose does not alter scenario factors, outcome probabilities or price adjustments.
