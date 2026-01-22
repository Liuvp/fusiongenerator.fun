import { Redis } from '@upstash/redis';

// 开发环境使用内存缓存（避免Redis连接问题）
const isDev = process.env.NODE_ENV === 'development';

// 内存缓存（仅开发环境）
const memoryCache = new Map<string, { value: number; expires: number }>();

// 初始化 Redis（生产环境）
// 检查是否配置了 Upstash Redis
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedisConfig = !!redisUrl && !!redisToken;

// 仅在非开发环境且配置存在时初始化 Redis
const redis = (!isDev && hasRedisConfig) ? new Redis({
    url: redisUrl!,
    token: redisToken!,
}) : null;

if (!isDev && !hasRedisConfig) {
    console.warn('[Rate Limit] Redis configuration missing in production, falling back to memory cache. (UPSTASH_REDIS_REST_URL/TOKEN not set)');
}

/**
 * IP 频率限制 - 每IP每分钟3次
 */
export async function checkIPRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:ip:${ip}`;
    const limit = 3;
    const window = 60000; // 60秒（毫秒）

    if (!redis) {
        // 开发环境：使用内存缓存
        const now = Date.now();
        const cached = memoryCache.get(key);

        if (!cached || cached.expires < now) {
            memoryCache.set(key, { value: 1, expires: now + window });
            return { allowed: true, remaining: limit - 1 };
        }

        const newValue = cached.value + 1;
        memoryCache.set(key, { value: newValue, expires: cached.expires });

        return {
            allowed: newValue <= limit,
            remaining: Math.max(0, limit - newValue),
        };
    }

    // 生产环境：使用Redis
    const current = await redis!.incr(key);

    if (current === 1) {
        await redis!.expire(key, 60);
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
    const today = new Date().toISOString().split('T')[0];
    const key = `quota:user:${userId}:${today}`;
    const limit = 3;

    if (!redis) {
        // 开发环境：使用内存缓存
        const cached = memoryCache.get(key);
        const current = cached ? cached.value + 1 : 1;
        memoryCache.set(key, { value: current, expires: Date.now() + 86400000 });

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    }

    // 生产环境：使用Redis
    const current = await redis!.incr(key);

    if (current === 1) {
        await redis!.expire(key, 86400);
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

    if (!redis) {
        // 开发环境：使用内存缓存
        const cached = memoryCache.get(key);
        const current = cached ? cached.value + 1 : 1;
        memoryCache.set(key, { value: current, expires: Date.now() + 86400000 });

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    }

    // 生产环境：使用Redis
    const current = await redis!.incr(key);

    if (current === 1) {
        await redis!.expire(key, 86400);
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
