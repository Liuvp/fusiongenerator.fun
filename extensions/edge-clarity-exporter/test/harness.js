/**
 * Offline test harness for content.js parsing functions.
 *
 * content.js wraps everything in an IIFE and depends on `chrome.*` + DOM APIs.
 * To test the pure parsing logic in Node, we read its source as text, inject a
 * `return` so the IIFE exposes its inner helpers, then run it under shims.
 *
 * Usage: node test/harness.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const EXT_DIR = path.resolve(__dirname, "..");
const CONTENT_PATH = path.join(EXT_DIR, "content.js");
const source = fs.readFileSync(CONTENT_PATH, "utf8");

const EXPOSED_NAMES = [
  "normalizeWhitespace",
  "normalizePanelText",
  "splitLines",
  "parseLabelValue",
  "parseDurationClicksPages",
  "parseTimestampHints",
  "parseIdentityBlock",
  "parseInsights",
  "parseDurationToSeconds",
  "parsePanel",
];

// Convert `(() => { ... })();` into `(() => { ...; return {...}; })()` by
// injecting a return statement right before the final IIFE close.
const lastClose = source.lastIndexOf("})();");
if (lastClose === -1) {
  throw new Error("Could not find IIFE close marker in content.js");
}
const patched =
  source.slice(0, lastClose) +
  "return {" +
  EXPOSED_NAMES.map((n) => JSON.stringify(n) + ": " + n).join(", ") +
  "};\n" +
  source.slice(lastClose);

// Minimal shims so the IIFE can run in Node without a browser.
const documentShim = {
  querySelectorAll: () => [],
  querySelector: () => null,
  body: {},
  scrollingElement: {},
  documentElement: {},
};
const windowShim = {
  getComputedStyle: () => ({ display: "", visibility: "", opacity: "1" }),
  innerWidth: 1280,
};
const chromeShim = { runtime: { onMessage: { addListener: () => {} } } };

const sandbox = {
  console,
  document: documentShim,
  window: windowShim,
  location: { href: "https://clarity.microsoft.com/test" },
  chrome: chromeShim,
  URL: { createObjectURL: () => "blob:x" },
  setTimeout: (fn) => fn(),
  URLSearchParams: globalThis.URLSearchParams,
};
sandbox.globalThis = sandbox;

const script = new vm.Script("__harness_result = " + patched, {});
vm.createContext(sandbox);
script.runInContext(sandbox);

module.exports = sandbox.__harness_result;
