# research

name: research

description: Research the codebase comprehensively before planning or implementing a change. Spawns parallel sub-agents to explore different dimensions of the codebase and synthesises findings into a [research.md](http://research.md) document with [file:line](file:line) references, architecture insights, and open questions. Trigger phrases: "research the codebase", "explore how X works", "find all files related to", "understand the current implementation", "research before I plan".

---

# research — Explore the Codebase Before Making Changes

Research the codebase thoroughly to answer a specific question or map the territory before planning a change. Produces a [research.md](http://research.md) document that becomes the input to planning — reducing planning questions and grounding the plan in actual code, not assumptions.

## When to use

Use before planning any change that touches more than one file, involves an unfamiliar part of the codebase, or where you want to understand existing patterns before deciding an approach.

Skip for mechanical changes where scope is completely clear.

## Initial response

When invoked without a query:

"I'm ready to research the codebase. What do you want to understand? Provide: 1. Your research question or area of interest 2. Any relevant files, tickets, or docs I should read first 3. (Optional) Scope — just this service, or related services too?"

Then wait.

## Process

### Step 1: Read mentioned files first

If the user references specific files, tickets, or docs — read them fully before doing anything else. Never delegate this to a sub-agent.

### Step 2: Clarify scope (if ambiguous)

For a clear, tightly scoped query ("find all files using X interface"): proceed. For an ambiguous query: ask one focused question about scope or depth before spawning sub-agents. Keep it to one question with 2–3 concrete options.

### Step 3: Decompose and spawn parallel sub-agents

Break the question into 2–4 independent research dimensions. Spawn sub-agents in a single parallel call:

- Explore agents — fast file/pattern search, tracing code paths, finding all usages of a class or method
- General-purpose agents — deep analysis, multi-file reasoning, understanding a complex system or flow

Each sub-agent should return findings with specific [file:line](file:line) references.

Example decomposition for "how does order processing work": Agent 1 finds all files related to order processing (entry points, handlers); Agent 2 traces the data flow from API to persistence; Agent 3 finds prior changes related to order processing in docs/features/.

### Step 4: Wait for all sub-agents, then synthesise

Wait for all sub-agents to complete before writing anything. Compile findings into a coherent picture. Prioritise live codebase findings; use change history as supplementary context.

### Step 5: Write [research.md](http://research.md)

Resolve the change folder: if invoked as "research <feature-id>" and docs/features/<feature-id>/ exists, use it. Otherwise create docs/features/<feature-id>/ with a feature.md identity file.

Write to docs/features/<feature-id>/[research.md](http://research.md) with frontmatter (date, topic, branch, git_commit, status) followed by these sections:

- Summary — 2–4 sentences answering the research question directly
- Detailed Findings — organized by area, each finding with a [file:line](file:line) reference
- Code References — list of [file:line](file:line) with description
- Architecture Insights — patterns, conventions, design decisions discovered
- Historical Context — relevant findings from docs/features/ or docs/features/done/
- Open Questions — anything that needs clarification before planning

### Step 6: Present and offer follow-ups

Summarise findings to the user with key references. Ask if they have follow-up questions. Append follow-ups to the same document under a Follow-up Research section with timestamp.

## Important notes

- Always read mentioned files fully — no partial reads
- Always wait for all sub-agents before synthesising
- Never write the document with placeholder values
- Research documents should be self-contained with file paths and line numbers