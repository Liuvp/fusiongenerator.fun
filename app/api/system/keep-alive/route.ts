import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Execute a lightweight query: count rows in generation_batches table
        // Using { head: true } means we only fetch the count, not the data
        const { count, error } = await supabase
            .from('generation_batches')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Keep-alive ping failed:', error);
            return NextResponse.json({ status: 'error', error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            check: 'database_active'
        });
    } catch (err) {
        console.error('Keep-alive unhandled error:', err);
        return NextResponse.json({ status: 'error', message: 'Internal Server Error' }, { status: 500 });
    }
}
