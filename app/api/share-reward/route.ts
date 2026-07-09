import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getClientIP } from '@/lib/rate-limit';

// POST - Grant +1 credit for sharing (anonymous users only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Only grant to anonymous users
    if (user) {
      return NextResponse.json({ success: true, message: 'Logged-in users already have credits' });
    }

    const body = await request.json();
    const { platform } = body;

    if (!platform || !['twitter', 'share'].includes(platform)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 });
    }

    const clientIP = getClientIP(request);

    // Rate limit: 1 share reward per day per IP (Redis-backed, gracefully degrade if unavailable)
    let shareKey = '';
    let skipRedis = false;
    try {
      const { Redis } = await import('@upstash/redis');
      const redis = Redis.fromEnv();

      const today = new Date().toISOString().split('T')[0];
      shareKey = `share_reward:${clientIP}:${today}`;
      const shareCount = await redis.incr(shareKey);

      if (shareCount === 1) {
        await redis.expire(shareKey, 60 * 60 * 24);
      }

      if (shareCount > 1) {
        return NextResponse.json({
          success: true,
          message: 'Share reward already claimed today'
        });
      }

      // Grant +1 anonymous credit (check current value first to prevent negative)
      const anonKey = `fusion:anonymous:${clientIP}`;
      const current = await redis.get<number>(anonKey);
      const currentVal = current ? parseInt(String(current)) : 0;

      if (currentVal <= 0) {
        await redis.set(anonKey, 1, { ex: 60 * 60 * 24 * 30 });
      } else {
        await redis.incr(anonKey);
      }
    } catch (redisError) {
      console.warn('⚠️ Redis unavailable for share-reward, skipping:', redisError);
      skipRedis = true;
    }

    if (!skipRedis) {
      return NextResponse.json({
        success: true,
        message: '+1 free fusion credit unlocked!',
        platform
      });
    }

    // Redis unavailable — still allow the share, just can't track/grant
    return NextResponse.json({
      success: true,
      message: 'Thanks for sharing!',
      platform
    });
  } catch (error) {
    console.error('Share reward API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
