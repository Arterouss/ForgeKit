# DevForge Architecture Bible

This document details the software architecture, design patterns, module boundaries, and UI/UX structure of **DevForge v3.0** (Desktop-First Browser OS).

---

## 1. System Overview

DevForge is a client-first **Next.js 16 (App Router)** application built with **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

```
+-----------------------------------------------------------------------------+
|                         Next.js App Router & Frame                          |
|  +--------------------+  +----------------------+  +---------------------+  |
|  | / (Landing Portal) |  | /dashboard (Hub/Hub) |  | /dashboard/tools/*  |  |
|  +--------------------+  +----------------------+  +---------------------+  |
+-----------------------------------------------------------------------------+
|              UI & Desktop Workspace Layer (v3.0 Spatial Glass)              |
|  +--------------------+  +-----------------------+  +--------------------+  |
|  | Command Palette    |  | Sidebar & Topbar Shell|  | Split IDE Studio   |  |
|  | (Ctrl+K Spotlight) |  | (288px / 64px Frame)  |  | (ToolContainer)    |  |
|  +--------------------+  +-----------------------+  +--------------------+  |
+-----------------------------------------------------------------------------+
|                         Core Engine & SDK (`src/sdk/`)                      |
|  +--------------------+  +-----------------------+  +--------------------+  |
|  | ToolRegistry       |  | Tool Engine Cache     |  | Plugin Sandbox     |  |
|  | (Dynamic Registry) |  | (Input/Output Cache)  |  | (Capability Guard) |  |
|  +--------------------+  +-----------------------+  +--------------------+  |
+-----------------------------------------------------------------------------+
```

---

## 2. Core Subsystems & UI/UX Architecture

### A. v3.0 Desktop-First UI Shell (`src/components/dashboard/`)
- **Spatial Glass Shell (`DashboardShell`, `Sidebar`, `TopBar`)**:
  - Enforces a desktop application frame with a `288px` (`w-72`) expanded sidebar, `72px` collapsed sidebar (`localStorage` synced via `devforge_sidebar_collapsed`), and sticky `64px` (`h-16`) TopBar.
  - Sub-pixel border framing (`border-white/[0.08]`) and multi-layer dark glass surfaces (`#09090b` canvas).

### B. Dynamic Tool Registry (`src/sdk/tool-registry.ts`)
- Maintains an in-memory map of 60+ registered `ToolDefinition` objects.
- Supports runtime dynamic registration (`registerTool`, `unregisterTool`) allowing sandboxed plugins to inject custom tools into the global search index.

### C. Tool Engine & Persistent Caching (`src/sdk/tool-engine.ts`)
- Wraps tool execution (`runTool`) with execution time tracking, client-side WASM sandboxing, input validation, and persistent input/output caching.

### D. Workspace Storage Ecosystem (`src/lib/workspace-storage-utils.ts`)
- Manages local persistence for:
  - Pinned tools & favorites
  - Custom collections
  - Activity history & telemetry
  - Sticky notes & code snippets
  - Multi-tab dock state (`activeTabs`)

### E. Sandboxed Extension Engine (`src/sdk/plugin-sdk/`)
- Enforces strict manifest validation (`X.Y.Z` semver, allowed capabilities).
- Intercepts sensitive browser APIs via `executeSandboxed(permission, action)` and logs telemetry into an inspectable audit buffer.

### F. Multi-Theme Design Studio (`src/app/globals.css` & `settings/appearance/`)
- Uses OKLCH design variables across 6 developer themes (`dark`, `light`, `midnight`, `nord`, `tokyo-night`, `dracula`).
- Hydration-safe mounting handled via React 19 `useMounted` (`useSyncExternalStore`) pattern.
