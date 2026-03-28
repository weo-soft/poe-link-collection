# PoE Link Collection Hub Page

A Path of Exile–themed link collection hub: categorized resources (builds, loot filters, trade, tools, overlay, media, and more), navigation across hub pages, and league/event information with an updates changelog. The UI uses a dark PoE-inspired theme.

## Features

- **Categorized links** — Sections for common PoE resource types
- **Navigation** — Multi-page hub with clear current-page indication
- **League events** — Current and past leagues with duration context
- **Updates** — Last-updated notice and changelog of link changes
- **Path of Exile theme** — Dark styling aligned with the game’s aesthetic
- **Progressive enhancement** — Core usefulness without JavaScript; enhanced behavior via ES modules

## Tech stack

- **Build:** Vite 5  
- **Languages:** Vanilla JavaScript (ES6+), HTML5, CSS3  
- **Testing:** Vitest (jsdom)  
- **Deployment:** GitHub Pages via GitHub Actions  

## Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/weo-soft/poe-link-collection.git
cd poe-link-collection
npm install
```

## Development

```bash
npm run dev              # Dev server (e.g. http://localhost:5173)
npm test                 # Vitest (watch)
npm test -- --run        # Single run (matches CI)
npm run test:coverage    # Coverage report
npm run lint             # ESLint
npm run format           # Prettier (write)
npm run build            # Production build → dist/
npm run preview          # Preview production build
```

## Project structure

Vite’s **root is `src/`**; static assets and JSON data live under **`public/`** and are emitted at the site root in `dist/`.

```
poe-link-collection/
├── src/
│   ├── index.html          # HTML entry
│   ├── scripts/            # ES modules (data, links, navigation, events, …)
│   ├── styles/             # CSS
│   └── config/             # App config (e.g. contact)
├── public/
│   ├── data/               # links.json, events.json, leagues.json, updates.json, …
│   └── images/             # Favicons and static images
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Page-level tests
├── docs/                   # Agent playbooks and review handoff
└── dist/                   # Build output (local)
```

## Data files

| Path | Role |
|------|------|
| `public/data/links.json` | Links by category (and game where applicable) |
| `public/data/link-items.json` | Per-link metadata/icons |
| `public/data/events.json` | League/event data |
| `public/data/leagues.json` | League listing |
| `public/data/updates.json` | Changelog / update records |

## Deployment (GitHub Pages)

Pushing to **`main`** runs `.github/workflows/deploy.yml`: `npm ci`, **`npm test -- --run`**, then **`npm run build`**, then upload of `dist/` to GitHub Pages.

1. **Pages source:** Repository **Settings → Pages → Source: GitHub Actions**.
2. **EmailJS (optional):** For contact/event features that need EmailJS at build time, set repository **Variables** `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_PUBLIC_KEY`, and `VITE_EMAILJS_TEMPLATE_ID` (see workflow `env` in `deploy.yml`). For local builds, use a root `.env` with the same `VITE_*` names.
3. **Custom domain:** Configure in Pages settings and DNS per GitHub’s instructions; `public/CNAME` or generated `dist/CNAME` may apply depending on your setup.

Manual deploy: `npm run build` and host the contents of `dist/`.

## Contributing

See **[`CONTRIBUTING.md`](./CONTRIBUTING.md)** for the PR checklist and conventions.

## AI agents and maintainers

- **[`AGENTS.md`](./AGENTS.md)** — Layout, commands, data flow, quality bar, and review workflows.
- **`docs/`** — Playbooks (`REVIEW_AGENT.md`, `SENIOR_DEVELOPER_AGENT.md`, `ORCHESTRATOR_AGENT.md`) and shared handoff log `REVIEW_FINDINGS.md`.

## License

This project is licensed under the MIT License — see [`LICENSE`](./LICENSE).

*Path of Exile* is a trademark of Grinding Gear Games. This project is a fan-made link hub and is not affiliated with or endorsed by Grinding Gear Games.
