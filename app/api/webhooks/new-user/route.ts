import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // 1. 安全验证 (简单的 Token 验证，防止恶意调用)
    // 你需要在 Supabase Webhook Header 中配置 x-api-key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = await request.json();
        const { record } = payload; // Supabase webhook payload structure
        const email = record?.email;
        const id = record?.id;

        if (!email) {
            return NextResponse.json({ error: 'No email found' }, { status: 400 });
        }

        // 1.5 Give Free Credits (2 Credits)
        try {
            const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
            const supabase = createServiceRoleClient();

            // Allow insert to fail silently if record exists (although for new user it shouldn't)
            // Using upsert or strict insert
            // Check if row already exists (e.g., subscription webhook created it with creem_customer_id)
            const { data: existing } = await supabase
                .from('customers')
                .select('id, credits')
                .eq('user_id', id)
                .maybeSingle();

            if (existing) {
                // Row exists — only grant 2 credits if still at 0 (subscription webhook edge case)
                if (existing.credits === 0) {
                    await supabase
                        .from('customers')
                        .update({ credits: 2, email: email })
                        .eq('user_id', id);
                } else {
                    // Credits already set (normal flow or refill) — just ensure email is saved
                    await supabase
                        .from('customers')
                        .update({ email: email })
                        .eq('user_id', id);
                }
            } else {
                // No row — create with 2 credits + email
                const { error: dbError } = await supabase
                    .from('customers')
                    .insert({ user_id: id, credits: 2, email: email });

                if (dbError) {
                    console.error('Failed to create customer record:', dbError);
                }
            }
        } catch (creditError) {
            console.error('Credit Grant Error:', creditError);
            // Non-blocking, continue to send email
        }

        // 2. Send welcome email to the new user
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            console.error('RESEND_API_KEY is missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'FusionGenerator <hello@fusiongenerator.fun>',
                to: email,
                subject: 'Welcome to FusionGenerator.fun!',
                html: `
          <h1>Welcome to FusionGenerator!</h1>
          <p>You've received <strong>2 free fusion credits</strong> to get started.</p>
          <p>Create your first Dragon Ball fusion now:</p>
          <p><a href="https://fusiongenerator.fun/dragon-ball" style="display:inline-block;padding:12px 24px;background:#7c3aed;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Start Fusing</a></p>
          <p style="margin-top:24px;color:#666;font-size:14px;">Need more? <a href="https://fusiongenerator.fun/pricing">Upgrade to Pro</a> for 300 generations/month, HD quality, and no watermark.</p>
        `,
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            console.error('Resend API Error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
