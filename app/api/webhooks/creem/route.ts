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
    if (!secret) {
      console.error("❌ CREEM_WEBHOOK_SECRET not configured — refusing all webhooks");
      return new Response("Server misconfiguration: webhook secret missing", { status: 500 });
    }

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

    /** 3️⃣ 解析事件 */
    const event = JSON.parse(body);

    // Fix: Creem uses 'eventType', not 'type'
    const eventType = event.eventType;

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

        // ⚠️ DO NOT grant DB credits on subscription.active
        // Monthly quota is managed by Redis (quota:pro:{userId}:{YYYY-MM}).
        // Granting 300 credits here would be orphaned — VIP never consumes DB credits,
        // and when subscription expires, user would inherit them as free credits.
        // Try update first (safe, no overwrite). If row doesn't exist, upsert with credits: 0.
        // New-user webhook will grant 2 free credits if it finds credits=0.
        if (eventType === 'subscription.active' && subscription.status === 'active') {
          const creemCustId = subscription.customer?.id || subscription.customer;
          if (creemCustId) {
            const { data: existing } = await supabase
              .from('customers')
              .update({ creem_customer_id: creemCustId })
              .eq('user_id', userId)
              .select('id')
              .maybeSingle();

            if (!existing) {
              // Row doesn't exist — create with credits: 0 (new-user webhook will grant 2 later)
              await supabase
                .from('customers')
                .upsert(
                  { user_id: userId, creem_customer_id: creemCustId, credits: 0 },
                  { onConflict: "user_id" }
                );
            }
          }
        }

        console.log(`✅ Subscription synced for user ${userId}`);
        break;
      }

      case "checkout.captured":
      case "checkout.completed":
      case "invoice.paid": {
        const payload = event.object;
        const refillId = process.env.CREEM_PRODUCT_ID_REFILL;
        if (!refillId) {
          console.error("CREEM_PRODUCT_ID_REFILL not configured");
          break;
        }

        const currentProductId = payload.product?.id || payload.product_id;

        if (currentProductId === refillId) {
          const userId = payload.metadata?.user_id || payload.customer?.metadata?.user_id;
          // checkout_id groups events from the same purchase (checkout.completed + invoice.paid share this)
          const checkoutId = payload.checkout_id || payload.id;

          if (userId) {
            const { data: customer } = await supabase
              .from('customers')
              .select('credits, last_refill_at, last_refill_checkout_id')
              .eq('user_id', userId)
              .single();

            const lastGrant = customer?.last_refill_at;
            const lastCheckout = customer?.last_refill_checkout_id;
            const elapsed = lastGrant ? Date.now() - new Date(lastGrant).getTime() : Infinity;

            // Dedup layer 1: same checkout_id = same purchase, different event types
            if (lastCheckout === checkoutId) {
              break;
            }
            // Dedup layer 2: 5-min cooldown = rapid successive purchases
            if (elapsed < 5 * 60 * 1000) {
              break;
            }

            // Dedup layer 3: Redis TTL per user+product (covers checkout_id mismatch across event types)
            try {
              const { Redis } = await import('@upstash/redis');
              const redis = Redis.fromEnv();
              const redisKey = `refill_granted:${userId}:${refillId}`;
              const alreadyGranted = await redis.get(redisKey);
              if (alreadyGranted) {
                break;
              }
              // Set 10-min TTL after successful grant (below)
              // (we set it after the grant succeeds, not here)
            } catch (e) {
              // Redis unavailable — rely on DB-based dedup (layers 1+2)
            }

            const current = customer?.credits || 0;
            const creemCustId = payload.customer?.id || payload.customer;
            const now = new Date().toISOString();

            if (customer) {
              await supabase.from('customers').update({
                credits: current + 100,
                creem_customer_id: creemCustId,
                last_refill_at: now,
                last_refill_checkout_id: checkoutId,
              }).eq('user_id', userId);
            } else {
              // Upsert to handle race condition with new-user webhook
              await supabase.from('customers').upsert({
                user_id: userId,
                credits: 100,
                creem_customer_id: creemCustId,
                last_refill_at: now,
                last_refill_checkout_id: checkoutId,
              }, { onConflict: "user_id" });
            }

            // Set Redis dedup key (layer 3) — 10 min TTL
            try {
              const { Redis } = await import('@upstash/redis');
              const redis = Redis.fromEnv();
              await redis.set(`refill_granted:${userId}:${refillId}`, 1, { ex: 600 });
            } catch (e) { /* non-blocking */ }
          }
        }
        break;
      }

      /** 4️⃣ Refund / Dispute handling */
      case "charge.refunded":
      case "charge.dispute.created": {
        const payload = event.object;
        const userId = payload.metadata?.user_id || payload.customer?.metadata?.user_id;
        const refundAmount = payload.amount_refunded || payload.amount || 0;

        if (userId) {
          const { data: customer } = await supabase
            .from('customers')
            .select('credits')
            .eq('user_id', userId)
            .single();

          if (customer) {
            // Deduct refill credits if refunded (100 credits per refill pack, don't go below 0)
            const deduction = Math.min(customer.credits, 100);
            if (deduction > 0) {
              await supabase
                .from('customers')
                .update({ credits: customer.credits - deduction })
                .eq('user_id', userId);
              console.log(`💸 Refund: deducted ${deduction} credits for user ${userId}`);
            }
          }

          // If subscription refunded, mark as canceled
          const productId = payload.product?.id || payload.product_id;
          const monthlyId = process.env.CREEM_PRODUCT_ID_MONTHLY;
          const yearlyId = process.env.CREEM_PRODUCT_ID_YEARLY;
          if (productId === monthlyId || productId === yearlyId) {
            await supabase
              .from('subscriptions')
              .update({ status: 'canceled', updated_at: new Date().toISOString() })
              .eq('user_id', userId);
            console.log(`💸 Refund: subscription canceled for user ${userId}`);
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
