# Agent and maintainer brief

Canonical context for **AI agents**, reviewers, and contributors working on this repository. Human operators should attach or confirm this file at the start of agent sessions. End-user setup and product summary live in [`README.md`](./README.md).

## Project overview

**PoE Link Collection** is a static, Path of Exile–themed hub page: categorized external links, multi-page navigation, league/event sections, changelog/updates UI, and contact/event-suggestion flows where configured. Core layout and links should remain usable without JavaScript (progressive enhancement); enhanced behavior loads via ES modules.

## Stack and constraints

| Area | Choice |
|------|--------|
| Build | [Vite](https://vitejs.dev/) 5 (`root: src`, `publicDir: ../public`, output `dist/`) |
| Runtime | Vanilla JavaScript (ES modules), HTML5, CSS3 |
| Test | [Vitest](https://vitest.dev/) with `jsdom` |
| Lint / format | ESLint (`src`, `tests`), Prettier (`src`, `tests`) |
| Deploy | GitHub Actions → GitHub Pages (`main`) |

**Dependencies:** keep additions justified and minimal. Runtime deps today include `@emailjs/browser` (and related) for optional email flows; do not add frameworks unless the project explicitly moves that direction.

## Repository layout

```
poe-link-collection/
├── src/                    # Vite root: index.html, scripts/, styles/, config/
├── public/                 # Copied to dist root: data/, images/, robots.txt, sitemap.xml
├── tests/                  # Vitest: unit/*.test.js, integration/page.test.js
├── docs/                   # Agent playbooks + REVIEW_FINDINGS handoff
├── specs/                  # Feature specs / plans (when present)
├── dist/                   # Build output (gitignored except local artifacts)
└── vite.config.js          # Vite + Vitest configuration
```

## Commands (quality gate)

Run from the repository root after substantive edits:

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server (default port 5173) |
| `npm test -- --run` | Tests once (CI uses this; no watch) |
| `npm run lint` | ESLint on `src` and `tests` |
| `npm run build` | Production build → `dist/` (includes HTML fix step) |
| `npm run preview` | Serve `dist/` locally |
| `npm run test:coverage` | Coverage report (optional) |
| `npm run format` | Prettier write |

**Default gate before merge or agent handoff:** `npm test -- --run` and `npm run lint` pass; `npm run build` succeeds when changes affect build or env.

## Data and configuration

- **JSON under `public/data/`** is loaded at runtime via `fetch` (see `src/scripts/data.js`): e.g. `links.json`, `link-items.json`, `events.json`, `leagues.json`, `updates.json`. Validate shape changes against tests and any specs/contracts in `specs/`.
- **Environment:** Vite exposes only `VITE_*` variables. GitHub Actions build sets `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, and `VITE_EMAILJS_TEMPLATE_ID` from repository **Variables** for deploys; local `.env` can supply the same for feature testing.

## Constitution (quality bar)

1. **Correctness first** — Edge cases and fetch failures should degrade gracefully (user-visible errors where appropriate, no silent corruption of data).
2. **Tests** — Extend or add Vitest coverage for new behavior; prefer deterministic tests (mocked `fetch` / DOM where needed).
3. **Accessibility** — Meaningful labels, focus, and live regions where dynamic content changes; respect existing patterns in `src/scripts` and styles.
4. **Scope** — Match existing style and file organization; avoid drive-by refactors unrelated to the task.
5. **Security** — No secrets in the repo; use env vars for keys; validate/sanitize assumptions when handling external URLs or user-driven content per existing validators.

## Multi-agent workflows

Structured review/fix loops use:

| Document | Role |
|----------|------|
| [`docs/REVIEW_FINDINGS.md`](./docs/REVIEW_FINDINGS.md) | Shared handoff log (append only) |
| [`docs/REVIEW_AGENT.md`](./docs/REVIEW_AGENT.md) | Review agent playbook |
| [`docs/SENIOR_DEVELOPER_AGENT.md`](./docs/SENIOR_DEVELOPER_AGENT.md) | Implementer playbook |
| [`docs/ORCHESTRATOR_AGENT.md`](./docs/ORCHESTRATOR_AGENT.md) | Orchestration between rounds |

Contributor-facing checklist and PR expectations: **[`CONTRIBUTING.md`](./CONTRIBUTING.md)**. This file (`AGENTS.md`) stays the deeper operational brief for agents and maintainers.
