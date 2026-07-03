# Plan: Quiz Improvements (Round 1)

## Overview

Ship the first round of quiz improvements surfaced after two days of real practice: a keyboard bug fix (Enter), two display/content changes (kanji counters, romaji grouping), and two additions (shared hint panel, placeholder favicon) — while removing streak/gamification and the numbers range selector.

## Current State Analysis

- [public/numbers.html](../../../public/numbers.html) and [public/counters.html](../../../public/counters.html) are fully self-contained pages (inline `<style>`/`<script>`, no shared files); [public/index.html](../../../public/index.html) is the home menu. No test suite, no lint config, no CI ([AGENTS.md](../../../AGENTS.md)).
- Enter already calls `checkAnswer()` via a keydown listener on both pages ([numbers.html:388-390](../../../public/numbers.html), [counters.html:492-494](../../../public/counters.html)), and `checkAnswer()` already advances on a second call (`if (answered) { nextQuestion(); return; }`, [numbers.html:358](../../../public/numbers.html)). But `checkAnswer()` sets `answerInput.disabled = true` after checking ([numbers.html:363](../../../public/numbers.html), [counters.html:467](../../../public/counters.html)), and a disabled input cannot receive further keydown events — so the second Enter press currently does nothing.
- Both pages render an identical `.stats` block with correct/wrong/streak ([numbers.html:256-260](../../../public/numbers.html), [counters.html:275-279](../../../public/counters.html)), with `streak` tracked and reset in `checkAnswer()` ([numbers.html:313,381](../../../public/numbers.html), [counters.html:409,485](../../../public/counters.html)).
- The numbers page has a `<select id="rangeSelect">` with four range options ([numbers.html:230-235](../../../public/numbers.html)); `randNum()` reads its value as the max ([numbers.html:316-319](../../../public/numbers.html)); a change listener re-rolls the question ([numbers.html:387](../../../public/numbers.html)).
- `counters.html`'s `counters` object ([counters.html:336-404](../../../public/counters.html)) gives each counter (hours, age, class) a `toHiragana` method, called wherever Japanese text is shown to the user to read ([counters.html:451,475](../../../public/counters.html)). Hiragana lookup tables: `hourH`, `ageOnesH`/`ageTensZeroH`, `classH` ([counters.html:287,297-300,303](../../../public/counters.html)), plus `minutesH` ([counters.html:311-316](../../../public/counters.html)).
- `numbers.html`'s `toRomaji(n)` ([numbers.html:285-295](../../../public/numbers.html)) concatenates thousands/hundreds/tens/ones parts with zero separators (e.g. "gosensanbyakuyonjuugo"), and `checkAnswer()` displays that raw string directly as feedback ([numbers.html:372,374](../../../public/numbers.html)).
- No shared JS/CSS file exists anywhere in `public/`.

## Desired End State

- Enter reliably checks an answer, then advances to the next question on a second press, on both quiz pages — matching click behavior exactly, no added safeguard (explicitly accepted).
- Streak is gone from both pages; only correct/wrong remain.
- The numbers page always draws from the full 1–9999 pool; the range selector is gone.
- Counters (hours, age, class year) display full kanji numerals + kanji counter suffix (時/歳/年生) wherever Japanese is shown for the user to read; typed answers stay romaji, unaffected.
- Wrong-answer romaji feedback on the numbers page is grouped by place value, readable at a glance; the underlying accepted-answer matching is unchanged.
- A collapsed-by-default hint panel, backed by a shared `public/notes.js`, is available identically on both quiz pages.
- All three pages show a placeholder 🎌-based favicon.

## What We're NOT Doing

- Not adding audio (parked, needs separate research — per PRD Non-Goals).
- Not adding new quiz topics/categories beyond numbers and counters.
- Not adding accounts, login, or multi-user support.
- Not changing question-selection logic — stays uniform random.
- Not renaming the app this round (FR-007 deferred until the name is settled).
- Not adding any cooldown/second-key safeguard around Enter — explicitly accepted risk.
- Not designing a real logo — favicon is an explicit placeholder.

## Implementation Approach

Three phases, ordered by risk and dependency: quick isolated UX fixes first (Phase 1), then display/content-only changes that touch existing conversion logic (Phase 2), then net-new additions that introduce the first shared file in this codebase (Phase 3). Each phase is independently shippable and touches a distinct, non-overlapping slice of the two quiz pages.

---

## Phase 1: Quick UX Fixes

### Overview

Fix Enter to reliably check-then-advance, remove the streak stat, and remove the numbers-page range selector in favor of one combined 1–9999 pool.

### Changes Required

**`public/numbers.html`, `public/counters.html`** — Fix Enter (FR-001)
- Intent: stop the second Enter press from going dead after checking an answer.
- Contract: replace `answerInput.disabled = true` with `answerInput.readOnly = true` in `checkAnswer()` (and reset `readOnly = false` in `nextQuestion()` alongside the existing `disabled = false` reset). A read-only input stays focusable and keeps receiving `keydown`, but its text can't be edited — so the existing `if (answered) { nextQuestion(); return; }` branch fires on the second Enter exactly as it already does for a second click.

**`public/numbers.html`, `public/counters.html`** — Remove streak (FR-004)
- Intent: drop the streak stat and its state from both pages.
- Contract: `.stats` contains only the correct and wrong `.stat` blocks; the `streak` variable, its increment/reset in `checkAnswer()`, and the `statStreak` element are removed from both files.

**`public/numbers.html`** — Combine number ranges into one pool (FR-003)
- Intent: always practice across the full range instead of a user-selected subset.
- Contract: `randNum()` returns `Math.floor(Math.random() * 9999) + 1` unconditionally; the `#rangeSelect` element, its `<option>`s, and its `change` listener are removed from the page.

### Success Criteria

**Automated**: `npm run dev` starts without errors (no test suite or lint config exists in this repo).

**Manual**:
- On both `/numbers` and `/counters`: type an answer, press Enter (checks), press Enter again (advances) — repeat for several questions without touching the mouse.
- Clicking "Check" then "Next →" still works exactly as before on both pages.
- The stats row shows only correct/wrong on both pages; no console errors reference `streak` or `statStreak`.
- On `/numbers`, no range selector is visible; over ~15-20 questions, both small (1-2 digit) and large (4-digit) numbers appear in the same session.

---

## Phase 2: Display/Content Changes

### Overview

Switch counters from hiragana to full kanji numerals + suffix for anything the user reads, and group romaji feedback on the numbers page by place value.

### Changes Required

**`public/counters.html`** — Kanji numerals for counters (FR-002)
- Intent: add kanji-numeral equivalents for each counter (hours, age, class year, and hour-minutes), and use them everywhere the user currently reads hiragana — the post-check sub-hint in "→ Japanese" mode, and the prompt display in "Japanese →" mode. Typed-answer checking (`toRomaji`/`jpAnswers`) is untouched.
- Contract: each counter config gains a `toKanji(...)` method with the same signature as its existing `toHiragana(...)`; `nextQuestion()` and `checkAnswer()` call `toKanji` wherever they currently call `toHiragana` for user-facing display. Kanji numeral tables (units, tens, hundreds as needed for 1-99, plus 時/歳/年生/分 suffixes and the 二十歳 irregular case) are added alongside the existing hiragana tables, following the same per-digit lookup structure already used by `hourH`/`ageOnesH`/`ageTensZeroH`/`classH`/`minutesH`.

**`public/numbers.html`** — Group romaji feedback by place value (FR-008)
- Intent: make the correct-answer romaji shown after a wrong guess easy to scan, without changing what counts as a correct typed answer.
- Contract: add a `toRomajiDisplay(n)` that returns the same thousands/hundreds/tens/ones parts as `toRomaji(n)` but joined with a space between each non-empty chunk. `checkAnswer()`'s "Answer: ..." and "Accepted: ..." feedback text uses `toRomajiDisplay`; the correctness check keeps using `toRomaji` + `normalize()` unchanged (which already strips whitespace, so this is purely cosmetic).

### Success Criteria

**Automated**: `npm run dev` starts without errors.

**Manual**:
- On `/counters`, in "→ Japanese" mode, the sub-hint after checking shows kanji (e.g. 五時, 二十歳, 三年生) for all three counter types, including the 20-years-old irregular case (はたち → 二十歳).
- On `/counters`, in "Japanese →" mode, the prompt itself is shown in kanji.
- On `/numbers`, deliberately answering a 4-digit number incorrectly shows the correct romaji visibly grouped by place value (e.g. "gosen sanbyaku yonjuu go"), and typing the correct answer with no spaces is still accepted as correct.

---

## Phase 3: New Additions

### Overview

Introduce a shared, structured notes file and a collapsed-by-default hint panel on both quiz pages, plus a placeholder favicon on all three pages.

### Changes Required

**`public/notes.js` (new)** — Shared hint content (FR-005)
- Intent: hold the user's existing grammar/vocab reference material (numbers explained; counters irregularities) as structured data that both quiz pages can render identically, as the one deliberate exception to this codebase's fully-self-contained-page convention.
- Contract: `notes.js` defines `const NOTES = [{ id, title, body }, ...]` (plain JS, no build step, loaded via `<script src="notes.js">`). Adding a future topic is appending one more entry — no restructuring needed as content grows.
- Note: the actual note content needs to come from the user (already drafted in prior conversations) — this is content to paste in during implementation, not to invent.

**`public/numbers.html`, `public/counters.html`** — Hint panel (FR-005)
- Intent: let the user open reference notes from either quiz page without leaving practice, without competing visually with the practice flow.
- Contract: both pages load `notes.js` and add a small toggle control that shows/hides a panel listing `NOTES` topics, each independently expandable; collapsed by default on page load.

**`public/index.html`, `public/numbers.html`, `public/counters.html`** — Placeholder favicon (FR-006)
- Intent: give all three pages a consistent tab icon without waiting on a real logo.
- Contract: each page's `<head>` includes an identical `<link rel="icon" ...>` pointing to an inline SVG/data-URI favicon reusing the 🎌 emoji already used in the app's headers.

### Success Criteria

**Automated**: `npm run dev` starts without errors; `notes.js` loads with no console errors on either quiz page.

**Manual**:
- Opening the hint panel on `/numbers` and on `/counters` shows the same topic list and content.
- The panel is collapsed on page load and doesn't obscure the practice card.
- The 🎌 favicon appears in the browser tab on all three pages (home, numbers, counters).

---

## Testing Strategy

No automated test suite exists in this repo (confirmed in [AGENTS.md](../../../AGENTS.md)), so verification is manual via `npm run dev` (`wrangler dev`) for every phase: exercise both quiz directions on both pages, check the browser console for errors, and confirm each phase's Manual success criteria above before moving to the next phase.

## References

- [docs/project/shape-notes.md](../../project/shape-notes.md)
- [docs/project/prd.md](../../project/prd.md)

## Progress

- [x] Phase 1: Quick UX fixes (Enter fix, remove streak, combine number ranges)
- [x] Phase 2: Display/content changes (kanji counters, romaji grouping)
- [x] Phase 3: New additions (shared hint panel + notes.js, placeholder favicon)
