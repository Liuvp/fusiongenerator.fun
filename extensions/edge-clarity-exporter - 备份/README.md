# Clarity Session Extractor (Edge Extension)

Extract visible Microsoft Clarity session detail cards and export data for analysis.

## What It Extracts

- Entry URL
- Exit URL
- Referrer
- Duration / Clicks / Pages
- User ID (if shown)
- Country / Browser / Device (best-effort from visible chips)
- Session insights bullet text (best-effort from visible panel)
- Capture timestamp and source page URL

## Output Formats

- JSONL (recommended for AI analysis)
- JSON
- CSV

## Install In Microsoft Edge

1. Open `edge://extensions/`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this folder:
   - `extensions/edge-clarity-exporter`

## How To Use

1. Open `https://clarity.microsoft.com/` and go to your recordings/session page.
2. Open one or more session detail panels/cards you want to capture.
3. Click extension icon -> `Extract Visible Sessions`.
4. If many sessions are in a scrollable list, use `Extract All (Auto Scroll)`.
   - This mode auto-clicks cards one-by-one to reveal more details before extraction.
   - The popup summary shows how many sessions got enriched details and AI insights text.
4. Export JSONL/JSON/CSV from the popup.

## Notes

- This reads only data visible in the current page DOM. It does not call private APIs.
- Clarity UI may change over time; parser is label-based and best-effort.
- If you want complete historical extraction, combine this with official exports (Recordings CSV + Data Export API).
