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

// 只要配置存在，就初始化 Redis（支持本地测试）
const redis = hasRedisConfig ? new Redis({
    url: redisUrl!,
    token: redisToken!,
}) : null;

if (!hasRedisConfig) {
    if (!isDev) {
        console.warn('[Rate Limit] Redis configuration missing in production, falling back to memory cache.');
    } else {
        console.log('[Rate Limit] Running with Memory Cache (Redis not configured).');
    }
} else {
    if (isDev) console.log('[Rate Limit] Connected to Upstash Redis in Development.');
}

/**
 * IP 频率限制 - 每IP每分钟3次
 */
export async function checkIPRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
    const key = `ratelimit:ip:${ip}`;
    const limit = 3;
    const window = 60000; // 60秒（毫秒）

    const useMemory = () => {
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
    };

    if (!redis) return useMemory();

    try {
        const current = await redis.incr(key);
        if (current === 1) await redis.expire(key, 60);

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
        };
    } catch {
        return useMemory();
    }
}

/**
 * 用户每日配额 - 每用户每天3次
 */
export async function checkUserDailyQuota(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
    const today = new Date().toISOString().split('T')[0];
    const key = `quota:user:${userId}:${today}`;
    const limit = 3;

    const useMemory = () => {
        const cached = memoryCache.get(key);
        const current = cached ? cached.value + 1 : 1;
        memoryCache.set(key, { value: current, expires: Date.now() + 86400000 });

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    };

    if (!redis) return useMemory();

    try {
        const current = await redis.incr(key);
        if (current === 1) await redis.expire(key, 86400);

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    } catch {
        return useMemory();
    }
}

/**
 * VIP用户每日配额 - 每天10次
 */
export async function checkVIPUserDailyQuota(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
    const today = new Date().toISOString().split('T')[0];
    const key = `quota:vip:${userId}:${today}`;
    const limit = 10;

    const useMemory = () => {
        const cached = memoryCache.get(key);
        const current = cached ? cached.value + 1 : 1;
        memoryCache.set(key, { value: current, expires: Date.now() + 86400000 });

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    };

    if (!redis) return useMemory();

    try {
        const current = await redis.incr(key);
        if (current === 1) await redis.expire(key, 86400);

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    } catch {
        return useMemory();
    }
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

/**
 * 只读检查：获取 IP 剩余配额 (不扣减)
 */
export async function getIPRateLimit(ip: string): Promise<{ value: number; limit: number; remaining: number }> {
    const key = `ratelimit:ip:${ip}`;
    const limit = 3;

    let current = 0;
    if (!redis) {
        const cached = memoryCache.get(key);
        current = cached ? cached.value : 0;
    } else {
        try {
            const val = await redis.get<number>(key);
            current = val ? parseInt(String(val)) : 0;
        } catch {
            const cached = memoryCache.get(key);
            current = cached ? cached.value : 0;
        }
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}

/**
 * 只读检查：获取 匿名用户(Fusion) 剩余配额 (1次)
 * Key: fusion:anonymous:{ip}
 */
export async function getAnonymousRateLimit(ip: string): Promise<{ value: number; limit: number; remaining: number }> {
    const key = `fusion:anonymous:${ip}`;
    const limit = 1;

    let current = 0;
    if (!redis) {
        // 本地无 Redis 时的模拟（因为 fusion 逻辑主要依赖 redis，这里做个兼容）
        current = 0;
    } else {
        try {
            const val = await redis.get<number>(key);
            current = val ? parseInt(String(val)) : 0;
        } catch {
            current = 0;
        }
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}

/**
 * 只读检查：VIP 用户 (不扣减)
 */
export async function getVIPQuotaReadOnly(userId: string): Promise<{ value: number; limit: number; remaining: number }> {
    const today = new Date().toISOString().split('T')[0];
    const key = `quota:vip:${userId}:${today}`;
    const limit = 10;

    let current = 0;
    if (!redis) {
        const cached = memoryCache.get(key);
        current = cached ? cached.value : 0;
    } else {
        try {
            const val = await redis.get<number>(key);
            current = val ? parseInt(String(val)) : 0;
        } catch {
            const cached = memoryCache.get(key);
            current = cached ? cached.value : 0;
        }
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}
