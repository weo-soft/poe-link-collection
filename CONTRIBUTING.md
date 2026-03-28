# Contributing

Thanks for helping improve PoE Link Collection.

## Before you open a pull request

1. Install dependencies: `npm install`
2. Run **`npm test -- --run`** and **`npm run lint`** (CI runs both on `main`)
3. If your change affects the build, run **`npm run build`**

Prefer focused changes: one logical fix or feature per PR.

## Where to look

- **[`README.md`](./README.md)** — Setup, data files, deployment
- **[`AGENTS.md`](./AGENTS.md)** — Layout, quality bar, and conventions for this repo

## Data and links

Edits to hub content usually touch JSON under [`public/data/`](./public/data/). Keep URLs valid and run tests after schema-affecting changes.

## Licensing

By contributing, you agree your contributions are licensed under the same terms as this project ([`LICENSE`](./LICENSE), MIT).
