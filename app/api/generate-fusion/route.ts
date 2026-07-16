import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";
import { SYSTEM_PROMPT, DRAGON_BALL_SYSTEM_PROMPT } from '@/lib/prompt-builder';
import { checkIPRateLimit, checkUserDailyQuota, checkProUserMonthlyQuota, getClientIP } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';
import { DB_CHARACTERS, DB_FUSION_STYLES } from '@/lib/dragon-ball-data';
import { POKEMON_DATABASE, buildPokemonPrompt } from '@/lib/pokemon-data';

// 配置 Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

// In-memory fallback for rate limiting (when Redis fails)
// TTL: 30 minutes, Max entries: 10,000
const fallbackCache = new Map<string, { count: number; expires: number }>();
const FALLBACK_TTL = 30 * 60 * 1000; // 30 minutes
const FALLBACK_MAX_ENTRIES = 10_000;

function fallbackGet(ip: string): number {
    const entry = fallbackCache.get(ip);
    if (!entry || entry.expires < Date.now()) {
        fallbackCache.delete(ip);
        return 0;
    }
    return entry.count;
}

function fallbackSet(ip: string, count: number): void {
    // Evict oldest entries if at capacity
    if (fallbackCache.size >= FALLBACK_MAX_ENTRIES) {
        const oldestKey = fallbackCache.keys().next().value;
        if (oldestKey) fallbackCache.delete(oldestKey);
    }
    fallbackCache.set(ip, { count, expires: Date.now() + FALLBACK_TTL });
}

export async function POST(request: NextRequest) {
    let user = null;
    let isVIP = false;
    let customerProfile: any = null;
    let clientIP = "127.0.0.1";

    try {
        const supabase = await createClient();

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

        clientIP = getClientIP(request) || "127.0.0.1";

        // Quota Logic Breakdown
        let remainingQuota = 0;
        let limitQuota = 0;
        let usedQuota = 0;

        // --- BRANCH: ANONYMOUS vs LOGGED IN ---

        if (!user) {
            // ANONYMOUS Logic: Check IP Rate Limit via Redis (with memory fallback)

            // Burst protection: 3 requests per minute per IP
            try {
                const ipCheck = await checkIPRateLimit(clientIP);
                if (!ipCheck.allowed) {
                    return NextResponse.json({
                        error: "Too many requests. Please wait a moment before trying again.",
                        isLimitReached: true,
                        reason: "burst",
                    }, { status: 429 });
                }
            } catch (ipErr) {
                console.warn("IP rate limit check failed, continuing:", ipErr);
            }

            let usage = 1;

            try {
                if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
                    throw new Error("Redis not configured");
                }

                const { Redis } = await import('@upstash/redis');
                const redis = Redis.fromEnv();
                const ratelimitKey = `fusion:anonymous:${clientIP}`;

                usage = await redis.incr(ratelimitKey);

                if (usage === 1) {
                    redis.expire(ratelimitKey, 60 * 60 * 24).catch(e => console.warn("Redis expire failed", e));
                }
            } catch (redisErr) {
                console.warn("[RateLimit] Redis unavailable, switching to Memory Fallback:", redisErr instanceof Error ? redisErr.message : redisErr);
                const current = fallbackGet(clientIP);
                usage = current + 1;
                fallbackSet(clientIP, usage);
            }

            if (usage > 2) {
                return NextResponse.json({
                    error: "Free trial limit reached. Please login to get more credits!",
                    isLimitReached: true // Signal for frontend
                }, { status: 429 }); // Using 429 for Rate Limit
            }

            remainingQuota = Math.max(0, 2 - usage);

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
                const quota = await checkProUserMonthlyQuota(user.id);
                if (!quota.allowed) {
                    // VIP monthly quota exhausted — fallback to DB credits (refill packs)
                    const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                    const adminClient = createServiceRoleClient();

                    const { data: customer } = await adminClient
                        .from("customers")
                        .select("id, credits")
                        .eq("user_id", user.id)
                        .single();

                    if (!customer || customer.credits < 1) {
                        return NextResponse.json({
                            error: 'Monthly limit reached for Pro plan (300 fusions/month). Purchase a Refill pack for more.',
                            used: quota.used,
                            limit: 300,
                            upgradeUrl: '/pricing',
                        }, { status: 429 });
                    }

                    // Atomic CAS deduction from DB credits
                    const { data: deducted, error: deductErr } = await adminClient
                        .from("customers")
                        .update({ credits: customer.credits - 1 })
                        .eq("id", customer.id)
                        .eq("credits", customer.credits)
                        .select("id, credits")
                        .single();

                    if (deductErr || !deducted) {
                        return NextResponse.json({
                            error: 'Monthly limit reached for Pro plan (300 fusions/month). Purchase a Refill pack for more.',
                            used: quota.used,
                            limit: 300,
                            upgradeUrl: '/pricing',
                        }, { status: 429 });
                    }

                    // VIP using refill credits — track for refund on failure
                    customerProfile = deducted;
                    usedQuota = quota.used;
                    remainingQuota = deducted.credits; // remaining refill credits
                    limitQuota = 300;
                } else {
                    usedQuota = quota.used;
                    remainingQuota = quota.remaining;
                    limitQuota = 300;
                }
            } else {
                // Free User Logic (Credits)
                const COST_PER_GEN = 1;

                // Use Service Role Client for atomic deduction
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                const adminClient = createServiceRoleClient();

                // Read-then-CAS: prevents TOCTOU race conditions
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
                    if (fresh) customerProfile = fresh;
                } else {
                    customerProfile = customer;
                }

                if (!customerProfile || customerProfile.credits < COST_PER_GEN) {
                    return NextResponse.json({ error: 'Insufficient credits. Please upgrade or top up.', upgradeUrl: '/pricing' }, { status: 402 });
                }

                // Atomic CAS deduction — .eq("credits", customerProfile.credits) acts as version guard
                const { data: deducted, error: deductErr } = await adminClient
                    .from("customers")
                    .update({ credits: customerProfile.credits - COST_PER_GEN })
                    .eq("id", customerProfile.id)
                    .eq("credits", customerProfile.credits)
                    .select("id, credits")
                    .single();

                if (deductErr || !deducted) {
                    return NextResponse.json({ error: 'Insufficient credits. Please upgrade or top up.', upgradeUrl: '/pricing' }, { status: 402 });
                }

                customerProfile = deducted;
                remainingQuota = deducted.credits;
            }
        }

        // ============================================================================
        // 4️⃣ 处理生成请求 & Prompt (Fusion Specific)
        // ============================================================================
        const body = await request.json();
        const { char1: char1Id, char2: char2Id, style: styleId, prompt: customPromptRaw, p1: p1Id, p2: p2Id } = body;

        let finalPrompt = "";
        let isPokemon = false;
        let dbImageUrls: string[] = []; // 角色参考图 URL（DB 融合用）

        // Mode A: Dragon Ball Fusion (via char IDs)
        if (char1Id && char2Id) {
            const char1 = DB_CHARACTERS.find(c => c.id === char1Id);
            const char2 = DB_CHARACTERS.find(c => c.id === char2Id);
            const style = DB_FUSION_STYLES.find(s => s.id === styleId);

            if (!char1 || !char2) {
                return NextResponse.json({ error: 'Invalid DB characters selected' }, { status: 400 });
            }

            // 构建基于参考图的融合 prompt（模型直接"看到"角色外观）
            // 必须使用生产环境 URL，fal.ai 服务器需要能公开访问图片
            const imageBaseUrl = "https://fusiongenerator.fun";
            dbImageUrls = [
                `${imageBaseUrl}${char1.imageUrl}`,
                `${imageBaseUrl}${char2.imageUrl}`,
            ];
            finalPrompt = `Dragon Ball fusion of ${char1.name} and ${char2.name}, combining their hair, outfit, and colors into one character.
${style?.prompt || ''}.
Akira Toriyama anime art style, cel shaded, high quality, dynamic pose.
${customPromptRaw || ''}`;
            console.log(`[DB Fusion] Generating with reference images: ${char1.name} + ${char2.name} (${style?.name || 'default'})`);
            console.log(`[DB Fusion] Image URLs:`, dbImageUrls);

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
        // Negative prompts kept for reference but not used - FLUX 2 Pro doesn't support them
        // Key constraints have been merged into system prompts instead

        const watermarkInstruction = !isVIP ? " Add subtle watermark text 'FusionGenerator.fun' in bottom right corner." : "";

        // 三层Prompt拼接
        const fullPrompt = `${selectedSystemPrompt}

${finalPrompt} ${watermarkInstruction}`;

        // Debug logging removed for PII compliance

        // ============================================================================
        // Fal.ai API 调用
        // DB 融合: FLUX 2 Pro Edit（传入角色参考图，模型直接"看到"角色）
        // 其他模式: FLUX 2 Pro（纯文生图）
        // ============================================================================
        let result: any;
        try {
            // 直接使用 fetch 调用 fal.ai Queue API（绕过旧 SDK v0.14.3 兼容性问题）
            const callFalAPI = async (endpoint: string, input: Record<string, unknown>) => {
                const apiKey = process.env.FAL_KEY;
                if (!apiKey) throw new Error("FAL_KEY not configured");

                const submitUrl = `https://queue.fal.run/${endpoint}`;

                // 1. 提交请求
                console.error(`[Fal API] POST ${submitUrl}`);
                console.error(`[Fal API] Input:`, JSON.stringify(input).substring(0, 300));
                const submitRes = await fetch(submitUrl, {
                    method: "POST",
                    headers: {
                        "Authorization": `Key ${apiKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(input),
                });

                const submitBody = await submitRes.text();
                console.error(`[Fal API] Submit response: ${submitRes.status}`, submitBody.substring(0, 500));

                if (!submitRes.ok) {
                    throw new Error(`Fal API submit failed (${submitRes.status}): ${submitBody}`);
                }

                let requestId: string;
                let statusUrl: string;
                let resultUrl: string;
                try {
                    const parsed = JSON.parse(submitBody);
                    if (parsed.detail) {
                        throw new Error(`Fal API error: ${JSON.stringify(parsed.detail)}`);
                    }
                    requestId = parsed.request_id;
                    if (!requestId) {
                        throw new Error(`No request_id in response: ${submitBody.substring(0, 300)}`);
                    }
                    // 使用响应返回的 URL（edit 端点的 URL 路径与 endpoint ID 不同）
                    statusUrl = parsed.status_url || `https://queue.fal.run/${endpoint}/requests/${requestId}/status`;
                    resultUrl = parsed.response_url || `https://queue.fal.run/${endpoint}/requests/${requestId}`;
                } catch (parseErr: any) {
                    if (parseErr.message?.includes("Fal API error")) throw parseErr;
                    throw new Error(`Failed to parse submit response: ${parseErr.message}. Body: ${submitBody.substring(0, 300)}`);
                }
                console.error(`[Fal API] Request submitted: ${requestId}`);

                // 2. 轮询状态
                let status = "IN_QUEUE";
                let attempts = 0;
                const maxAttempts = 120;
                while (status === "IN_QUEUE" || status === "IN_PROGRESS") {
                    if (attempts++ >= maxAttempts) {
                        throw new Error(`Fal API timeout after ${maxAttempts}s`);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const statusRes = await fetch(statusUrl, {
                        headers: { "Authorization": `Key ${apiKey}` },
                    });
                    const statusText = await statusRes.text();
                    let statusData: any;
                    try {
                        statusData = JSON.parse(statusText);
                    } catch {
                        throw new Error(`Failed to parse status response: ${statusText.substring(0, 300)}`);
                    }
                    status = statusData.status;
                    if (attempts <= 3 || status === "COMPLETED") {
                        console.error(`[Fal API] Status (attempt ${attempts}):`, status);
                    }
                    if (status === "COMPLETED") break;
                    if (status === "FAILED" || status === "ERROR") {
                        throw new Error(`Fal API request failed: ${JSON.stringify(statusData)}`);
                    }
                }

                // 3. 获取结果（使用 submit 响应返回的 response_url）
                const resultRes = await fetch(resultUrl, {
                    headers: { "Authorization": `Key ${apiKey}` },
                });
                const resultBody = await resultRes.text();
                console.error(`[Fal API] Result response: ${resultRes.status}`, resultBody.substring(0, 500));
                try {
                    return JSON.parse(resultBody);
                } catch {
                    throw new Error(`Failed to parse result response: ${resultBody.substring(0, 300)}`);
                }
            };

            if (dbImageUrls.length > 0) {
                // DB 融合：传入角色参考图
                try {
                    result = await callFalAPI("fal-ai/flux-2-pro/edit", {
                        prompt: fullPrompt,
                        image_urls: dbImageUrls,
                        image_size: "square_hd",
                        enable_safety_checker: false,
                        output_format: "png",
                    });
                } catch (editErr: any) {
                    console.warn("[DB Fusion] Edit endpoint failed, falling back to text-to-image:", editErr.message);
                    result = await callFalAPI("fal-ai/flux-2-pro", {
                        prompt: fullPrompt,
                        image_size: "square_hd",
                        enable_safety_checker: false,
                        output_format: "png",
                    });
                }
            } else {
                // 其他模式：纯文生图
                result = await callFalAPI("fal-ai/flux-2-pro", {
                    prompt: fullPrompt,
                    image_size: "square_hd",
                    enable_safety_checker: false,
                    output_format: "png",
                });
            }
        } catch (falErr: any) {
            console.error("Fal Execution Error:", falErr);
            throw new Error(`[Fal Error] ${falErr.message || "Fal API failed"}`);
        }

        // 提取图片URL - 记录响应结构以便调试
        console.log("[Fal API] Response keys:", Object.keys(result));
        console.log("[Fal API] Response preview:", JSON.stringify(result, null, 2).substring(0, 800));

        let imageUrl: string | undefined;
        if (result.data?.images?.[0]?.url) imageUrl = result.data.images[0].url;
        else if (result.images?.[0]?.url) imageUrl = result.images[0].url;
        else if (result.data?.image_url) imageUrl = result.data.image_url;
        else if (result.image_url) imageUrl = result.image_url;
        else if (result.response?.images?.[0]?.url) imageUrl = result.response.images[0].url;
        else if (result.output?.images?.[0]?.url) imageUrl = result.output.images[0].url;
        else if (result.result?.images?.[0]?.url) imageUrl = result.result.images[0].url;
        else if (result.response?.image_url) imageUrl = result.response.image_url;
        else if (result.output?.image_url) imageUrl = result.output.image_url;

        if (!imageUrl) throw new Error(`No image URL in response. Keys: ${Object.keys(result).join(', ')}`);

        // ============================================================================
        // 5️⃣ 扣费逻辑 — Credits already deducted BEFORE generation (Fix #1)
        // ============================================================================
        // If we reach here, generation succeeded and credits were already consumed.
        // No additional deduction needed. The remainingQuota was set during pre-deduction.
        if (user && !isVIP && customerProfile) {
            remainingQuota = customerProfile.credits; // Already updated in step 3
        }

        return NextResponse.json({
            imageUrl: imageUrl,
            prompt: finalPrompt,
            quota: {
                used: usedQuota,
                remaining: remainingQuota,
                limit: limitQuota,
                isVIP: isVIP,
                type: isVIP ? 'monthly_limit' : 'credits'
            }
        });

    } catch (error: any) {
        console.error('=== Generation Error ===', error);

        // Refund credits if they were pre-deducted but generation failed
        // Applies to: free users (always pre-deduct) + VIP fallback (pre-deducted from refill credits)
        if (user && customerProfile) {
            try {
                const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
                const adminClient = createServiceRoleClient();
                // CAS refund: read current credits, only refund if unchanged
                const { data: current } = await adminClient
                    .from("customers")
                    .select("credits")
                    .eq("id", customerProfile.id)
                    .single();
                if (current && current.credits === customerProfile.credits) {
                    const { data: refunded } = await adminClient
                        .from("customers")
                        .update({ credits: current.credits + 1 })
                        .eq("id", customerProfile.id)
                        .eq("credits", current.credits)
                        .select("id");
                    if (refunded && refunded.length > 0) {
                        console.log(`💰 Refunded 1 credit to user ${user.id} (generation failed)`);
                    } else {
                        console.log(`⏭️ Refund race lost for user ${user.id} — concurrent refund won`);
                    }
                } else {
                    console.log(`⏭️ Refund skipped for user ${user.id} — credits changed since deduction`);
                }
            } catch (refundErr) {
                console.error("CRITICAL: Failed to refund credit:", refundErr);
            }
        } else if (!user) {
            // Anonymous: decrement Redis counter so failure doesn't consume a free use
            try {
                if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                    const { Redis } = await import('@upstash/redis');
                    const redis = Redis.fromEnv();
                    const ratelimitKey = `fusion:anonymous:${clientIP}`;
                    const current = await redis.get<number>(ratelimitKey);
                    if (current && current > 0) {
                        await redis.set(ratelimitKey, current - 1, { ex: 60 * 60 * 24 });
                    }
                }
            } catch (decrErr) {
                console.warn("Failed to refund anonymous quota on failure:", decrErr);
            }
        }

        return NextResponse.json(
            { error: `[API Error] ${error.message || 'Generation failed'}` },
            { status: 500 }
        );
    }
}
