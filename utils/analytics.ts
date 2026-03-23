"use client";

type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  try {
    const globalWindow = window as Window & {
      gtag?: (...args: unknown[]) => void;
    };

    if (typeof globalWindow.gtag === "function") {
      globalWindow.gtag("event", eventName, payload);
    }
  } catch (error) {
    console.warn(`Failed to track event: ${eventName}`, error);
  }
}

export function toAnalyticsErrorMessage(error: unknown, maxLength = 160): string {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof error === "object" && error && "message" in error && typeof error.message === "string"
          ? error.message
          : "unknown_error";

  return raw.slice(0, maxLength);
}
