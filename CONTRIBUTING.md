# Contributing to DevForge

Thank you for your interest in contributing to DevForge! 🚀

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ForgeKit.git`
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run checks: `pnpm lint && pnpm type-check && pnpm test && pnpm build`
7. Submit a pull request

## Development

```bash
pnpm dev        # Start dev server
pnpm lint       # Run ESLint
pnpm type-check # Check TypeScript
pnpm test       # Run unit tests
pnpm build      # Production build
```

## Guidelines

- Follow the existing code style
- Write TypeScript (strict mode)
- Add tests for new features
- Use design tokens (never hardcode colors)
- Use existing components from the design system
