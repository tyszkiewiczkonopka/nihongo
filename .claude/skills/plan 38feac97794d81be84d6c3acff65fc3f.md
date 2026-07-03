# plan

name: plan

description: Create a detailed, phased implementation plan through an interactive process. Researches the codebase, asks clarifying questions scaled to complexity, and writes a reviewable [plan.md](http://plan.md) with success criteria and a Progress section. Trigger phrases: "plan this", "create a plan", "plan the implementation", "write an implementation plan", "plan <feature-id>". Use AFTER research (optional) and frame (optional), BEFORE implement.

---

# plan — Create a Phased Implementation Plan

Create a detailed implementation plan through an interactive, iterative process. The plan is a document — written to a file, reviewed by the developer, then passed to implement. Never skip to implementation without a reviewed plan.

## Initial response

If a file path or feature-id was provided, read it immediately and begin.

If nothing was provided, ask for: the task or ticket description (or a file path); any context, constraints, or requirements; links to research or prior implementations. Note that the more context provided, the fewer questions are needed — task only means full questioning, task + [research.md](http://research.md) means fewer questions, task + [frame.md](http://frame.md) means fewer questions, and task + frame + research means minimum questions.

Then wait.

## Process

### Step 1: Identify upstream artifacts and scale questioning

Before reading anything, identify what was provided: a frame brief (docs/feature/<feature-id>/[frame.md](http://frame.md) or content with a Reframed Problem Statement section), a research doc (docs/features/<feature-id>/[research.md](http://research.md) or YAML with a topic field), or task only (none of the above).

If a frame is present: treat the Reframed Problem Statement as authoritative. Do not re-question the framing. Skip diagnostic questions about what the problem is.

If research is present: use its Code References as the codebase baseline. Do not re-explore files research already mapped.

Read all provided files fully.

### Step 2: Research the codebase

Spawn 2–3 parallel sub-agents to investigate: find all files directly related to the task; find similar existing implementations to follow as patterns; find prior decisions about this area in docs/features/.

Read all files identified as relevant into the main context.

### Step 3: Present understanding and assess complexity

After research, share what you found: a summary of the understood task, key findings with [file:line](file:line) references, relevant patterns or constraints, potential complexity or risk, and a complexity rating (HIGH/MEDIUM/LOW) with explanation. Ask the user to confirm or adjust complexity.

Complexity scale: LOW → 4–6 questions (single-file change, config, follows clear existing pattern); MEDIUM → 7–10 questions (new endpoint, refactor, multiple files); HIGH → 11–15 questions (new microservice, data migration, cross-cutting change).

Scale down when a frame or research doc is present — don't re-ask settled decisions.

### Step 4: Ask clarifying questions

Ask the confirmed number of questions across multiple rounds (1–4 per round). Each question has 2–4 concrete options, with exactly one marked as Recommended. Each option's description includes what it does, its strength, and its tradeoff. The recommendation must be grounded in codebase patterns, not guessing.

Always ask about (adapt to complexity): scope boundaries; edge cases and failure modes; success criteria; data model decisions (MEDIUM+); error handling strategy (MEDIUM+); testing approach (MEDIUM+); architecture choices (HIGH); migration and rollback (HIGH).

Do not ask about: anything already settled in a frame or research doc; low-level implementation details determinable from codebase patterns; questions with obvious answers given the context.

### Step 5: Propose plan structure

After questions, present the proposed phases as text — a numbered list of phase names with what each accomplishes. Ask if the breakdown looks right, with options: Looks good / Needs adjustment / Too granular / Too coarse.

### Step 6: Write the plan

Resolve the feature folder: if docs/features/<feature-id>/ exists, use it; otherwise create it with a [feature.md](http://feature.md) identity file.

Write docs/features/<feature-id>/[plan.md](http://plan.md) with these sections: Overview (1–2 sentence summary); Current State Analysis (what exists now, with [file:line](file:line) references); Desired End State (concrete, verifiable outcome); What We're NOT Doing (explicit out-of-scope items); Implementation Approach (high-level strategy); then per-phase sections, each with an Overview, Changes Required (per component: file path, Intent in 1–2 sentences, Contract naming the interface — code snippets only when genuinely non-obvious), and Success Criteria split into Automated (e.g. mvn test, mvn verify, build) and Manual (what a human verifies); then Testing Strategy; References (links to research/frame); and finally a Progress section with checkboxes per phase, using the convention "- [ ]" pending and "- [x]" done, appending the commit SHA when a step lands.

Key rules: the plan describes what to change and why, not how to write the code; intent is 1–2 sentences, contract names the interface, code snippets are the exception; every phase has both automated and manual success criteria; phase blocks use plain bullets, checkboxes live only in the Progress section.

### Step 7: Present and hand off

Present both file paths, recommend reading the brief first, list what to check (phase scoping, success criteria specificity, technical details), and suggest the next command: implement <feature-id> phase 1.

## Important guidelines

- Be skeptical — question vague requirements, identify risks early
- Never write the full plan before getting buy-in on structure
- No open questions in the final plan — research or ask before writing
- Be thorough — read all context files fully before planning
- The plan is the review checkpoint — if something looks wrong here, fix it now, not after implementation starts