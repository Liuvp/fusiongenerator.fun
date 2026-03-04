"use client";

import dynamic from "next/dynamic";

const DBFusionStudioNoSSR = dynamic(
    () => import("./fusion-studio").then((mod) => mod.DBFusionStudio),
    {
        ssr: false,
        loading: () => (
            <div
                id="fusion-studio"
                className="bg-gradient-to-b from-orange-50/30 to-white p-4 pb-8 rounded-3xl"
                role="region"
                aria-label="Dragon Ball Fusion Studio"
            >
                <div className="rounded-lg bg-card text-card-foreground border-0 shadow-sm">
                    <div className="p-5 space-y-4">
                        <div className="h-7 w-56 rounded bg-gray-200 animate-pulse" />
                        <div className="h-6 w-36 rounded bg-gray-100 animate-pulse" />
                        <div className="h-44 rounded-xl bg-gray-100 animate-pulse" />
                        <div className="h-12 rounded-lg bg-gray-200 animate-pulse" />
                    </div>
                </div>
            </div>
        ),
    }
);

export function DBFusionStudioClient() {
    return <DBFusionStudioNoSSR />;
}

