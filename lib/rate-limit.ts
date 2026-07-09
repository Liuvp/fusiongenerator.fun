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
 * Pro 用户每月配额 - 每月300次
 * 按自然月计数，key 在月底自动过期。
 */
export async function checkProUserMonthlyQuota(userId: string): Promise<{ allowed: boolean; remaining: number; used: number }> {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const key = `quota:pro:${userId}:${ym}`;
    const limit = 300;

    // 计算到月底的剩余秒数，作为 Redis key 的过期时间（自然月滚动）
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const ttlSeconds = Math.ceil((endOfMonth.getTime() - now.getTime()) / 1000);

    if (!redis) {
        // 开发环境：使用内存缓存
        const cached = memoryCache.get(key);
        const current = cached ? cached.value + 1 : 1;
        memoryCache.set(key, { value: current, expires: Date.now() + ttlSeconds * 1000 });

        return {
            allowed: current <= limit,
            remaining: Math.max(0, limit - current),
            used: current,
        };
    }

    // 生产环境：使用Redis
    const current = await redis!.incr(key);

    if (current === 1) {
        await redis!.expire(key, ttlSeconds);
    }

    return {
        allowed: current <= limit,
        remaining: Math.max(0, limit - current),
        used: current,
    };
}

/**
 * 获取客户端IP地址 (防伪造)
 *
 * Priority:
 * 1. x-vercel-forwarded-for  — Vercel 专用头，不可伪造
 * 2. x-real-ip               — 反向代理设置（nginx等），可信
 * 3. x-forwarded-for         — 取最后一个（链尾 = 真实客户端IP）
 * 4. Hash fallback           — 无法获取IP时，基于 UA+Accept 生成稳定指纹
 */
export function getClientIP(request: Request): string {
    // 1. Vercel 专用安全头（不可伪造）
    const vercelForwarded = request.headers.get('x-vercel-forwarded-for');
    if (vercelForwarded) {
        return `v:${vercelForwarded.split(',')[0].trim()}`;
    }

    // 2. 反向代理设置的真实IP
    const realIP = request.headers.get('x-real-ip');
    if (realIP && realIP.trim()) {
        return `r:${realIP.trim()}`;
    }

    // 3. x-forwarded-for — 取链尾（最右侧 = 客户端原始IP）
    //    客户端可伪造第一个条目，但 Vercel/代理会在末尾追加真实IP
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        const parts = forwarded.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length > 0) {
            return `f:${parts[parts.length - 1]}`;
        }
    }

    // 4. Hash fallback: 基于 UA + Accept 生成稳定指纹，防止完全绕过
    const ua = request.headers.get('user-agent') || '';
    const accept = request.headers.get('accept') || '';
    const raw = `${ua}|${accept}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        const chr = raw.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return `h:${Math.abs(hash).toString(36)}`;
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
        const val = await redis.get<number>(key);
        current = val ? parseInt(String(val)) : 0;
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}

/**
 * 只读检查：获取 匿名用户(Fusion) 剩余配额 (3次)
 * Key: fusion:anonymous:{ip}
 */
export async function getAnonymousRateLimit(ip: string): Promise<{ value: number; limit: number; remaining: number }> {
    const key = `fusion:anonymous:${ip}`;
    const limit = 2;

    let current = 0;
    if (!redis) {
        // 本地无 Redis 时的模拟（因为 fusion 逻辑主要依赖 redis，这里做个兼容）
        current = 0;
    } else {
        const val = await redis.get<number>(key);
        current = val ? parseInt(String(val)) : 0;
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}

/**
 * 只读检查：Pro 用户 (不扣减)，按自然月计数
 */
export async function getProQuotaReadOnly(userId: string): Promise<{ value: number; limit: number; remaining: number }> {
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const key = `quota:pro:${userId}:${ym}`;
    const limit = 300;

    let current = 0;
    if (!redis) {
        const cached = memoryCache.get(key);
        current = cached ? cached.value : 0;
    } else {
        const val = await redis.get<number>(key);
        current = val ? parseInt(String(val)) : 0;
    }

    return {
        value: current,
        limit: limit,
        remaining: Math.max(0, limit - current)
    };
}
