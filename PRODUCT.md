# Product

## Register

product

## Users

Solo use — the primary (likely only) user is the app's own developer, studying Japanese.
Sessions are short, frequent daily drills, most often on a phone, fit into small pockets of
time rather than long sit-down study blocks. No need to design for unknown/general audiences.

## Product Purpose

A personal Japanese-study tool: two quizzes (numbers 1–9999 both directions; counters —
hours, age, class-year) drill recall with immediate correct/wrong feedback, and two reference
pages (numbers-notes, counters-notes) explain the underlying rules and irregularities for when
a quick lookup is needed mid-study. Success = low-friction daily practice that actually gets
used — fast to open, fast to answer, fast to move to the next question.

## Brand Personality

Calm, editorial, traditional. A Japanese-stationery aesthetic: warm washi paper tones, indigo
ink, a restrained vermillion "hanko" (red-seal) accent used sparingly for emphasis/CTAs. Quiet
confidence rather than energetic gamification — feedback should be clear and immediate without
being loud or celebratory.

## Anti-references

- The generic SaaS-form look this project had before this session's rework: flat beige
  background, default system font, stock blue links, indistinguishable gray boxes with no
  visual hierarchy.
- Duolingo-style heavy gamification: no mascots, no streak-as-pressure mechanics, no loud
  celebration animations on correct answers. Feedback stays understated (a colored banner, not
  a burst of confetti).

## Design Principles

1. **Speed over persuasion.** This is a drill tool opened many times a day — minimize friction
   (one clear primary action per screen, no marketing filler, no unnecessary steps between
   intent and answer).
2. **Notes are reference, quizzes are practice — keep the two paces distinct.** Reference pages
   read at an unhurried, editorial pace (generous whitespace, longer-form explanation); quiz
   pages stay compact and action-oriented. Don't collapse them into one template.
3. **Restraint over gamification.** Correctness feedback is quiet and legible (color + short
   text), never a pressure mechanic or a loud animated reward.
4. **One consistent type system across every surface.** The three-font system (Shippori Mincho
   for Japanese/display, IBM Plex Mono for data/labels/controls, Inter for body/CTAs) applies
   everywhere — a page that drifts from it is a regression, not a variant.
5. **Design for the phone in hand.** Primary usage is mobile, in short sessions — touch targets,
   layout, and content density should assume a thumb on a small screen, not a mouse on a desktop
   monitor.

## Accessibility & Inclusion

WCAG AA as the baseline. Minimum 44px touch targets on all interactive controls. Full dark mode
via `prefers-color-scheme`, with token contrast checked in both modes. No additional personal
accommodation beyond standard best practice at this time.
