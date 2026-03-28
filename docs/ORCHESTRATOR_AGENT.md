# Orchestrator agent playbook

Use this document when acting as an **orchestrator agent**. You **do not** replace the review or developer roles; you **coordinate** them, track state across rounds, enforce quality gates, and **loop** until exit criteria are met or you stop with an explicit report.

## Roles you coordinate

| Role | Playbook | Responsibility |
|------|-----------|----------------|
| **Review agent** | [`REVIEW_AGENT.md`](./REVIEW_AGENT.md) | Inspects code/behavior; appends **Review sessions** and **findings** (`Status: open`) to the handoff file |
| **Senior developer agent** | [`SENIOR_DEVELOPER_AGENT.md`](./SENIOR_DEVELOPER_AGENT.md) | Implements fixes; updates **Status** and **Resolution** on each finding |
| **Orchestrator** (you) | This file | Sequences work, records **Orchestrator run** summaries, decides continue/stop |
| **Project brief** (all roles) | **[`AGENTS.md`](../AGENTS.md)** (repo root) | **Overview, structure, commands, constitution** — ensure every specialist reads it **before** their pass; humans should attach or confirm it at session start |

**[`README.md`](../README.md)** is for end-user setup and product context; **`AGENTS.md`** is the operational source of truth for agents. Use **`CONTRIBUTING.md`** only if the repo adds extra rules.

## Artifact: handoff file

Default path: **`docs/REVIEW_FINDINGS.md`**. Both specialist agents and you append to it. **Never delete history**; add new sections at the end (or follow team convention if documented elsewhere).

## Inputs from the human

Capture at the start and restate in your first **Orchestrator run**:

1. **Goal** — What “done” means (feature, refactor, audit, hardening, release prep).
2. **Scope** — Paths, services, or change boundaries (optional).
3. **Severity policy** — Which severities must be cleared or explicitly closed before exit.  
   **Default:** every `open` finding with severity `blocker`, `high`, or `medium` must end as `resolved`, or `partial` / `wontfix` with rationale **and** human-approved policy; `low` / `suggestion` optional unless the human says otherwise.
4. **Budget** — Maximum **review rounds** (default: `5`). Definition below.
5. **Quality gate** — Command(s) that must be green after developer passes. **Default for this repo:** take them from **[`AGENTS.md`](../AGENTS.md)** (e.g. the documented test + lint invocation). Document exceptions in the run summary.
6. **Stop conditions** — Any extra rules (e.g. “stop if only suggestions remain”).

## What counts as one round

A **round** is:

1. **Review** — New **Review session** in the handoff file (findings recorded).
2. **Fix** — Developer agent addresses all in-policy `open` findings (or marks `partial` / `wontfix` per policy).
3. **Gate** — Quality gate run after fixes; results noted.
4. **Verification review** — A follow-up review pass (new session) focused on regressions and touched areas.

If verification introduces new in-policy findings, start another round (increment counter) beginning at **Fix** for those items, unless the human prefers a full review again—state your choice in **Orchestrator run**.

## Phases

### Phase 1 — Intake and planning

1. Confirm **[`AGENTS.md`](../AGENTS.md)** is in context for all participants (human should attach it before runs). Restate goal, scope, policy, budget, and **quality gate** from **`AGENTS.md`** unless the human overrides.
2. If the goal requires **new implementation** first, ensure that work is completed (or explicitly scoped out) before an empty “paper” review; point implementers at **`AGENTS.md`** (and `CONTRIBUTING.md` if present).
3. Optionally append **Orchestrator run** with **Round: 0** (planning only).

### Phase 2 — Review round (review agent)

1. Instruct the participant to read **`AGENTS.md`**, then follow **`REVIEW_AGENT.md`**.
2. Require a new **Review session** with target revision and check results.
3. Confirm new findings use the agreed ID format and **Status:** `open`.

If nothing in scope violates the severity policy, you may skip to verification or exit depending on the human’s goal.

### Phase 3 — Fix round (senior developer agent)

1. Instruct the participant to read **`AGENTS.md`**, then follow **`SENIOR_DEVELOPER_AGENT.md`**.
2. Require handling of every in-policy `open` finding (triage order in that playbook).
3. Require the **quality gate** after substantive changes.
4. Require **Resolution** blocks and updated **Status** for each touched finding.

### Phase 4 — Verification gate (review agent again)

1. Second pass: **`AGENTS.md`** + **`REVIEW_AGENT.md`** — regressions, new risks near changed code, contract drift.
2. New in-policy findings → count as another round; return to Phase 3.

### Phase 5 — Loop control

- **Continue** if policy-relevant `open` findings remain and `round < max_rounds`.
- **Stop — success** if no policy-relevant `open` findings remain and the quality gate is green (or human-accepted).
- **Stop — budget** if `round >= max_rounds`: append **Orchestrator run** with remaining IDs, severities, and recommended next action for a human.

## Orchestrator run block (append to handoff file)

```markdown
## Orchestrator run — YYYY-MM-DD HH:MM (optional TZ)

- **Human goal:** …
- **Scope:** …
- **Severity policy:** …
- **Quality gate:** `<commands>` — result
- **Round:** N / max M
- **Actions this round:** …
- **Open findings remaining:** IDs + severities, or “none per policy”
- **Next step:** e.g. “Verification review” | “Stop — criteria met” | “Stop — budget exhausted; risks: …”

---
```

## Rules for the orchestrator

- **One specialist role at a time** per step; avoid two agents editing the same finding concurrently without a clear split.
- **Escalate** if `blocker` / `high` is `wontfix` without human approval against policy—stop the loop and document in **Orchestrator run**.
- **Idempotency** — On a new engagement, read the handoff file from the end backward for latest sessions before assuming empty state.
- **Interactive verification** — Use dev servers or staging only when the human asked for runtime validation; otherwise rely on agreed commands.

## Quick checklist (per round)

- [ ] **`AGENTS.md`** available to the active specialist before their pass.
- [ ] Review session appended; finding IDs assigned; checks recorded.
- [ ] Every in-policy `open` finding has **Resolution** or allowed `partial` / `wontfix`.
- [ ] Quality gate run after fixes (or exception documented).
- [ ] Verification review completed if code changed materially.
- [ ] **Orchestrator run** appended with round number and **Next step**.

## Handoff

If stopping mid-loop, the next orchestrator or human should read the **bottom of the handoff file** for the latest **Review**, **Developer**, and **Orchestrator** sections, then resume at the appropriate phase.
