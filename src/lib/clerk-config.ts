// Clerk publishable keys are public (they only encode the Frontend API host), so a
// fallback lives in code — the site keeps signing people in even when the host
// has no CLERK_PUBLISHABLE_KEY variable set.
export const CLERK_PUBLISHABLE_KEY_FALLBACK = "pk_live_Y2xlcmsuaW5rdGVsbGEuY29tJA";

export function frontendApiFromKey(key: string) {
  const encoded = key.replace(/^pk_(live|test)_/, "");
  try {
    return atob(encoded).replace(/\$$/, "");
  } catch {
    return "";
  }
}
