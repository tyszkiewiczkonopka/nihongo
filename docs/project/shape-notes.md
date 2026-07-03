---
project_name: nihongo
context_type: brownfield
product_type: web app (static site)
target_scale: internal only, single user
timeline_budget: no hard deadline, hobby pace, after-hours
---

# Shape Notes

## Vision & Problem Statement

Pain or gap driving this change: after two days of real practice, content-accuracy gaps (counters shown in hiragana when kanji fits the user's memorization goals better), UX friction (no Enter-to-advance, an unwanted streak counter, hard-to-parse mistake feedback), missing reference content (grammar/vocab notes already drafted elsewhere), a missing feature (audio), and cosmetic/identity gaps (name, favicon).

## Current System

Nihongo is a Cloudflare Workers static site with a home menu and two quiz pages (numbers, and a combined hours/age/class-year counters quiz). Each page is a single self-contained HTML file with inline styles and inline JS; the Worker only proxies requests to static assets. Tech stack: Cloudflare Workers + Wrangler, vanilla HTML/CSS/JS, no framework, no build step.

## User & Persona

Single user (the app owner) — an experienced language learner with strong personal pedagogical preferences. Existing apps/sites for Japanese practice don't match their expectations on either theory or practice content, which is why this is a bespoke tool built to their own spec rather than an off-the-shelf product.

## Access Control

No auth — the app is reached via a plain URL only the user knows. This is deliberate (single personal user, easiest possible access) and is not changing as part of this round of work.

## Success Criteria

**Primary**: Pressing Enter submits/checks the current answer, exactly mirroring the existing click-based check action — no double-submission, no interference with the answer-reveal state once feedback is showing.

**Secondary**: Counters displayed in kanji instead of hiragana (close second priority — kanji shapes are easy to confuse visually, so seeing them repeatedly is the main lever for memorizing them).

**Guardrails**: Enter-key handling must not break or duplicate the existing click-to-check/reveal flow — the two input paths (click, Enter) must resolve to the same single action per question.

## Constraints & Preserved Behavior

Must preserve: the core verification loop — prompt shown → answer written → answer checked. This is the one mechanic that must survive every change; without it the app stops making sense as a study tool.

## Functional Requirements

| FR | Requirement | Priority | Feature | Notes / guardrails |
|---|---|---|---|---|
| FR-001 | User can submit/check the answer by pressing Enter (mirrors the click action) | must-have | modified | Guardrail: must not let the user advance past a wrong answer without the correct-answer feedback having been shown. Exact mechanism deferred to plan phase. |
| FR-002 | User sees counters displayed in kanji instead of hiragana | must-have | modified | Difficulty reading kanji at first is accepted as intentional friction — it's the point (shape memorization), not a flaw to fix. |
| FR-003 | User practices numbers from one combined pool instead of choosing among 4 separate ranges | nice-to-have | modified | No counter-argument. |
| FR-004 | Streak indicator is removed from the UI | nice-to-have | modified (removal) | No counter-argument — no gamification wanted (streaks, badges, etc. don't work for this user). |
| FR-005 | User can open a hint/info panel with grammar & vocab reference notes (numbers explained + counters irregularities table), accessible identically from every quiz page | nice-to-have | new | Guardrail: must not compete visually with the practice flow — collapsed/opt-in, not always-on. Needs real design thought before implementation. |
| FR-006 | App has a favicon | nice-to-have | new | Icon/logo choice still undecided (open question). |
| FR-007 | App is renamed (e.g. "Nihongo Dojo") | nice-to-have | modified | No counter-argument to renaming itself; the specific name is a tentative best guess, still open to change. |
| FR-008 | When an answer is wrong on the numbers page (Number→Japanese direction), the correct romaji is displayed with clearer grouping by place value (thousands / hundreds / tens / ones) so a wrong digit is easy to spot | must-have | modified | Romaji is the primary practice representation for this direction (fastest to type, works well with keyboard/mobile autocomplete) — it stays primary. This is a display/formatting fix only, not a shift away from romaji. |
| FR-010 | (preserved) User can see the prompt, write an answer, and get it checked | must-have | preserved | The one mechanic that must survive every change. |

## User Stories

- As a solo learner typing on a keyboard, I want to press Enter to check my answer so I don't have to reach for the mouse mid-practice.
- As a learner memorizing counter kanji, I want counters shown in kanji (not hiragana) so repeated exposure builds shape recognition.
- As a learner who just wants to drill numbers, I want one combined range pool so I don't have to re-select a range and re-encounter the same numbers repeatedly.
- As someone who finds streaks distracting, I want the streak indicator gone so the UI only shows what helps me study.
- As a learner with existing grammar/vocab notes, I want a hint panel available on every quiz page (not just one) so I can look something up without leaving practice.
- As someone who wants the app to feel like mine, I want a distinct name and favicon instead of generic defaults.
- As a learner typing romaji for Number→Japanese, I want the corrected romaji grouped by place value when I'm wrong, so I can immediately see which digit I got wrong instead of parsing one long unbroken string.

## Business Logic

Question selection is uniform random from the applicable pool (across counters, and — once FR-003 lands — across the combined number range). This round of changes does not modify that rule; no new selection logic (e.g. mistake-weighted, spaced repetition) is being introduced or should be assumed for later.

## Non-Functional Requirements

- No gamification mechanics (streaks, badges, points) — standing constraint, not just this round (drives FR-004).
- Only the hint/notes panel (FR-005) needs consistent presence/behavior across all quiz pages; other features (e.g. kanji display) are scoped to where they apply and don't set a cross-page consistency precedent.
- Usage is roughly 50/50 keyboard (desktop) and touchscreen (mobile) — inputs need to work well on both; keyboard support (FR-001) is an addition, not a shift to keyboard-first design.
- No performance/scale requirements — single personal user, static site.

## Non-Goals

- Audio pronunciation (originally FR-009) is explicitly out of scope for this round — parked pending deeper research into feasibility, quality, and cost (free options may be poor quality/counterproductive; paid options may not be worth the cost).
- No new quiz topics/categories beyond numbers and counters this round.
- No accounts or multi-user support — stays single-user, no login, no per-user data separation.
- No change to question-selection logic — random selection stays as-is, no mistake-weighting or spaced repetition.
