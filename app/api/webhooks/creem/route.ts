export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

/**
 * Supabase service-role client
 * ⚠️ 仅可用于服务端（Webhook 场景是正确的）
 */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    /** 1️⃣ 读取原始 body（必须是 text，否则签名会失效） */
    const body = await req.text();
    const signature = req.headers.get("creem-signature");

    if (!signature) {
      return new Response("Missing creem-signature", { status: 400 });
    }

    /** 2️⃣ 校验 webhook 签名 */
    const secret = process.env.CREEM_WEBHOOK_SECRET;
    if (secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body, "utf8")
        .digest("hex");

      // 安全对比（防 timing attack）
      const isValid =
        signature.length === expectedSignature.length &&
        crypto.timingSafeEqual(
          Buffer.from(signature),
          Buffer.from(expectedSignature)
        );

      if (!isValid) {
        console.error("❌ Invalid Creem webhook signature");
        return new Response("Invalid signature", { status: 401 });
      }
    }

    /** 3️⃣ 解析事件 */
    const event = JSON.parse(body);
    console.log("✅ Creem Webhook:", event.type);

    /** 4️⃣ 处理订阅类事件 */
    switch (event.type) {
      case "subscription.active":
      case "subscription.trialing":
      case "subscription.updated":
      case "subscription.canceled": {
        const subscription = event.data;

        const userId = subscription?.metadata?.user_id;
        if (!userId) {
          console.warn("⚠️ Missing user_id in metadata");
          break;
        }

        const currentPeriodEnd = subscription.current_period_end
          ? new Date(subscription.current_period_end * 1000).toISOString()
          : null;

        const { error } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              status: subscription.status,
              current_period_end: currentPeriodEnd,
              creem_subscription_id: subscription.id,
              creem_product_id: subscription.product_id,
              cancel_at_period_end:
                subscription.cancel_at_period_end ?? false,
              updated_at: new Date().toISOString(),
            },
            {
              // ⚠️ 确保 user_id 在表中是 UNIQUE
              onConflict: "user_id",
            }
          );

        if (error) {
          console.error("❌ Supabase upsert error:", error);
          return new Response("Database error", { status: 500 });
        }

        console.log(`✅ Subscription synced for user ${userId}`);
        break;
      }

      /** 5️⃣ 其他事件暂不处理 */
      default:
        console.log("ℹ️ Unhandled event type:", event.type);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err);
    return new Response(`Webhook error: ${err.message}`, {
      status: 400,
    });
  }
}
