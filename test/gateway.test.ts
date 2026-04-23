/**
 * Lightweight unit tests for the routing table and request transform.
 * The actual Worker entry uses global `fetch`, which we stub here.
 *
 * Run with: npm test (requires wrangler + vitest installed).
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import worker from "../src/index";

type FetchMock = ReturnType<typeof vi.fn>;

function installFetch(mock: FetchMock) {
  (globalThis as unknown as { fetch: typeof fetch }).fetch = mock as unknown as typeof fetch;
}

const noopEnv = {} as never;
const noopCtx = {
  waitUntil: () => undefined,
  passThroughOnException: () => undefined,
} as unknown as ExecutionContext;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("spexx-cloud-gateway", () => {
  it("returns 404 for unknown host", async () => {
    const fetchMock: FetchMock = vi.fn();
    installFetch(fetchMock);

    const res = await worker.fetch(
      new Request("https://example.com/functions/v1/hello"),
      noopEnv,
      noopCtx,
    );

    expect(res.status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rewrites contentko to the Supabase project host", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(new Response("ok", { status: 200 }));
    installFetch(fetchMock);

    await worker.fetch(
      new Request("https://api.contentko.com/functions/v1/ping"),
      noopEnv,
      noopCtx,
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const proxied = fetchMock.mock.calls[0][0] as Request;
    expect(new URL(proxied.url).hostname).toBe("dnehqsalmcbimrdtlpsg.supabase.co");
    expect(new URL(proxied.url).pathname).toBe("/functions/v1/ping");
    expect(proxied.headers.get("Host")).toBe("dnehqsalmcbimrdtlpsg.supabase.co");
  });

  it("rewrites kollably and insiderguide hosts", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(new Response("ok", { status: 200 }));
    installFetch(fetchMock);

    await worker.fetch(new Request("https://api.kollably.co/rest/v1/"), noopEnv, noopCtx);
    await worker.fetch(
      new Request("https://api.insiderguide.co/auth/v1/token"),
      noopEnv,
      noopCtx,
    );

    const first = fetchMock.mock.calls[0][0] as Request;
    const second = fetchMock.mock.calls[1][0] as Request;
    expect(new URL(first.url).hostname).toBe("vexgswtiknfbdtqihvjc.supabase.co");
    expect(new URL(second.url).hostname).toBe("qbzmsvfphpfgnlztskma.supabase.co");
  });

  it("preserves query string and Authorization header", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 204 }));
    installFetch(fetchMock);

    await worker.fetch(
      new Request("https://api.contentko.com/rest/v1/posts?select=id&limit=5", {
        headers: {
          authorization: "Bearer sb-anon-key",
          apikey: "sb-anon-key",
        },
      }),
      noopEnv,
      noopCtx,
    );

    const proxied = fetchMock.mock.calls[0][0] as Request;
    const proxiedUrl = new URL(proxied.url);
    expect(proxiedUrl.search).toBe("?select=id&limit=5");
    expect(proxied.headers.get("authorization")).toBe("Bearer sb-anon-key");
    expect(proxied.headers.get("apikey")).toBe("sb-anon-key");
  });

  it("does not set body on GET requests", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(new Response("ok", { status: 200 }));
    installFetch(fetchMock);

    await worker.fetch(
      new Request("https://api.contentko.com/rest/v1/"),
      noopEnv,
      noopCtx,
    );

    const proxied = fetchMock.mock.calls[0][0] as Request;
    expect(proxied.method).toBe("GET");
    expect(proxied.body).toBeNull();
  });

  it("forwards POST body on upload-style requests", async () => {
    const fetchMock: FetchMock = vi
      .fn()
      .mockResolvedValue(new Response("ok", { status: 200 }));
    installFetch(fetchMock);

    const payload = JSON.stringify({ hello: "world" });
    await worker.fetch(
      new Request("https://api.contentko.com/storage/v1/object/bucket/file.bin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
      }),
      noopEnv,
      noopCtx,
    );

    const proxied = fetchMock.mock.calls[0][0] as Request;
    expect(proxied.method).toBe("POST");
    expect(await proxied.text()).toBe(payload);
  });
});
