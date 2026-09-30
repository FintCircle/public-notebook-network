// Server-only: talks to Cloudflare D1 through the Lovable connector gateway.
type D1Result<T> = { results: T[]; success: boolean };

export async function d1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const cfKey = process.env["CLOUDFLARE_API_KEY"];
  const account = process.env["CLOUDFLARE_ACCOUNT_ID"];
  const db = process.env["D1_DATABASE_ID"];
  if (!lovableKey || !cfKey || !account || !db) throw new Error("Database is not configured");
  const base = (process.env["CONNECTOR_GATEWAY_BASE_URL"] ?? "https://connector-gateway.lovable.dev").replace(/\/$/, "");
  const res = await fetch(`${base}/cloudflare/client/v4/accounts/${account}/d1/database/${db}/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": cfKey, "Content-Type": "application/json" },
    body: JSON.stringify({ sql, params }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Database request failed [${res.status}]: ${text}`);
  const json = JSON.parse(text) as { success: boolean; errors?: Array<{ message: string }>; result: D1Result<T>[] };
  if (!json.success) throw new Error(`Database error: ${json.errors?.[0]?.message ?? "unknown"}`);
  return json.result[0]?.results ?? [];
}

export async function currentUserId(request: Request): Promise<string | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const { verifyToken } = await import("@clerk/backend");
  try {
    const claims = await verifyToken(token, { secretKey: process.env["CLERK_SECRET_KEY"]! });
    return claims.sub ?? null;
  } catch {
    return null;
  }
}

export async function requireUserId(request: Request) {
  const id = await currentUserId(request);
  if (!id) throw new Error("Please sign in first.");
  return id;
}

export async function clerkUserInfo(userId: string) {
  const { createClerkClient } = await import("@clerk/backend");
  const clerk = createClerkClient({ secretKey: process.env["CLERK_SECRET_KEY"]! });
  const u = await clerk.users.getUser(userId);
  const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || u.primaryEmailAddress?.emailAddress.split("@")[0] || "Someone";
  return { name, imageUrl: u.hasImage ? u.imageUrl : null };
}

export async function ensureProfile(userId: string) {
  const existing = await d1("SELECT id FROM profiles WHERE id = ?", [userId]);
  if (existing.length) return;
  const info = await clerkUserInfo(userId);
  await d1("INSERT OR IGNORE INTO profiles (id, display_name, portrait_url) VALUES (?, ?, ?)", [userId, info.name, info.imageUrl]);
}
