# DevForge — The Ultimate All-In-One Developer Toolbox v1.0.0 ⚡

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-210_Tests-646CFF?style=for-the-badge&logo=vitest)](https://vitest.dev/)

DevForge is an enterprise-grade, extensible developer platform housing **60 instant developer tools**, an integrated **Workspace Ecosystem**, a sandboxed **Plugin Marketplace**, and **6 developer themes**.

---

## ✨ Features at a Glance

- **60 Instant Developer Tools** across 9 specialized domains (Formatting, Encoding, Generators, Regex, Crypto, SQL, Network/API, DevOps, and Server Configs).
- **Extensible Tool SDK & Engine** (`@/sdk/`): Type-safe metadata, schema validation, persistent input/output caching, and search registry.
- **Developer Workspace Ecosystem** (`Ctrl+K` Command Palette, Workspace Hub, Custom Collections, Sticky Notes, Code Snippet Vault, and Multi-Tab dock).
- **Plugin Marketplace & Extension SDK** (`Ctrl+M`): Secure sandboxed execution wrapper (`executeSandboxed`), permission audit telemetry, and community extensions catalog.
- **6 Curated Developer Themes**: DevForge Dark, Light Canvas, Midnight OLED, Nord Frost, Tokyo Night, and Dracula Purple.
- **100% Quality Gates**: Fully tested with 210 Vitest unit tests, 0 TypeScript errors, 0 ESLint warnings, and Next.js 16 App Router Turbopack SSG/SSR readiness.

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
# Run TypeScript compiler check (0 errors required)
pnpm type-check

# Run ESLint validation (--max-warnings 0)
pnpm lint

# Run automated Vitest unit test suite (210 tests across 62 suites)
pnpm test

# Build production bundle with Next.js Turbopack
pnpm build
```

---

## 📄 License & Contributing

DevForge is licensed under the MIT License. See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.
