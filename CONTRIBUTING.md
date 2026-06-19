# Contributing to Browser Dashboard

Thank you for your interest in this project. Browser Dashboard is a local, offline-first browser start page — contributions that keep it fast, minimal, and easy to maintain are welcome.

Please read this guide before opening a pull request.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Ways to Contribute

- **Bug reports** — something broken, confusing, or regressed
- **Feature ideas** — open a discussion first for larger changes
- **Documentation** — fixes and clarifications in README or `docs/`
- **Code** — bug fixes, UI polish, performance improvements, tests

## Before You Start

1. Check [existing issues](https://github.com/NameNotImportantt/browser-dashboard/issues) to avoid duplicate work.
2. For non-trivial features, open an issue or discussion and wait for feedback before investing in a large PR.
3. Read the [Developer Guide](./docs/DEVELOPERS.en.md) for setup, architecture, and project layout.

## Development Setup

Requirements: [Bun](https://bun.sh/) and Node.js `20.19+` or `22.12+`.

```bash
git clone https://github.com/NameNotImportantt/browser-dashboard.git
cd browser-dashboard
bun install
bun run dev
```

Other useful commands:

| Command | Purpose |
| --- | --- |
| `bun run build` | Type-check and production build |
| `bun run start` | Preview the production build |
| `tsc -b` | Type-check only (required after TS changes) |

Production output is a single file: `dist/index.html`.

## Pull Request Guidelines

1. **Keep PRs focused** — one logical change per pull request.
2. **Match existing style** — naming, file layout, and patterns used in nearby code.
3. **Preserve UX goals** — fast UI, minimalism, offline-first behavior.
4. **Update docs** when user-visible behavior or setup steps change.
5. **Do not add dependencies** without discussing first in an issue. Avoid heavy UI frameworks.
6. **Run checks** before submitting:
   ```bash
   tsc -b
   bun run build
   ```
   Style-only changes do not require `tsc -b`, but a full build is still recommended before a PR.

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short description in English>
```

Common types: `feat`, `fix`, `docs`, `refactor`, `style`, `test`, `chore`.

Examples:

- `feat: add search history clear action`
- `fix: weather cursor default on hover`
- `docs: clarify file:// setup for Firefox`

Use imperative mood, no trailing period.

## Code Conventions

### TypeScript

- Domain types live in `src/db/types/*` (one file per entity).
- Component prop types live in `src/components/<ComponentName>/types/*`.
- Page types live in `src/pages/types/*`.
- Do not add a shared `src/types/domain.ts`.

### Styles

- Use only `*.module.scss` colocated with components.
- No global CSS files (`index.css`, plain `.scss`, etc.).

### Data & Storage

- Persist app data in IndexedDB via Dexie.
- Use `localStorage` only for small, non-critical settings.

### Design

- Dark, atmospheric UI with magical minimalism and purple-blue accents.
- Avoid visual clutter, heavy decoration, and cartoonish styling.

## Reporting Bugs

When opening an issue, include:

- Browser and version (e.g. Firefox 128, Chrome 126)
- OS (Linux, macOS, Windows)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if relevant

For **security vulnerabilities**, do not open a public issue. Contact the maintainer privately (see repository security policy when available).

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

## Questions

- [User documentation](./README.md)
- [User documentation (Russian)](./docs/README.ru.md)
- [Developer Guide](./docs/DEVELOPERS.en.md)
- [Developer Guide (Russian)](./docs/DEVELOPERS.ru.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [MIT License](./LICENSE)

Maintainer: [NameNotImportantt](https://github.com/NameNotImportantt)
