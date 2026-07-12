// ==============================================
// DevForge — README Generator Pro Utilities
// ==============================================
// Generate production-grade README.md documents
// with dynamic badges, table of contents, features,
// tech stack, installation, usage, and license.
// ==============================================

export interface ReadmeBadge {
  label: string;
  url: string;
}

export interface ReadmeFeature {
  title: string;
  description: string;
}

export interface ReadmeConfig {
  projectName: string;
  tagline: string;
  bannerUrl?: string;
  githubRepo: string; // e.g., 'owner/repo'
  includeBadges: boolean;
  includeToc: boolean;
  features: ReadmeFeature[];
  techStack: string[];
  installCommand: string;
  devCommand: string;
  usageExample?: string;
  contributingEnabled: boolean;
  license: string;
}

export interface ReadmeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates a complete README.md markdown document based on configuration.
 */
export function generateReadmeContent(config: ReadmeConfig): string {
  const lines: string[] = [];

  // Title
  lines.push(`# ${config.projectName || 'Project Name'}`);
  lines.push('');

  // Badges
  if (config.includeBadges && config.githubRepo.trim()) {
    const repo = config.githubRepo.trim();
    lines.push(
      `![License](https://img.shields.io/github/license/${repo}) ` +
        `![Stars](https://img.shields.io/github/stars/${repo}?style=flat) ` +
        `![Issues](https://img.shields.io/github/issues/${repo})`
    );
    lines.push('');
  }

  // Tagline
  if (config.tagline.trim()) {
    lines.push(`> ${config.tagline.trim()}`);
    lines.push('');
  }

  // Banner
  if (config.bannerUrl && config.bannerUrl.trim()) {
    lines.push(`![Project Banner](${config.bannerUrl.trim()})`);
    lines.push('');
  }

  // Table of Contents
  if (config.includeToc) {
    lines.push('## Table of Contents');
    lines.push('- [Overview](#overview)');
    if (config.features.length > 0) lines.push('- [Features](#features)');
    if (config.techStack.length > 0) lines.push('- [Tech Stack](#tech-stack)');
    lines.push('- [Getting Started](#getting-started)');
    if (config.usageExample?.trim()) lines.push('- [Usage](#usage)');
    if (config.contributingEnabled) lines.push('- [Contributing](#contributing)');
    lines.push('- [License](#license)');
    lines.push('');
  }

  // Overview
  lines.push('## Overview');
  lines.push(
    `${config.projectName} is designed to streamline development and deliver high-performance solutions with modern developer experience.`
  );
  lines.push('');

  // Features
  if (config.features.length > 0) {
    lines.push('## Features');
    config.features.forEach((f) => {
      lines.push(`- **${f.title}**: ${f.description}`);
    });
    lines.push('');
  }

  // Tech Stack
  if (config.techStack.length > 0) {
    lines.push('## Tech Stack');
    config.techStack.forEach((t) => {
      lines.push(`- \`${t}\``);
    });
    lines.push('');
  }

  // Getting Started
  lines.push('## Getting Started');
  lines.push('');
  lines.push('### Prerequisites');
  lines.push('- Node.js >= 18.x');
  lines.push('- pnpm / npm / yarn');
  lines.push('');
  lines.push('### Installation');
  lines.push('1. Clone the repository:');
  lines.push('```bash');
  lines.push(`git clone https://github.com/${config.githubRepo || 'owner/repo'}.git`);
  lines.push('```');
  lines.push('2. Install dependencies:');
  lines.push('```bash');
  lines.push(config.installCommand || 'pnpm install');
  lines.push('```');
  lines.push('3. Start development server:');
  lines.push('```bash');
  lines.push(config.devCommand || 'pnpm dev');
  lines.push('```');
  lines.push('');

  // Usage
  if (config.usageExample?.trim()) {
    lines.push('## Usage');
    lines.push('```typescript');
    lines.push(config.usageExample.trim());
    lines.push('```');
    lines.push('');
  }

  // Contributing
  if (config.contributingEnabled) {
    lines.push('## Contributing');
    lines.push(
      'Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request following conventional commit guidelines.'
    );
    lines.push('');
  }

  // License
  lines.push('## License');
  lines.push(
    `Distributed under the **${config.license || 'MIT'}** License. See \`LICENSE\` for more details.`
  );

  return lines.join('\n');
}

/**
 * Validates README configuration.
 */
export function validateReadmeConfig(config: ReadmeConfig): ReadmeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.projectName.trim()) {
    errors.push('Project name cannot be empty.');
  }

  if (config.includeBadges && !config.githubRepo.includes('/')) {
    warnings.push('GitHub repo should be in format "owner/repo" for badges to render correctly.');
  }

  if (config.features.length === 0) {
    warnings.push('Adding at least one feature description improves documentation quality.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const README_PRESETS: {
  name: string;
  description: string;
  config: ReadmeConfig;
}[] = [
  {
    name: 'Next.js 16 Full-Stack Web Application',
    description: 'Comprehensive README with badges, features, Turbopack stack, and setup commands',
    config: {
      projectName: 'DevForge Developer Studio',
      tagline: 'All-in-one developer productivity platform built with Next.js 16 App Router',
      githubRepo: 'Arterouss/ForgeKit',
      includeBadges: true,
      includeToc: true,
      features: [
        {
          title: 'DevOps & Docker Pack',
          description: 'Visual builders for Dockerfiles, Kubernetes manifests, and CI/CD pipelines',
        },
        {
          title: 'Strict TypeScript & Zero-Config Verification',
          description: 'Fully typed utilities validated by automated Vitest unit test suites',
        },
      ],
      techStack: ['Next.js 16 (App Router)', 'TypeScript 5.x', 'Tailwind CSS', 'Vitest'],
      installCommand: 'pnpm install',
      devCommand: 'pnpm dev',
      usageExample: 'import { generateReadmeContent } from "@/lib/readme-utils";\n\nconst md = generateReadmeContent(myConfig);',
      contributingEnabled: true,
      license: 'MIT',
    },
  },
  {
    name: 'Open-Source Node.js CLI Tool',
    description: 'Concise README tailored for NPM packages and CLI scripts',
    config: {
      projectName: 'forge-cli',
      tagline: 'Blazing fast terminal generator for DevOps templates',
      githubRepo: 'Arterouss/forge-cli',
      includeBadges: true,
      includeToc: false,
      features: [
        {
          title: 'Single Binary Execution',
          description: 'Runs anywhere without complex configuration files',
        },
      ],
      techStack: ['Node.js', 'Commander.js', 'Chalk'],
      installCommand: 'npm install -g forge-cli',
      devCommand: 'forge-cli --help',
      contributingEnabled: true,
      license: 'Apache-2.0',
    },
  },
];
