import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createJsClient } from "@supabase/supabase-js";
import * as fal from "@fal-ai/serverless-client";
import { getUserSubscription } from "@/utils/supabase/subscriptions";
import { checkProUserMonthlyQuota, getClientIP } from "@/lib/rate-limit";

// Configure Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

export const maxDuration = 60; // Allow 60s for execution

export async function POST(req: NextRequest) {
    let user = null;
    let activeCustomer: any = null;
    let isVIP = false;
    const COST = 1;

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

        // --- BRANCH: ANONYMOUS vs LOGGED IN ---

        if (!user) {
            // ANONYMOUS Logic: Check IP Rate Limit
            const ip = getClientIP(req);
            const ratelimitKey = `fusion:anonymous:${ip}`;
            let usage = 1;

            if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                try {
                    const { Redis } = await import('@upstash/redis');
                    const redis = Redis.fromEnv();
                    usage = await redis.incr(ratelimitKey);
                    if (usage === 1) {
                        await redis.expire(ratelimitKey, 60 * 60 * 24); // 24h TTL (synced with generate-fusion)
                    }
                } catch (redisError: any) {
                    console.error("[RateLimit] Redis failed, using memory fallback:", redisError.message);
                    usage = 1;
                }
            } else {
                console.warn("[RateLimit] ⚠️ Redis not configured — AI page has NO rate limiting in production!");
                usage = 1;
            }

            if (usage > 2) {
                return NextResponse.json({
                    error: "Free trial limit reached. Please login to get more credits!",
                    isLimitReached: true
                }, { status: 402 });
            }

        } else {
            // LOGGED IN Logic: Check Subscription first, then Credits
            try {
                const subscription = await getUserSubscription(user.id);
                isVIP = !!subscription;
            } catch (e) {
                console.warn("Failed to check subscription:", e);
            }

            if (!isVIP) {
                // Free user: atomic credit deduction BEFORE generation (prevents TOCTOU)
                try {
                    // Use service role for atomic CAS deduction
                    const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                    const adminClient = createServiceRoleClient();

                    // Read current credits
                    const { data: customer } = await adminClient
                        .from("customers")
                        .select("id, credits")
                        .eq("user_id", user.id)
                        .single();

                    if (!customer) {
                        // Auto-create: INSERT only (not upsert) to avoid overwriting webhook-granted credits
                        const { error: insertErr } = await adminClient
                            .from("customers")
                            .insert({ user_id: user.id, credits: 2 });
                        if (insertErr) {
                            // Row likely created by webhook race — re-read
                            console.warn("Auto-create insert failed (race with webhook):", insertErr.message);
                        }

                        // Re-read after insert
                        const { data: fresh } = await adminClient
                            .from("customers")
                            .select("id, credits")
                            .eq("user_id", user.id)
                            .single();
                        if (fresh) activeCustomer = fresh;
                    } else {
                        activeCustomer = customer;
                    }

                    if (!activeCustomer || activeCustomer.credits < COST) {
                        return NextResponse.json({ error: "Insufficient credits. Please top up.", upgradeUrl: '/pricing' }, { status: 402 });
                    }

                    // Atomic CAS deduction
                    const { data: deducted, error: deductErr } = await adminClient
                        .from("customers")
                        .update({ credits: activeCustomer.credits - COST })
                        .eq("id", activeCustomer.id)
                        .eq("credits", activeCustomer.credits)
                        .select("id, credits")
                        .single();

                    if (deductErr || !deducted) {
                        return NextResponse.json({ error: "Insufficient credits. Please top up.", upgradeUrl: '/pricing' }, { status: 402 });
                    }

                    activeCustomer = deducted;
                } catch (dbError: any) {
                    console.error(">> DATABASE ERROR:", dbError.message);
                    return NextResponse.json(
                        { error: "Service temporarily unavailable. Please try again later." },
                        { status: 503 }
                    );
                }
            } else {
                // Pro user: check monthly quota
                const quota = await checkProUserMonthlyQuota(user.id);
                if (!quota.allowed) {
                    // VIP monthly quota exhausted — fallback to DB credits (refill packs)
                    try {
                        const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                        const adminClient = createServiceRoleClient();

                        const { data: customer } = await adminClient
                            .from("customers")
                            .select("id, credits")
                            .eq("user_id", user.id)
                            .single();

                        if (!customer || customer.credits < COST) {
                            return NextResponse.json({
                                error: "Monthly limit reached for Pro plan (300 fusions/month). Purchase a Refill pack for more.",
                                used: quota.used,
                                limit: 300,
                                type: "monthly_limit",
                                upgradeUrl: '/pricing',
                            }, { status: 429 });
                        }

                        // Atomic CAS deduction from refill credits
                        const { data: deducted, error: deductErr } = await adminClient
                            .from("customers")
                            .update({ credits: customer.credits - COST })
                            .eq("id", customer.id)
                            .eq("credits", customer.credits)
                            .select("id, credits")
                            .single();

                        if (deductErr || !deducted) {
                            return NextResponse.json({
                                error: "Monthly limit reached for Pro plan (300 fusions/month). Purchase a Refill pack for more.",
                                used: quota.used,
                                limit: 300,
                                type: "monthly_limit",
                                upgradeUrl: '/pricing',
                            }, { status: 429 });
                        }

                        activeCustomer = deducted;
                    } catch (dbError: any) {
                        console.error("VIP fallback DB error:", dbError.message);
                        return NextResponse.json({ error: "Service temporarily unavailable." }, { status: 503 });
                    }
                }
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
            [url1, url2] = await Promise.all([
                fal.storage.upload(image1),
                fal.storage.upload(image2)
            ]);
        } catch (uploadError: any) {
            console.error("Fal Storage Upload Failed:", uploadError);
            throw new Error(`[Upload Error] ${uploadError.message || "Network error during image transfer"}`);
        }

        // 4. Generate Fusion (Vision + Flux)
        let image2Description = "";
        try {
            const descriptionResult: any = await fal.subscribe("fal-ai/llava-next", {
                input: {
                    image_url: url2,
                    prompt: "Describe this character's physical appearance, clothing, and distinct features in detail. Be concise but specific."
                },
                logs: false,
            });
            image2Description = descriptionResult.output;
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
            const result: any = await fal.subscribe("fal-ai/flux/dev", {
                input: { prompt: finalPrompt, image_url: url1, strength: 0.85 },
                logs: true
            });

            // 5. Credits already deducted before generation — no additional deduction needed
            let remainingCredits = activeCustomer ? activeCustomer.credits : 0;

            const imageUrl =
                Array.isArray(result?.images) && typeof result.images[0]?.url === "string"
                    ? result.images[0].url
                    : null;
            if (!imageUrl) {
                throw new Error("[Fal Error] Model response did not include a valid image URL.");
            }

            return NextResponse.json({
                success: true,
                imageUrl,
                remainingCredits: remainingCredits,
                logs: result.logs
            });

        } catch (falError: any) {
            console.error("Fal Generation Error:", falError);
            throw new Error(`[Fal Error] ${falError.message || "The AI model is currently busy or unresponsive"}`);
        }

    } catch (error: any) {
        console.error("API Error Trace:", error);

        // Refund credits if pre-deducted but generation failed
        // Applies to: free users + VIP fallback (refill credits)
        if (user && activeCustomer) {
            try {
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                const adminClient = createServiceRoleClient();
                // CAS refund: read current credits, only refund if unchanged
                const { data: current } = await adminClient
                    .from("customers")
                    .select("credits")
                    .eq("id", activeCustomer.id)
                    .single();
                if (current && current.credits === activeCustomer.credits) {
                    const { data: refunded } = await adminClient
                        .from("customers")
                        .update({ credits: current.credits + COST })
                        .eq("id", activeCustomer.id)
                        .eq("credits", current.credits)
                        .select("id");
                    if (refunded && refunded.length > 0) {
                        console.log(`💰 Refunded ${COST} credits to user ${user.id} (generation failed)`);
                    } else {
                        console.log(`⏭️ Refund race lost for user ${user.id} — concurrent refund won`);
                    }
                } else {
                    console.log(`⏭️ Refund skipped for user ${user.id} — credits changed since deduction`);
                }
            } catch (refundErr) {
                console.error("CRITICAL: Failed to refund credits:", refundErr);
            }
        }

        const rawMessage = typeof error?.message === "string" ? error.message : "Unknown server error";
        const normalized = rawMessage.toLowerCase();

        // Map recoverable service failures to 503 so the client can show a retry-oriented message.
        if (
            normalized.includes("[fal error]") ||
            normalized.includes("model response did not include") ||
            normalized.includes("temporarily unavailable") ||
            normalized.includes("busy") ||
            normalized.includes("timeout")
        ) {
            return NextResponse.json({
                error: "Generation service is temporarily unavailable. Please try again in a moment."
            }, { status: 503 });
        }

        return NextResponse.json({
            error: rawMessage.includes("[API Error]") ? rawMessage : `[API Error] ${rawMessage}`
        }, { status: 500 });
    }
}
