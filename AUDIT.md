# Spexx Cloud Gateway — Phase 0 Audit

Generated: 2026-04-23
Scope: recursive grep across `~/koding/` for the three Supabase project refs that
will be proxied by this Worker.

## Refs tracked

| Ref | Product | Future domain |
|---|---|---|
| `dnehqsalmcbimrdtlpsg` | Contentko (Creator) | `api.contentko.com` |
| `vexgswtiknfbdtqihvjc` | Kollably | `api.kollably.co` |
| `qbzmsvfphpfgnlztskma` | Spexx Hub (CRM / Ads / Growth / Insider Guide) | `api.insiderguide.co` (plus internal CRM/Ads uses) |

Note: `qbzmsvfphpfgnlztskma` is shared by multiple products. Only `api.insiderguide.co`
is in scope for this gateway. CRM / Ads keep their current domains (`crm.spexx.cloud`,
`ads.spexx.cloud`) unless later extended.

---

## Totals

| Ref | Files touched | Classification summary |
|---|---|---|
| `dnehqsalmcbimrdtlpsg` | 11 | 2 edge-function OAuth redirects (HOT), 1 frontend doc string, 1 n8n workflow, 1 cross-project edge function (spexx-ads), 6 docs/plans/seed/task files |
| `vexgswtiknfbdtqihvjc` | 6 | 1 frontend fallback URL (HOT), 1 env example, 3 docs, 1 guardian runner config |
| `qbzmsvfphpfgnlztskma` | 19 | 1 frontend fallback URL (HOT), 1 cross-project edge function call, 1 SQL migration (commented example), 1 Twilio webhook URL (HOT), 4 env examples, 10 docs/plans/specs |

Heaviest repos: `spexx-crm` (8 refs), `kollably` (6), `creator` (6), `admin`,
`guardian`, `spexx-ads`, `spexx-scraper`, `growthops`, `spexx-agents-ui`,
`insider-guide`, `trading-bots`, `contentko-demo-video`, `spexx-crew`.

---

## `dnehqsalmcbimrdtlpsg` (Contentko / Creator) — detail

| File | Line | Classification |
|---|---|---|
| `TEAM-DELEGATION-PLAN.md` | 62 | documentation (project roster table) |
| `creator/TASK.md` | 3 | documentation (project pointer) |
| `creator/docs/superpowers/plans/2026-04-15-backlog-viral-unification.md` | 220, 359, 370 | documentation (plan with curl + deploy commands) |
| `creator/docs/superpowers/specs/2026-04-13-hierarchical-content-types-design.md` | 5 | documentation (spec header) |
| **`creator/supabase/functions/meta-oauth-start/index.ts`** | 5 | **HOT — hardcoded OAuth REDIRECT_URI** |
| **`creator/supabase/functions/meta-oauth-callback/index.ts`** | 8 | **HOT — hardcoded OAuth REDIRECT_URI** |
| `creator/supabase/functions/meta-oauth-callback/index.ts` | 133 | guard: `SUPABASE_URL.includes("dnehqsalmcbimrdtlpsg")` — dev/prod switch |
| `creator/n8n-workflows/frameio-sync-to-creator.json` | webhook node | n8n workflow HTTP node target |
| `contentko-demo-video/src/TikTokDemo.tsx` | 353 | UI copy (demo screen text showing redirect URI to user) |
| `admin/project-finance/server/seed.ts` | 76-79 | seed data for finance dashboard (documentation-ish) |
| `spexx-ads/supabase/functions/engagement-leads/index.ts` | 5 | **HOT — cross-project fetch from spexx-ads edge fn into creator** |
| `guardian/claude-runner/server.js` | 38 | config field `supabaseRef: "dnehqsalmcbimrdtlpsg"` (single mention in minified file) |
| `guardian/n8n-workflows/archive-backup-2026-04-06.json` | n/a | n8n workflow archive (historical backup) |

**Cutover priorities (Contentko):**
1. `creator/supabase/functions/meta-oauth-start/index.ts` — REDIRECT_URI
2. `creator/supabase/functions/meta-oauth-callback/index.ts` — REDIRECT_URI (Meta OAuth dashboard also needs update)
3. `spexx-ads/supabase/functions/engagement-leads/index.ts` — CREATOR_SUPABASE_URL
4. `creator/n8n-workflows/frameio-sync-to-creator.json` — HTTP node URL
5. `contentko-demo-video/src/TikTokDemo.tsx` — demo copy text

---

## `vexgswtiknfbdtqihvjc` (Kollably) — detail

| File | Line | Classification |
|---|---|---|
| `TEAM-DELEGATION-PLAN.md` | 61 | documentation |
| `kollably/CLAUDE.md` | 17, 51 | documentation (CLI examples + pointer) |
| `admin/project-finance/server/seed.ts` | 76, 81 | seed data (documentation-ish) |
| **`kollably/src/pages/Pricing.tsx`** | 9 | **HOT — frontend fallback SUPABASE_URL constant** |
| `guardian/claude-runner/server.js` | 38 | guardian config field |
| `spexx-scraper/.env.example` | 2 | env example only |

**Cutover priorities (Kollably):**
1. `kollably/src/pages/Pricing.tsx` — hard-coded fallback URL (change default or require env)
2. `kollably/.env` (not in audit — user's .env must be updated for `VITE_SUPABASE_URL`)
3. `spexx-scraper/.env.example` (env template)

---

## `qbzmsvfphpfgnlztskma` (Spexx Hub / CRM / Ads / Growth / Insider Guide) — detail

| File | Line | Classification |
|---|---|---|
| `TEAM-DELEGATION-PLAN.md` | 60 | documentation |
| `spexx-crew/CLAUDE.md` | 9 | documentation |
| `spexx-crew/.env.example` | 2 | env example |
| `admin/project-finance/server/seed.ts` | 78 | seed data |
| **`kollably/supabase/functions/search-businesses/index.ts`** | 6 | **HOT — cross-project CRM_INGEST_URL** |
| `spexx-ads/.env.example` | 1 | env example |
| `trading-bots/polybot/docs/superpowers/specs/2026-04-11-spexx-ingest-gateway-design.md` | 227 | documentation (spec) |
| **`kollably/.env.example`** | 8 | env example comment (fallback URL) |
| **`kollably/src/lib/marketing-supabase.ts`** | 5, 16 | **HOT — marketing Supabase client DEFAULT_URL fallback** |
| `growthops/.env.example` | 2 | env example |
| `insider-guide/CLAUDE.md` | 6 | documentation |
| `spexx-ads/CLAUDE.md` | 5, 13 | documentation |
| `spexx-agents-ui/.env.example` | 2 | env example |
| `trading-bots/polybot/docs/superpowers/specs/2026-04-11-spexx-scraper-design.md` | 185 | documentation |
| `spexx-crm/docs/superpowers/plans/2026-04-11-edge-function-auth.md` | 12, 165, 175, 391, 392, 415, 425, 432, 452 | documentation (plan with CLI + curl examples) |
| `spexx-crm/supabase/.temp/linked-project.json` | 1 | CLI-managed file; do not edit manually |
| `spexx-scraper/.env.example` | 6 | env example (CRM_SUPABASE_URL) |
| `guardian/claude-runner/server.js` | 32 | guardian config |
| **`spexx-crm/docs/whatsapp-providers.md`** | 23, 51 | **documentation — BUT the URL on line 23 is the Twilio webhook URL users must configure in Twilio dashboard. Dashboard update required.** |
| `spexx-crm/docs/superpowers/specs/2026-04-11-edge-function-auth-design.md` | 92 | documentation (spec) |
| `spexx-crm/supabase/migrations/20260418_reply_classifier.sql` | 67 | SQL comment (example for `app.settings.supabase_url`) |
| `spexx-crm/supabase/functions/_shared/DEPLOY_NOTES.md` | 8 | documentation |
| `spexx-crm/CLAUDE.md` | 5 | documentation |

**Cutover priorities (Insider Guide specifically — which is the only `qbzmsvfphpfgnlztskma` surface this gateway owns):**
1. `kollably/supabase/functions/search-businesses/index.ts` — CRM_INGEST_URL (cross-project, but CRM-facing — keep unchanged unless `api.insiderguide.co` is what we want used)
2. Insider Guide app itself is NOT in this audit grep output — meaning it probably reads `VITE_SUPABASE_URL` from `.env` and doesn't hard-code the hostname. The `.env` file needs updating at cutover time. The `insider-guide/CLAUDE.md` reference (line 6) is documentation only.

---

## Categories (cross-ref)

### HOT — functional code calling the raw Supabase hostname (must be updated at cutover)

1. `creator/supabase/functions/meta-oauth-start/index.ts:5`
2. `creator/supabase/functions/meta-oauth-callback/index.ts:8`
3. `spexx-ads/supabase/functions/engagement-leads/index.ts:5`
4. `kollably/src/pages/Pricing.tsx:9`
5. `kollably/supabase/functions/search-businesses/index.ts:6` (internal CRM — not a gateway surface)
6. `kollably/src/lib/marketing-supabase.ts:5,16`
7. `creator/n8n-workflows/frameio-sync-to-creator.json` (webhook URL)

### WARM — env-example files (must update when user writes real `.env`)

`spexx-scraper/.env.example`, `spexx-ads/.env.example`, `spexx-agents-ui/.env.example`,
`kollably/.env.example`, `growthops/.env.example`, `spexx-crew/.env.example`.

### COLD — documentation / seed / plans / specs (update on next edit; non-blocking)

All files under `docs/`, `CLAUDE.md`, `TASK.md`, `admin/project-finance/server/seed.ts`,
`TEAM-DELEGATION-PLAN.md`, n8n backup archives, SQL migration comments.

### External (outside repo, flagged for the user)

- Meta Developer dashboard — OAuth redirect URI for Contentko must be updated to
  `https://api.contentko.com/functions/v1/meta-oauth-callback`
- TikTok Developer dashboard — same pattern, referenced in `contentko-demo-video/src/TikTokDemo.tsx:353`
- Twilio WhatsApp webhook URL (one per provider) — `https://api.insiderguide.co/functions/v1/receive-whatsapp?...` (or keep on CRM domain; user's call)
- Meta, TikTok, Frame.io n8n workflow HTTP nodes
- Supabase Storage CORS settings (confirm `api.contentko.com`, `api.kollably.co`, `api.insiderguide.co` are in the allowed-origins list for buckets used by frontends — video uploads especially)

---

## Constraints honored during audit

- No application code was modified.
- No Supabase project was queried.
- Audit is read-only grep only.
