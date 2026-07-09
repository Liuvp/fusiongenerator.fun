"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/dragon-ball" className="block">
          <Button variant="outline" className="w-full justify-start gap-2 h-12">
            <Zap className="h-4 w-4 text-orange-500" />
            <div className="text-left">
              <div className="font-medium">Dragon Ball Fusion</div>
              <div className="text-xs text-muted-foreground">Fuse DB characters</div>
            </div>
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
