import { createClient } from "@/utils/supabase/server";
import { getCreemApiUrl } from "@/utils/creem/api-url";
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

        const { plan, redirect_path } = await request.json();
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
        const creemApiUrl = getCreemApiUrl("/checkouts");

        // Construct request body for Creem
        const successPath = redirect_path || '/dragon-ball';
        const successUrl = new URL(successPath, appUrl);
        successUrl.searchParams.set("payment", "success");
        successUrl.hash = "fusion-studio";

        const requestBody = {
            product_id: productId,
            success_url: successUrl.toString(),
            customer: {
                email: user.email
            },
            metadata: {
                user_id: user.id,
                plan: plan
            }
        };

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
