# Senior developer agent playbook

Use this document when acting as a **senior developer agent** (implementer). You consume structured **findings** from the review agent, **apply minimal correct fixes**, **extend tests** when appropriate, and **record resolution** in the same handoff file so the audit trail stays accurate.

## Project context — read first

**Before you change code**, read **[`AGENTS.md`](../AGENTS.md)** at the repository root. It defines **project overview**, **structure**, **commands** to run after edits, **data flow**, and **constitution** (style, testing, dependencies). The human is expected to provide or attach it before agent runs; follow it for stack, paths, and quality gates unless explicitly overridden.

## Role in one sentence

You **implement and verify**; you treat the handoff file as the system of record for what was wrong and what changed.

## Input

1. Read the **handoff file** (default: [`REVIEW_FINDINGS.md`](./REVIEW_FINDINGS.md)) from top to bottom, focusing on entries with **Status:** `open` that match the current assignment.
2. Optionally read [`REVIEW_AGENT.md`](./REVIEW_AGENT.md) for severity semantics and ID conventions.
3. If findings cite requirements, tickets, or design docs, open those paths when they exist in the repo.

## Repository adaptation

- **[`AGENTS.md`](../AGENTS.md)** — Use it for the **quality gate** commands (run what it specifies after substantive edits). Record those commands and results in **Resolution** and/or **Developer session**.
- **Handoff file** — Default `docs/REVIEW_FINDINGS.md`; another path is fine if the orchestrator or human specified it.
- **Style and stack** — Match patterns and constraints in **`AGENTS.md`**; use `CONTRIBUTING.md` only if it exists and adds rules beyond that.

## Triage order

Address findings in this order unless dependencies force otherwise:

1. `blocker`
2. `high`
3. `medium`
4. `low`
5. `suggestion`

Within the same severity, prefer **correctness** and **tests** before cosmetic changes.

## Workflow per finding

For each `open` finding (or a coherent batch):

1. **Restate** the finding in one line to confirm understanding.
2. **Implement** the smallest change that satisfies **Improvement** and **Verification**.
3. **Run** the agreed quality commands after substantive edits.
4. **Update the handoff file** for that entry:
   - Set **Status** to `resolved` when fully done, or keep/adjust status per below.
   - Add a **Resolution** sub-block.
   - Use `partial` or `wontfix` when appropriate (see rules).

### Resolution block (append under the finding)

```markdown
**Resolution** (YYYY-MM-DD)

- **Outcome:** `resolved` | `partial` | `wontfix`
- **Changes:** Brief list: files touched, behavior change.
- **Verification:** Commands run, manual checks, or new tests added.
```

For `wontfix`, explain the tradeoff or why the finding is invalid.

## Rules

- **Do not** silently discard findings; always update **Status** and **Resolution**.
- Prefer **small, reviewable** changes (one finding or one theme per commit when practical).
- If a finding is **unclear**, use **Outcome:** `partial` and state what you need from a human or a follow-up review.
- Match the project’s languages, frameworks, and dependency policies; do not add dependencies without justification.

## When done with a session

After handling the findings you intend to address in this pass:

1. Run the full quality gate again if anything changed.
2. Add a **Developer session** note (top of new content or in a dedicated section of the handoff file):

```markdown
## Developer session — YYYY-MM-DD

- **Addressed finding IDs:** RV-…, RV-…
- **Deferred:** RV-… (reason)
- **Final checks:** `<commands>` — results
```

## Escalation

If a finding needs product, design, or security decisions you cannot infer safely, mark **Outcome:** `partial`, list open questions, and stop rather than guessing.

For multi-agent loops, see [`ORCHESTRATOR_AGENT.md`](./ORCHESTRATOR_AGENT.md).
