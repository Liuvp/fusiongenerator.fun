import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";
import { SYSTEM_PROMPT, NEGATIVE_PROMPT, DRAGON_BALL_SYSTEM_PROMPT, DRAGON_BALL_NEGATIVE_PROMPT } from '@/lib/prompt-builder';
import { checkIPRateLimit, checkUserDailyQuota, checkVIPUserDailyQuota, getClientIP } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';

// 配置 Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // ============================================================================
        // 1️⃣ 用户认证检查（必须登录）- 优先检查，避免未登录请求消耗IP配额
        // ============================================================================
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required. Please sign in to generate fusions.' },
                { status: 401 }
            );
        }

        // ============================================================================
        // 2️⃣ IP 频率限制（每IP每分钟3次）- 已登录用户的防滥用措施
        // ============================================================================
        const clientIP = getClientIP(request);
        const ipLimit = await checkIPRateLimit(clientIP);

        if (!ipLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please wait a moment and try again.',
                    retryAfter: 60,
                },
                { status: 429 }
            );
        }

        // ============================================================================
        // 3️⃣ 用户每日配额检查
        // ============================================================================

        // 检查用户是否是 VIP（订阅用户）
        // VIP = status is 'active' or 'trialing'
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .maybeSingle();

        const isVIP = !!subscription;

        // 变量用于存储配额信息，供返回使用
        let remainingQuota = 0;
        let limitQuota = 0;
        let usedQuota = 0;

        // 逻辑分支：
        // 1. VIP 用户 -> 检查每日限额 (10次) -> 不扣积分
        // 2. 免费用户 -> 检查积分 (>0) -> 扣除积分 (1分)

        let customerProfile: any = null;

        if (isVIP) {
            // === VIP 逻辑 (Redis 限额) ===
            const quota = await checkVIPUserDailyQuota(user.id);
            if (!quota.allowed) {
                return NextResponse.json(
                    {
                        error: 'Daily limit reached for VIP plan (10 generations/day).',
                        used: quota.used,
                        limit: 10,
                        upgradeUrl: '/pricing',
                    },
                    { status: 429 }
                );
            }
            usedQuota = quota.used;
            remainingQuota = quota.remaining;
            limitQuota = 10;
        } else {
            // === 免费用户逻辑 (DB 积分) ===

            // 1. 获取积分配置
            const COST_PER_GEN = 1;

            // 2. 查询用户积分
            // (如果没有 profile 则自动创建，初始送 3 分 - 与 AI Studio 逻辑保持一致)
            const { data: customer, error: custError } = await supabase
                .from("customers")
                .select("credits, id")
                .eq("user_id", user.id)
                .single();

            if (customer) {
                customerProfile = customer;
            } else {
                // Auto-create profile for new users
                const { data: newCustomer, error: createError } = await supabase
                    .from("customers")
                    .insert([{ user_id: user.id, credits: 3 }])
                    .select("credits, id")
                    .single();

                if (!createError && newCustomer) {
                    customerProfile = newCustomer;
                }
            }

            // 3. 检查积分是否足够
            const currentCredits = customerProfile?.credits || 0;

            if (currentCredits < COST_PER_GEN) {
                return NextResponse.json(
                    {
                        error: 'Insufficient credits. Please upgrade or top up.',
                        upgradeUrl: '/pricing',
                    },
                    { status: 402 }
                );
            }

            // 设置显示变量 (预扣除)
            usedQuota = 0; // 免费用户不展示“已用次数”，只展示积分
            remainingQuota = currentCredits; // 这里暂存当前积分，生成成功后再减
            limitQuota = 0; // 无限制
        }

        // ============================================================================
        // 4️⃣ 处理生成请求
        // ============================================================================
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required' },
                { status: 400 }
            );
        }

        // ============================================================================
        // 🔥 关键修复：自动检测内容类型，使用对应的 System Prompt
        // ============================================================================
        const isDragonBall = prompt.toLowerCase().includes('dragon ball') ||
            prompt.includes('Akira Toriyama') ||
            prompt.includes('Saiyan') ||
            prompt.includes('Goku') ||
            prompt.includes('Vegeta') ||
            prompt.includes('Frieza') ||
            prompt.includes('Majin Buu');

        const selectedSystemPrompt = isDragonBall ? DRAGON_BALL_SYSTEM_PROMPT : SYSTEM_PROMPT;
        const selectedNegativePrompt = isDragonBall ? DRAGON_BALL_NEGATIVE_PROMPT : NEGATIVE_PROMPT;

        console.log('=== Fusion Generation Request ===');
        console.log('User:', user.email);
        console.log('IP:', clientIP);
        console.log('VIP:', isVIP);
        console.log('Quota:', isVIP ? `${usedQuota}/10 (VIP)` : `${remainingQuota} Credits (Free)`);
        console.log('Content Type:', isDragonBall ? 'Dragon Ball' : 'Pokemon');
        console.log('User Prompt:', prompt);

        // 三层Prompt拼接（使用正确的 System Prompt）
        const fullPrompt = `${selectedSystemPrompt}

${prompt}`;

        console.log('\n=== Full Prompt to Fal.ai ===');
        console.log(fullPrompt);
        console.log('\n=== Negative Prompt ===');
        console.log(selectedNegativePrompt);

        // ============================================================================
        // Fal.ai API 调用（最优参数）
        // ============================================================================

        console.log('Calling Fal.ai...');
        const result: any = await fal.run("fal-ai/flux/dev", {
            input: {
                prompt: fullPrompt,
                negative_prompt: selectedNegativePrompt,
                image_size: "square_hd",     // 1024x1024
                num_inference_steps: 38,     // 最高质量和清晰度
                guidance_scale: 7.5,         // 强Prompt遵循度
                num_images: 1,
                enable_safety_checker: true,
            },
        });

        console.log('Generation Complete!');

        // 提取图片URL
        let imageUrl: string | undefined;
        if (result.data?.images?.[0]?.url) {
            imageUrl = result.data.images[0].url;
        } else if (result.images?.[0]?.url) {
            imageUrl = result.images[0].url;
        } else if (result.data?.image_url) {
            imageUrl = result.data.image_url;
        } else if (result.image_url) {
            imageUrl = result.image_url;
        }

        if (!imageUrl) {
            console.error('No image URL found in result:', result);
            throw new Error('No image URL in response');
        }

        console.log('Image URL:', imageUrl);
        console.log('Image URL:', imageUrl);

        // ============================================================================
        // 5️⃣ 扣费逻辑 (仅限免费用户)
        // ============================================================================
        if (!isVIP && customerProfile) {
            const COST_PER_GEN = 1;
            const { error: updateError } = await supabase
                .from("customers")
                .update({ credits: customerProfile.credits - COST_PER_GEN })
                .eq("id", customerProfile.id);

            if (updateError) {
                console.error("Failed to deduct credits:", updateError);
            } else {
                remainingQuota = customerProfile.credits - COST_PER_GEN;
                console.log(`Deducted ${COST_PER_GEN} credit. Remaining: ${remainingQuota}`);
            }
        }

        console.log('Quota/Credits info:', isVIP ? `VIP Used: ${usedQuota}` : `Credits Left: ${remainingQuota}`);

        // 返回结果（包含配额信息）
        return NextResponse.json({
            imageUrl: imageUrl,
            prompt: prompt,
            quota: {
                used: usedQuota,
                remaining: remainingQuota, // VIP: daily remaining; Free: credits remaining
                limit: limitQuota,
                isVIP: isVIP,
                type: isVIP ? 'daily_limit' : 'credits'
            }
        });

    } catch (error: any) {
        console.error('=== Generation Error ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);

        return NextResponse.json(
            { error: error.message || 'Generation failed' },
            { status: 500 }
        );
    }
}
