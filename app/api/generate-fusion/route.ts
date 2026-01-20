import { NextRequest, NextResponse } from 'next/server';
import * as fal from "@fal-ai/serverless-client";
import { SYSTEM_PROMPT, NEGATIVE_PROMPT } from '@/lib/prompt-builder';
import { checkIPRateLimit, checkUserDailyQuota, checkVIPUserDailyQuota, getClientIP } from '@/lib/rate-limit';
import { createClient } from '@/utils/supabase/server';

// 配置 Fal.ai
fal.config({
    credentials: process.env.FAL_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // ============================================================================
        // 1️⃣ IP 频率限制（每IP每分钟3次）
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
        // 2️⃣ 用户认证检查（必须登录）
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
        // 3️⃣ 用户每日配额检查
        // ============================================================================

        // 检查用户是否是VIP（订阅用户）
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        const isVIP = !!subscription;

        // 根据VIP状态检查不同配额
        const quota = isVIP
            ? await checkVIPUserDailyQuota(user.id)
            : await checkUserDailyQuota(user.id);

        if (!quota.allowed) {
            const limitMessage = isVIP
                ? 'Daily limit reached (10/day for VIP users).'
                : 'Daily limit reached (3/day for free users). Upgrade to VIP for 10 generations per day!';

            return NextResponse.json(
                {
                    error: limitMessage,
                    used: quota.used,
                    limit: isVIP ? 10 : 3,
                    upgradeUrl: '/pricing',
                },
                { status: 429 }
            );
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

        console.log('=== Fusion Generation Request ===');
        console.log('User:', user.email);
        console.log('IP:', clientIP);
        console.log('VIP:', isVIP);
        console.log('Quota:', `${quota.used}/${isVIP ? 10 : 3}`);
        console.log('User Prompt:', prompt);

        // 三层Prompt拼接
        const fullPrompt = `${SYSTEM_PROMPT}

${prompt}`;

        console.log('\n=== Full Prompt to Fal.ai ===');
        console.log(fullPrompt);
        console.log('\n=== Negative Prompt ===');
        console.log(NEGATIVE_PROMPT);

        // ============================================================================
        // Fal.ai API 调用（最优参数）
        // ============================================================================

        console.log('Calling Fal.ai...');
        const result: any = await fal.run("fal-ai/flux/dev", {
            input: {
                prompt: fullPrompt,
                negative_prompt: NEGATIVE_PROMPT,
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
        console.log('Quota used:', quota.used, '/', isVIP ? 10 : 3);

        // 返回结果（包含配额信息）
        return NextResponse.json({
            imageUrl: imageUrl,
            prompt: prompt,
            quota: {
                used: quota.used,
                remaining: quota.remaining,
                limit: isVIP ? 10 : 3,
                isVIP: isVIP,
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
