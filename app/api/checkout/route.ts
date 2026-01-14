import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

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
        } else {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        if (!process.env.CREEM_API_KEY || !productId) {
            console.error("Missing Creem configuration");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Determine the base URL for redirection
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.headers.get("origin") || "http://localhost:3000";

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
            url: "https://test-api.creem.io/v1/checkouts",
            productId,
            userId: user.id
        });

        const response = await fetch("https://test-api.creem.io/v1/checkouts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.CREEM_API_KEY,
            },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Creem API error:", data);
            return NextResponse.json(
                { error: data.message || "Failed to create checkout session" },
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
