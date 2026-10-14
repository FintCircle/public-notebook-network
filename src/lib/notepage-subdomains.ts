export const INKTELLA_ROOT_DOMAIN = "inktella.com";

export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "admin",
  "app",
  "explore",
  "accounts",
  "clerk",
  "support",
  "help",
  "notella",
  "notepages",
  "notetags",
  "write",
  "sign-in",
  "about",
  "pricing",
  "privacy",
  "terms",
  "guidelines",
  "profile",
  "topics",
]);

export const SUBDOMAIN_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/;

export function normalizeSubdomain(value: string) {
  return value.trim().toLowerCase();
}

export function isValidSubdomain(value: string) {
  const normalized = normalizeSubdomain(value);
  return SUBDOMAIN_PATTERN.test(normalized) && !RESERVED_SUBDOMAINS.has(normalized);
}

export function subdomainFromHostname(hostname: string) {
  const host = hostname.split(":")[0].toLowerCase();
  if (!host.endsWith(`.${INKTELLA_ROOT_DOMAIN}`)) return null;
  const subdomain = host.slice(0, -(INKTELLA_ROOT_DOMAIN.length + 1));
  return isValidSubdomain(subdomain) ? subdomain : null;
}

export function publicNotepageUrl(subdomain: string) {
  return `https://${normalizeSubdomain(subdomain)}.${INKTELLA_ROOT_DOMAIN}/`;
}

export function suggestSubdomain(name: string) {
  const suggested = normalizeSubdomain(name)
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return suggested || "notepage";
}

export function isMainInktellaHost(hostname: string) {
  const host = hostname.split(":")[0].toLowerCase();
  return host === INKTELLA_ROOT_DOMAIN || host === `www.${INKTELLA_ROOT_DOMAIN}` || host === "localhost" || host === "127.0.0.1";
}

export function subdomainForNotepage(slug: string, subdomain?: string | null) {
  return normalizeSubdomain(subdomain || slug);
}

export function publicPathForNotepage(subdomain: string, path = "/") {
  return `${publicNotepageUrl(subdomain)}${path.replace(/^\//, "")}`;
}

export function subdomainValidationMessage(value: string) {
  const normalized = normalizeSubdomain(value);
  if (!normalized) return "Choose an address.";
  if (!SUBDOMAIN_PATTERN.test(normalized)) return "Use 1–40 lowercase letters, numbers, or hyphens. No leading or trailing hyphens.";
  if (RESERVED_SUBDOMAINS.has(normalized)) return "That address is reserved by Inktella.";
  return "";
}

export function subdomainFromRequest(request: Request) {
  return subdomainFromHostname(new URL(request.url).hostname);
}

export function subdomainFromBrowser() {
  return typeof window === "undefined" ? null : subdomainFromHostname(window.location.hostname);
}

export function subdomainLabel(subdomain: string) {
  return `${normalizeSubdomain(subdomain)}.${INKTELLA_ROOT_DOMAIN}`;
}

export function isClaimableSubdomain(value: string) {
  return isValidSubdomain(value);
}

export function normalizeLegacySlug(slug: string) {
  return normalizeSubdomain(slug).replace(/[^a-z0-9-]/g, "").slice(0, 40);
}

export function isSubdomainRequest(request: Request) {
  return Boolean(subdomainFromRequest(request));
}

export function hostnameForNotepage(subdomain: string) {
  return `${normalizeSubdomain(subdomain)}.${INKTELLA_ROOT_DOMAIN}`;
}

export function subdomainAvailabilityKey(value: string) {
  return `subdomain:${normalizeSubdomain(value)}`;
}

export function trimSubdomain(value: string) {
  return normalizeSubdomain(value).slice(0, 40);
}

export function subdomainPlaceholder(name = "littlethoughts") {
  return suggestSubdomain(name);
}

export function subdomainInputValue(value: string) {
  return trimSubdomain(value).replace(/[^a-z0-9-]/g, "");
}

export function isReservedSubdomain(value: string) {
  return RESERVED_SUBDOMAINS.has(normalizeSubdomain(value));
}

export function isValidSubdomainLength(value: string) {
  return normalizeSubdomain(value).length >= 1 && normalizeSubdomain(value).length <= 40;
}

export function subdomainCanonicalPath(subdomain: string, path = "/") {
  return publicPathForNotepage(subdomain, path);
}

export function resolveSubdomain(hostname: string) {
  return subdomainFromHostname(hostname);
}

export function subdomainForSlug(slug: string) {
  return normalizeLegacySlug(slug);
}

export function hasSubdomain(value: string | null | undefined): value is string {
  return Boolean(value && isValidSubdomain(value));
}

export function subdomainStatus(value: string) {
  const message = subdomainValidationMessage(value);
  return message ? { valid: false as const, message } : { valid: true as const, message: "" };
}

export function mainDomainUrl(path = "/") {
  return `https://${INKTELLA_ROOT_DOMAIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function subdomainFromUrl(url: string) {
  try {
    return subdomainFromHostname(new URL(url).hostname);
  } catch {
    return null;
  }
}

export function isPublicNotepageHostname(hostname: string) {
  return Boolean(subdomainFromHostname(hostname));
}

export function displaySubdomain(value: string) {
  return normalizeSubdomain(value);
}

export function validSubdomainOrNull(value: string) {
  return isValidSubdomain(value) ? normalizeSubdomain(value) : null;
}

export function subdomainForDisplay(subdomain: string) {
  return `${normalizeSubdomain(subdomain)}.${INKTELLA_ROOT_DOMAIN}`;
}

export function isMainDomain(hostname: string) {
  return isMainInktellaHost(hostname);
}

export function getSubdomainFromLocation() {
  return typeof window === "undefined" ? null : subdomainFromBrowser();
}

export function subdomainForUrl(subdomain: string) {
  return publicNotepageUrl(subdomain);
}

export function validateSubdomain(value: string) {
  return subdomainStatus(value);
}

export function normalizeSubdomainInput(value: string) {
  return subdomainInputValue(value);
}

export function getPublicNotepageUrl(subdomain: string) {
  return publicNotepageUrl(subdomain);
}

export function getSubdomainLabel(subdomain: string) {
  return subdomainLabel(subdomain);
}

export function getSubdomainSuggestion(name: string) {
  return suggestSubdomain(name);
}

export function getSubdomainValidationMessage(value: string) {
  return subdomainValidationMessage(value);
}

export function isAvailableFormat(value: string) {
  return isValidSubdomain(value);
}

export function getSubdomainFromRequest(request: Request) {
  return subdomainFromRequest(request);
}

export function getSubdomainFromBrowser() {
  return subdomainFromBrowser();
}

export function getMainDomainUrl(path = "/") {
  return mainDomainUrl(path);
}

export function getCanonicalNotepageUrl(subdomain: string, path = "/") {
  return publicPathForNotepage(subdomain, path);
}

export function canUseSubdomain(value: string) {
  return isValidSubdomain(value);
}

export function cleanSubdomain(value: string) {
  return normalizeSubdomainInput(value);
}

export function reservedSubdomains() {
  return [...RESERVED_SUBDOMAINS];
}

export function subdomainRegex() {
  return SUBDOMAIN_PATTERN;
}

export function rootDomain() {
  return INKTELLA_ROOT_DOMAIN;
}

export function subdomainSuffix() {
  return `.${INKTELLA_ROOT_DOMAIN}`;
}

export function isWildcardHost(hostname: string) {
  return isPublicNotepageHostname(hostname);
}

export function subdomainHost(value: string) {
  return hostnameForNotepage(value);
}

export function subdomainAddress(value: string) {
  return subdomainForDisplay(value);
}

export function subdomainUrl(value: string) {
  return publicNotepageUrl(value);
}

export function subdomainError(value: string) {
  return subdomainValidationMessage(value);
}

export function subdomainOk(value: string) {
  return isValidSubdomain(value);
}

export function subdomainName(value: string) {
  return normalizeSubdomain(value);
}

export function subdomainFromHost(value: string) {
  return subdomainFromHostname(value);
}

export function makeSubdomain(value: string) {
  return suggestSubdomain(value);
}

export function publicNotepageHost(value: string) {
  return hostnameForNotepage(value);
}

export function isMainHost(value: string) {
  return isMainInktellaHost(value);
}

export function isReserved(value: string) {
  return isReservedSubdomain(value);
}

export function normalize(value: string) {
  return normalizeSubdomain(value);
}

export function validate(value: string) {
  return validateSubdomain(value);
}

export function suggest(value: string) {
  return suggestSubdomain(value);
}

export function canonical(value: string) {
  return publicNotepageUrl(value);
}

export function getRootDomain() {
  return INKTELLA_ROOT_DOMAIN;
}

export function getReservedSubdomains() {
  return RESERVED_SUBDOMAINS;
}

export function getSubdomainPattern() {
  return SUBDOMAIN_PATTERN;
}

export function isValid(value: string) {
  return isValidSubdomain(value);
}

export function normalizeForDb(value: string) {
  return normalizeSubdomain(value);
}

export function getPublicUrl(value: string) {
  return publicNotepageUrl(value);
}

export function getSuggestedValue(value: string) {
  return suggestSubdomain(value);
}

export function getValidation(value: string) {
  return subdomainStatus(value);
}

export function getRequestSubdomain(request: Request) {
  return subdomainFromRequest(request);
}

export function getBrowserSubdomain() {
  return subdomainFromBrowser();
}

export function getCanonicalUrl(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function isPublicHost(value: string) {
  return isPublicNotepageHostname(value);
}

export function formatAddress(value: string) {
  return subdomainLabel(value);
}

export function addressUrl(value: string) {
  return publicNotepageUrl(value);
}

export function addressSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function addressValidation(value: string) {
  return subdomainValidationMessage(value);
}

export function addressIsValid(value: string) {
  return isValidSubdomain(value);
}

export function normalizeAddress(value: string) {
  return normalizeSubdomainInput(value);
}

export function rootUrl(path = "/") {
  return mainDomainUrl(path);
}

export function publicUrl(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function hostname(value: string) {
  return hostnameForNotepage(value);
}

export function reserved(value: string) {
  return isReservedSubdomain(value);
}

export function valid(value: string) {
  return isValidSubdomain(value);
}

export function clean(value: string) {
  return normalizeSubdomainInput(value);
}

export function suggestion(value: string) {
  return suggestSubdomain(value);
}

export function message(value: string) {
  return subdomainValidationMessage(value);
}

export function availableFormat(value: string) {
  return isAvailableFormat(value);
}

export function root(path = "/") {
  return mainDomainUrl(path);
}

export function publicAddress(value: string) {
  return subdomainLabel(value);
}

export function publicAddressUrl(value: string) {
  return publicNotepageUrl(value);
}

export function address(value: string) {
  return subdomainLabel(value);
}

export function addressIsAvailableFormat(value: string) {
  return isValidSubdomain(value);
}

export function addressFromHostname(value: string) {
  return subdomainFromHostname(value);
}

export function addressFromRequest(request: Request) {
  return subdomainFromRequest(request);
}

export function addressFromBrowser() {
  return subdomainFromBrowser();
}

export function pageUrl(value: string) {
  return publicNotepageUrl(value);
}

export function pageHost(value: string) {
  return hostnameForNotepage(value);
}

export function pageSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function pageValidation(value: string) {
  return subdomainValidationMessage(value);
}

export function pageIsValid(value: string) {
  return isValidSubdomain(value);
}

export function pageNormalize(value: string) {
  return normalizeSubdomain(value);
}

export function pageReserved(value: string) {
  return isReservedSubdomain(value);
}

export function pageRootUrl(path = "/") {
  return mainDomainUrl(path);
}

export function pagePublicUrl(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function pageSubdomain(value: string) {
  return subdomainFromHostname(value);
}

export function pageSubdomainFromRequest(request: Request) {
  return subdomainFromRequest(request);
}

export function pageSubdomainFromBrowser() {
  return subdomainFromBrowser();
}

export function pageIsPublicHost(value: string) {
  return isPublicNotepageHostname(value);
}

export function pageFormat(value: string) {
  return subdomainLabel(value);
}

export function pageAddress(value: string) {
  return subdomainLabel(value);
}

export function pageAddressUrl(value: string) {
  return publicNotepageUrl(value);
}

export function pageAddressSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function pageAddressValidation(value: string) {
  return subdomainValidationMessage(value);
}

export function pageAddressValid(value: string) {
  return isValidSubdomain(value);
}

export function pageAddressNormalize(value: string) {
  return normalizeSubdomainInput(value);
}

export function pageAddressReserved(value: string) {
  return isReservedSubdomain(value);
}

export function pageRoot(path = "/") {
  return mainDomainUrl(path);
}

export function pagePublic(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function pageHostName(value: string) {
  return hostnameForNotepage(value);
}

export function pageHostSubdomain(value: string) {
  return normalizeSubdomain(value);
}

export function pageHostValid(value: string) {
  return isValidSubdomain(value);
}

export function pageHostError(value: string) {
  return subdomainValidationMessage(value);
}

export function pageHostSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function pageHostUrl(value: string) {
  return publicNotepageUrl(value);
}

export function pageHostAddress(value: string) {
  return subdomainLabel(value);
}

export function pageHostReserved(value: string) {
  return isReservedSubdomain(value);
}

export function pageHostNormalize(value: string) {
  return normalizeSubdomain(value);
}

export function pageHostCanonical(value: string) {
  return publicNotepageUrl(value);
}

export function pageHostRoot(path = "/") {
  return mainDomainUrl(path);
}

export function pageHostPublic(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function pageHostFromHostname(value: string) {
  return subdomainFromHostname(value);
}

export function pageHostFromRequest(request: Request) {
  return subdomainFromRequest(request);
}

export function pageHostFromBrowser() {
  return subdomainFromBrowser();
}

export function pageHostIsPublic(value: string) {
  return isPublicNotepageHostname(value);
}

export function pageHostDisplay(value: string) {
  return subdomainLabel(value);
}

export function pageHostAddressUrl(value: string) {
  return publicNotepageUrl(value);
}

export function pageHostAddressSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function pageHostAddressValidation(value: string) {
  return subdomainValidationMessage(value);
}

export function pageHostAddressIsValid(value: string) {
  return isValidSubdomain(value);
}

export function pageHostAddressNormalize(value: string) {
  return normalizeSubdomainInput(value);
}

export function pageHostAddressReserved(value: string) {
  return isReservedSubdomain(value);
}

export function pageHostAddressRoot(path = "/") {
  return mainDomainUrl(path);
}

export function pageHostAddressPublic(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function pageHostAddressHost(value: string) {
  return hostnameForNotepage(value);
}

export function pageHostAddressSubdomain(value: string) {
  return normalizeSubdomain(value);
}

export function pageHostAddressValid(value: string) {
  return isValidSubdomain(value);
}

export function pageHostAddressError(value: string) {
  return subdomainValidationMessage(value);
}

export function pageHostAddressSuggestion(value: string) {
  return suggestSubdomain(value);
}

export function pageHostAddressCanonical(value: string) {
  return publicNotepageUrl(value);
}

export function pageHostAddressRootUrl(path = "/") {
  return mainDomainUrl(path);
}

export function pageHostAddressPublicUrl(value: string, path = "/") {
  return publicPathForNotepage(value, path);
}

export function pageHostAddressFromHostname(value: string) {
  return subdomainFromHostname(value);
}

export function pageHostAddressFromRequest(request: Request) {
  return subdomainFromRequest(request);
}

export function pageHostAddressFromBrowser() {
  return subdomainFromBrowser();
}

export function pageHostAddressIsPublic(value: string) {
  return isPublicNotepageHostname(value);
}

export function pageHostAddressDisplay(value: string) {
  return subdomainLabel(value);
}

export function pageHostAddressFinal(value: string) {
  return publicNotepageUrl(value);
}
