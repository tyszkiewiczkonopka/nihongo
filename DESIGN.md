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
| `public/numbers-notes.html` | Reference: how Japanese numbers are built | self-contained `<style>` |
| `public/counters-notes.html` | Reference: counter irregularities | self-contained `<style>` |
| `public/notes.js` | Shared `NOTES` data (`{id, title, href}`) linking quizzes → notes | — |
| `public/favicon.png` | Enso-circle logo (180×180), also used as the in-app logo | — |

**The three quiz pages share `public/quiz.css`.** The two notes pages each keep their own
inline `<style>` (they are visually complete and treated as **finalized reference designs** —
do not restyle them unless explicitly asked). The quiz pages were deliberately brought *up to*
the notes pages' look; the notes pages are the reference, not the other way around.

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
| **IBM Plex Mono** | Data, labels, controls, eyebrows | input, `.stat-num`, `.accepted`, `.ampm-badge`, `.mode-btn`, `.quiz-tab`, `.prompt-label`, `.stat-label`, `.unit-label`, `.menu-sub`, notes romaji/labels |
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

### Notes pages (reference palettes, for consistency when editing them)
- `numbers-notes.html`: `--paper #F2EDE1`, `--paper-alt #E9E1CC`, `--card #FBF8F0`,
  `--ink #1C2530`, `--ink-soft #5B6472`, `--indigo #2B4570`, `--indigo-deep #182B47`,
  `--hanko #B33A3A`, `--gold #A8823C`, `--line #D8CEB6`. (Quiz light palette is derived from this.)
- `counters-notes.html`: red-pen variant — `--paper #EDE7D9`, `--paper-dark #E1D9C6`,
  `--ink #2B2B29`, `--ink-soft #5C574E`, `--shu #C1440E` (vermillion), `--shu-soft #E8DCC8`,
  `--line #C9BFA8`.

Neither notes page has a dark mode (they are light-only by design). Dark values above were
authored specifically for the quiz pages.

## Layout

- `body`: flex column, `align-items:center`, **`justify-content:flex-start`** with
  `padding-top: max(1rem, 8vh)`. Content is anchored near the top — **do not vertically center
  the whole viewport** (that left ~300px of dead space on mobile, the original bug).
- `.wrap`: `max-width: 420px`, centered — the quiz column. (Notes pages use a wider `.wrap`,
  760–920px, since they're long-form reading.)
- `.container`: the card surface — `var(--card)`, `1px solid var(--line)`, `border-radius:16px`,
  flat (no drop shadow; the notes pages are flat too).
- Subtle fixed "washi" texture via `body::before` (two faint radial gradients).

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
white text. Used for direction toggles (Number→JP / JP→Number) and, on counters, the counter-type
selector (Hours / Age 歳 / Class 年生) — which **replaced a native `<select>`** so all controls
share one custom aesthetic. Counter buttons carry `data-counter="…"`; `setCounter(id)` toggles
`.active` and re-renders.

### Buttons
- `.btn-primary` (Check, Next): filled `--hanko`, white, Inter 600, full-width; hover darkens
  via `filter: brightness(0.92)`.
- `.btn-secondary` / bare `<button>`: `--card` fill, `--line` border, `--ink` text.
- All ≥44px tall.

### Answer input
- `.input-row` is a **vertical stack** (input above full-width Check) — fixes long romaji
  answers (e.g. `rokusenshichihyakugojuugo`) getting clipped when input shared a row with the button.
- Input: IBM Plex Mono, 16px (avoids iOS focus-zoom), left-aligned, `--card` bg.
- Guidance lives **only in the `placeholder`** (IBM Plex Mono). The earlier separate hint line
  under the button was removed as redundant.

### Feedback / stats
- `.feedback` banner: `.correct` (green tokens) / `.wrong` (red tokens).
- `.accepted`: mono, lists alternate accepted readings.
- `.stats`: two blocks; `.stat-num` mono, `.stat-label` mono uppercase eyebrow.

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
   space, no horizontal scroll.
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
