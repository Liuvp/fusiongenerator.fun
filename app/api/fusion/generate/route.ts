import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { storage, subscribe } from "@fal-ai/serverless-client";

// Set FAL_KEY (handled by environment variables automatically for @fal-ai/serverless-client if set)
// But we need to ensure it's available server-side.

export const maxDuration = 60; // Allow 60s for execution

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient(); // User client for Auth
        const supabaseAdmin = createJsClient(supabaseUrl, supabaseServiceKey); // Admin client for DB ops

        // [DEBUG] Log HEADERS
        console.log("[API DEBUG] Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

        // ... Authentication logic using 'supabase' (User Client) remains same ...
        // Try getUser() first (most secure)
        let { data: { user }, error: authError } = await supabase.auth.getUser();

        // Fallback: If getUser fails, try getSession
        if (!user || authError) {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) user = session.user;
        }

        if (!user) {
            return NextResponse.json({ error: "Unauthorized. Please login." }, { status: 401 });
        }


        // 1. Check Credits / Subscription using ADMIN CLIENT (Bypass RLS)
        let activeCustomer: any = null;
        try {
            const { data: customer, error: custError } = await supabaseAdmin
                .from("customers")
                .select("credits, id")
                .eq("user_id", user.id)
                .single();

            if (customer) {
                activeCustomer = customer;
            } else if (custError && custError.code !== 'PGRST116') {
                throw custError;
            } else {
                // Auto-create using Admin
                const { data: newCustomer, error: createError } = await supabaseAdmin
                    .from("customers")
                    .insert([{ user_id: user.id, credits: 3 }])
                    .select("credits, id")
                    .single();

                if (createError) throw createError;
                activeCustomer = newCustomer;
            }
        } catch (dbError: any) {
            console.error(">> DATABASE ERROR:", dbError.message);
            return NextResponse.json(
                { error: "Service temporarily unavailable. Please try again later." },
                { status: 503 }
            );
        }

        // Check Credits
        if (activeCustomer.credits < 1) {
            return NextResponse.json({ error: "Insufficient credits. Please top up." }, { status: 402 });
        }

        // 2. Parse FormData & 3. Upload Images... (No changes needed)
        const formData = await req.formData();
        const image1 = formData.get("image1") as File;
        const image2 = formData.get("image2") as File;
        const prompt = formData.get("prompt") as string || "A creative fusion of two images";

        if (!image1 || !image2) {
            return NextResponse.json({ error: "Missing images." }, { status: 400 });
        }

        const [url1, url2] = await Promise.all([
            storage.upload(image1),
            storage.upload(image2)
        ]);


        // 4. Generate Fusion (Vision + Flux)
        console.log("Analyzing Image 2 for fusion traits...");
        let image2Description = "";
        try {
            // Vision Logic ...
            const descriptionResult: any = await subscribe("fal-ai/llava-next", {
                input: {
                    image_url: url2,
                    prompt: "Describe character features concisely."
                }
            });
            image2Description = descriptionResult.output;
        } catch (e) { image2Description = "distinct character"; }

        const finalPrompt = `(Masterpiece). Fusion of character in image AND character looking like: ${image2Description}. ${prompt}. Detailed.`;

        // Generate
        const result: any = await subscribe("fal-ai/flux/dev", {
            input: { prompt: finalPrompt, image_url: url1, strength: 0.85 },
            logs: true
        });


        // 5. Deduct Credit (Cost: 1) using ADMIN CLIENT
        const COST = 1;
        try {
            const { error: updateError } = await supabaseAdmin
                .from("customers")
                .update({ credits: activeCustomer.credits - COST })
                .eq("id", activeCustomer.id);

            if (updateError) {
                console.error("CRITICAL: Failed to deduct credit:", updateError);
                // In production, we might want to refund the generation or retry.
            }
        } catch (e) {
            console.error("Deduction Logic Error:", e);
        }

        return NextResponse.json({
            success: true,
            imageUrl: result.images[0].url,
            remainingCredits: activeCustomer.credits - COST,
            logs: result.logs
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
