function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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
