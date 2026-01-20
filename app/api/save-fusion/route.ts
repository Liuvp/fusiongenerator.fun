import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
    try {
        // 验证用户登录
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { imageUrl, prompt, pokemon1Name, pokemon2Name, styleName } = await request.json();

        // 保存到数据库
        const { data, error } = await supabase
            .from('fusions')
            .insert([
                {
                    user_id: user.id,
                    image_url: imageUrl,
                    prompt: prompt,
                    pokemon_1: pokemon1Name,
                    pokemon_2: pokemon2Name,
                    style: styleName,
                    created_at: new Date().toISOString(),
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Save fusion error:', error);
            return NextResponse.json(
                { error: 'Failed to save fusion' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, fusion: data });

    } catch (error: any) {
        console.error('Save fusion error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to save fusion' },
            { status: 500 }
        );
    }
}
