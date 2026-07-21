# Nihongo Dojo — Design System

The visual and interaction system for the app. It exists so the **quiz pages** and the
**notes/reference pages** read as one product: a calm, editorial, Japanese-stationery
aesthetic (warm "washi" paper, indigo ink, a vermillion/hanko accent) rather than a
generic web form.

## Pages & roles

| File | Role | Styling source |
|------|------|----------------|
| `public/index.html` | Home / entry point — menu of quizzes | `public/quiz.css` |
| `public/numbers.html` | Numbers quiz (1–9999, both directions) | `public/quiz.css` |
| `public/counters.html` | Counters quiz (hours / age / class year) | `public/quiz.css` |
| `public/notes.html` | Reference: number & counter irregularities + number builder | self-contained `<style>` |
| `public/notes.js` | Shared `NOTES` data (`{id, title, href}`) linking quizzes → notes | — |
| `public/favicon.png` | Enso-circle logo (180×180), also used as the in-app logo | — |

**The three quiz pages share `public/quiz.css`.** The single notes page keeps its own
inline `<style>` (it is visually complete and treated as a **finalized reference design** —
do not restyle it unless explicitly asked). The quiz pages were deliberately brought *up to*
the notes page's look; the notes page is the reference, not the other way around. It uses the
vermillion "red-pen" palette (see below) and contains only irregularities plus the interactive
number builder.

Served as static assets by Cloudflare Workers (`wrangler.jsonc`, `assets.directory = ./public`).
No build step, no framework — plain HTML/CSS/JS.

## Fonts

Loaded from Google Fonts in every page `<head>` (same URL across all 5 pages so it caches once):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

Three faces, each with a fixed job — this is the core of the type system:

| Face | Role | Where |
|------|------|-------|
| **Shippori Mincho** (serif) | Japanese text, numerals, headings, wordmark | h1, brand wordmark, `.number-display`, `.sub-hint`, kanji, menu titles, notes headings |
| **IBM Plex Mono** | Data, labels, controls, eyebrows | input, `.stat-num`, `.accepted`, `.ampm-badge`, `.mode-btn`, `.quiz-tab`, `.stat-label`, `.unit-label`, `.menu-sub`, notes romaji/labels |
| **Inter** | Body copy & primary CTAs | `body` default, `.feedback`, `.btn-primary` (Check/Next), notes body/`.sec-desc` |

Rules of thumb:
- **Small labels** (prompt, stat, unit) use the "eyebrow" treatment: IBM Plex Mono, ~10–11px,
  `text-transform: uppercase`, `letter-spacing: 0.06–0.08em`, `var(--ink-soft)`.
- **Numbers and romaji are always mono** — mirrors how the notes pages render readings.
- **Japanese glyphs and display numerals are always serif.**
- **⚠️ `<button>` does not inherit `font-family`.** The base `button` rule in `quiz.css`
  sets `font-family: 'Inter', sans-serif` explicitly. Without it buttons fall back to Arial —
  this was a real bug that made the whole UI look unstyled. Any new button must get an explicit
  family (Inter for CTAs, IBM Plex Mono for toggle/pill controls).

## Color tokens

### Quiz pages — `public/quiz.css` `:root`
Light and dark redeclare the **same variable names**, so every rule references `var(--x)` once
and dark mode falls out automatically (`@media (prefers-color-scheme: dark)`).

| Token | Light | Dark | Use |
|-------|-------|------|-----|
| `--paper` | `#F2EDE1` | `#1A1A18` | body background |
| `--paper-alt` | `#E9E1CC` | `#242420` | prompt card, stat blocks, menu items |
| `--card` | `#FBF8F0` | `#26241F` | container, inputs, default buttons |
| `--ink` | `#1C2530` | `#F0F0EA` | primary text |
| `--ink-soft` | `#5B6472` | `#A9A79C` | secondary text, labels |
| `--indigo` | `#2B4570` | `#7C9BC9` | links, hint icon, focus, menu kanji |
| `--indigo-deep` | `#182B47` | `#3E5C8A` | active mode-btn fill |
| `--hanko` | `#B33A3A` | `#D9776A` | primary CTA, active-tab underline |
| `--gold` | `#A8823C` | `#C9A468` | reserved accent (highlights) |
| `--line` | `#D8CEB6` | `#3A3830` | borders |
| `--correct` / `--correct-bg` | `#166534` / `#DCFCE7` | `#86E0A6` / `#1E3A28` | correct feedback |
| `--wrong` / `--wrong-bg` | `#991b1b` / `#FEE2E2` | `#E39B95` / `#3A2320` | wrong feedback |

**`--hanko` (brand/CTA red) is intentionally distinct from `--wrong` (error red)** so the
primary button color and the "wrong answer" color never get confused.

### Notes page (reference palette, for consistency when editing it)
- `notes.html`: red-pen variant — `--paper #EDE7D9`, `--paper-dark #E1D9C6`,
  `--ink #2B2B29`, `--ink-soft #5C574E`, `--shu #C1440E` (vermillion), `--shu-soft #E8DCC8`,
  `--line #C9BFA8`. Irregular cards and "changed" builder tiles are outlined/filled with `--shu`.

The notes page has no dark mode (light-only by design). The quiz light palette is derived from
the earlier warm-indigo notes palette (`--paper #F2EDE1`, `--indigo #2B4570`, `--hanko #B33A3A`,
etc.); dark values in the quiz table were authored specifically for the quiz pages.

## Layout

- `body`: flex column, `align-items:center`, **`justify-content:flex-start`** with
  `padding-top: max(1rem, 8vh)`. Content is anchored near the top — **do not vertically center
  the whole viewport** (that left ~300px of dead space on mobile, the original bug).
  - **Exception — tablet/desktop portrait** (`min-width: 600px` and `min-height: 700px`):
    `justify-content: center` instead. Top-anchoring exists to avoid dead space below a *short*
    mobile viewport; on a tall/wide one the same top-anchor just moves the dead space to the
    bottom of the page instead of removing it. Past this size threshold there's enough room that
    centering reads as intentional. Mobile portrait (375×812) stays under the `min-width: 600px`
    gate and keeps the top-anchored behavior.
- `.wrap`: `max-width: 420px`, centered — the quiz column. (Notes pages use a wider `.wrap`,
  760–920px, since they're long-form reading.)
- `.container`: the card surface — `var(--card)`, `1px solid var(--line)`, `border-radius:16px`,
  flat (no drop shadow; the notes pages are flat too).
- Subtle fixed "washi" texture via `body::before` (two faint radial gradients).
- **Phone landscape** (`orientation: landscape` and `max-height: 500px`, scoped to
  `.quiz-container` — the class on `numbers.html`/`counters.html`'s `.container`, not the home
  menu): the portrait vertical stack doesn't fit without scrolling past the entire header/tabs/
  settings just to reach the number card. `.quiz-container` becomes a 2-column grid (`220px 1fr`)
  — settings (counter-type pills, direction toggle) in the left column, the actual quiz
  interaction (card/input/feedback/next/stats) in the right column, header/tabs spanning both
  columns on top. `align-items: start` on the grid is required — without it, grid's default
  `stretch` makes the short left-column controls balloon to match the tall card's row height.
  The grid itself gets `max-height` + `overflow-y: auto` as a fallback so Check/feedback/stats
  are one small scroll away instead of unreachable, rather than trying to compress everything
  to fit exactly (which fought readability). Not applied to the home menu (`index.html`) — its
  two-item list never had a landscape problem.

## Components

### Quiz header (numbers/counters only)
```html
<header class="quiz-header">
  <a class="brand-home" href="./"><img class="brand-logo" src="favicon.png" alt="" /> Nihongo Dojo</a>
  <a class="hint-link" href="…" target="_blank" rel="noopener" aria-label="Reference notes" title="Reference notes">
    <svg><!-- open-book icon, stroke=currentColor --></svg>
  </a>
</header>
<nav class="quiz-tabs">
  <a class="quiz-tab [active]" href="numbers">Numbers</a>
  <a class="quiz-tab [active]" href="counters">Counters</a>
</nav>
```
- **Logo**: the enso `favicon.png` (not an emoji) — 26px in headers, 40px on the home title.
- **Brand wordmark**: Shippori Mincho serif.
- **Hint link**: icon-only (open-book SVG, no text), 44px tap target, indigo → ink on hover.
  It links to the page's *own* note only, looked up from `NOTES` by `id`
  (`numbers-reference` / `counters-reference`). Opens in a new tab **on purpose** — preserves
  in-progress quiz state. The notes pages have no back-nav by design.
- **Tabs**: underline style (mono, active tab gets a `--hanko` bottom border) — deliberately
  different from the pill-shaped in-page toggles so page-nav ≠ in-page settings. Switching tabs
  is a normal page navigation between the two static files.

### Home menu (index only)
`.menu-item` rows: serif kanji icon (数 / 助, in indigo) + serif `.menu-title` + mono `.menu-sub`.

### In-page toggles — `.mode-btn` (pills)
Mono, `min-height:44px`. Default = outlined on `--card`; `.active` = filled `--indigo-deep`,
white text. Used for direction toggles and, on counters, the counter-type selector
(Hours / Age 歳 / Class 年生) — which **replaced a native `<select>`** so all controls share one
custom aesthetic. Counter buttons carry `data-counter="…"`; `setCounter(id)` toggles `.active`
and re-renders.

**Every `.mode-toggle` row is a single equal-width flex group** (`.mode-toggle .mode-btn { flex:1;
min-width:0 }`), never content-sized pills. Content-sized pills silently wrapped onto two stacked
lines once the combined label width exceeded the ~295px content column (verified live — this was
a real bug, not a hypothetical). `.mode-btn` sets `white-space: normal` specifically to override
the base `button` rule's `nowrap` — without it, long labels overflow their flex cell horizontally
instead of wrapping to a second line. **When adding any new segmented/toggle group, reuse this
flex:1 + min-width:0 + white-space:normal combination; don't hand-size pills to content.**

**Direction-toggle labels are a fixed universal pair: `123 → 日本語` / `日本語 → 123`.**
Earlier revisions spelled these out per quiz (`"Class year → Japanese"`, ~22 chars), which is what
caused the two-line wrapping bug above and duplicated the counter-type pill directly above it
(counters.html already states "Hours"/"Age"/"Class" one row up). `123` stands in for "whatever
numeric value this quiz drills" — it reads the same for numbers, hours, ages, and class years, so
`setCounter()` no longer needs to rewrite `#modeVal`/`#modeJp` text per counter type. The kanji
half is wrapped in `<span class="jp">` (`.mode-btn .jp { font-family: 'Shippori Mincho', serif;
font-size: 14px; }`) since Japanese glyphs are always serif, never mono, per the type system.
`.mode-btn` carries `gap: 4px` so the plain-text run and the `.jp` span space evenly around the
arrow — without it the arrow hugs whichever side is the kanji span.

On `counters.html`, two independent `.mode-toggle` groups stack directly (counter-type, then
direction). They intentionally share the same pill styling (both are in-page settings, not
navigation — see the quiz-tabs vs. mode-btn distinction below), so the only thing separating them
as two *different* decisions is space: the counter-type group carries `.counter-toggle`
(`margin-bottom: 2rem`), clearly more generous than the 6px gap *within* a row or the 1.5rem
before the prompt card. Don't zero out `.counter-toggle`'s margin via a `.controls .counter-toggle`
override — that collapsed the gap to 0 in an earlier pass and is exactly the mistake to avoid.

### Prompt card
The `.card` no longer carries a `.prompt-label` sentence (e.g. "How do you read this number in
Japanese?", "What time is this in Japanese?"). It was removed as redundant: the direction toggle
(`123 → 日本語` / `日本語 → 123`) already states the direction, the counter-type pills (Hours/Age/
Class, on counters.html) already state the category, and `.unit-label` still supplies the one
piece of context those don't ("years old", "grade / year"). The card is now just
`.number-display` (+ `.unit-label` where relevant) + `.sub-hint`. Don't re-add a restated question
here — if a future counter type needs disambiguation the toggle/pill labels are the place to add
it, not a new sentence in the card.

### Buttons
- `.btn-primary` (`#checkBtn`, `.check-btn`): filled `--hanko`, white, Inter 600, full-width;
  hover darkens via `filter: brightness(0.92)`. **One button does double duty as Check/Next** —
  there is no separate Next element anymore. `checkAnswer()` reads `answered`: if `false` it
  grades the input and flips the button's `textContent` to "Next →"; if already `true` (i.e. the
  button currently reads "Next →") it calls `nextQuestion()` instead, which resets the label back
  to "Check". This existed as an accidental behavior even when there were two buttons (`Check`
  already silently acted as `Next` once answered — the separate Next button was doing nothing
  Check didn't already do post-answer) — merging just made the one real state machine visible
  as one button instead of two.
  - **Submitting blank counts as a wrong attempt**, it doesn't silently skip. Typing nothing and
    pressing the button reveals the correct answer, marks it wrong, and flips to "Next →" — same
    as any other incorrect answer. This was a deliberate product decision (not just a dedup): the
    old separate Next button let you skip without any answer being scored at all, which is a
    different, since-removed behavior. If "skip without penalty" is ever wanted back, it needs
    its own explicit affordance — don't reintroduce it by special-casing blank input to bypass
    `answered`/scoring again.
- `.btn-secondary` / bare `<button>`: `--card` fill, `--line` border, `--ink` text.
- All ≥44px tall.

### Answer input
- `.input-row` is a **vertical stack** (input above full-width Check) — fixes long romaji
  answers (e.g. `rokusenshichihyakugojuugo`) getting clipped when input shared a row with the button.
- Input: IBM Plex Mono, 16px (avoids iOS focus-zoom), left-aligned, `--card` bg.
- Guidance lives **only in the `placeholder`** (IBM Plex Mono). The earlier separate hint line
  under the button was removed as redundant.

### Feedback / stats
- `.feedback` banner: `.correct` (green tokens, "正解！ Correct!") / `.wrong` (red tokens). The
  wrong-answer banner shows **only the bare correct answer** — no "不正解。" kanji prefix, no
  "Answer:" label. The colored banner (wrong = red tokens) already signals it was incorrect;
  restating that in words on top of the color was redundant.
- **`.feedback` is collapsed by default** (`max-height: 0; opacity: 0; padding: 0; margin-bottom: 0`)
  and only expands to its visible size when `.correct`/`.wrong` is applied. It used to reserve a
  fixed ~54px gap below the Check/Next button at all times (to avoid layout shift once feedback
  appeared) — but that meant every unanswered question showed a big empty gap for no visible
  reason. Collapsing it removes that dead space, and the expand/collapse is eased in over 0.25s
  (`cubic-bezier(0.25, 1, 0.5, 1)`, an ease-out-quart — no bounce) rather than snapping, so the
  stats line shifting down slightly reads as a deliberate reveal, not a jump. Respects
  `prefers-reduced-motion` (transition removed, state changes instantly). Don't re-add a static
  `min-height` here — that's exactly the gap this fixed.
- There is no separate "Accepted: …" line for alternate readings anymore (`.accepted` /
  `#acceptedLabel` were removed) — the wrong-answer banner shows one canonical answer, not every
  accepted variant.
- `.stats`: a single inline line — `3 correct · 1 wrong` — not two boxed cards. Two tinted,
  padded, rounded `.stat` containers for what's ultimately two numbers was exactly the kind of
  unnecessary card distill flags; a plain centered row (mono `.stat-num` + uppercase eyebrow
  `.stat-label`, `·` divider in `--line`) carries the same information without the extra chrome
  and reads quieter, which fits the "quiet confidence, not gamification" brand principle better
  than a stat-card treatment would. Don't reintroduce per-stat card backgrounds.

## Interaction / navigation model
- Two quizzes are separate static pages; the tab bar navigates directly between them, and the
  brand/logo returns Home. No SPA, no client routing.
- Enter submits an answer (keydown handler on the input); Check/Next are also buttons.
- Notes open in a new tab from the header hint icon.

## Accessibility
- **All interactive targets are ≥44px** (`.mode-btn`, `.quiz-tab`, `.brand-home`, `.hint-link`,
  buttons) — verified live via `getBoundingClientRect`.
- Icon-only hint link has `aria-label` + `title` ("Reference notes"); logo `<img>` is decorative
  (`alt=""`).
- Full dark mode via `prefers-color-scheme`; tokens chosen for legible contrast on dark paper.

## Verification (no automated tests)
Static site via `wrangler dev` on port 8787; verify in the live browser preview:
1. `/`, `/numbers`, `/counters` at **375×812 (mobile)** and a desktop width — no homepage dead
   space, no horizontal scroll. Also check **tablet portrait (768×1024)** — content should be
   vertically centered, not stranded near the top — and **phone landscape (e.g. 812×375)** — the
   quiz pages should reflow to the 2-column layout with settings on the left and the number
   card/input/Check reachable without excessive scrolling.
2. Tabs navigate correctly and mark the right page `.active`; header hint icon points to the
   correct note and opens a new tab.
3. Touch targets ≥44px (inspect bounding boxes).
4. Long romaji answer doesn't clip in the input.
5. Toggle `prefers-color-scheme` on all three pages — tokens read correctly, no leftover
   hardcoded dark colors.
6. Enter-to-submit works; counter pills switch type and update labels/placeholder.
7. Confirm fonts actually resolve (buttons must be Inter/mono, **not Arial**) via computed
   `font-family`, not just screenshots.

## Conventions & open decisions
- **Inter is intentional** despite design-linter "overused font" warnings — it's the body/CTA
  face shared with the notes pages, so keeping it maintains app-wide consistency. Revisit only
  if changing the body font across *all* pages (quizzes + notes) for more personality.
- **Notes pages are finalized** — treat as reference; don't restyle without an explicit ask.
- **New shared UI goes in `quiz.css`**; keep the light/dark token pair in sync (same names).
- **Never rely on `<button>` inheriting fonts** — always set `font-family` explicitly.
- Emoji are avoided in chrome; use the logo image or an SVG icon instead.
