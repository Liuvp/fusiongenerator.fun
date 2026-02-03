import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createJsClient } from "@supabase/supabase-js";
import * as fal from "@fal-ai/serverless-client";
import { getUserSubscription } from "@/utils/supabase/subscriptions";

// Configure Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

export const maxDuration = 60; // Allow 60s for execution

export async function POST(req: NextRequest) {
    console.log("[API] Fusion Generate request received");
    try {
        // [DEBUG] Check Environment Config
        if (!process.env.FAL_KEY) {
            console.error("FATAL: FAL_KEY is missing in environment variables.");
            return NextResponse.json({ error: "[Config Error] FAL_KEY is missing on server." }, { status: 500 });
        }

        let supabase;
        try {
            supabase = await createClient(); // User client for Auth
        } catch (e: any) {
            console.error("Supabase Client Init Error:", e);
            throw new Error(`[Auth Init Error] ${e.message}`);
        }

        let user = null;

        // 0. Check for Authorization Header (Bearer Token) override
        const authHeader = req.headers.get('Authorization');
        if (authHeader) {
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
            try {
                const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();
                user = supabaseUser;

                if (!user || authError) {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session?.user) user = session.user;
                }
            } catch (e) {
                console.warn("Auth check failed, continuing as guest if allowed", e);
            }
        }

        let activeCustomer: any = null;
        const COST = 1;

        // --- BRANCH: ANONYMOUS vs LOGGED IN ---

        if (!user) {
            // ANONYMOUS Logic: Check IP Rate Limit
            const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
            const ratelimitKey = `fusion:anonymous:${ip}`;
            let usage = 1;

            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                try {
                    const { Redis } = await import('@upstash/redis');
                    const redis = Redis.fromEnv();
                    usage = await redis.incr(ratelimitKey);
                    if (usage === 1) {
                        await redis.expire(ratelimitKey, 60 * 60 * 24 * 30);
                    }
                } catch (redisError: any) {
                    console.error("[RateLimit] Redis failed, using memory fallback:", redisError.message);
                    // Fallback to memory or just allow if redis fails to prevent crashing
                    usage = 1;
                }
            } else {
                console.warn("[RateLimit] Redis not configured, allowing single guest access.");
                usage = 1;
            }

            if (usage > 1) {
                return NextResponse.json({
                    error: "Free trial limit reached. Please login to get more credits!",
                    isLimitReached: true
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

            if (activeCustomer.credits < 1) {
                return NextResponse.json({ error: "Insufficient credits. Please top up." }, { status: 402 });
            }
        }

        // 2. Parse FormData
        let image1, image2, prompt;
        try {
            const formData = await req.formData();
            image1 = formData.get("image1") as File;
            image2 = formData.get("image2") as File;
            prompt = formData.get("prompt") as string || "A creative fusion of two images";
        } catch (e: any) {
            console.error("FormData Parse Error:", e);
            throw new Error(`[Request Error] Failed to parse images. ${e.message}`);
        }

        if (!image1 || !image2) {
            return NextResponse.json({ error: "Missing images. Please select two images." }, { status: 400 });
        }

        // 3. Upload Images to Storage
        let url1, url2;
        try {
            console.log("Uploading images to Fal Storage...");
            [url1, url2] = await Promise.all([
                fal.storage.upload(image1),
                fal.storage.upload(image2)
            ]);
            console.log("Upload successful:", url1, url2);
        } catch (uploadError: any) {
            console.error("Fal Storage Upload Failed:", uploadError);
            throw new Error(`[Upload Error] ${uploadError.message || "Network error during image transfer"}`);
        }

        // 4. Generate Fusion (Vision + Flux)
        let image2Description = "";
        try {
            console.log("Analyzing Image 2 for fusion traits...");
            const descriptionResult: any = await fal.subscribe("fal-ai/llava-next", {
                input: {
                    image_url: url2,
                    prompt: "Describe this character's physical appearance, clothing, and distinct features in detail. Be concise but specific."
                },
                logs: false,
            });
            image2Description = descriptionResult.output;
            console.log("Vision Analysis Result:", image2Description);
        } catch (e) {
            console.warn("Vision analysis failed, falling back to default prompt:", e);
            image2Description = "a distinct character";
        }

        let isPremium = false;
        if (user) {
            try {
                const subscription = await getUserSubscription(user.id);
                isPremium = !!subscription;
            } catch (e) {
                console.warn("Failed to check subscription status:", e);
            }
        }

        const watermarkInstruction = !isPremium
            ? " text \"fusiongenerator.fun\" watermark in bottom right corner."
            : "";

        const finalPrompt = `(Masterpiece). Fusion of character in image AND character looking like: ${image2Description || "the second uploaded image"}. ${prompt}.${watermarkInstruction} Detailed.`;

        // Generate Final Image
        try {
            console.log("Generating fusion with Flux...");
            const result: any = await fal.subscribe("fal-ai/flux/dev", {
                input: { prompt: finalPrompt, image_url: url1, strength: 0.85 },
                logs: true
            });

            // 5. Deduct Credit
            let remainingCredits = activeCustomer ? activeCustomer.credits : 0;

            if (user && activeCustomer) {
                try {
                    const { error: updateError } = await supabase
                        .from("customers")
                        .update({ credits: activeCustomer.credits - COST })
                        .eq("id", activeCustomer.id);

                    if (!updateError) remainingCredits = activeCustomer.credits - COST;
                    else console.error("Failed to deduct credit:", updateError);
                } catch (e) { console.error("Deduction Error:", e); }
            }

            return NextResponse.json({
                success: true,
                imageUrl: result.images[0].url,
                remainingCredits: remainingCredits,
                logs: result.logs
            });

        } catch (falError: any) {
            console.error("Fal Generation Error:", falError);
            throw new Error(`[Fal Error] ${falError.message || "The AI model is currently busy or unresponsive"}`);
        }

    } catch (error: any) {
        console.error("API Error Trace:", error);
        return NextResponse.json({
            error: error.message.includes("[API Error]") ? error.message : `[API Error] ${error.message}`
        }, { status: 500 });
    }
}
