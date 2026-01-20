import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkUserDailyQuota, checkVIPUserDailyQuota } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    try {
        // 验证用户登录
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        // 检查用户是否是VIP
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .single();

        const isVIP = !!subscription;

        // 获取配额（不增加计数，仅查询）
        // 由于我们的函数会自动incr，这里需要先获取当前值再减1
        const quota = isVIP
            ? await checkVIPUserDailyQuota(user.id)
            : await checkUserDailyQuota(user.id);

        // 返回配额信息（需要减去刚才查询时增加的1次）
        return NextResponse.json({
            quota: {
                used: Math.max(0, quota.used - 1), // 减去查询时增加的
                remaining: Math.min(isVIP ? 10 : 3, quota.remaining + 1), // 加回来
                limit: isVIP ? 10 : 3,
                isVIP: isVIP,
            }
        });

    } catch (error: any) {
        console.error('Get quota error:', error);
        return NextResponse.json(
            { error: 'Failed to get quota' },
            { status: 500 }
        );
    }
}
