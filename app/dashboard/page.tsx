import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionStatusCard } from "@/components/dashboard/subscription-status-card";
import { CreditsBalanceCard } from "@/components/dashboard/credits-balance-card";
import { GenerationQuotaCard } from "@/components/dashboard/generation-quota-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { Metadata } from "next";

import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Fusion Generator",
  description: "Manage your fusion creations, view generation history, and track your credits for Dragon Ball and Pokemon character fusions.",
  robots: {
    index: false,
    follow: false,
  },
};

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const paymentStatus = searchParams.payment;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // 直接查询subscriptions表
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, creem_product_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  // 查询customers表获取credits（如果表存在）
  const { data: customerData } = await supabase
    .from("customers")
    .select("credits, credits_history(amount, type, created_at)")
    .eq("user_id", user.id)
    .single();

  const credits = customerData?.credits || 0;
  const recentCreditsHistory = customerData?.credits_history?.slice(0, 2) || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-6 sm:gap-8 px-4 sm:px-8 container">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-pink-500/10 to-purple-500/10 border border-primary/20 rounded-lg p-6 sm:p-8 mt-6 sm:mt-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
          Welcome back,{" "}
          <span className="block sm:inline mt-1 sm:mt-0">{user.email}</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your fusion creations, view your generation history, and track your credits.
        </p>
      </div>

      {/* Payment Success Banner */}
      {paymentStatus === 'success' && (
        <div className="bg-green-500/15 border border-green-500/20 text-green-700 dark:text-green-400 px-6 py-4 rounded-lg flex items-center gap-3 mt-6 sm:mt-8 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Subscription Activated!</h3>
            <p className="text-sm opacity-90">Thank you for upgrading to Pro. Your account features have been unlocked.</p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SubscriptionStatusCard subscription={subscription} />
        <CreditsBalanceCard
          credits={credits}
          recentHistory={recentCreditsHistory}
        />
        <GenerationQuotaCard />
        <QuickActionsCard />
      </div>



      {/* Account Details Section */}
      <div className="rounded-xl border bg-card p-4 sm:p-6 mb-6">
        <h2 className="font-bold text-lg sm:text-xl mb-4">Account Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium break-all">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">User ID</p>
              <p className="font-medium break-all">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
