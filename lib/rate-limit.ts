import { Redis } from '@upstash/redis';

// 初始化 Redis（用于频率限制和配额）
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/**
 * IP 频率限制 - 每IP每分钟3次
 */
export async function checkIPRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:ip:${ip}`;
    const limit = 3;
    const window = 60; // 60秒

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, window);
    }

    return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
    };
}

/**
 * 用户每日配额 - 每用户每天3次
 */
export async function checkUserDailyQuota(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const key = `quota:user:${userId}:${today}`;
    const limit = 3;

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, 86400); // 24小时
    }

    return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        used: current,
    };
}

/**
 * VIP用户每日配额 - 每天10次
 */
export async function checkVIPUserDailyQuota(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
    const today = new Date().toISOString().split('T')[0];
    const key = `quota:vip:${userId}:${today}`;
    const limit = 10;

    const current = await redis.incr(key);

    if (current === 1) {
        await redis.expire(key, 86400);
    }

    return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        used: current,
    };
}

/**
 * 获取客户端IP地址
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIP) {
        return realIP;
    }

    return 'unknown';
}
