# spexx-cloud-gateway

A single Cloudflare Worker that fronts branded API subdomains for Spexx apps
and proxies each one to its corresponding Supabase project. Replaces Supabase's
$10/month-per-project custom-domain addon.

## Routes

| Incoming host | Supabase project | Product |
|---|---|---|
| `api.contentko.com` | `dnehqsalmcbimrdtlpsg.supabase.co` | Contentko (Creator) |
| `api.kollably.co` | `vexgswtiknfbdtqihvjc.supabase.co` | Kollably |
| `api.insiderguide.co` | `qbzmsvfphpfgnlztskma.supabase.co` | Insider Guide (shared Spexx Hub) |

Any request hitting an unknown host returns `404 Not Found`.

## How it works

The Worker:

1. Looks up the inbound `Host` in a static routing table.
2. Rewrites the URL to the matching Supabase project host.
3. Overrides the `Host` header so Supabase's edge routes correctly.
4. Streams the request and response bodies through unmodified
   (`duplex: "half"`) so large uploads and SSE both work.
5. Uses `redirect: "manual"` so OAuth 302 responses from Supabase are passed
   through to the caller instead of being followed by the Worker.

CORS is not touched — Supabase already sets the appropriate headers and the
Worker returns them unchanged.

## Local dev

```bash
npm install
npx wrangler dev
# then, in another shell:
curl -sS -H 'Host: api.contentko.com' http://127.0.0.1:8787/functions/v1/ -i | head
```

## Tests

```bash
npm test
```

Vitest exercises the routing table, the host header rewrite, query-string
preservation, and the GET-no-body / POST-with-body code paths.

## Deploy

Prereqs:

1. All three domains must already be on the same Cloudflare account you are
   logging in to (`contentko.com`, `kollably.co`, `insiderguide.co`).
2. `wrangler login` once per machine.

```bash
cd /Users/axel/koding/spexx-cloud-gateway
npm install
npx wrangler login
npx wrangler deploy
```

Cloudflare will provision TLS certs automatically for each `custom_domain`
route declared in `wrangler.toml`.

## Cutover checklist

See `AUDIT.md` for the full list of files and external dashboards that
reference the raw `*.supabase.co` URLs and need updating once the gateway
is live.

High-priority surfaces to update after go-live:

- **Meta Developer dashboard** — Contentko OAuth redirect URI -> `https://api.contentko.com/functions/v1/meta-oauth-callback`
- **TikTok Developer dashboard** — same pattern
- **Twilio** — WhatsApp webhook URL (if moving to `api.insiderguide.co`)
- **Supabase Storage CORS** — add the three branded origins to each project's bucket CORS allow-list

## Safety

- No Worker secrets. The Worker is a pure proxy; all auth still flows through
  via the caller's `Authorization` / `apikey` headers and Supabase continues
  to be the source of truth for authentication and RLS.
- The Worker does NOT rewrite response headers, including `Set-Cookie` and
  `Location`. If a redirect points at `*.supabase.co`, the client will follow
  it to the raw Supabase host; update the upstream service (e.g. edge function
  `REDIRECT_URI` constants) if you need the redirect to stay on the branded
  domain.
