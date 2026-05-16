import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getClientIP } from "@/lib/rate-limit";
import { createHash } from "crypto";

const VALID_RATINGS = new Set([1, 2, 3]);
const VALID_TYPES = new Set(["dragon_ball", "pokemon", "ai"]);

function hashIP(ip: string): string {
    return createHash("sha256").update(ip + "fusion_feedback_salt").digest("hex").slice(0, 16);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { fusionType, char1Id, char2Id, rating, imageUrl } = body;

        // Validate
        if (!VALID_TYPES.has(fusionType)) {
            return NextResponse.json({ error: "Invalid fusion type" }, { status: 400 });
        }
        if (!char1Id || !char2Id) {
            return NextResponse.json({ error: "Missing character IDs" }, { status: 400 });
        }
        if (!VALID_RATINGS.has(rating)) {
            return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
        }

        // Get user (optional)
        const supabase = await createClient();
        let userId: string | null = null;
        try {
            const { data: { user } } = await supabase.auth.getUser();
            userId = user?.id ?? null;
        } catch {
            // anonymous
        }

        // Get IP hash for anonymous dedup
        const ip = getClientIP(request);
        const ipHash = userId ? null : hashIP(ip);

        const { error } = await supabase
            .from("fusion_feedback")
            .insert({
                fusion_type: fusionType,
                char1_id: char1Id,
                char2_id: char2Id,
                rating,
                image_url: imageUrl ?? null,
                user_id: userId,
                ip_hash: ipHash,
            });

        if (error) {
            // Unique violation = duplicate feedback
            if (error.code === "23505") {
                return NextResponse.json({ ok: true, duplicate: true });
            }
            console.error("Feedback insert error:", error);
            return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Feedback API error:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
