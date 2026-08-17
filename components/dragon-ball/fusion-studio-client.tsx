"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// The studio chunk is ssr:false — on slow connections the skeleton can spin for
// 10s+. Without an escape hatch, visitors dead-click everything and eventually
// hard-reload the page (observed in Clarity). Offer a reload link after 8s.
function StudioSkeleton() {
    const [isSlow, setIsSlow] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsSlow(true), 8000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            id="fusion-studio"
            className="scroll-mt-20 bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl"
            role="region"
            aria-label="Dragon Ball Fusion Studio"
        >
            <div className="rounded-lg bg-card text-card-foreground border-0 shadow-sm">
                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600" aria-live="polite">
                        <span className="h-4 w-4 rounded-full border-2 border-orange-300 border-t-orange-600 animate-spin" aria-hidden="true" />
                        Loading Fusion Studio… pick two fighters in a moment
                    </div>
                    <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
                    <div className="h-6 w-36 rounded bg-gray-100 animate-pulse" />
                    <div className="h-44 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="h-12 rounded-lg bg-gray-200 animate-pulse" />
                    {isSlow && (
                        <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-center">
                            <p className="text-sm text-orange-900">
                                Still loading — a slow connection can cause this.
                                <a
                                    href="/dragon-ball"
                                    onClick={(e) => { e.preventDefault(); window.location.reload(); }}
                                    className="ml-1 font-semibold underline text-orange-700 hover:text-orange-900"
                                >
                                    Tap to reload
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const DBFusionStudioNoSSR = dynamic(
    () => import("./fusion-studio").then((mod) => mod.DBFusionStudio),
    {
        ssr: false,
        loading: () => <StudioSkeleton />,
    }
);

export function DBFusionStudioClient() {
    return <DBFusionStudioNoSSR />;
}
