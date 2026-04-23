/**
 * Spexx Cloud Gateway
 *
 * A Cloudflare Worker that routes branded API domains to the correct
 * Supabase project by Host header. Replaces Supabase's $10/mo/project
 * custom-domain offering for the hostnames listed below.
 *
 * Streaming-safe: request and response bodies are passed through
 * without being buffered, so large uploads (e.g. videos) and SSE
 * responses work correctly.
 */

export interface Env {
  // Reserved for future env-driven config. Intentionally empty today.
}

/**
 * Branded host -> Supabase project host.
 * Keep in sync with wrangler.toml routes.
 */
const ROUTES: Record<string, string> = {
  "api.contentko.com": "dnehqsalmcbimrdtlpsg.supabase.co",
  "api.kollably.co": "vexgswtiknfbdtqihvjc.supabase.co",
  "api.insiderguide.co": "qbzmsvfphpfgnlztskma.supabase.co",
};

// Methods that may carry a request body. Others must not set `body` on the
// forwarded Request or the Workers runtime will throw.
const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export default {
  async fetch(req: Request, _env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(req.url);
    const target = ROUTES[url.hostname.toLowerCase()];

    if (!target) {
      console.log(`[gateway] 404 unknown host=${url.hostname} path=${url.pathname}`);
      return new Response("Not found", { status: 404 });
    }

    const proxyUrl = new URL(url.toString());
    proxyUrl.hostname = target;
    proxyUrl.port = "";
    proxyUrl.protocol = "https:";

    // Clone headers; override Host so Supabase's edge routes the request to the
    // correct project. Cloudflare strips hop-by-hop headers automatically.
    const headers = new Headers(req.headers);
    headers.set("Host", target);

    const hasBody = METHODS_WITH_BODY.has(req.method.toUpperCase()) && req.body !== null;

    const init: RequestInit & { duplex?: "half" } = {
      method: req.method,
      headers,
      redirect: "manual",
    };

    if (hasBody) {
      init.body = req.body;
      // Required in Workers/undici when streaming a request body.
      init.duplex = "half";
    }

    const proxyReq = new Request(proxyUrl.toString(), init);

    console.log(
      `[gateway] ${req.method} ${url.hostname}${url.pathname} -> ${target}${proxyUrl.pathname}`,
    );

    // Pass ctx through so that downstream waitUntil-style work (none today)
    // would not be truncated. Left unused to keep the code obvious.
    void ctx;

    return fetch(proxyReq);
  },
} satisfies ExportedHandler<Env>;
