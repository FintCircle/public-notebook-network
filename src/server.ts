import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const { subdomainFromRequest } = await import("./lib/notepage-subdomains");
      const subdomain = subdomainFromRequest(request);
      let routedRequest = request;
      if (subdomain) {
        try {
          const { d1 } = await import("./lib/d1.server");
          const matches = await d1<{ id: string }>(
            "SELECT id FROM notepages WHERE lower(subdomain) = ? LIMIT 1",
            [subdomain],
          );
          if (!matches[0]) {
            return new Response("Notepage not found", {
              status: 404,
              headers: { "content-type": "text/plain; charset=utf-8" },
            });
          }
        } catch (error) {
          console.error("Unable to resolve Notepage subdomain", error);
          return new Response("Notepage unavailable", {
            status: 503,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        const url = new URL(request.url);
        const pathname = url.pathname;

        // Keep TanStack server functions, assets, and dev-runtime requests on their
        // original paths. Rewriting those requests into /:notepage/* makes the
        // client report that notebooks cannot be opened and can accidentally expose
        // the main application shell on a Notepage host.
        const isRuntimeRequest =
          pathname.startsWith("/_") ||
          pathname.startsWith("/@") ||
          pathname.startsWith("/assets/") ||
          pathname.startsWith("/favicon") ||
          pathname.startsWith("/robots.txt") ||
          pathname.startsWith("/sitemap") ||
          /\.[a-z0-9]{2,8}$/i.test(pathname);

        if (isRuntimeRequest) {
          const response = await handler.fetch(request, env, ctx);
          return await normalizeCatastrophicSsrResponse(response);
        }

        // A Notepage hostname is a scoped site, not an alternate entry point to
        // Inktella. Only its public sections may be served from this host.
        const isNotepagePath =
          pathname === "/" ||
          /^\/(?:notes|about|guestnote)(?:\/|$)/.test(pathname) ||
          /^\/notepage\/[^/]+(?:\/|$)/.test(pathname) ||
          /^\/notetags\/[^/]+(?:\/|$)/.test(pathname);

        if (!isNotepagePath) {
          return new Response("Not found", {
            status: 404,
            headers: { "content-type": "text/plain; charset=utf-8" },
          });
        }

        const internalPath = pathname === "/" ? "" : pathname;
        if (!internalPath.startsWith(`/${subdomain}`)) {
          url.pathname = `/${subdomain}${internalPath}`;
          routedRequest = new Request(url, request);
        }
      }
      const response = await handler.fetch(routedRequest, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
