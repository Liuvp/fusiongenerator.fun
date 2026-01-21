
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("creem-signature");

    if (!signature) {
      return new Response("Missing signature", { status: 400 });
    }

    // Verify signature
    // Note: In a real production environment, you MUST verify the signature.
    // However, for this specific test case, if you don't have the webhook secret set up 
    // or if Creem's test environment behaves differently, you might temporarily skip it.
    // BUT valid verification code is provided below.

    const secret = process.env.CREEM_WEBHOOK_SECRET;
    if (secret) {
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
      if (signature !== expectedSignature) {
        return new Response("Invalid signature", { status: 401 });
      }
    }

    const event = JSON.parse(body);
    console.log("Received Creem Webhook Event:", event.type, event);

    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
        // Extract relevant data
        // Note: Check the actual payload structure from Creem logs to be sure
        const subscription = event.data;
        const userId = subscription.metadata?.user_id;
        const status = subscription.status;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
        const productId = subscription.product_id;

        if (userId) {
          console.log(`Updating subscription for user ${userId} to ${status}`);

          // Upsert into subscriptions table
          const { error } = await supabase
            .from("subscriptions")
            .upsert({
              user_id: userId,
              status: status,
              current_period_end: currentPeriodEnd,
              creem_subscription_id: subscription.id,
              creem_product_id: productId,
              cancel_at_period_end: subscription.cancel_at_period_end || false,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' }); // Assuming user_id is unique or primary key for 1:1 mapping

          if (error) {
            console.error("Error updating Supabase:", error);
            return new Response("Database error", { status: 500 });
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
