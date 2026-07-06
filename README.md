<p align="right">
  <strong>English</strong> | <a href="./docs/README.ru.md">Русский</a>
</p>

<div align="center">
  <img src="./docs/assets/favicon.png" width="144" height="144" alt="Browser Dashboard icon" />
  <h1>Browser Dashboard</h1>

  <p><strong>A fast, offline-first browser start page with search, tasks, habits, and bookmarks.</strong></p>

  <p>
    <a href="https://github.com/NameNotImportantt/browser-dashboard/releases"><img src="https://img.shields.io/github/v/release/NameNotImportantt/browser-dashboard" alt="release" /></a>
    <img src="https://img.shields.io/badge/status-alpha-orange" alt="status alpha" />
    <img src="https://img.shields.io/badge/offline--first-yes-8b5cf6" alt="offline first" />
    <img src="https://img.shields.io/badge/single--file-HTML-e879f9" alt="single file html" />
    <img src="https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white" alt="bun" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="react 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="typescript 5" />
    <img src="https://img.shields.io/badge/Zustand-state-764ABC" alt="zustand state" />
    <img src="https://img.shields.io/badge/Dexie-IndexedDB-336791" alt="dexie indexeddb" />
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
  </p>
</div>

## Features

- 🔍 Multi-engine search
- 📁 Bookmark categories
- ✅ Todo manager
- 🔥 Habit tracking
- 📝 Notes
- 🌤 Weather
- 🗂 Workspaces
- 💾 Offline-first storage
- 🚫 No account required

## Table of Contents

- [Features](#features)
- [What Is It](#what-is-it)
- [What It Is For](#what-it-is-for)
- [Problem It Solves](#problem-it-solves)
- [Features and How They Work](#features-and-how-they-work)
- [Installation](#installation)
- [Set as Browser Start Page](#set-as-browser-start-page)
- [Limitations](#limitations)
- [Screenshots](#screenshots)
- [Roadmap](#roadmap)
- [For Developers](#for-developers)
- [License](#license)

---

### What Is It

**Browser Dashboard** is a self-contained local start page for your browser. It ships as a single `index.html` file and runs entirely in the browser without a backend server.

The UI is built around a dark, atmospheric aesthetic with a focus on speed, minimalism, and instant access to everyday tools: search, bookmarks, tasks, habits, notes, clock, and weather.

### What It Is For

Use it as a personal home screen when you open the browser or a new tab. It replaces generic search-provider start pages with a workspace you control: your links, your tasks, your habits, and your layout preferences — all stored locally on your machine.

### Problem It Solves

Most built-in browser start pages are either too noisy, too generic, or tied to a single search provider. Cloud dashboards require accounts, sync infrastructure, and constant connectivity.

Browser Dashboard offers a middle ground:

- **Local-first** — your data stays in the browser (IndexedDB), not on someone else's server.
- **Zero setup beyond one file** — download a release, point the browser to it, done.
- **Fast and lightweight** — a single static HTML bundle with no install wizard or background services.
- **Focused toolkit** — search, quick links, daily overview, and lightweight productivity widgets in one calm screen.

### Features and How They Work

| Area | What you get | How it works |
| --- | --- | --- |
| **Workspaces** | Separate contexts (e.g. *Work*, *Personal*) | Each workspace has its own todos, habits, bookmarks, and note. Switch via the bar at the bottom; the active workspace is remembered. |
| **Search** | Central search bar with engine picker | Built-in Google and DuckDuckGo, plus custom engines via `{q}` URL templates. Queries open in a new tab. Recent queries are stored locally; online suggestions come from Google Suggest (JSONP) when available. |
| **Quick Links** | Bookmark grid with categories | Save URLs with titles, group them into categories, filter by category on the home screen. |
| **Tasks** | Full todo list with priorities and due dates | Add, complete, reorder, and delete tasks. The home sidebar shows up to five active tasks for today. |
| **Habits** | Daily habit tracker with streaks | Mark habits done for today; streak length is calculated from completion history. |
| **Notes** | One persistent note per workspace | Auto-saved text note, loaded lazily when you open the Notes screen. |
| **Clock & Date** | Top bar time and date | Respects 12h/24h format, timezone (auto or manual), and locale-aware date formatting. |
| **Weather** | Current temperature in the top bar | City is geocoded via Open-Meteo; forecast data is fetched on demand and cached for 30 minutes. Requires internet. |
| **Settings** | Theme, locale, appearance, search, weather | Light/dark theme, Russian/English UI, custom background image, text color overrides, tab title, and search engine management. |
| **State** | Dashboard data flow | Zustand store and domain hooks power todos, habits, bookmarks, notes, settings, weather, and search history. |
| **Storage** | Offline persistence | All core data lives in IndexedDB through Dexie (`browser-home-page-db`). No account, no cloud sync. |

### Installation

1. Open [GitHub Releases](https://github.com/NameNotImportantt/browser-dashboard/releases).
2. Download the latest `index.html` from the release assets.
3. Save it anywhere on your disk, for example:
   - Linux: `~/Documents/browser-dashboard/index.html`
   - macOS: `~/Documents/browser-dashboard/index.html`
   - Windows: `C:\Users\You\Documents\browser-dashboard\index.html`

> [!IMPORTANT]
> Each release contains **one self-contained `index.html` file**. All JavaScript, styles, and assets are inlined at build time — you do not need Node.js, Bun, or any server to use it.

No package manager, no build step, and no dependencies are required for end users.

### Set as Browser Start Page

> [!NOTE]
> **In work.** Browser setup instructions are being expanded and verified. The steps below are a draft.

Use a `file:///` URL pointing to your downloaded file.

**Example paths**

| OS | Example `file:///` URL |
| --- | --- |
| Linux | `file:///home/you/Documents/browser-dashboard/index.html` |
| macOS | `file:///Users/you/Documents/browser-dashboard/index.html` |
| Windows | `file:///C:/Users/You/Documents/browser-dashboard/index.html` |

#### Blink (Chrome, Chromium, Brave, Edge, Vivaldi, Opera)

**Homepage on startup**

1. Open browser **Settings**.
2. Find **On startup** / **Start up**.
3. Choose **Open a specific page or set of pages**.
4. Add your `file:///` URL to `index.html`.

**New tab page (optional)**

Browsers on Blink do not allow replacing the new-tab page with a local file out of the box. Options:

- Use a new-tab override extension and point it to your local file, or
- Rely on the startup homepage if opening the browser is enough for your workflow.

#### Gecko (Firefox, LibreWolf, Zen, etc.)

**Homepage and new windows**

1. Open **Settings → Home** (or `about:preferences#home`).
2. Set **Homepage and new windows** to **Custom URLs…**.
3. Paste your `file:///` URL.

**New tab (optional)**

1. Open `about:config`.
2. Set `browser.newtab.url` to your `file:///` URL.

> [!TIP]
> Keep the file in a stable folder. If you move or rename it, update the browser setting to the new path.

### Limitations

- **Local data only** — todos, habits, bookmarks, notes, and settings are stored in IndexedDB for the current browser profile. Clearing site data removes everything. There is no built-in export, import, or cross-device sync.
- **One browser profile = one dataset** — data is not shared between Blink and Gecko browsers, or between different profiles on the same browser.
- **Weather needs the network** — geocoding and forecast use Open-Meteo APIs. Without internet, only the last cached value (up to 30 minutes old) is shown.
- **Search suggestions need the network** — online suggestions call Google Suggest over JSONP. Ad blockers, strict privacy settings, or offline mode may disable them; local search history still works.
- **Background images are stored locally** — uploaded images are compressed and saved inside IndexedDB (max 8 MB source file, longest edge resized to 1920 px). Very large libraries of custom backgrounds are not supported.
- **Single note per workspace** — the Notes screen holds one text field per workspace, not a full notes app with multiple pages.
- **`file://` constraints** — some browser policies treat local files differently. If a feature that requires `fetch()` fails, check browser security settings or try serving the file through a local static server during development.
- **Alpha status** — the project is under active development; UI and behavior may change between releases.

### Screenshots

<p align="center">
  <img src="./docs/screenshots/mainPage.png" width="48%" alt="Home screen with search and quick links" />
  <img src="./docs/screenshots/tasks.png" width="48%" alt="Tasks screen" />
  <img src="./docs/screenshots/habits.png" width="48%" alt="Habits screen" />
  <img src="./docs/screenshots/Notes.png" width="48%" alt="Notes screen" />
  <img src="./docs/screenshots/settingPage.png" width="48%" alt="Settings screen" />
  <img src="./docs/screenshots/lightTheme.png" width="48%" alt="Light theme" />
</p>

### Roadmap

#### User-facing

- [x] Workspaces — separate contexts for tasks, habits, bookmarks, and notes
- [x] Tasks — priorities, due dates, drag-and-drop reorder
- [x] Habits — daily tracking with streaks
- [x] Notes — one persistent note per workspace
- [x] Bookmark categories — group and filter quick links
- [x] Multi-engine search — built-in and custom `{q}` templates
- [x] Search history and online suggestions
- [x] Weather — Open-Meteo with local cache
- [x] Clock and date — timezone and format settings
- [x] Theme and appearance — light/dark, custom background, text colors
- [ ] Data import and export
- [ ] Local backup
- [ ] PWA mode — installable, offline shell
- [ ] Workspace delete confirmation
- [ ] Search history management — view and clear
- [ ] Opt-out for online search suggestions
- [ ] New widgets
- [ ] Task filters and grouping
- [ ] Habit calendar and statistics
- [ ] Bookmark drag-and-drop reorder
- [ ] Bookmark favicons
- [ ] Debounced note autosave
- [ ] Keyboard shortcuts
- [ ] Undo for destructive actions
- [ ] Scheduled theme — dark/light by time of day

#### Engineering

- [ ] Content Security Policy
- [x] Refactor data layer — split dashboard data into `data/`, Zustand store, and domain hooks
- [ ] Tests and CI
- [ ] React error boundary
- [ ] SCSS modules only — remove global `styles.css`
- [ ] Loading skeletons

### For Developers

See the [Developer Guide](./docs/DEVELOPERS.en.md) for build instructions, project structure, and release workflow. Current build split: `bun run build` creates single-file release artifact, while `bun run build:multi` creates standard multi-file Vite output. See [Contributing](./CONTRIBUTING.md) if you want to send a pull request.

### License

Licensed under the [MIT License](./LICENSE). 
Copyright (c) 2026 NameNotImportantt.

See the [Code of Conduct](./CODE_OF_CONDUCT.md) for community guidelines.
