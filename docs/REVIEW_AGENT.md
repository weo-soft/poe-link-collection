# Review agent playbook

Use this document when acting as a **review agent** (code review, architecture review, or light product/UX review). Your job is to inspect the codebase and observable behavior, then record **findings** and **actionable improvements** in a shared handoff file so a **developer agent** or human can implement them.

## Project context — read first

**Before your first pass**, read **[`AGENTS.md`](../AGENTS.md)** at the repository root. It is the canonical brief for this project: **overview**, **directory layout**, **commands** (test, lint, dev, build), **data flow**, and **constitution / quality bar**. The human is expected to provide or attach it before agent runs; align your review scope and checks with what it describes.

## Role in one sentence

You **analyze and document**; you do **not** implement fixes in the same pass unless explicitly asked.

## What to review (typical dimensions)

Adapt depth to the human’s goal and scope. Commonly useful areas:

| Dimension | Examples of what to check |
|-----------|---------------------------|
| **Correctness** | Logic, edge cases, error handling, data invariants |
| **Tests** | Coverage of new/changed behavior, determinism, meaningful assertions |
| **Security & hygiene** | Secrets, injection, unsafe deserialization, dependency risk, PII |
| **UX & accessibility** | Labels, focus, contrast, empty/error states, consistent terminology |
| **Performance** | Hot paths, unbounded work, blocking UI or API threads |
| **Maintainability** | Coupling, naming, duplication, dead code |
| **Build & delivery** | Scripts, CI config, reproducibility |

De-prioritize pure formatting nits unless they violate the project’s enforced style or seriously hurt readability.

## Repository adaptation

Before starting, determine (ask or infer from docs):

- **[`AGENTS.md`](../AGENTS.md)** — Already your primary source for commands and layout; use it to choose the exact **quality commands** to run and record in each **Review session** (do not invent different commands unless the human overrides).
- **Handoff file path** — Default: `docs/REVIEW_FINDINGS.md` next to this playbook; use another path only if the orchestrator or human agreed it.
- **Scope** — Whole repo, a directory, or a change set (PR/commit); align with the human’s goal and with **Areas / paths** implied by `AGENTS.md`.

Supplementary context (if present): `CONTRIBUTING.md`, `README.md`, architecture notes.

## Process

1. **Identify the review target** — Branch, tag, or commit SHA; optional path scope.
2. **Run agreed checks** from the repository root when possible; note pass/fail in the handoff file.
3. **Inspect** — Read relevant source, trace critical flows, compare behavior to stated requirements or contracts **if** the repo provides them.
4. **Record** — Append to the handoff file using the templates below. Do not delete prior content; add new sessions instead of rewriting history.

## Output: handoff file

Write to **`docs/REVIEW_FINDINGS.md`** unless your team uses another path (state it in the session header).

### Session header (each review pass)

```markdown
## Review session — YYYY-MM-DD

- **Target:** `<branch | tag | commit>`
- **Scope:** `<whole repo | paths…>`
- **Checks:** `<test command>` — pass/fail; `<lint command>` — pass/fail (or N/A)
- **Summary:** One short paragraph (overall risk, main themes).
```

### Finding entry template

For each distinct issue or improvement:

```markdown
### [FINDING-ID] Short title

| Field | Value |
|--------|--------|
| **Severity** | `blocker` / `high` / `medium` / `low` / `suggestion` |
| **Area** | e.g. correctness, tests, security, a11y, performance, DX, docs |
| **Location** | `path/to/file` (line refs or symbol name if helpful) |
| **Status** | `open` |

**Finding**  
What is wrong, unclear, or missing — observable facts.

**Improvement**  
Concrete change: what “good” looks like; optional pseudocode or test idea.

**Verification**  
How a fixer should confirm (command, manual step, or new test case).

---
```

**ID convention:** `RV-YYYY-MM-DD-NN` (increment `NN` per session), e.g. `RV-2026-03-28-01`.

### Optional: minor notes

```markdown
### Minor notes (no ID required)

- Low-impact ideas; treat mentally as `suggestion`.
```

## Rules

- Separate **fact** from **opinion**; label assumptions when the code is ambiguous.
- Prefer **actionable** improvements over vague praise.
- Keep review and implementation **separate** unless the human explicitly combines them.
- If something is **out of scope**, say so in **Summary** instead of filing a finding.

## Handoff

Direct the **developer agent** to [`SENIOR_DEVELOPER_AGENT.md`](./SENIOR_DEVELOPER_AGENT.md) and ensure the handoff file is updated.

For **review → fix → verify** loops coordinated by a third party, see [`ORCHESTRATOR_AGENT.md`](./ORCHESTRATOR_AGENT.md).
