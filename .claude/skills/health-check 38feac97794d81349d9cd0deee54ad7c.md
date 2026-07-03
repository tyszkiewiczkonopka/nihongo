# health-check

name: health-check

description: Audit an existing project for AI agent readiness. Checks dependency health, test infrastructure, CI/CD configuration, and missing setup. Produces a prioritised fix list split into "fix before AI work" and "not urgent". Trigger phrases: "health check", "check my project", "is my project ready for AI", "audit my project", "project health".

---

# health-check — Audit Project for AI Agent Readiness

Audit the project's current state and produce a structured report with prioritised fixes. The question being answered is not "is this project healthy" in general — it's "is this project set up in a way that lets an AI agent work reliably?"

## Precondition

Requires an existing codebase in cwd with at least one recognisable project marker (pom.xml, build.gradle, package.json, pyproject.toml, go.mod, Cargo.toml, *.csproj). If none found, stop and say so.

## What to check

### 1. Dependency lockfile

Does a lockfile exist? (pom.xml with pinned versions, package-lock.json, poetry.lock, go.sum, etc.) If not: non-reproducible builds mean the agent can't reason about exact dependency state.

### 2. Test runner — can tests actually run?

Detect the test framework. Attempt a dry run (Java/Maven: mvn test-compile -q; Java/Gradle: ./gradlew testClasses).

Surface: detected runner, test count if available, any errors that prevent tests from running. A non-working test suite is the highest-priority finding — the agent cannot verify its own changes without tests.

### 3. Dependency audit

Run the ecosystem audit tool (Maven: mvn dependency:analyze; npm: npm audit --json; Python: pip-audit, skip if not installed, note the skip).

Report CRITICAL and HIGH findings inline. MODERATE and LOW: log only. A non-zero exit from audit tools is informational, not a halt condition.

### 4. CI/CD configuration

Check for CI config (.github/workflows/, Jenkinsfile, .gitlab-ci.yml). If found, read it and note which stages exist: lint, test, build, security scan. If absent: note it but do not treat as urgent — it does not block agent collaboration if a local test runner works.

### 5. Instruction file

Does [AGENTS.md](http://AGENTS.md) or [CLAUDE.md](http://CLAUDE.md) exist at the repo root? If not: the agent starts every session with zero project knowledge. Mark as a fix item and point to the agents-md skill.

### 6. Code style enforcement

Is a formatter or linter configured? (Checkstyle, SpotBugs, PMD, ESLint, etc.) Without enforced style, AI-generated PRs add noise reviewers spend time on instead of reviewing logic.

## Output

Produce a report split into two sections:

**Fix before AI work** (in order of impact on agent reliability):

1. No working test runner
2. CRITICAL/HIGH security vulnerabilities
3. No lockfile / unpinned dependencies
4. Missing instruction file ([AGENTS.md](http://AGENTS.md))
5. No formatter/linter configured

**Not urgent** (real gaps, won't block agent collaboration today):

- Missing CI pipeline
- Moderate/low audit findings
- Missing .editorconfig, .env.example, etc.

Each fix entry must include: what is wrong, why it matters for AI-assisted work specifically, and the concrete fix command or next step.

## Behaviour

- Read-only. Never modifies the project.
- Warn and continue on every finding — nothing halts the audit.
- Final verdict: ready / needs-attention / significant-gaps. Even significant-gaps means "fix these first", not "stop here".