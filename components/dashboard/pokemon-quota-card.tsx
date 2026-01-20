"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Crown } from "lucide-react";

export function PokemonQuotaCard() {
    const [quota, setQuota] = useState<{
        used: number;
        remaining: number;
        limit: number;
        isVIP: boolean;
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuota = async () => {
            try {
                const response = await fetch('/api/get-quota');
                if (response.ok) {
                    const data = await response.json();
                    setQuota(data.quota);
                }
            } catch (error) {
                console.error('Failed to fetch quota:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuota();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Pokemon Fusion Quota
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-8 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!quota) {
        return null;
    }

    const percentage = (quota.remaining / quota.limit) * 100;
    const isLow = percentage < 30;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Pokemon Fusion Quota
                    </span>
                    {quota.isVIP && (
                        <Badge variant="default" className="gap-1">
                            <Crown className="h-3 w-3" />
                            VIP
                        </Badge>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Daily Generations</span>
                        <span className="font-medium">
                            {quota.remaining}/{quota.limit}
                        </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${isLow ? 'bg-orange-500' : 'bg-primary'
                                }`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                {/* Status Message */}
                <div className={`text-sm ${isLow ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
                    {quota.remaining === 0 ? (
                        <p>❌ Daily limit reached. {quota.isVIP ? 'Resets tomorrow.' : 'Upgrade to VIP for more!'}</p>
                    ) : quota.remaining === 1 ? (
                        <p>⚠️ Last generation remaining today</p>
                    ) : (
                        <p>✅ {quota.remaining} generations available</p>
                    )}
                </div>

                {/* Plan Info */}
                <div className="pt-2 border-t text-xs text-muted-foreground">
                    {quota.isVIP ? (
                        <p>VIP Plan: {quota.limit} generations per day</p>
                    ) : (
                        <p>Free Plan: {quota.limit} generations per day · <a href="/pricing" className="text-primary hover:underline">Upgrade to VIP</a></p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
