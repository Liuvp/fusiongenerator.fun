"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import RandomNameGenerator from "@/components/product/random/random-name-generator";

export default function RandomNameGeneratorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Header removed: duplicate of breadcrumbs */}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <RandomNameGenerator />
      </div>
    </div>
  );
}