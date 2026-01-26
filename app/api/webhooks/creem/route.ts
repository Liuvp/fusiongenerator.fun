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
    console.log("🔍 [DEBUG] Creem Webhook Payload:", JSON.stringify(event, null, 2));

    // Fix: Creem uses 'eventType', not 'type'
    const eventType = event.eventType;
    console.log("✅ Creem Webhook Type:", eventType);

    /** 4️⃣ 处理订阅类事件 */
    switch (eventType) {
      case "subscription.active":
      case "subscription.trialing":
      case "subscription.updated":
      case "subscription.canceled": {
        const subscription = event.object;

        const userId = subscription?.metadata?.user_id;
        if (!userId) {
          console.warn("⚠️ Missing user_id in metadata");
          break;
        }

        // Creem sends ISO string in 'current_period_end_date'
        const rawEndDate = subscription.current_period_end_date || subscription.current_period_end;
        let currentPeriodEnd = null;

        if (rawEndDate) {
          // If number, it's a timestamp (seconds)
          if (typeof rawEndDate === 'number') {
            currentPeriodEnd = new Date(rawEndDate * 1000).toISOString();
          } else {
            // If string, assume ISO format from Creem
            currentPeriodEnd = new Date(rawEndDate).toISOString();
          }
        }

        const { error } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: userId,
              status: subscription.status,
              current_period_end: currentPeriodEnd,
              creem_subscription_id: subscription.id,
              creem_product_id: subscription.product?.id || subscription.product_id,
              // cancel_at_period_end column missing in DB schema, removing.
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

        // Grant credits for new active subscriptions
        if (eventType === 'subscription.active' && subscription.status === 'active') {
          try {
            const { data: customer } = await supabase
              .from('customers')
              .select('credits')
              .eq('user_id', userId)
              .single();

            const currentCredits = customer?.credits || 0;

            // Determine grant amount based on Product ID (Monthly vs Yearly)
            let grantAmount = 300; // Default Monthly
            const pid = subscription.product?.id || subscription.product_id;
            const monthlyId = process.env.CREEM_PRODUCT_ID_MONTHLY;
            const yearlyId = process.env.CREEM_PRODUCT_ID_YEARLY;

            if (yearlyId && pid === yearlyId) {
              grantAmount = 3600;
              console.log("📅 Yearly subscription detected. Plan: 3600 credits.");
            } else {
              // Assume Monthly or fallback
              grantAmount = 300;
              console.log(`📅 Monthly subscription detected (PID: ${pid}). Plan: 300 credits.`);
            }

            if (customer) {
              const { error: creditError } = await supabase
                .from('customers')
                .update({
                  credits: currentCredits + grantAmount,
                  creem_customer_id: subscription.customer?.id || subscription.customer
                })
                .eq('user_id', userId);
              if (creditError) console.error("Failed to update credits:", creditError);
              else console.log(`✅ Updated credits to ${currentCredits + grantAmount} for user ${userId}`);
            } else {
              const { error: creditError } = await supabase
                .from('customers')
                .insert({
                  user_id: userId,
                  credits: grantAmount,
                  creem_customer_id: subscription.customer?.id || subscription.customer
                });
              if (creditError) console.error("Failed to insert credits:", creditError);
              else console.log(`✅ Inserted ${grantAmount} credits for new customer ${userId}`);
            }
          } catch (e) {
            console.error("Credit grant error processing:", e);
          }
        }

        console.log(`✅ Subscription synced for user ${userId}`);
        break;
      }

      case "checkout.captured":
      case "checkout.completed": // Based on log "eventType": "checkout.completed"
      case "invoice.paid": {
        const payload = event.object;
        // Check if it is the Refill Product
        const refillId = process.env.CREEM_PRODUCT_ID_REFILL || "prod_2u5vQK9gqpiGF8mjKsZksb";

        const currentProductId = payload.product?.id || payload.product_id;

        // Log for debugging
        console.log(`💰 Payment Event: ${eventType}, Product: ${currentProductId}`);

        if (currentProductId === refillId) {
          const userId = payload.metadata?.user_id || payload.customer?.metadata?.user_id;
          if (userId) {
            const { data: customer } = await supabase.from('customers').select('credits').eq('user_id', userId).single();
            const current = customer?.credits || 0;

            // Grant +100
            const creemCustId = payload.customer?.id || payload.customer;

            if (customer) {
              await supabase.from('customers').update({
                credits: current + 100,
                creem_customer_id: creemCustId
              }).eq('user_id', userId);
              console.log(`✅ Updated Refill Credits (+100) and Customer ID for ${userId}`);
            } else {
              await supabase.from('customers').insert({
                user_id: userId,
                credits: 100,
                creem_customer_id: creemCustId
              });
              console.log(`✅ Inserted Refill Credits (100) for ${userId}`);
            }
          } else {
            console.warn("⚠️ Refill payment received but no user_id found in metadata");
          }
        }
        break;
      }

      /** 5️⃣ 其他事件暂不处理 */
      default:
        console.log("ℹ️ Unhandled event type:", eventType);
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
