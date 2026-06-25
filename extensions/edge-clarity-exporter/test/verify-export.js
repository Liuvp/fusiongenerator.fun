/**
 * End-to-end verification: confirm that the parser, when run on the
 * raw_panel_text of a REAL post-fix export, reproduces exactly the
 * session_insights_points that the extension actually wrote out.
 *
 * If these match for every session, the content.js logic used in the browser
 * is identical to what the test harness exercises.
 */
const fs = require("fs");

const harness = require("./harness.js");
const { parseInsights, parsePanel } = harness;

const files = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (files.length === 0) {
  console.error("Usage: node test/verify-export.js <post-fix-export.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(files[0], "utf8"));

let mismatches = 0;
let noInsightSection = 0;
let verified = 0;

const JUNK = /(mistakes are possible|Share feedback|improve!|Filled IconGenerate|Favorite this session|Slang off|^More details$|^Copy$|View visitor profile|View session info and event timeline)/i;

for (const session of raw) {
  const text = session.raw_panel_text || "";
  const exportedPoints = Array.isArray(session.session_insights_points)
    ? session.session_insights_points
    : [];

  // No insight section in panel at all (collapsed card).
  if (!/Session insights/i.test(text)) {
    noInsightSection += 1;
    continue;
  }

  // Re-parse from raw_panel_text with the test harness.
  const fakeEl = {
    innerText: text,
    getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0 }),
  };
  const reparsed = parsePanel(fakeEl, 0);
  const reparsedPoints = reparsed.session_insights_points || [];

  // Compare: same length + same content.
  const same =
    reparsedPoints.length === exportedPoints.length &&
    reparsedPoints.every((p, i) => p === exportedPoints[i]);

  // Also flag any junk leakage in EITHER side.
  const exportedClean = exportedPoints.every((p) => !JUNK.test(p));
  const reparsedClean = reparsedPoints.every((p) => !JUNK.test(p));

  if (!same || !exportedClean || !reparsedClean) {
    mismatches += 1;
    console.log(`MISMATCH ${session.session_id} (user ${session.user_id})`);
    if (!exportedClean) console.log("  exported has junk:", exportedPoints.find((p) => JUNK.test(p)));
    if (!reparsedClean) console.log("  reparsed has junk:", reparsedPoints.find((p) => JUNK.test(p)));
    if (!same) {
      console.log("  exported[" + exportedPoints.length + "]:", exportedPoints.slice(0, 1));
      console.log("  reparsed[" + reparsedPoints.length + "]:", reparsedPoints.slice(0, 1));
    }
  } else {
    verified += 1;
  }
}

console.log("");
console.log("=== END-TO-END VERIFICATION ===");
console.log("Total sessions        :", raw.length);
console.log("No insight section    :", noInsightSection, "(collapsed cards, skipped)");
console.log("Verified identical    :", verified);
console.log("Mismatches / junk     :", mismatches);
console.log(mismatches === 0 ? "PASS" : "FAIL");
