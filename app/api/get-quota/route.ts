import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkUserDailyQuota, checkVIPUserDailyQuota } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // 1. 尝试获取用户（允许失败，失败即为匿名）
        let user = null;
        try {
            const { data: { user: u }, error } = await supabase.auth.getUser();
            if (u && !error) user = u;
        } catch (e) {
            // ignore auth error
        }

        // 2. 匿名用户逻辑
        if (!user) {
            const { getClientIP, getAnonymousRateLimit } = await import('@/lib/rate-limit');
            const ip = getClientIP(request) || "127.0.0.1";

            const limitInfo = await getAnonymousRateLimit(ip);

            return NextResponse.json({
                quota: {
                    used: limitInfo.value,
                    remaining: limitInfo.remaining,
                    limit: limitInfo.limit,
                    isVIP: false,
                    type: 'anonymous'
                }
            });
        }

        // 3. 登录用户逻辑 (VIP 或 积分)

        // 检查 VIP
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('user_id', user.id)
            .in('status', ['active', 'trialing'])
            .maybeSingle();

        const isVIP = !!subscription;

        if (isVIP) {
            // VIP: 查 Redis (只读)
            const { getVIPQuotaReadOnly } = await import('@/lib/rate-limit');
            const vipQuota = await getVIPQuotaReadOnly(user.id);

            return NextResponse.json({
                quota: {
                    used: vipQuota.value,
                    remaining: vipQuota.remaining,
                    limit: vipQuota.limit,
                    isVIP: true,
                    type: 'daily_limit'
                }
            });
        } else {
            // Free User: 查 DB 积分
            const { data: customer } = await supabase
                .from("customers")
                .select("credits")
                .eq("user_id", user.id)
                .single();

            const credits = customer?.credits || 0; // 如果没记录就是0（或者前端逻辑是自动创建的话这里可能不同步，但查询不应该创建）

            return NextResponse.json({
                quota: {
                    used: 0, // 积分制没有“今日已用”的概念，或者不好统计
                    remaining: credits,
                    limit: 0, // 无上限
                    isVIP: false,
                    type: 'credits'
                }
            });
        }

    } catch (error: any) {
        console.error('Get quota error:', error);
        return NextResponse.json(
            { error: 'Failed to get quota' },
            { status: 500 }
        );
    }
}
