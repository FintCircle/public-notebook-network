// Clerk Account Portal handles all sign-in / sign-up; we only send people there and back.
export const ACCOUNT_PORTAL = "https://accounts.inktella.com";

export function portalUrl(kind: "sign-in" | "sign-up" = "sign-in", returnTo?: string) {
  const back = returnTo ?? (typeof window !== "undefined" ? window.location.href : "https://inktella.com/notepages");
  return `${ACCOUNT_PORTAL}/${kind}?redirect_url=${encodeURIComponent(back)}`;
}

export function goToSignIn(returnTo?: string) {
  window.location.href = portalUrl("sign-in", returnTo);
}
