# Surplus Bowl verification — 2026-11-04

Status: browser demo season passed after two UI fixes. Real shared-pool sign-in, Google Sheets saves, independent-session reload and deployed role checks remain unverified.

## Fixes
- Restore Investment results → Demo controls / Commissioner controls navigation. Shared team accounts receive no commissioner navigation entry; server authorization remains in place.
- Reset sample pool now creates an empty rules-v2 week-one season instead of restoring the partially completed example.

## Evidence
- Production baseline: ab3ddfbd2db943c8791395c8c7d9456bc3e7e539.
- Browser-tested code: c4f2e552850a7568aa55fc3da87d5221c94b4990.
- Preview deployment: dpl_8D3Ks4MepqmdTxidmPBi42CdpmDz, READY.
- All 11 automated test files passed. The new suite checks navigation for demo, commissioner and team roles.
- Browser UI: reset to empty week one; run four annual investment sales; submit 12 picks; lock rounds; enter all 12 game results; submit and lock a prop slip; settle winning, losing and voided selections; show final awards.
- Test slip: 100 points on AFC champion at 1.8 (win), 64 on total Over at 1.91 (loss), 100 on passing Over at 1.9 (void). Net prop profit = 180 + 0 + 100 - 264 = 16.
- Final displayed results: 280.1 fund, 16.0 prop profit, 12 correct picks, +37.11% compounded investment return.
- Reloaded the browser page and reopened Trophies; final values persisted in browser demo storage. This is NOT evidence of Google Sheets persistence.
- Production /api/pool returned the application's sign-in-required response. This confirms reachability, not successful Google authentication or Sheet access.
- Production Events retained its same two pre-existing allocation rows. No production events were written.

## Isolated test setup prepared
A separate native Google Sheet was copied, reset to the current eight-fund rules-v2 starting state, and given independent random access codes. Its Events tab is empty. Preview GOOGLE_SHEET_ID points to that copy and Preview has an independent POOL_SESSION_SECRET. Production variables retain their original scope/value.

The Vercel project is not linked to a Git repository, so previews were created explicitly through the existing project's Git-source deployment API. No production deployment or merge was performed.

## Required credential setup
1. Use a test service account with Sheets API enabled; share the isolated test Sheet with its client_email as Editor. Keep general access restricted.
2. Add its complete JSON key to surplus-bowl's GOOGLE_SERVICE_ACCOUNT_JSON as a Preview Secret. Do not paste credentials into chat or commit them.
3. Redeploy the PR head as Preview after the variable is saved. The current preview predates the independent signing-secret configuration.
4. Use secure browser sign-in with the test codes from the isolated Access tab. Verify a team allocation appends an Events row, survives refresh and is visible after a separate sign-in. Verify team ownership restrictions and disabled commissioner actions, then complete the season as commissioner.
5. Leave the PR draft until the real-Sheet flow passes. The production pool remains on the original commit.
