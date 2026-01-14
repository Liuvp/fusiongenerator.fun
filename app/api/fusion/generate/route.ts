
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Mock Intefaces
interface FusionRequest {
    image1: string; // Base64 or URL
    image2: string; // Base64 or URL
    fusionStrength?: number;
    style?: string;
    series?: string;
}

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. 获取客户端 IP (用于未登录限制)
        const forwarded = req.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "127.0.0.1";

        let canGenerate = false;
        let limitReached = false;
        let userPlan = "free";

        // 2. 权限校验逻辑
        if (user) {
            // 已登录用户：检查订阅状态
            const { data: subscription } = await supabase
                .from("subscriptions")
                .select("status, current_period_end")
                .eq("user_id", user.id)
                .in("status", ["active", "trialing"])
                .gt("current_period_end", new Date().toISOString())
                .single();

            const isPro = !!subscription;
            userPlan = isPro ? "pro" : "free";

            if (isPro) {
                // Pro 用户：检查 Fair Use (每日 100 张)
                // TODO: 这里即使是 Pro 也建议稍微记一下数，防止被刷
                // 为了快速上线，暂定 Pro 无强限制，或给一个很大的阈值
                canGenerate = true;
            } else {
                // 免费登录用户：检查每日配额 (使用 quantity 字段或单独的 usage 表)
                // 简单起见，这里复用 check_ip_rate_limit 或新建逻辑
                // 暂时给免费登录用户 5 次
                const { data: allow } = await supabase.rpc("check_ip_rate_limit", { p_client_ip: user.id }); // Hack: 传 user_id 当 IP 用
                if (allow) canGenerate = true;
                else limitReached = true;
            }

        } else {
            // 未登录用户：基于 IP 限制 (每日 3 次)
            const { data: allow } = await supabase.rpc("check_ip_rate_limit", { p_client_ip: ip });
            if (allow) canGenerate = true;
            else limitReached = true;
        }

        if (limitReached) {
            return NextResponse.json(
                { error: "Daily limit reached. Upgrade to Pro for unlimited fusions." },
                { status: 429 }
            );
        }

        // 3. (Mock) 生成逻辑
        // 实际对接时，这里会调用 Replicate / Midjourney API
        // 现在返回一个假的 loading / result

        // 模拟延迟
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock Result
        // 返回一个静态图作为示例
        const mockResultUrl = "https://fusiongenerator.fun/gallery/AI-Fusion-Generator-Preview.png";

        return NextResponse.json({
            success: true,
            imageUrl: mockResultUrl,
            remainingCredits: userPlan === 'free' ? 2 : 999, // Mock data
            plan: userPlan
        });

    } catch (error: any) {
        console.error("Fusion API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
