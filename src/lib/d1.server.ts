// Server-only: talks to Cloudflare D1.
// Order: native Worker binding `DB` (inktella.com on Cloudflare) → Lovable connector gateway (preview)
// → direct Cloudflare API with CLOUDFLARE_API_TOKEN.
import { CLERK_PUBLISHABLE_KEY_FALLBACK, frontendApiFromKey } from "./clerk-config";

type D1Result<T> = { results: T[]; success: boolean };
type D1Binding = {
  prepare: (sql: string) => { bind: (...v: unknown[]) => { all: <T>() => Promise<{ results: T[] }> } };
};

function workerEnv(): Record<string, unknown> {
  const g = globalThis as { __env__?: Record<string, unknown>; env?: Record<string, unknown> };
  return g.__env__ ?? {};
}

function envVar(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;
  const v = workerEnv()[name];
  return typeof v === "string" && v ? v : undefined;
}

export async function d1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const binding = workerEnv()["DB"] as D1Binding | undefined;
  if (binding && typeof binding.prepare === "function") {
    const { results } = await binding.prepare(sql).bind(...params).all<T>();
    return results ?? [];
  }

  const account = envVar("CLOUDFLARE_ACCOUNT_ID");
  const db = envVar("D1_DATABASE_ID") ?? "0519136e-346c-4f11-9387-3c3ff15fc76d";
  const lovableKey = envVar("LOVABLE_API_KEY");
  const cfConnectorKey = envVar("CLOUDFLARE_API_KEY");
  const cfToken = envVar("CLOUDFLARE_API_TOKEN");

  let url: string;
  let headers: Record<string, string>;
  if (account && lovableKey && cfConnectorKey) {
    const base = (envVar("CONNECTOR_GATEWAY_BASE_URL") ?? "https://connector-gateway.lovable.dev").replace(/\/$/, "");
    url = `${base}/cloudflare/client/v4/accounts/${account}/d1/database/${db}/query`;
    headers = { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": cfConnectorKey, "Content-Type": "application/json" };
  } else if (account && cfToken) {
    url = `https://api.cloudflare.com/client/v4/accounts/${account}/d1/database/${db}/query`;
    headers = { Authorization: `Bearer ${cfToken}`, "Content-Type": "application/json" };
  } else {
    throw new Error("Database is not configured");
  }

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ sql, params }) });
  const text = await res.text();
  if (!res.ok) throw new Error(`Database request failed [${res.status}]: ${text}`);
  const json = JSON.parse(text) as { success: boolean; errors?: Array<{ message: string }>; result: D1Result<T>[] };
  if (!json.success) throw new Error(`Database error: ${json.errors?.[0]?.message ?? "unknown"}`);
  return json.result[0]?.results ?? [];
}

// ---------- Clerk session verification ----------

function b64urlToBytes(s: string) {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=");
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

let jwksCache: { at: number; keys: Array<JsonWebKey & { kid?: string }> } | null = null;

async function verifyWithJwks(token: string): Promise<string | null> {
  const [h, p, sig] = token.split(".");
  if (!h || !p || !sig) return null;
  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h))) as { kid?: string; alg?: string };
  const claims = JSON.parse(new TextDecoder().decode(b64urlToBytes(p))) as { sub?: string; iss?: string; exp?: number; nbf?: number };
  if (header.alg !== "RS256") return null;

  const pk = envVar("CLERK_PUBLISHABLE_KEY") ?? CLERK_PUBLISHABLE_KEY_FALLBACK;
  const issuer = `https://${frontendApiFromKey(pk)}`;
  if (claims.iss !== issuer) return null;
  const now = Math.floor(Date.now() / 1000);
  if (!claims.exp || claims.exp < now - 5) return null;
  if (claims.nbf && claims.nbf > now + 5) return null;

  if (!jwksCache || Date.now() - jwksCache.at > 60 * 60 * 1000) {
    const res = await fetch(`${issuer}/.well-known/jwks.json`);
    if (!res.ok) return null;
    jwksCache = { at: Date.now(), keys: ((await res.json()) as { keys: Array<JsonWebKey & { kid?: string }> }).keys };
  }
  const jwk = jwksCache.keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(sig), new TextEncoder().encode(`${h}.${p}`));
  return ok ? claims.sub ?? null : null;
}

export async function currentUserId(request: Request): Promise<string | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const secretKey = envVar("CLERK_SECRET_KEY");
    if (secretKey) {
      const { verifyToken } = await import("@clerk/backend");
      const claims = await verifyToken(token, { secretKey });
      return claims.sub ?? null;
    }
    return await verifyWithJwks(token);
  } catch (e) {
    console.error("Clerk token verification failed", e);
    return null;
  }
}

export async function requireUserId(request: Request) {
  const id = await currentUserId(request);
  if (!id) throw new Error("Please sign in first.");
  return id;
}

export type ProfileHint = { name?: string | undefined; imageUrl?: string | undefined };

export async function clerkUserInfo(userId: string, hint: ProfileHint = {}) {
  const secretKey = envVar("CLERK_SECRET_KEY");
  if (secretKey) {
    try {
      const { createClerkClient } = await import("@clerk/backend");
      const u = await createClerkClient({ secretKey }).users.getUser(userId);
      const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || u.primaryEmailAddress?.emailAddress.split("@")[0] || "Someone";
      return { name, imageUrl: u.hasImage ? u.imageUrl : null };
    } catch (e) {
      console.error("Clerk user lookup failed", e);
    }
  }
  // Without a secret key, use what the signed-in person's own browser reported about themselves.
  return { name: hint.name?.slice(0, 80) || "Someone", imageUrl: hint.imageUrl ?? null };
}

export async function ensureProfile(userId: string, hint: ProfileHint = {}) {
  const existing = await d1("SELECT id FROM profiles WHERE id = ?", [userId]);
  if (existing.length) return;
  const info = await clerkUserInfo(userId, hint);
  await d1("INSERT OR IGNORE INTO profiles (id, display_name, portrait_url) VALUES (?, ?, ?)", [userId, info.name, info.imageUrl]);
}
