# DevForge Architecture Bible

This document details the software architecture, design patterns, and module boundaries of **DevForge v1.0.0**.

---

## 1. System Overview

DevForge is a client-first **Next.js 16 (App Router)** application built with **React 19**, **TypeScript 5**, and **Tailwind CSS v4**.

```
+-----------------------------------------------------------------------------+
|                               Next.js App Router                            |
|  +-----------------------+  +----------------------+  +------------------+  |
|  | /dashboard (Hub/Grid) |  | /dashboard/tools/*   |  | /marketplace     |  |
|  +-----------------------+  +----------------------+  +------------------+  |
+-----------------------------------------------------------------------------+
|                            UI & Workspace Layer                             |
|  +--------------------+  +-----------------------+  +--------------------+  |
|  | Command Palette    |  | WorkspaceContext      |  | PluginProvider     |  |
|  | (Ctrl+K)           |  | (LocalStorage Sync)   |  | (LocalStorage Sync)|  |
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

## 2. Core Subsystems

### A. Dynamic Tool Registry (`src/sdk/tool-registry.ts`)
- Maintains an in-memory map of registered `ToolDefinition` objects.
- Supports runtime dynamic registration (`registerTool`, `unregisterTool`) allowing sandboxed plugins to inject custom tools seamlessly into the global search index.

### B. Tool Engine & Persistent Caching (`src/sdk/tool-engine.ts`)
- Wraps tool execution (`runTool`) with execution time tracking, input validation, and optional persistent input/output caching.

### C. Workspace Storage Ecosystem (`src/lib/workspace-storage-utils.ts`)
- Manages local persistence for:
  - Pinned tools & favorites
  - Custom collections
  - Activity history
  - Sticky notes & code snippets
  - Multi-tab dock state (`activeTabs`)

### D. Sandboxed Extension Engine (`src/sdk/plugin-sdk/`)
- Enforces strict manifest validation (`X.Y.Z` semver, allowed capabilities).
- Intercepts sensitive browser APIs via `executeSandboxed(permission, action)` and logs telemetry into an inspectable audit buffer.

### E. Multi-Theme Design System (`src/app/globals.css`)
- Uses OKLCH design variables across 6 developer themes (`dark`, `light`, `midnight`, `nord`, `tokyo-night`, `dracula`).
