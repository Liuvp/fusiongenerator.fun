import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

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

    // Rate limit: check if this IP already claimed share reward today
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIP = forwarded?.split(',')[0]?.trim() || '127.0.0.1';

    const { Redis } = await import('@upstash/redis');
    const redis = Redis.fromEnv();

    const today = new Date().toISOString().split('T')[0];
    const shareKey = `share_reward:${clientIP}:${today}`;
    const shareCount = await redis.incr(shareKey);

    if (shareCount === 1) {
      await redis.expire(shareKey, 60 * 60 * 24);
    }

    // Limit: 1 share reward per day per IP
    if (shareCount > 1) {
      return NextResponse.json({
        success: true,
        message: 'Share reward already claimed today'
      });
    }

    // Grant +1 anonymous credit
    const anonKey = `fusion:anonymous:${clientIP}`;
    await redis.decr(anonKey).catch(() => {
      // If key doesn't exist, set it to 1 (they have 1 free use)
      redis.set(anonKey, 1, { ex: 60 * 60 * 24 * 30 });
    });

    return NextResponse.json({
      success: true,
      message: '+1 free fusion credit unlocked!',
      platform
    });
  } catch (error) {
    console.error('Share reward API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
