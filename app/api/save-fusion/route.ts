import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from '@/utils/supabase/service-role';

// POST - Save a fusion to user's history
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fusionType, char1Id, char1Name, char2Id, char2Name, styleId, styleName, imageUrl } = body;

    if (!char1Id || !char2Id || !imageUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const adminClient = createServiceRoleClient();

    const { data, error } = await adminClient
      .from('user_generations')
      .insert({
        user_id: user.id,
        fusion_type: fusionType || 'dragon_ball',
        char1_id: char1Id,
        char1_name: char1Name || char1Id,
        char2_id: char2Id,
        char2_name: char2Name || char2Id,
        style_id: styleId || null,
        style_name: styleName || null,
        image_url: imageUrl,
        is_favorite: false,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('Failed to save fusion:', error);
      return NextResponse.json({ error: 'Failed to save fusion' }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data.id, createdAt: data.created_at });
  } catch (error) {
    console.error('Save fusion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Toggle favorite status
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isFavorite } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing generation id' }, { status: 400 });
    }

    const adminClient = createServiceRoleClient();

    const { error } = await adminClient
      .from('user_generations')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update favorite:', error);
      return NextResponse.json({ error: 'Failed to update favorite' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update favorite API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Remove a generation from history
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing generation id' }, { status: 400 });
    }

    const adminClient = createServiceRoleClient();

    const { error } = await adminClient
      .from('user_generations')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete generation:', error);
      return NextResponse.json({ error: 'Failed to delete generation' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete generation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
