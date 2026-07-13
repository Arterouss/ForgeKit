# DevForge Changelog

All notable changes to DevForge will be documented in this file.

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
