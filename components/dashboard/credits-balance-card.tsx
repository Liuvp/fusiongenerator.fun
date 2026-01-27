"use client";

import { Coins } from "lucide-react";
import { CreditTransaction } from "@/types/creem";

type CreditsBalanceCardProps = {
  credits: number;
  recentHistory: CreditTransaction[];
};

export function CreditsBalanceCard({
  credits,
  recentHistory,
}: CreditsBalanceCardProps) {
  const isLowCredits = credits < 10;

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Coins className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Available Credits</p>
          <h3 className={`text-2xl font-bold mt-1 ${isLowCredits ? 'text-yellow-600' : ''}`}>
            {credits}
          </h3>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-sm text-muted-foreground">Recent Activity</p>
        <div className="space-y-1">
          {recentHistory.length > 0 ? (
            recentHistory.map((history, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span
                  className={
                    history.type === "add" ? "text-primary" : "text-destructive"
                  }
                >
                  {history.type === "add" ? "+" : "-"}
                  {history.amount}
                </span>
                <span className="text-muted-foreground" suppressHydrationWarning>
                  {new Date(history.created_at).toISOString().slice(0, 10)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          )}
        </div>
      </div>
      {isLowCredits && (
        <div className="mt-4">
          <a href="/pricing" className="block">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full">
              Get More Credits
            </button>
          </a>
        </div>
      )}
    </div>
  );
}
