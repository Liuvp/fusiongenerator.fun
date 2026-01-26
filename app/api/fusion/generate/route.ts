import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createJsClient } from "@supabase/supabase-js";
import { storage, subscribe, config } from "@fal-ai/serverless-client";

// Set FAL_KEY explicitly to ensure server-side access
config({
    credentials: process.env.FAL_KEY,
});

export const maxDuration = 60; // Allow 60s for execution

export async function POST(req: NextRequest) {
    try {
        // [DEBUG] Check Environment Config
        if (!process.env.FAL_KEY) {
            console.error("FATAL: FAL_KEY is missing in environment variables.");
            return NextResponse.json({ error: "[Config Error] FAL_KEY is missing on server." }, { status: 500 });
        }

        let supabase = await createClient(); // User client for Auth
        let user = null;

        // [DEBUG] Log HEADERS
        // console.log("[API DEBUG] Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

        // 0. Check for Authorization Header (Bearer Token) override
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
            // console.log("[API DEBUG] Found Authorization Header");
            try {
                const tokenClient = createJsClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                    { global: { headers: { Authorization: authHeader } } }
                );
                const { data: { user: headerUser }, error: headerError } = await tokenClient.auth.getUser();
                if (headerUser && !headerError) {
                    supabase = tokenClient as any;
                    user = headerUser;
                }
            } catch (e) {
                console.warn("[API DEBUG] Token Client Error:", e);
            }
        }

        // Try getUser() if not found in header
        if (!user) {
            const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
            user = supabaseUser;

            // Fallback: If getUser fails, try getSession
            if (!user || authError) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) user = session.user;
            }
        }

        let activeCustomer: any = null;
        const COST = 1;

        // --- BRANCH: ANONYMOUS vs LOGGED IN ---

        if (!user) {
            // ANONYMOUS Logic: Check IP Rate Limit
            const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

            // Requires @upstash/redis
            // If Redis envs are missing, we might want to fail open or closed. Here we fail closed for safety.
            if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
                console.warn("Redis not configured, denying anonymous access.");
                return NextResponse.json({ error: "Anonymous generation temporarily unavailable." }, { status: 503 });
            }

            const { Redis } = await import('@upstash/redis');
            const redis = Redis.fromEnv();
            const ratelimitKey = `fusion:anonymous:${ip}`;

            // Check usage
            // incr returns the new value. If it's 1, it's the first time.
            const usage = await redis.incr(ratelimitKey);

            // Set expiry if new key (e.g., 30 days to prevent infinite abuse, effectively "1 time per month")
            if (usage === 1) {
                await redis.expire(ratelimitKey, 60 * 60 * 24 * 30);
            }

            if (usage > 1) {
                return NextResponse.json({
                    error: "Free trial limit reached. Please login to get more credits!",
                    isLimitReached: true // Signal for frontend
                }, { status: 402 });
            }

            console.log(`Anonymous user (IP: ${ip}) used 1 free credit.`);

        } else {
            // LOGGED IN Logic: Check Credits
            try {
                const { data: customer, error: custError } = await supabase
                    .from("customers")
                    .select("credits, id")
                    .eq("user_id", user.id)
                    .single();

                if (customer) {
                    activeCustomer = customer;
                } else if (custError && custError.code !== 'PGRST116') {
                    throw custError;
                } else {
                    // Auto-create with 1 Credit (New Requirement: Register gets 1 credit)
                    const { data: newCustomer, error: createError } = await supabase
                        .from("customers")
                        .insert([{ user_id: user.id, credits: 1 }])
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
        }


        // 2. Parse FormData & 3. Upload Images... 
        const formData = await req.formData();
        const image1 = formData.get("image1") as File;
        const image2 = formData.get("image2") as File;
        const prompt = formData.get("prompt") as string || "A creative fusion of two images";

        if (!image1 || !image2) {
            return NextResponse.json({ error: "Missing images." }, { status: 400 });
        }

        let url1, url2;
        try {
            console.log("Uploading images to Fal Storage...");
            [url1, url2] = await Promise.all([
                storage.upload(image1),
                storage.upload(image2)
            ]);
            console.log("Upload successful:", url1, url2);
        } catch (uploadError: any) {
            console.error("Fal Storage Upload Failed:", uploadError);
            throw new Error(`[Upload Error] ${uploadError.message || "Failed to upload images"}`);
        }


        // 4. Generate Fusion (Vision + Flux)
        console.log("Analyzing Image 2 for fusion traits...");
        let image2Description = "";

        // Step 4.1: Analyze Image 2 using LLaVA (Vision Model)
        try {
            console.log("Starting visual analysis of Image 2...");
            const descriptionResult: any = await subscribe("fal-ai/llava-next", {
                input: {
                    image_url: url2,
                    prompt: "Describe this character's physical appearance, clothing, and distinct features in detail. Be concise but specific."
                },
                logs: true,
            });
            image2Description = descriptionResult.output;
            console.log("Vision Analysis Result:", image2Description);
        } catch (e) {
            console.warn("Vision analysis failed, falling back to default prompt:", e);
            image2Description = "a distinct character";
        }

        const watermarkInstruction = !user ? " Add subtle watermark text 'FusionGenerator.fun' in bottom right corner." : "";
        const finalPrompt = `(Masterpiece). Fusion of character in image AND character looking like: ${image2Description || "the second uploaded image"}. ${prompt}.${watermarkInstruction} Detailed.`;

        // Generate
        try {
            const result: any = await subscribe("fal-ai/flux/dev", {
                input: { prompt: finalPrompt, image_url: url1, strength: 0.85 },
                logs: true
            });

            // 5. Deduct Credit Only for Logged In Users
            let remainingCredits = 0;
            if (user && activeCustomer) {
                try {
                    const { error: updateError } = await supabase
                        .from("customers")
                        .update({ credits: activeCustomer.credits - COST })
                        .eq("id", activeCustomer.id);

                    if (!updateError) remainingCredits = activeCustomer.credits - COST;
                    else console.error("Failed to deduct credit:", updateError);
                } catch (e) { console.error("Deduction Error:", e); }
            } else {
                // For anonymous, remaining is 0 (since they only had 1)
                remainingCredits = 0;
            }

            return NextResponse.json({
                success: true,
                imageUrl: result.images[0].url,
                remainingCredits: remainingCredits,
                logs: result.logs
            });

        } catch (falError: any) {
            console.error("Fal Error:", falError);
            throw new Error(`[Fal Error] ${falError.message || "Generation failed"}`);
        }

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: `[API Error] ${error.message}` }, { status: 500 });
    }
}
