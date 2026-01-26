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

        // 1.5 Give Free Credits (1 Credit)
        try {
            const { createServiceRoleClient } = await import('@/utils/supabase/service-role');
            const supabase = createServiceRoleClient();

            // Allow insert to fail silently if record exists (although for new user it shouldn't)
            // Using upsert or strict insert
            const { error: dbError } = await supabase
                .from('customers')
                .upsert(
                    { user_id: id, credits: 1 },
                    { onConflict: 'user_id', ignoreDuplicates: true } // If exists, keep existing (prevent overwrite if race condition)
                );

            if (dbError) {
                console.error('Failed to grant free credits:', dbError);
            } else {
                console.log(`Granted 1 free credit to new user: ${email}`);
            }
        } catch (creditError) {
            console.error('Credit Grant Error:', creditError);
            // Non-blocking, continue to send email
        }

        // 2. 调用 Resend API 发送邮件 (使用原生 fetch，零依赖)
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
                from: 'FusionGenerator <onboarding@resend.dev>', // 这里必须是你 Resend 验证过的域名，或者是测试域名
                to: process.env.ADMIN_EMAIL || 'YOUR_EMAIL@example.com', // 管理员邮箱
                subject: '🎉 New User Signup!',
                html: `
          <h1>New User Registered!</h1>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>User ID:</strong> ${id}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
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
