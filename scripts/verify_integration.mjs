import fs from 'fs';
import path from 'path';
import { config, subscribe } from "@fal-ai/serverless-client";

console.log(">> SIMULATION START: Testing Fusion Capability <<");

const readEnv = (f) => { try { return fs.readFileSync(path.resolve(process.cwd(), f), 'utf8'); } catch { return ""; } };
const envs = readEnv('.env') + '\n' + readEnv('.env.local');
const get = (k) => { const m = envs.match(new RegExp(`${k}\\s*=\\s*["']?([^"'\n\r]+)["']?`)); return m ? m[1] : null; };

// 1. Env Check
const keys = ["FAL_KEY", "NEXT_PUBLIC_SUPABASE_URL"];
const missing = keys.filter(k => !get(k));
if (missing.length) { console.error("!! CRITICAL: Missing Env: " + missing.join(", ")); process.exit(1); }
console.log("[PASS] Environment Variables Verified.");

// 2. Service Check
const falKey = get("FAL_KEY");
console.log(`[PASS] Auth Configuration Loaded (${falKey.slice(0, 4)}...)`);

// 3. Request Simulation
console.log("[INFO] Simulating Generation Request to Fal.ai (Flux)...");
config({ credentials: falKey });

(async () => {
    try {
        const start = Date.now();
        const res = await subscribe("fal-ai/flux/dev", {
            input: { prompt: "Test fusion unit check", image_size: "square_hd" },
            logs: true
        });
        const t = ((Date.now() - start) / 1000).toFixed(1);
        if (res.images?.[0]?.url) {
            console.log(`[PASS] Generation Successful! (${t}s)`);
            console.log(`       Result: ${res.images[0].url}`);
        } else {
            console.error("[FAIL] No image returned.");
            process.exit(1);
        }
    } catch (e) {
        console.error("[FAIL] Request Error: " + e.message);
        process.exit(1);
    }
})();
