import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Force dynamic to ensure env vars are read at runtime, not build time
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await request.json();
        let productId;

        if (plan === "monthly") {
            productId = process.env.CREEM_PRODUCT_ID_MONTHLY;
        } else if (plan === "yearly") {
            productId = process.env.CREEM_PRODUCT_ID_YEARLY;
        } else if (plan === "refill") {
            productId = process.env.CREEM_PRODUCT_ID_REFILL;
        } else {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const missingVars = [];
        if (!process.env.CREEM_API_KEY) missingVars.push("CREEM_API_KEY");
        if (!process.env.CREEM_PRODUCT_ID_MONTHLY) missingVars.push("CREEM_PRODUCT_ID_MONTHLY (Raw Check)");

        // Debugging: Log available env keys (don't log values for security)
        // V3 Debugging - Checking for Systemic Env Var Failure
        console.log("DEBUG V3: NODE_ENV =", process.env.NODE_ENV);
        // Check if ANY secret var exists (e.g. Supabase Secret)
        console.log("DEBUG V3: HAS_SUPABASE_SECRET =", !!process.env.SUPABASE_SERVICE_ROLE_KEY);
        console.log("DEBUG V3: Available Env Keys =", Object.keys(process.env).filter(k => !k.startsWith("npm_") && !k.startsWith("v_")).join(", "));
        console.log("DEBUG V3: Plan =", plan);
        console.log("DEBUG: productId resolved to:", productId);

        if (!productId) missingVars.push(`Product ID for ${plan} (CREEM_PRODUCT_ID_${plan.toUpperCase()})`);

        if (missingVars.length > 0) {
            console.error("Missing Creem configuration:", missingVars.join(", "));
            return NextResponse.json(
                { error: `Server configuration error: Missing ${missingVars.join(", ")}` },
                { status: 500 }
            );
        }

        // Determine the base URL for redirection
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";
        // Use configured API URL or fallback to production
        let creemApiUrl = process.env.CREEM_API_URL || "https://api.creem.io/v1/checkouts";

        // Auto-fix common configuration errors (missing path suffix)
        if (!creemApiUrl.endsWith("/checkouts")) {
            // Remove trailing slash if present then append suffix
            creemApiUrl = creemApiUrl.replace(/\/$/, "") + "/checkouts";
        }

        console.log(`Checking out with API URL: ${creemApiUrl}`);

        // Construct request body for Creem
        const requestBody = {
            product_id: productId,
            success_url: `${appUrl}/dashboard?payment=success`,
            customer: {
                email: user.email,
                metadata: {
                    user_id: user.id
                }
            },
            metadata: {
                user_id: user.id,
                plan: plan
            }
        };

        console.log("Creating Creem checkout session:", {
            url: creemApiUrl,
            productId,
            userId: user.id
        });

        const response = await fetch(creemApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.CREEM_API_KEY as string,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Creem API error full:", JSON.stringify(data));
            const errorMessage = data.message || data.error || JSON.stringify(data);
            return NextResponse.json(
                { error: `Creem Request Failed: ${errorMessage}` },
                { status: response.status }
            );
        }

        return NextResponse.json({ checkout_url: data.checkout_url });
    } catch (error: any) {
        console.error("Checkout route error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
