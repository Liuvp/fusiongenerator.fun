import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";
import { SYSTEM_PROMPT, NEGATIVE_PROMPT, DRAGON_BALL_SYSTEM_PROMPT, DRAGON_BALL_NEGATIVE_PROMPT } from '@/lib/prompt-builder';
import { checkIPRateLimit, checkUserDailyQuota, checkVIPUserDailyQuota, getClientIP } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';
import { DB_CHARACTERS, DB_FUSION_STYLES, buildDBPrompt } from '@/lib/dragon-ball-data';
import { POKEMON_DATABASE, buildPokemonPrompt } from '@/lib/pokemon-data';

// 配置 Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

// In-memory fallback for rate limiting (when Redis fails)
const fallbackCache = new Map<string, number>();

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        let user = null;

        // 0. Check for Authorization Header (Bearer Token) override or Session
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
            try {
                const { data: { user: headerUser }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
                if (headerUser && !error) user = headerUser;
            } catch (e) { console.warn("Token check failed", e); }
        }

        if (!user) {
            const { data: { user: sessionUser } } = await supabase.auth.getUser();
            user = sessionUser;
        }

        const clientIP = getClientIP(request) || "127.0.0.1";

        // Quota Logic Breakdown
        let isVIP = false;
        let remainingQuota = 0;
        let limitQuota = 0;
        let usedQuota = 0;
        let customerProfile: any = null;

        // --- BRANCH: ANONYMOUS vs LOGGED IN ---

        if (!user) {
            // ANONYMOUS Logic: Check IP Rate Limit via Redis
            if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
                console.warn("Redis not configured, denying anonymous access.");
                return NextResponse.json({ error: "Anonymous generation temporarily unavailable." }, { status: 503 });
            }

            let usage = 1;

            try {
                const { Redis } = await import('@upstash/redis');
                const redis = Redis.fromEnv();
                const ratelimitKey = `fusion:anonymous:${clientIP}`;

                // Check usage
                usage = await redis.incr(ratelimitKey);

                // Set expiry if new key (e.g., 30 days)
                if (usage === 1) {
                    // Non-blocking expire
                    redis.expire(ratelimitKey, 60 * 60 * 24 * 30).catch(e => console.warn("Redis expire failed", e));
                }
            } catch (redisErr) {
                console.warn("[RateLimit] Redis failed, switching to Memory Fallback:", redisErr);
                // Fallback: Use memory cache
                const current = fallbackCache.get(clientIP) || 0;
                usage = current + 1;
                fallbackCache.set(clientIP, usage);
                console.log(`[RateLimit] Memory Fallback: IP ${clientIP} usage ${usage}`);
            }

            if (usage > 1) {
                return NextResponse.json({
                    error: "Free trial limit reached. Please login to get more credits!",
                    isLimitReached: true // Signal for frontend
                }, { status: 429 }); // Using 429 for Rate Limit
            }

            console.log(`Anonymous user (IP: ${clientIP}) used 1 free credit.`);
            remainingQuota = 0; // Display 0 remaining for anon

        } else {
            // LOGGED IN Logic

            // Check VIP
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('status')
                .eq('user_id', user.id)
                .in('status', ['active', 'trialing'])
                .maybeSingle();
            isVIP = !!subscription;

            if (isVIP) {
                const quota = await checkVIPUserDailyQuota(user.id);
                if (!quota.allowed) {
                    return NextResponse.json({
                        error: 'Daily limit reached for VIP plan (10 generations/day).',
                        used: quota.used,
                        limit: 10,
                        upgradeUrl: '/pricing',
                    }, { status: 429 });
                }
                usedQuota = quota.used;
                remainingQuota = quota.remaining;
                limitQuota = 10;
            } else {
                // Free User Logic (Credits)
                const COST_PER_GEN = 1;
                const { data: customer, error: custError } = await supabase
                    .from("customers")
                    .select("credits, id")
                    .eq("user_id", user.id)
                    .single();

                if (customer) {
                    customerProfile = customer;
                } else {
                    // Auto-create with 1 Credit
                    const { data: newCustomer, error: createError } = await supabase
                        .from("customers")
                        .insert([{ user_id: user.id, credits: 1 }])  // ✅ 统一为 1 次免费额度
                        .select("credits, id")
                        .single();
                    if (!createError && newCustomer) customerProfile = newCustomer;
                }

                if ((customerProfile?.credits || 0) < COST_PER_GEN) {
                    return NextResponse.json({ error: 'Insufficient credits. Please upgrade or top up.', upgradeUrl: '/pricing' }, { status: 402 });
                }
                remainingQuota = customerProfile?.credits || 0;
            }
        }

        // ============================================================================
        // 4️⃣ 处理生成请求 & Prompt (Fusion Specific)
        // ============================================================================
        const body = await request.json();
        const { char1: char1Id, char2: char2Id, style: styleId, prompt: customPromptRaw, p1: p1Id, p2: p2Id } = body;

        let finalPrompt = "";
        let isPokemon = false;

        // Mode A: Dragon Ball Fusion (via char IDs)
        if (char1Id && char2Id) {
            const char1 = DB_CHARACTERS.find(c => c.id === char1Id);
            const char2 = DB_CHARACTERS.find(c => c.id === char2Id);
            const style = DB_FUSION_STYLES.find(s => s.id === styleId);

            if (!char1 || !char2) {
                return NextResponse.json({ error: 'Invalid DB characters selected' }, { status: 400 });
            }

            finalPrompt = buildDBPrompt(char1, char2, style, customPromptRaw);
            console.log(`[DB Fusion] Generating: ${char1.name} + ${char2.name} (${style?.name || 'default'})`);

            // Mode B: Pokemon Fusion (via p1/p2 IDs)
        } else if (p1Id && p2Id) {
            const p1 = POKEMON_DATABASE.find(p => p.id === p1Id);
            const p2 = POKEMON_DATABASE.find(p => p.id === p2Id);

            if (!p1 || !p2) {
                return NextResponse.json({ error: 'Invalid Pokemon selected' }, { status: 400 });
            }

            isPokemon = true;
            finalPrompt = buildPokemonPrompt(p1, p2); // Currently no style support for Pokemon
            console.log(`[Poke Fusion] Generating: ${p1.name} + ${p2.name}`);

            // Mode C: Direct Prompt (Fallback)
        } else if (customPromptRaw || body.prompt) {
            finalPrompt = customPromptRaw || body.prompt;

        } else {
            return NextResponse.json({ error: 'Missing character selection or prompt' }, { status: 400 });
        }

        // Prompt Logic Analysis
        // If it's explicitly Pokemon mode, we don't force Dragon Ball context
        const promptLower = finalPrompt.toLowerCase();
        let isDragonBall = false;

        if (!isPokemon) {
            isDragonBall = promptLower.includes('dragon ball') ||
                promptLower.includes('akira toriyama') ||
                promptLower.includes('saiyan') ||
                promptLower.includes('goku') ||
                promptLower.includes('vegeta') ||
                promptLower.includes('frieza') ||
                promptLower.includes('majin');
        }

        const selectedSystemPrompt = isDragonBall ? DRAGON_BALL_SYSTEM_PROMPT : SYSTEM_PROMPT;
        const selectedNegativePrompt = isDragonBall ? DRAGON_BALL_NEGATIVE_PROMPT : NEGATIVE_PROMPT;

        const watermarkInstruction = !user ? " Add subtle watermark text 'FusionGenerator.fun' in bottom right corner." : "";

        // 三层Prompt拼接
        const fullPrompt = `${selectedSystemPrompt}

${finalPrompt} ${watermarkInstruction}`;

        console.log('=== Fusion Generation Request ===');
        console.log('User:', user ? user.email : 'Anonymous');
        console.log('IP:', clientIP);
        console.log('Final Prompt:', fullPrompt);

        // ============================================================================
        // Fal.ai API 调用
        // ============================================================================
        let result: any;
        try {
            result = await fal.run("fal-ai/flux/dev", {
                input: {
                    prompt: fullPrompt,
                    negative_prompt: selectedNegativePrompt,
                    image_size: "square_hd",
                    num_inference_steps: 38,
                    guidance_scale: 7.5,
                    num_images: 1,
                    enable_safety_checker: true,
                    output_format: "png",
                },
            });
        } catch (falErr: any) {
            console.error("Fal Execution Error:", falErr);
            throw new Error(`[Fal Error] ${falErr.message || "Fal API failed"}`);
        }

        // 提取图片URL
        let imageUrl: string | undefined;
        if (result.data?.images?.[0]?.url) imageUrl = result.data.images[0].url;
        else if (result.images?.[0]?.url) imageUrl = result.images[0].url;
        else if (result.data?.image_url) imageUrl = result.data.image_url;
        else if (result.image_url) imageUrl = result.image_url;

        if (!imageUrl) throw new Error('No image URL in response');

        // ============================================================================
        // 5️⃣ 扣费逻辑 (仅限登录的免费用户或 VIP 记录)
        // ============================================================================
        if (user) {
            if (isVIP) {
                // VIP Quota handled by check function limit in this simplified version
            } else if (customerProfile) {
                const COST_PER_GEN = 1;
                // Use Service Role Client for deduction to bypass RLS policies
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                const adminClient = createServiceRoleClient();

                const { error: updateError } = await adminClient
                    .from("customers")
                    .update({ credits: customerProfile.credits - COST_PER_GEN })
                    .eq("id", customerProfile.id); // Securely target by ID we verified earlier

                if (updateError) {
                    console.error("CRITICAL: Failed to deduct credit for user", user.id, updateError);
                } else {
                    remainingQuota = customerProfile.credits - COST_PER_GEN;
                }
            }
        }

        return NextResponse.json({
            imageUrl: imageUrl,
            prompt: finalPrompt,
            quota: {
                used: usedQuota,
                remaining: remainingQuota,
                limit: limitQuota,
                isVIP: isVIP,
                type: isVIP ? 'daily_limit' : 'credits'
            }
        });

    } catch (error: any) {
        console.error('=== Generation Error ===', error);
        return NextResponse.json(
            { error: `[API Error] ${error.message || 'Generation failed'}` },
            { status: 500 }
        );
    }
}
