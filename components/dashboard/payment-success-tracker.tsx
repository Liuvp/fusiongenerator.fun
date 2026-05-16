"use client";

import { useEffect } from "react";
import { trackEvent } from "@/utils/analytics";

export function PaymentSuccessTracker() {
  useEffect(() => {
    trackEvent("payment_success", { source: "dashboard_redirect" });
  }, []);

  return null;
}
