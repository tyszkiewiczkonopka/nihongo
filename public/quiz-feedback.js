function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// When several correct answers are accepted (e.g. "ku"/"kyuu" for 9), diffing
// against variants[0] can highlight a variant spelling as a mistake even though
// the user's real error is elsewhere. Pick whichever accepted variant is
// closest to what the user typed so the diff only flags the actual mistake.
function pickClosestVariant(variants, rawInput, preprocess) {
  preprocess = preprocess || (s => s.trim().toLowerCase());
  const userNorm = preprocess(rawInput);
  let best = variants[0];
  let bestDist = Infinity;
  for (const variant of variants) {
    const dist = levenshtein(preprocess(variant), userNorm);
    if (dist < bestDist) { bestDist = dist; best = variant; }
  }
  return best;
}

// Highlights only the substring of `correctDisplay` that the user got wrong,
// wrapping that middle span in .wrong-part and leaving the rest as plain text.
// `preprocess` mirrors the quiz's own normalize() so macrons/case line up before diffing.
function diffHighlight(correctDisplay, rawInput, preprocess) {
  preprocess = preprocess || (s => s.trim().toLowerCase());
  const dispChars = [...correctDisplay];
  const compChars = [];
  dispChars.forEach((ch, i) => {
    if (!/\s/.test(ch)) compChars.push({ ch: ch.toLowerCase(), idx: i });
  });
  const userChars = [...preprocess(rawInput)].filter(ch => !/\s/.test(ch));

  let prefix = 0;
  while (prefix < compChars.length && prefix < userChars.length && compChars[prefix].ch === userChars[prefix]) prefix++;

  let suffix = 0;
  const maxSuffix = Math.min(compChars.length - prefix, userChars.length - prefix);
  while (suffix < maxSuffix && compChars[compChars.length - 1 - suffix].ch === userChars[userChars.length - 1 - suffix]) suffix++;

  const startIdx = prefix < compChars.length ? compChars[prefix].idx : dispChars.length;
  const endIdx = (compChars.length - suffix > prefix) ? compChars[compChars.length - suffix - 1].idx + 1 : startIdx;

  const before = escapeHtml(dispChars.slice(0, startIdx).join(''));
  const mid = escapeHtml(dispChars.slice(startIdx, endIdx).join(''));
  const after = escapeHtml(dispChars.slice(endIdx).join(''));

  if (!mid) return escapeHtml(correctDisplay);
  return before + '<span class="wrong-part">' + mid + '</span>' + after;
}

// Assembles the feedback banner's inner HTML: a main line plus an optional
// secondary romaji line (used when quizzing Japanese -> number/value).
function feedbackHtml(mainHtml, romajiText) {
  let html = '<span class="feedback-main">' + mainHtml + '</span>';
  if (romajiText) html += '<span class="feedback-romaji">' + escapeHtml(romajiText) + '</span>';
  return html;
}
