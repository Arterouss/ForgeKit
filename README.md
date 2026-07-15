# DevForge — The Premium Desktop-First Developer Workspace v3.0.0 ⚡

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-210_Tests-646CFF?style=for-the-badge&logo=vitest)](https://vitest.dev/)

DevForge is a premium, desktop-grade developer workspace running directly inside your browser. Built to specifications outlined in **`DEVFORGE DESIGN BIBLE v3.0` (Chapters 01 - 40)**, DevForge abandons conventional admin dashboard templates and generic Bootstrap layouts in favor of a handcrafted, high-contrast spatial dark glass architecture inspired by **Raycast, Linear, Arc Browser, Warp Terminal, VS Code, and Vercel**.

---

## ✨ v3.0 Highlights & Core Capabilities

- **Desktop-First Spatial Glass Architecture (`DEVFORGE DESIGN BIBLE v3.0`)**:
  - **Sidebar (`w-72` / `288px` Expanded & `w-[72px]` Collapsed)**: Multi-category grouping with sticky section headers, instant `⌘K` Quick Search pill, and automatic `localStorage` persistence (`devforge_sidebar_collapsed`).
  - **Topbar Command Center (`64px` Sticky)**: Global search/Command Palette trigger (`Ctrl+K`), dynamic Breadcrumbs, live WASM sandbox telemetry (`0.4ms avg latency`), and notification center.
  - **Landing Portal**: Zero horizontal shift (`max-w-6xl mx-auto`), interactive macOS IDE window showcase (`ToolPreviewSection`), and Bento Box feature matrix.
- **60 Instant Developer Utilities** across 9 specialized domains (Formatting, Encoding, Generators, Regex, Crypto, SQL, Network/API, DevOps, and Linux/Server Configs).
- **Split-Screen IDE Studio (`ToolContainer` & `UtilityPanel`)**: Split/Single view toggles, unsaved changes indicators, quick URL link sharing, and fullscreen mode without page reloads.
- **Sandboxed Plugin Marketplace & Extension SDK (`Ctrl+M`)**: Secure capability verification wrapper (`executeSandboxed`), permission audit buffer, and community extensions catalog.
- **6 Curated Developer Themes**: DevForge Dark, Light Canvas, Midnight OLED (`#09090b`), Nord Frost, Tokyo Night Cyberpunk, and Dracula Purple.
- **100% Quality Gates**: 0 ESLint warnings, 0 TypeScript errors, 210/210 Vitest unit tests passing across 62 suites, and clean Next.js 16 production build.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Arterouss/ForgeKit.git
cd ForgeKit

# Install dependencies using pnpm
pnpm install

# Run the local development server with Turbopack
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to launch DevForge.

---

## 🛠️ Included Tools Catalog (60 Tools)

| Category | Tools Included |
| :--- | :--- |
| **Formatting & Linting** | JSON Formatter, XML Formatter, SQL Formatter, YAML Formatter |
| **Encoding & Decoding** | Base64 Studio, URL Encoder/Decoder, Hex Encoder/Decoder, Base32 Studio, HTML Entity Encoder |
| **Generators & Studio** | UUID/ULID Generator, Hash Studio, HMAC Generator, Password Generator, CSR Decoder |
| **Regex & Parsing** | Regex Studio & Matcher, Regex Vulnerability Scanner |
| **Network & API** | DNS Lookup Tool, HTTP Header Inspector, REST Request Builder, cURL Command Builder, Webhook Tester, API Auth Helper, Certificate Viewer |
| **DevOps & Containers** | Dockerfile Builder, Docker Compose Builder, `.dockerignore` Generator, Kubernetes Manifest Builder, Docker Run Command Builder |
| **Linux & Systems Config** | Apache VirtualHost Builder, Nginx Config Builder, Caddyfile Builder, Traefik Config Builder, Systemd Service Builder, Linux Command Explorer, `chmod` Calculator, `chown` Command Builder, Bash Script Generator, Cron Expression Builder |
| **Git & Productivity** | Conventional Commit Builder, `.gitignore` Generator, `.gitattributes` Generator, Git Cheat Sheet, Git Alias Builder, Git Hook Builder, GitHub Actions Workflow Builder, PR Template Builder, Issue Template Builder, Release Notes Generator, Husky Config Builder |

---

## 🧪 Quality Verification & Commands

```bash
# 1. Run ESLint code quality audit (0 warnings required)
pnpm lint

# 2. Run TypeScript strict compiler check (0 errors required)
pnpm type-check

# 3. Execute automated unit test suite across all 62 test files (210 tests)
pnpm test

# 4. Generate optimized Next.js production static & dynamic bundles
pnpm build
```

---

## 📚 Official Documentation & Architecture Reports

- **[REDESIGN_REPORT.md](file:///d:/Kuliah/Web/ForgeKit/REDESIGN_REPORT.md)** — Comprehensive UX & Architectural Redesign verification report (Chapter 40 deliverable).
- **[DESIGN_SYSTEM.md](file:///d:/Kuliah/Web/ForgeKit/DESIGN_SYSTEM.md)** — Design tokens, geometry rules, and spatial glass specifications.
- **[ARCHITECTURE.md](file:///d:/Kuliah/Web/ForgeKit/ARCHITECTURE.md)** — System design, module boundaries, and Core Engine SDK.
- **[CHANGELOG.md](file:///d:/Kuliah/Web/ForgeKit/CHANGELOG.md)** — Chronological release history.
- **[ROADMAP.md](file:///d:/Kuliah/Web/ForgeKit/ROADMAP.md)** — Forward-looking post-v3.0 product milestones.

---

## 📄 License

DevForge is open-source software licensed under the MIT License.
