/**
 * Regression harness: re-parse the raw_panel_text of each captured session
 * through the content.js parser, and compare key fields before/after fixes.
 *
 * Usage:
 *   node test/regress.js                 # full report
 *   node test/regress.js --quiet         # summary counts only
 */
const fs = require("fs");
const path = require("path");

const harness = require("./harness.js");
const { parseInsights, parsePanel } = harness;

const DATA_PATH = process.env.CLARITY_DATA || "D:/桌面/clarity-sessions-2026-06-23T01-17-19-265Z.json";
const quiet = process.argv.includes("--quiet");

const raw = JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));

// Known-bad browser tokens we want the regex to recognize.
const MOBILE_BROWSERS = ["ChromeMobile", "EdgeMobile", "MobileSafari"];

function hasInsightSentences(points) {
  // A "good" insight extraction contains at least one human-readable sentence
  // longer than a short button/icon label.
  return Array.isArray(points) && points.some((p) => typeof p === "string" && p.length > 60);
}

function looksLikeButtons(points) {
  // Detect the known junk: button text or "Filled IconGenerate".
  const junkTokens = [
    "Filled IconGenerate",
    "IconSorry",
    "Favorite this session",
    "Share recording",
    "View visitor profile",
    "More details",
    "View session info and event timeline",
  ];
  return Array.isArray(points) && points.some((p) =>
    junkTokens.some((tok) => typeof p === "string" && p.includes(tok))
  );
}

const report = {
  total: raw.length,
  insightsGood: 0,
  insightsButtons: 0,
  insightsShort: 0, // too-short sessions that should be empty
  insightsRecovered: 0, // was junk, now good
  browserCorrect: 0,
  browserWrong: 0,
  countryHasBrowser: 0,
  examples: [],
};

for (const session of raw) {
  const text = session.raw_panel_text || "";
  if (!text) continue;

  const points = parseInsights(text);

  // Re-parse identity via parsePanel so we exercise the same path the extension uses.
  // We pass a tiny stub element by reconstructing text through the same pipeline.
  const reparsed = reparsePanelFromText(text);
  const { country, browser } = reparsed;

  const isTooShort = /Sorry, this session is too short/i.test(text);

  if (hasInsightSentences(points)) report.insightsGood += 1;
  else if (looksLikeButtons(points)) report.insightsButtons += 1;
  else if (isTooShort) report.insightsShort += 1;

  // Browser check
  const expectedBrowser = extractExpectedBrowser(text);
  const browserOk = expectedBrowser
    ? String(browser || "").toLowerCase() === expectedBrowser.toLowerCase()
    : true;
  if (browserOk) report.browserCorrect += 1;
  else report.browserWrong += 1;

  // Country pollution check
  const countryPolluted = MOBILE_BROWSERS.some((b) =>
    String(country || "").includes(b)
  );
  if (countryPolluted) report.countryHasBrowser += 1;

  report.examples.push({
    session_id: session.session_id,
    raw_browser_hint: expectedBrowser,
    parsed_browser: browser,
    parsed_country: country,
    insights_kind: hasInsightSentences(points)
      ? "good"
      : looksLikeButtons(points)
      ? "buttons"
      : isTooShort
      ? "too-short"
      : "empty",
    sample: Array.isArray(points) ? points.slice(0, 1).join(" ").slice(0, 70) : "",
  });
}

function extractExpectedBrowser(text) {
  // "User ID: 4592gg Poland ChromeMobile Mobile"
  const m = text.match(/User ID:\s*[^\n]*\b(ChromeMobile|EdgeMobile|MobileSafari|Chrome|Edge|Firefox|Safari|Opera|Brave)\b/i);
  return m ? m[1] : null;
}

// Reconstruct a minimal DOM-like element from raw text so we can reuse parsePanel.
function reparsePanelFromText(text) {
  // parsePanel expects an element with innerText; emulate that contract.
  const fakeElement = {
    innerText: text,
    getBoundingClientRect: () => ({ width: 100, height: 100, top: 0, left: 0 }),
  };
  return parsePanel(fakeElement, 0);
}

if (quiet) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log("=== BASELINE (current content.js) ===");
  console.log("Total sessions:", report.total);
  console.log("Insights  good    :", report.insightsGood);
  console.log("Insights  buttons :", report.insightsButtons);
  console.log("Insights  short   :", report.insightsShort);
  console.log("Browser   correct :", report.browserCorrect);
  console.log("Browser   wrong   :", report.browserWrong);
  console.log("Country polluted  :", report.countryHasBrowser);
  console.log("");
  console.log("--- first 8 examples ---");
  for (const ex of report.examples.slice(0, 8)) {
    console.log(
      `${ex.session_id} | browser: ${ex.parsed_browser} (hint ${ex.raw_browser_hint}) | country: ${ex.parsed_country} | insights: ${ex.insights_kind}`
    );
  }
}
