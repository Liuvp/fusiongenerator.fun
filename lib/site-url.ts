const DEFAULT_SITE_URL = "https://fusiongenerator.fun";

function normalizeUrl(input?: string): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  let url = raw;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  try {
    new URL(url);
    return url;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.BASE_URL) ||
    DEFAULT_SITE_URL
  );
}
