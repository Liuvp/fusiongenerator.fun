(() => {
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function normalizeWhitespace(text) {
    return String(text || "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\r/g, "")
      .trim();
  }

  const PANEL_LABELS = [
    "Entry:",
    "Exit:",
    "Referrer:",
    "Duration:",
    "Clicks:",
    "Pages:",
    "User ID:",
    "Session insights",
    "Favorite this session",
    "Share recording",
    "View visitor profile",
    "More details",
    "View session info and event timeline",
    "Your insights are powered by AI",
    "Share feedback",
    "Copy",
    "Slang off",
  ];

  function normalizePanelText(text) {
    let value = String(text || "").replace(/\u00a0/g, " ").replace(/\r/g, "");

    for (const label of PANEL_LABELS) {
      const escaped = escapeRegex(label);
      value = value.replace(new RegExp("([^\\n])(" + escaped + ")", "gi"), "$1\n$2");
    }

    value = value.replace(
      /([A-Za-z/])(\d{1,2}:\d{2}\s*(?:AM|PM))/g,
      "$1\n$2"
    );
    value = value.replace(
      /\b(AM|PM)(?=(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}\b)/gi,
      "$1\n"
    );

    return value;
  }

  function splitLines(text) {
    return normalizeWhitespace(normalizePanelText(text))
      .split("\n")
      .map((line) => normalizeWhitespace(line))
      .filter(Boolean);
  }

  function getElementText(element) {
    return normalizeWhitespace((element && element.innerText) || "");
  }

  function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function parseLabelValue(lines, label, fullText) {
    const escapedLabel = escapeRegex(label);
    if (fullText) {
      const inlineMatcher = new RegExp(
        escapedLabel +
          "\\s*([\\s\\S]*?)(?=(?:Entry:|Exit:|Referrer:|Duration:|Clicks:|Pages:|User ID:|Session insights|Favorite this session|Share recording|View visitor profile|More details|View session info and event timeline|Your insights are powered by AI|Share feedback|Copy|Slang off|\\b\\d{1,2}:\\d{2}\\s*(?:AM|PM)\\b|\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\\.?\\s+\\d{1,2}\\b|$))",
        "i"
      );
      const m = fullText.match(inlineMatcher);
      if (m) {
        const value = normalizeWhitespace(m[1]);
        if (value) return value;
      }
    }

    const matcher = new RegExp("^" + escapedLabel + "\\s*(.+)$", "i");
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      const m = line.match(matcher);
      if (m) return normalizeWhitespace(m[1]);
      if (new RegExp("^" + escapedLabel + "$", "i").test(line)) {
        for (let j = i + 1; j < lines.length; j += 1) {
          const next = normalizeWhitespace(lines[j]);
          if (!next) continue;
          if (/^(Entry|Exit|Referrer|Duration|Clicks|Pages|User ID):/i.test(next)) break;
          return next;
        }
      }
    }
    return null;
  }

  function parseDurationClicksPages(lines, fullText) {
    for (const line of lines) {
      const m = line.match(
        /Duration:\s*([0-9:]+)\s*Clicks:\s*(\d+)\s*Pages:\s*(\d+)/i
      );
      if (m) {
        return {
          duration: m[1],
          clicks: Number.parseInt(m[2], 10),
          pages: Number.parseInt(m[3], 10),
        };
      }
    }
    if (fullText) {
      const m = fullText.match(
        /Duration:\s*([0-9:]+)\s*Clicks:\s*(\d+)\s*Pages:\s*(\d+)/i
      );
      if (m) {
        return {
          duration: m[1],
          clicks: Number.parseInt(m[2], 10),
          pages: Number.parseInt(m[3], 10),
        };
      }
    }
    return {
      duration: null,
      clicks: null,
      pages: null,
    };
  }

  function parseTimestampHints(lines) {
    const all = lines.join(" ");
    const timeMatch = all.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i);
    const dateMatch = all.match(
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}\b/i
    );
    return {
      local_time_hint: timeMatch ? normalizeWhitespace(timeMatch[0]) : null,
      local_date_hint: dateMatch ? normalizeWhitespace(dateMatch[0]) : null,
    };
  }

  function parseIdentityBlock(lines, fullText) {
    const identity = {
      user_id: null,
      country: null,
      browser: null,
      device: null,
    };

    const browserRegex =
      /\b(Edge|Chrome|Firefox|Safari|Opera|Brave|Samsung Internet|Internet Explorer|MobileSafari)\b/i;
    const deviceRegex = /\b(PC|Desktop|Mobile|Tablet|Android|iPhone|iPad|Mac)\b/i;

    const userIdLine = lines.find((line) => /^User ID:/i.test(line));
    if (userIdLine) {
      const m = userIdLine.match(/^User ID:\s*([^\s]+)(?:\s+(.+))?$/i);
      identity.user_id = m ? normalizeWhitespace(m[1]) : null;
      const trailing = m ? normalizeWhitespace(m[2] || "") : "";
      if (trailing) {
        if (!identity.browser) {
          const browserMatch = trailing.match(browserRegex);
          if (browserMatch) identity.browser = normalizeWhitespace(browserMatch[1]);
        }
        if (!identity.device) {
          const deviceMatch = trailing.match(deviceRegex);
          if (deviceMatch) identity.device = normalizeWhitespace(deviceMatch[1]);
        }
        const countryCandidate = trailing
          .replace(browserRegex, "")
          .replace(deviceRegex, "")
          .replace(/\b(?:Session insights|Favorite this session|Share recording|More details)\b[\s\S]*$/i, "")
          .trim();
        if (countryCandidate && !identity.country) {
          identity.country = countryCandidate;
        }
      }
    }

    if (fullText) {
      const blockMatch = fullText.match(
        /User ID:\s*[^\n]+\n([\s\S]*?)(?:Session insights|More details|$)/i
      );
      if (blockMatch) {
        const rawCandidates = blockMatch[1]
          .split("\n")
          .map((line) => normalizeWhitespace(line))
          .filter(Boolean)
          .filter((line) => !/^User ID:/i.test(line))
          .filter((line) => !/^More details$/i.test(line))
          .filter((line) => !/^(Entry|Exit|Referrer|Duration|Clicks|Pages):/i.test(line))
          .filter((line) => !/^\d+$/.test(line))
          .filter((line) => !/^\.\.\//.test(line))
          .filter((line) => !/^https?:\/\//i.test(line))
          .filter((line) => !/fusiongenerator\.fun/i.test(line))
          .filter((line) => !/^Slang off$/i.test(line))
          .filter((line) => !/^\d{1,2}:\d{2}\s*(?:AM|PM)?$/i.test(line))
          .filter(
            (line) =>
              !/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}\b/i.test(
                line
              )
          );

        for (const line of rawCandidates) {
          if (!identity.browser && browserRegex.test(line)) {
            identity.browser = line;
            continue;
          }
          if (!identity.device && deviceRegex.test(line)) {
            identity.device = line;
            continue;
          }
          if (!identity.country) {
            identity.country = line;
          }
        }
      }
    }

    const filtered = lines.filter((line) => {
      if (/^(Entry|Exit|Referrer|Duration):/i.test(line)) return false;
      if (/^(Clicks|Pages):/i.test(line)) return false;
      if (/^User ID:/i.test(line)) return false;
      if (/^Session insights$/i.test(line)) return false;
      if (/^More details$/i.test(line)) return false;
      if (/^Your insights are powered/i.test(line)) return false;
      if (/^Share feedback/i.test(line)) return false;
      if (/^(?:AM|PM)$/i.test(line)) return false;
      if (/^\d{1,2}:\d{2}\s*(?:AM|PM)?$/i.test(line)) return false;
      if (
        /\b\d{1,2}:\d{2}\s*(?:AM|PM)\b/i.test(line) &&
        /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}\b/i.test(
          line
        )
      ) {
        return false;
      }
      if (
        /^(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.?\s+\d{1,2}$/i.test(
          line
        )
      ) {
        return false;
      }
      if (/^\.\.\//.test(line)) return false;
      if (/^https?:\/\//i.test(line)) return false;
      if (/fusiongenerator\.fun/i.test(line)) return false;
      if (/^Slang off$/i.test(line)) return false;
      return true;
    });

    const unknown = [];
    for (const line of filtered) {
      if (/^[\u2022\-]/.test(line)) continue;
      if (line.length > 120) continue;
      unknown.push(line);
    }

    if (!identity.country && unknown.length > 0) identity.country = unknown[0] || null;
    if (!identity.browser) {
      const browserLine = unknown.find((line) => browserRegex.test(line));
      if (browserLine) identity.browser = browserLine;
    }
    if (!identity.device) {
      const deviceLine = unknown.find((line) => deviceRegex.test(line));
      if (deviceLine) identity.device = deviceLine;
    }
    if (!identity.browser && unknown.length > 1) identity.browser = unknown[1] || null;
    if (!identity.device && unknown.length > 2) identity.device = unknown[2] || null;

    return identity;
  }

  function parseInsights(text) {
    const part = text.split(/Session insights/i)[1];
    if (!part) return [];

    const cleaned = part
      .replace(
        /^(?:Filled\s+IconGenerate|IconSorry,.*?insights|Favorite this session|Share recording|View visitor profile|More details|View session info and event timeline|Session insights|Copy)+/i,
        ""
      )
      .replace(/Your insights are powered by AI[\s\S]*?possible\./i, "")
      .replace(/Share feedback[\s\S]*?improve\!/i, "")
      .trim();

    const bulletLines = [];
    const bulletRegex = /(?:^|\n)[\u2022\-]\s*(.+?)(?=(?:\n[\u2022\-]\s)|$)/gs;
    let match;
    while ((match = bulletRegex.exec(cleaned))) {
      const line = normalizeWhitespace(match[1]);
      if (/^Slang off$/i.test(line)) continue;
      if (line) bulletLines.push(line);
    }

    if (bulletLines.length > 0) return bulletLines;

    const sentences = cleaned
      .split(/\n+/)
      .map((line) => normalizeWhitespace(line))
      .filter(Boolean)
      .filter((line) => !/^Slang off$/i.test(line));
    return sentences.slice(0, 8);
  }

  function isLikelySessionPanelText(text) {
    return (
      /Entry:/i.test(text) &&
      /Exit:/i.test(text) &&
      /Referrer:/i.test(text) &&
      /Duration:/i.test(text) &&
      /Clicks:/i.test(text) &&
      /Pages:/i.test(text)
    );
  }

  function isVisibleElement(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") return false;
    const style = window.getComputedStyle(element);
    if (!style) return false;
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number.parseFloat(style.opacity || "1") === 0) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function countLabelOccurrences(text, label) {
    const re = new RegExp(escapeRegex(label), "gi");
    const matches = text.match(re);
    return matches ? matches.length : 0;
  }

  function resolveSingleCardRoot(node) {
    if (!node) return node;
    let best = node;
    let current = node;

    while (current && current.parentElement && current.parentElement !== document.body) {
      const parent = current.parentElement;
      if (!isVisibleElement(parent)) break;
      const text = getElementText(parent);
      if (!text || text.length > 14000) break;
      if (!isLikelySessionPanelText(text)) break;
      const entryCount = countLabelOccurrences(text, "Entry:");
      const userIdCount = countLabelOccurrences(text, "User ID:");
      if (entryCount > 1 || userIdCount > 1) break;
      best = parent;
      current = parent;
    }

    return best;
  }

  function getCandidateElements(root) {
    const selectors = ["aside", "article", "section", "div", "li"];
    const scope = root && typeof root.querySelectorAll === "function" ? root : document;
    const all = scope.querySelectorAll(selectors.join(","));
    const candidates = [];

    for (const element of all) {
      if (!isVisibleElement(element)) continue;
      const text = getElementText(element);
      if (!text) continue;
      if (text.length < 40 || text.length > 5000) continue;
      if (!isLikelySessionPanelText(text)) continue;
      candidates.push(element);
    }

    const leafCandidates = candidates.filter(
      (node) => !candidates.some((other) => other !== node && node.contains(other))
    );

    const normalized = [];
    for (const node of leafCandidates) {
      const root = resolveSingleCardRoot(node);
      if (!normalized.includes(root)) {
        normalized.push(root);
      }
    }

    normalized.sort((a, b) => {
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      if (Math.abs(ar.top - br.top) > 2) return ar.top - br.top;
      return ar.left - br.left;
    });

    return normalized;
  }

  function getSessionKey(session) {
    return [
      session.entry_url || "",
      session.exit_url || "",
      session.referrer || "",
      session.duration_text || "",
      String(session.clicks || ""),
      String(session.pages || ""),
      session.user_id || "",
      session.local_time_hint || "",
      session.local_date_hint || "",
    ].join("|");
  }

  function dedupeSessions(sessions) {
    const unique = [];
    const seen = new Set();
    for (const session of sessions) {
      const key = getSessionKey(session);
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(session);
    }
    return unique;
  }

  function scoreSessionCompleteness(session) {
    let score = 0;
    if (!session) return score;
    if (session.user_id) score += 1;
    if (session.country) score += 1;
    if (session.browser) score += 1;
    if (session.device) score += 1;
    if (session.local_time_hint) score += 1;
    if (session.local_date_hint) score += 1;
    if (session.session_insights_points && session.session_insights_points.length > 0) {
      score += 2;
    }
    return score;
  }

  function getProcessingKey(session) {
    const stableCore = [
      session.entry_url || "",
      session.duration_text || "",
      String(session.clicks || ""),
      String(session.pages || ""),
      session.local_time_hint || "",
      session.local_date_hint || "",
      session.user_id || "",
    ].join("|");
    const fallback = hashString((session.raw_panel_text || "").slice(0, 260));
    return stableCore + "|" + fallback;
  }

  function isSameSession(left, right) {
    if (!left || !right) return false;
    const leftCore = [
      left.entry_url || "",
      left.duration_text || "",
      String(left.clicks || ""),
      String(left.pages || ""),
      left.local_time_hint || "",
      left.local_date_hint || "",
      left.user_id || "",
    ].join("|");
    const rightCore = [
      right.entry_url || "",
      right.duration_text || "",
      String(right.clicks || ""),
      String(right.pages || ""),
      right.local_time_hint || "",
      right.local_date_hint || "",
      right.user_id || "",
    ].join("|");

    if (leftCore === rightCore) return true;

    const softLeft = [left.entry_url || "", left.duration_text || "", left.user_id || ""].join(
      "|"
    );
    const softRight = [
      right.entry_url || "",
      right.duration_text || "",
      right.user_id || "",
    ].join("|");
    return !!left.entry_url && softLeft === softRight;
  }

  function findBestMatch(summarySession, sessions) {
    let best = null;
    let bestScore = -1;
    for (const candidate of sessions) {
      if (!isSameSession(summarySession, candidate)) continue;
      const score = scoreSessionCompleteness(candidate);
      if (score > bestScore) {
        best = candidate;
        bestScore = score;
      }
    }
    return best;
  }

  function isLikelySameSessionForMerge(base, candidate) {
    if (!base || !candidate) return false;
    if (isSameSession(base, candidate)) return true;

    const sameUser =
      !!base.user_id && !!candidate.user_id && String(base.user_id) === String(candidate.user_id);
    const sameEntry =
      !!base.entry_url &&
      !!candidate.entry_url &&
      String(base.entry_url) === String(candidate.entry_url);
    const sameDuration =
      !!base.duration_text &&
      !!candidate.duration_text &&
      String(base.duration_text) === String(candidate.duration_text);

    if (sameUser && (sameEntry || sameDuration)) return true;
    if (sameEntry && sameDuration) return true;
    return false;
  }

  function getVisibleMoreDetailsControls(scope) {
    const root = scope && typeof scope.querySelectorAll === "function" ? scope : document;
    const nodes = Array.from(
      root.querySelectorAll("a, button, [role='button'], span, div")
    ).filter((node) => {
      if (!isVisibleElement(node)) return false;
      const text = getElementText(node);
      if (!text) return false;
      return /^More details$/i.test(text);
    });
    return nodes;
  }

  async function waitForMatchingDetailSession(baseSession, initialSession, timeoutMs) {
    const timeout = Math.max(600, timeoutMs);
    const started = Date.now();
    let best = initialSession || baseSession || null;
    let bestScore = scoreSessionCompleteness(best);
    let stableLoops = 0;

    while (Date.now() - started < timeout) {
      const active = extractActiveDetailSession();
      if (active && isLikelySameSessionForMerge(baseSession, active)) {
        const merged = mergeSessionRecords(best || baseSession, active);
        const mergedScore = scoreSessionCompleteness(merged);
        if (mergedScore >= bestScore) {
          best = merged;
          bestScore = mergedScore;
          stableLoops = 0;
        }
        if (
          merged.session_insights_text &&
          String(merged.session_insights_text).trim() !== ""
        ) {
          return merged;
        }
      } else {
        stableLoops += 1;
      }

      if (stableLoops >= 4 && bestScore >= 4) {
        break;
      }
      await sleep(200);
    }

    return best || initialSession || baseSession;
  }

  async function tryOpenMoreDetailsAndCapture(baseSession, currentSession, card, waitMs) {
    let best = currentSession || baseSession;
    const clickDelay = Math.max(120, waitMs);
    const beforeUrl = location.href;

    const controls = [
      ...getVisibleMoreDetailsControls(card),
      ...getVisibleMoreDetailsControls(getActiveDetailPanelCandidate()),
      ...getVisibleMoreDetailsControls(document),
    ];

    const used = new Set();
    for (const control of controls) {
      if (!control) continue;
      if (used.has(control)) continue;
      used.add(control);
      try {
        control.scrollIntoView({ block: "center", inline: "nearest" });
      } catch {
        // ignore
      }
      try {
        control.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        if (typeof control.click === "function") control.click();
      } catch {
        // continue to next control
      }

      await sleep(clickDelay);
      best = await waitForMatchingDetailSession(baseSession, best, clickDelay * 10);

      if (
        best &&
        best.session_insights_text &&
        String(best.session_insights_text).trim() !== ""
      ) {
        return best;
      }

      if (location.href !== beforeUrl) {
        const inDetail = await waitForMatchingDetailSession(baseSession, best, clickDelay * 14);
        best = mergeSessionRecords(best, inDetail);
        try {
          history.back();
        } catch {
          // ignore
        }

        for (let i = 0; i < 14; i += 1) {
          await sleep(180);
          if (location.href === beforeUrl) break;
        }
        best = await waitForMatchingDetailSession(baseSession, best, clickDelay * 8);
      }
    }

    return best;
  }

  async function enrichSessionFromDetails(baseSession, currentSession, card, waitMs) {
    let best = await waitForMatchingDetailSession(baseSession, currentSession, waitMs * 8);
    if (
      best &&
      best.session_insights_text &&
      String(best.session_insights_text).trim() !== ""
    ) {
      return best;
    }
    best = await tryOpenMoreDetailsAndCapture(baseSession, best, card, waitMs);
    return best || currentSession || baseSession;
  }

  function findClickableTarget(element) {
    let node = element;
    while (node && node !== document.body) {
      if (typeof node.click === "function") {
        const role = String(node.getAttribute && node.getAttribute("role"));
        if (
          role.toLowerCase() === "button" ||
          role.toLowerCase() === "option" ||
          Number(node.tabIndex) >= 0 ||
          node.tagName === "BUTTON" ||
          node.tagName === "A"
        ) {
          return node;
        }
      }
      node = node.parentElement;
    }
    return element;
  }

  async function clickCardAndWait(card, waitMs) {
    if (!card) return;
    const delay = Math.max(80, waitMs);
    const target = findClickableTarget(card);
    card.scrollIntoView({ block: "center", inline: "nearest" });
    await sleep(30);

    const before = getElementText(card);
    try {
      target.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      target.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      target.click();
    } catch {
      try {
        card.click();
      } catch {
        // ignore click failures and continue best-effort parsing
      }
    }

    const detailsLink = Array.from(
      card.querySelectorAll("a, button, [role='button'], span, div")
    ).find((el) => /More details/i.test(getElementText(el)));
    if (detailsLink) {
      try {
        detailsLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        if (typeof detailsLink.click === "function") detailsLink.click();
      } catch {
        // ignore
      }
    }

    let previousLength = before.length;
    for (let i = 0; i < 6; i += 1) {
      await sleep(delay);
      const now = getElementText(card);
      const nowLength = now.length;
      const hasDetails =
        /Session insights/i.test(now) ||
        (/User ID:/i.test(now) && /(Edge|Chrome|Firefox|Safari|Opera|PC|Mobile|Tablet)/i.test(now));
      if (hasDetails) break;
      if (Math.abs(nowLength - previousLength) < 5 && i >= 2) break;
      previousLength = nowLength;
    }
  }

  function findLikelyListScroller() {
    const all = Array.from(document.querySelectorAll("div, section, aside, main"));
    const ranked = [];

    for (const node of all) {
      if (!isVisibleElement(node)) continue;
      const style = window.getComputedStyle(node);
      if (!style) continue;
      const overflowY = String(style.overflowY || "").toLowerCase();
      if (!["auto", "scroll", "overlay"].includes(overflowY)) continue;
      if (node.scrollHeight <= node.clientHeight + 6) continue;
      if (node.clientHeight < 180) continue;

      const text = getElementText(node).slice(0, 6000);
      let score = 0;
      if (/All recordings/i.test(text)) score += 30;
      if (/Session insights/i.test(text)) score += 40;
      if (/Entry:/i.test(text)) score += 25;
      if (/Duration:/i.test(text)) score += 15;
      if (/Referrer:/i.test(text)) score += 15;
      score += Math.min(20, Math.floor(node.clientHeight / 80));
      ranked.push({ node, score });
    }

    ranked.sort((a, b) => b.score - a.score);
    return ranked.length ? ranked[0].node : document.scrollingElement || document.documentElement;
  }

  function hashString(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  function parsePanel(element, index) {
    const rawText = getElementText(element);
    const text = normalizeWhitespace(normalizePanelText(rawText));
    const lines = splitLines((element && element.innerText) || rawText);
    const entry = cleanPathLikeValue(parseLabelValue(lines, "Entry:", text));
    const exit = cleanPathLikeValue(parseLabelValue(lines, "Exit:", text));
    const referrer = parseLabelValue(lines, "Referrer:", text);
    const metrics = parseDurationClicksPages(lines, text);
    const identity = parseIdentityBlock(lines, text);
    const timeHints = parseTimestampHints(lines);
    const insightPoints = parseInsights(text);

    const base = [
      entry || "",
      exit || "",
      referrer || "",
      metrics.duration || "",
      String(metrics.clicks || ""),
      String(metrics.pages || ""),
      identity.user_id || "",
      String(index),
      location.href,
    ].join("|");

    return {
      session_id: "clarity_" + hashString(base),
      source_url: location.href,
      captured_at_utc: new Date().toISOString(),
      entry_url: entry,
      exit_url: exit,
      referrer,
      duration_text: metrics.duration,
      duration_sec: parseDurationToSeconds(metrics.duration),
      clicks: metrics.clicks,
      pages: metrics.pages,
      user_id: identity.user_id,
      country: identity.country,
      browser: identity.browser,
      device: identity.device,
      local_time_hint: timeHints.local_time_hint,
      local_date_hint: timeHints.local_date_hint,
      session_insights_points: insightPoints,
      session_insights_text: insightPoints.join(" "),
      raw_panel_text: text,
    };
  }

  function mergeSessionRecords(base, extra) {
    if (!base) return extra;
    if (!extra) return base;

    const merged = { ...base };
    const scalarKeys = [
      "entry_url",
      "exit_url",
      "referrer",
      "duration_text",
      "duration_sec",
      "clicks",
      "pages",
      "user_id",
      "country",
      "browser",
      "device",
      "local_time_hint",
      "local_date_hint",
    ];

    for (const key of scalarKeys) {
      const left = merged[key];
      const right = extra[key];
      const leftMissing =
        left == null || (typeof left === "string" && left.trim() === "");
      if (leftMissing && right != null && String(right).trim() !== "") {
        merged[key] = right;
      }
    }

    const leftInsights = Array.isArray(merged.session_insights_points)
      ? merged.session_insights_points
      : [];
    const rightInsights = Array.isArray(extra.session_insights_points)
      ? extra.session_insights_points
      : [];
    if (rightInsights.length > leftInsights.length) {
      merged.session_insights_points = rightInsights;
      merged.session_insights_text = rightInsights.join(" ");
    } else if (
      (!merged.session_insights_text || merged.session_insights_text.trim() === "") &&
      extra.session_insights_text &&
      extra.session_insights_text.trim() !== ""
    ) {
      merged.session_insights_text = extra.session_insights_text;
    }

    if (
      (!merged.raw_panel_text || merged.raw_panel_text.length < 50) &&
      extra.raw_panel_text &&
      extra.raw_panel_text.length >= 50
    ) {
      merged.raw_panel_text = extra.raw_panel_text;
    }

    return merged;
  }

  function isLikelyDetailPanelElement(element) {
    if (!element || !isVisibleElement(element)) return false;
    const text = getElementText(element);
    if (!text || text.length < 180) return false;
    if (!/Entry:/i.test(text)) return false;
    if (!/Referrer:/i.test(text)) return false;
    if (!/Duration:/i.test(text)) return false;
    if (!/User ID:/i.test(text) && !/Clicks:/i.test(text)) return false;
    return true;
  }

  function getActiveDetailPanelCandidate() {
    const nodes = Array.from(document.querySelectorAll("aside, section, div, article"));
    let best = null;
    let bestScore = -1;

    for (const node of nodes) {
      if (!isLikelyDetailPanelElement(node)) continue;
      const text = getElementText(node);
      let score = 0;
      if (/Session insights/i.test(text)) score += 60;
      if (/Your insights are powered/i.test(text)) score += 20;
      if (/More details/i.test(text)) score += 10;
      if (/User ID:/i.test(text)) score += 10;
      if (/Entry:/i.test(text) && /Exit:/i.test(text)) score += 10;
      const rect = node.getBoundingClientRect();
      if (rect.left < window.innerWidth * 0.45) score += 8;
      if (rect.width >= 220) score += 6;
      if (text.length > 450) score += 6;
      if (text.length > 2200) score -= 20;

      if (score > bestScore) {
        best = node;
        bestScore = score;
      }
    }

    return best;
  }

  function extractActiveDetailSession() {
    const panel = getActiveDetailPanelCandidate();
    if (!panel) return null;
    try {
      return parsePanel(panel, 0);
    } catch {
      return null;
    }
  }

  function cleanPathLikeValue(value) {
    if (!value) return value;
    const trimmed = normalizeWhitespace(value);
    const first = trimmed.split(/\s+/)[0];
    return first || trimmed;
  }

  function parseDurationToSeconds(durationText) {
    if (!durationText) return null;
    const parts = durationText.split(":").map((part) => Number.parseInt(part, 10));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    }
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return null;
  }

  function extractSessions() {
    const candidates = getCandidateElements();
    const sessions = candidates.map((element, index) => parsePanel(element, index));
    return dedupeSessions(sessions);
  }

  async function extractSessionsByAutoScroll(options = {}) {
    const maxSteps = Math.max(1, Math.min(300, Number(options.maxSteps) || 80));
    const stepDelayMs = Math.max(80, Math.min(2000, Number(options.stepDelayMs) || 250));
    const scroller = findLikelyListScroller();
    const collected = [];
    const processedCards = new Set();
    let staleSteps = 0;
    let previousTop = scroller.scrollTop;
    let steps = 0;
    let clickedCards = 0;
    let enrichedSessions = 0;
    let insightSessions = 0;

    for (let i = 0; i < maxSteps; i += 1) {
      steps = i + 1;
      const visibleCards = getCandidateElements(scroller);
      let addedThisStep = 0;

      for (let cardIndex = 0; cardIndex < visibleCards.length; cardIndex += 1) {
        const card = visibleCards[cardIndex];
        let summary;
        try {
          summary = parsePanel(card, cardIndex);
        } catch {
          continue;
        }
        const processingKey = getProcessingKey(summary);
        if (processedCards.has(processingKey)) {
          continue;
        }
        processedCards.add(processingKey);

        await clickCardAndWait(card, stepDelayMs);
        let detailed = summary;
        try {
          detailed = parsePanel(card, cardIndex);
        } catch {
          detailed = summary;
        }

        const activeDetail = extractActiveDetailSession();
        if (activeDetail) {
          if (
            isLikelySameSessionForMerge(summary, activeDetail) ||
            isLikelySameSessionForMerge(detailed, activeDetail)
          ) {
            detailed = mergeSessionRecords(detailed, activeDetail);
          }
        }

        const globalSessions = extractSessions();
        const matched = findBestMatch(summary, globalSessions);
        if (matched) {
          detailed = mergeSessionRecords(detailed, matched);
        }

        detailed = await enrichSessionFromDetails(summary, detailed, card, stepDelayMs);

        collected.push(detailed);
        clickedCards += 1;
        addedThisStep += 1;
        if (scoreSessionCompleteness(detailed) >= 4) {
          enrichedSessions += 1;
        }
        if (
          detailed.session_insights_text &&
          String(detailed.session_insights_text).trim() !== ""
        ) {
          insightSessions += 1;
        }
        await sleep(Math.max(40, Math.floor(stepDelayMs * 0.5)));
      }

      const dedupedCount = dedupeSessions(collected).length;

      const nearBottom =
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 6;
      const nextTop = Math.min(
        scroller.scrollTop + Math.max(120, Math.floor(scroller.clientHeight * 0.9)),
        scroller.scrollHeight
      );
      scroller.scrollTop = nextTop;
      await sleep(stepDelayMs);

      const moved = Math.abs(scroller.scrollTop - previousTop) > 1;
      previousTop = scroller.scrollTop;

      if (addedThisStep === 0 && (!moved || nearBottom)) {
        staleSteps += 1;
      } else {
        staleSteps = 0;
      }

      if (staleSteps >= 3) {
        return {
          sessions: dedupeSessions(collected),
          meta: {
            mode: "auto_scroll",
            steps,
            endReached: true,
            dedupedCount,
            clickedCards,
            enrichedSessions,
            insightSessions,
            processedCards: processedCards.size,
          },
        };
      }
    }

    return {
      sessions: dedupeSessions(collected),
      meta: {
        mode: "auto_scroll",
        steps,
        endReached: false,
        dedupedCount: dedupeSessions(collected).length,
        clickedCards,
        enrichedSessions,
        insightSessions,
        processedCards: processedCards.size,
      },
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (!message) return;

    if (message.type === "EXTRACT_CLARITY_SESSIONS") {
      try {
        const sessions = extractSessions();
        sendResponse({
          ok: true,
          sessionCount: sessions.length,
          sessions,
          meta: { mode: "visible_only" },
        });
      } catch (error) {
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
      return;
    }

    if (message.type === "EXTRACT_CLARITY_SESSIONS_ALL") {
      extractSessionsByAutoScroll(message.options || {})
        .then((result) => {
          sendResponse({
            ok: true,
            sessionCount: result.sessions.length,
            sessions: result.sessions,
            meta: result.meta,
          });
        })
        .catch((error) => {
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          });
        });
      return true;
    }
  });
})();
