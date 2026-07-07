import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET - Fetch user's fusion history
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const favoritesOnly = searchParams.get('favorites') === 'true';
    const fusionType = searchParams.get('type') || null;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('user_generations')
      .select('id, fusion_type, char1_id, char1_name, char2_id, char2_name, style_id, style_name, image_url, is_favorite, created_at', { count: 'exact' })
      .eq('user_id', user.id);

    if (favoritesOnly) {
      query = query.eq('is_favorite', true);
    }

    if (fusionType) {
      query = query.eq('fusion_type', fusionType);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Failed to fetch generation history:', error);
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json({
      generations: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      }
    });
  } catch (error) {
    console.error('Generation history API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
