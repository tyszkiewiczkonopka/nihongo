# frame

name: frame

description: Challenge the problem framing before planning. Separates observation from stated cause, and problem from proposed solution. Use when a ticket or request already contains a proposed fix, or when the scope feels uncertain. Produces a Frame Brief the plan skill can consume directly. Trigger phrases: "frame this", "challenge the assumption", "is this the right fix", "before I plan", "what are we actually solving", "frame the problem". Use BEFORE plan, not instead of it.

---

# frame — Challenge the Problem Framing Before Planning

Plans built on the wrong problem statement are perfect solutions to the wrong question. This skill separates observation from stated cause — and problem from proposed solution — before any planning begins.

## When to use

Use when: a ticket contains both a bug report and a proposed fix already; the scope of a task feels uncertain ("should we even do it this way?"); a problem and its cause have been presented as a single fact; stakes are high and the system is unfamiliar.

Skip when: the task is a pure mechanical change (rename, bump version, config tweak); you've already confirmed the root cause independently; the request is a clearly scoped feature with no underlying premise to challenge.

Cost of running it on a clear task: ~5 minutes, 2–3 questions. Cost of skipping it on a misframed task: a day in the wrong direction.

## Initial response

When invoked without input: "I'll help check whether you're solving the right problem before planning. Share: 1. The observation — what is happening or what you're being asked to fix 2. Your initial framing — what you think is causing it, or the approach in mind 3. (Optional) Any research, logs, or files I should read"

Then wait.

## Process

### Step 1: Separate the three components — keep them distinct

Read everything the user provided. Extract and echo back three separate things:

- Reported observation — the literal observable effect. Not a cause. Not a fix.
- Stated cause — what they think is causing the observation
- Proposed direction — what they want to do about it

Echo these back as three separate bullets and confirm before continuing.

### Step 2: Map hypotheses

For the stated cause, generate 2–4 alternative hypotheses — other things that could produce the same observation. For each: name it, describe the signal that would confirm or rule it out, note whether that signal is easy to check.

Present as a table with columns: Hypothesis | Confirming signal | Easy to check?

### Step 3: Narrowing round

Ask 2–3 focused questions to rule hypotheses in or out. Each question should have 2–4 concrete options and mark one as recommended. Focus on the hypotheses that are both plausible and easy to check first.

### Step 4: Write the Frame Brief

Once the picture is clear, write to docs/features/<feature-id>/[frame.md](http://frame.md) with sections:

- Reported Observation — the literal observable effect
- Stated Cause — what the reporter believed was causing it
- Reframed Problem Statement — the actual problem after investigation (may confirm or replace the original)
- Hypothesis Investigation — table of hypothesis / evidence / status (confirmed, ruled out, uncertain)
- Narrowing Signals — the key facts that shifted the framing
- Recommended Direction — what to do and why, one paragraph
- Confidence — HIGH/MEDIUM/LOW and why
- Open Questions — anything that couldn't be resolved and needs verification

The Frame Brief is a valid direct input to the plan skill. Pass it with "plan <change-id>" or by referencing docs/features/<feature-id>/[frame.md](http://frame.md).

### Step 5: Hand off

After writing, print a short summary: Frame complete, point to the brief path, and suggest "Next: plan <feature-id>".

Stop. Do not chain into planning automatically.