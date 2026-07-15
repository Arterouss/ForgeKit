# DevForge Changelog

All notable changes to DevForge will be documented in this file.

## [3.0.0] - 2026-07-15

### Added & Redesigned (Desktop-First Browser OS Redesign)
- **Comprehensive UI/UX Visual Overhaul (`DEVFORGE DESIGN BIBLE v3.0` Chapters 01 - 40)**
  - Replaced conventional admin dashboard templates and generic Bootstrap/Tailwind containers with a handcrafted, high-contrast spatial dark glass design (`#09090b` canvas, `border-white/[0.08]`, `rounded-[24px]` / `rounded-[28px]`).
  - **Sidebar (`src/components/dashboard/sidebar.tsx`)**: Rebuilt with exact `288px` (`w-72`) expanded / `72px` collapsed dimensions, subtle left accent indicators (`w-0.5 bg-primary`), sticky category headers, and automatic `localStorage` persistence (`devforge_sidebar_collapsed`).
  - **Topbar Command Center (`src/components/dashboard/topbar.tsx`)**: Sticky `64px` header with dynamic Breadcrumbs, instant `Ctrl+K` Command Palette pill, local WASM telemetry (`0.4ms avg latency`), and notification center.
  - **Landing Page (`src/app/page.tsx`)**: Zero horizontal shift, 100% centered architecture featuring an interactive macOS IDE live showcase (`ToolPreviewSection`), Bento Box feature grid, and local execution benchmarks.
  - **Dashboard Command Center (`src/app/dashboard/page.tsx`)**: Time-sensitive greeting, instant Spotlight Search (`Ctrl+K`), and 1-click Quick Launch pills for top engineering utilities.
  - **IDE Tool Sandbox (`src/components/workspace/*`)**: Split view vs Single view layout toggles, unsaved changes indicators, instant URL link sharing, and fullscreen execution mode without page reloads.
  - **React 19 & Hydration Compliance**: Implemented `useMounted` (`useSyncExternalStore`) across theme switching and appearance settings to guarantee zero hydration mismatches and zero lint errors.
  - **Quality Gates Verification**: Verified with `0 errors` on `pnpm lint` and `pnpm type-check`, `210/210 passing tests` on `pnpm test`, and clean production build compilation (`pnpm build`).

---

## [1.0.0] - 2026-07-13

### Added
- **Phase 10: Release Candidate & Production Readiness**
  - Added privacy-first Error Monitoring & Analytics telemetry abstractions (`src/lib/monitoring/`).
  - Implemented dynamic complete Next.js sitemap indexing all core pages and 60 tools (`src/app/sitemap.ts`).
  - Added comprehensive production documentation (`ARCHITECTURE.md`, `RELEASE_NOTES_v1.md`, updated `README.md`).
- **Phase 9: UI/UX Master Polish**
  - Expanded theme system with 4 new developer themes (**Midnight**, **Nord**, **Tokyo Night**, **Dracula**) alongside Dark and Light.
  - Redesigned `ToolCard` with dynamic Lucide category icons, interactive Favorite toggle, and WCAG accessibility.
  - Added multi-theme switching commands to Command Palette (`Ctrl+K`) and TopBar multi-theme selector.
  - Added `CodeEditor` syntax-ready component with line numbers and copy-to-clipboard support.
- **Phase 8: Plugin Marketplace & Extension SDK**
  - Implemented Sandboxed Extension SDK (`executeSandboxed`) with capability verification and security audit logs.
  - Added interactive 4-tab Plugin Marketplace portal (`/dashboard/marketplace` via `Ctrl+M`).
  - Added 6 curated community extensions to local marketplace.
- **Phase 7: Developer Workspace Ecosystem**
  - Added Persistent Workspace Storage (`localStorage` + export/import JSON backups).
  - Added Workspace Hub (`/dashboard/workspace`), Custom Collections, Sticky Notes, and Code Snippet Vault.
  - Implemented multi-tab dock (`activeTabs`) and global Command Palette (`Ctrl+K`).
- **Phase 1 to Phase 6: Core Engine & 60 Specialized Tools**
  - Built 60 developer utilities across Formatting, Encoding, Generators, Regex, Crypto, SQL, Network/API, DevOps, Linux/Server, and Git Productivity.
  - Enforced 100% automated Vitest coverage (210 tests across 62 files).
