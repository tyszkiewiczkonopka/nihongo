---
project: nihongo
version: 1
status: draft
created: 2026-07-03
context_type: brownfield
product_type: web app (static site)
target_scale: internal only, single user
timeline_budget: no hard deadline, hobby pace, after-hours
---

# PRD: Nihongo

## Current System Overview

Nihongo is a Cloudflare Workers static site with a home menu and two quiz pages (numbers, and a combined hours/age/class-year counters quiz). Each page is a single self-contained HTML file with inline styles and inline JS; the Worker only proxies requests to static assets. Tech stack: Cloudflare Workers + Wrangler, vanilla HTML/CSS/JS, no framework, no build step.

## Problem Statement & Motivation

After two days of real practice, the user surfaced a mix of gaps driving this round of change: content-accuracy gaps (counters shown in hiragana when kanji fits the user's memorization goals better), UX friction (no Enter-to-advance, an unwanted streak counter, hard-to-parse mistake feedback), missing reference content (grammar/vocab notes already drafted elsewhere but not in the app), a missing feature under consideration (audio, parked), and cosmetic/identity gaps (name, favicon).

## User & Persona

Single user (the app owner) — an experienced language learner with strong personal pedagogical preferences. Existing apps/sites for Japanese practice don't match their expectations on either theory or practice content, which is why this is a bespoke tool built to their own spec rather than an off-the-shelf product.

## Success Criteria

**Primary**: Pressing Enter submits/checks the current answer, exactly mirroring the existing click-based check action — no double-submission, no interference with the answer-reveal state once feedback is showing.

**Secondary**: Counters displayed in kanji instead of hiragana (close second priority — kanji shapes are easy to confuse visually, so seeing them repeatedly is the main lever for memorizing them).

**Guardrails**: Enter-key handling must not break or duplicate the existing click-to-check/reveal flow — the two input paths (click, Enter) must resolve to the same single action per question.

## User Stories

- **FR-001**: Given I'm practicing on a keyboard, when I press Enter, then my answer is checked (same as clicking), so I don't have to reach for the mouse mid-practice.
- **FR-002**: Given I'm practicing counters, when a counter is displayed, then it appears in kanji (not hiragana), so repeated exposure builds shape recognition.
- **FR-003**: Given I'm practicing numbers, when I start a session, then questions are drawn from one combined range pool instead of a range I must re-select, so I don't have to re-select a range and re-encounter the same numbers repeatedly.
- **FR-004**: Given I'm using the quiz, when I view the UI, then no streak indicator is shown, so the UI only shows what helps me study.
- **FR-005**: Given I'm on any quiz page, when I open the hint panel, then I see grammar/vocab reference notes, available identically on every quiz page, so I can look something up without leaving practice.
- **FR-006/FR-007**: Given I'm using the app, when I look at the tab/title, then I see a distinct name and favicon instead of generic defaults, so the app feels like mine.
- **FR-008**: Given I answer incorrectly on the numbers page (Number→Japanese direction), when the correct romaji is shown, then it's grouped by place value (thousands/hundreds/tens/ones), so I can immediately see which digit I got wrong instead of parsing one long unbroken string.

## Scope of Change

| FR | Requirement | Priority | Classification |
|---|---|---|---|
| FR-001 | Enter key submits/checks the answer | must-have | modified |
| FR-002 | Counters displayed in kanji instead of hiragana | must-have | modified |
| FR-003 | Combined single pool for number ranges | nice-to-have | modified |
| FR-004 | Remove streak indicator | nice-to-have | modified (removal) |
| FR-005 | Hint/info panel for grammar & vocab notes, consistent across all quiz pages | nice-to-have | new |
| FR-006 | Favicon | nice-to-have | new |
| FR-007 | App rename (e.g. "Nihongo Dojo", name still tentative) | nice-to-have | modified |
| FR-008 | Group corrected romaji by place value on wrong answers (numbers page, Number→Japanese) | must-have | modified |
| FR-010 | Core verification loop (prompt → answer → check) | must-have | preserved |

Note: FR-009 (audio) was considered during shaping and reassigned to Non-Goals — see below.

## Constraints & Compatibility

- Must preserve: the core verification loop — prompt shown → answer written → answer checked. This is the one mechanic that must survive every change; without it the app stops making sense as a study tool.
- No gamification mechanics (streaks, badges, points) — standing constraint, not just this round (drives FR-004).
- Only the hint/notes panel (FR-005) needs consistent presence/behavior across all quiz pages; other features (e.g. kanji display) are scoped to where they apply and don't set a cross-page consistency precedent.
- Usage is roughly 50/50 keyboard (desktop) and touchscreen (mobile) — inputs need to work well on both; keyboard support (FR-001) is an addition, not a shift to keyboard-first design.
- No performance/scale requirements — single personal user, static site.
- FR-001 guardrail: must not let the user advance past a wrong answer without the correct-answer feedback having been shown. Exact mechanism TODO — see Open Questions.
- FR-008 note: romaji remains the primary practice representation for the Number→Japanese direction (fastest to type, works well with keyboard/mobile autocomplete) — this is a display/formatting fix only, not a shift away from romaji.

## Business Logic Changes

No change. Question selection is uniform random from the applicable pool (across counters, and — once FR-003 lands — across the combined number range). This round does not modify that rule; no new selection logic (e.g. mistake-weighted, spaced repetition) is being introduced or should be assumed for later.

## Access Control Changes

No change. No auth — the app is reached via a plain URL only the user knows. This is deliberate (single personal user, easiest possible access) and is not changing as part of this round of work.

## Non-Goals

- Audio pronunciation (originally FR-009) is explicitly out of scope for this round — parked pending deeper research into feasibility, quality, and cost (free options may be poor quality/counterproductive; paid options may not be worth the cost).
- No new quiz topics/categories beyond numbers and counters this round.
- No accounts or multi-user support — stays single-user, no login, no per-user data separation.
- No change to question-selection logic — random selection stays as-is, no mistake-weighting or spaced repetition.

## Open Questions

- FR-001: what specific mechanism prevents Enter from skip-advancing past unread feedback (e.g. separate keypress for advance vs. check, minimum display time, distinct button state)? Deferred to plan phase.
- FR-006: no icon/logo concept chosen yet for the favicon.
- FR-007: "Nihongo Dojo" is a tentative name only — not finalized, open to being challenged/changed.
- FR-009 (audio): parked; needs dedicated research on feasibility/quality/cost before it re-enters scope.

## Forward: technical notes

- FR-005 (hint panel): user's own guidance is that it should be "collapsed/opt-in, not always-on" so it doesn't compete visually with the practice flow. This is an implementation-level affordance, not a PRD-level requirement — carry it into the plan phase as a design constraint.
