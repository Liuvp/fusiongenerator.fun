const DEFAULT_CREEM_API_BASE_URL = "https://api.creem.io/v1";

export function getCreemApiBaseUrl() {
  const configuredUrl = process.env.CREEM_API_URL?.trim();

  if (!configuredUrl) {
    return DEFAULT_CREEM_API_BASE_URL;
  }

  return configuredUrl.replace(/\/checkouts\/?$/, "").replace(/\/$/, "");
}

export function getCreemApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getCreemApiBaseUrl()}${normalizedPath}`;
}
