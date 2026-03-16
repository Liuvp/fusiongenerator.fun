import { createServiceRoleClient } from "@/utils/supabase/service-role";
import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isAuthorized(request: Request) {
    const secret = process.env.CRON_SECRET;

    if (!secret) {
        return process.env.NODE_ENV !== "production";
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return false;
    }

    const providedSecret = authHeader.slice("Bearer ".length).trim();
    const expected = Buffer.from(secret);
    const provided = Buffer.from(providedSecret);

    if (expected.length !== provided.length) {
        return false;
    }

    return timingSafeEqual(expected, provided);
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized" },
            {
                status: 401,
                headers: {
                    "Cache-Control": "no-store, max-age=0",
                },
            }
        );
    }

    try {
        const supabase = createServiceRoleClient();

        // Use a lightweight query against a table that exists in the live schema.
        const { count, error } = await supabase
            .from('customers')
            .select('id', { count: 'exact', head: true });

        if (error) {
            console.error('Keep-alive ping failed:', error);
            return NextResponse.json(
                { status: 'error', error: error.message },
                {
                    status: 500,
                    headers: {
                        'Cache-Control': 'no-store, max-age=0',
                    },
                }
            );
        }

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            check: 'database_active',
            count,
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        });
    } catch (err) {
        console.error('Keep-alive unhandled error:', err);
        return NextResponse.json(
            { status: 'error', message: 'Internal Server Error' },
            {
                status: 500,
                headers: {
                    'Cache-Control': 'no-store, max-age=0',
                },
            }
        );
    }
}
