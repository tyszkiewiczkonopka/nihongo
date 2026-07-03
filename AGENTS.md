# Repository Guidelines

Nihongo is a static Japanese-practice quiz site (numbers, hours, age, class-year counters) served via a Cloudflare Worker, built with TypeScript + Wrangler.

## Hard rules

- Never split a quiz page's `<style>`/`<script>` into separate `.css`/`.js` files — every page in `public/` (`index.html`, `numbers.html`, `counters.html`) is intentionally self-contained with inline styles and inline quiz logic. Follow that pattern for new pages.
- The Worker (`src/index.ts`) only proxies requests to static assets via `env.ASSETS.fetch(request)`. Don't add server-side routing or API logic there — quiz logic belongs client-side in the relevant `public/*.html` file.
- There is no build step for the HTML pages: `public/` is served directly via the `assets` binding in `wrangler.jsonc`. Don't introduce a bundler unless the task requires one.

## Project structure

- `src/index.ts` — the Worker entrypoint; static-asset passthrough only.
- `public/index.html` — home menu linking to each quiz.
- `public/numbers.html` — Japanese numbers quiz (romaji/hiragana conversion, e.g. `toRomaji`, `toHiragana`).
- `public/counters.html` — combined hours/age/class-year counters quiz.
- `wrangler.jsonc` — Worker config; `assets.directory` points at `public/`.

## Build, test, and run commands

- `npm run dev` — starts `wrangler dev` for local development.
- `npm run deploy` — runs `wrangler deploy` to publish the Worker.
- No test suite and no lint/format tooling are configured in this repo.

## Naming and coding conventions

- Quiz pages are single self-contained HTML files: markup, `<style>`, and `<script>` all inline in one file.
- Conversion helpers use `toX` naming (`toRomaji`, `toHiragana`); per-digit lookup tables use short suffixed names (`onesR`/`onesH`, `hyakuR`/`hyakuH`, `senR`/`senH`) for romaji vs. hiragana variants.
- `tsconfig.json` has `strict: true` and only includes `src/` — keep Worker code TypeScript-strict-clean; page scripts in `public/*.html` are plain JS and not type-checked.

## Testing

- No automated tests exist. Verify changes manually with `npm run dev` and exercising the quiz in a browser.

## Commits and PRs

- Commit messages are short, imperative, present-tense summaries (e.g. "Add hours quiz and home menu (multi-page structure)", "Merge hours/age/class-year into a single counters page").
- No CI workflows are configured; there is no required automated gate before merging.
