// ==============================================
// DevForge — GitIgnore Generator Pro Utilities
// ==============================================
// Technology-based .gitignore rule generation,
// multi-select merge, deduplication, and presets.
// ==============================================

export interface GitIgnoreStack {
  name: string;
  category: 'language' | 'framework' | 'tool';
  rules: string[];
}

/**
 * Merges multiple gitignore rule sets and deduplicates lines.
 */
export function mergeGitignoreRules(stacks: GitIgnoreStack[]): string {
  if (stacks.length === 0) return '';

  const sections: string[] = [];

  for (const stack of stacks) {
    sections.push(`# ===== ${stack.name} =====`);
    for (const rule of stack.rules) {
      sections.push(rule);
    }
    sections.push('');
  }

  return deduplicateRules(sections.join('\n'));
}

/**
 * Removes duplicate rules while preserving comments and section headers.
 */
export function deduplicateRules(input: string): string {
  const lines = input.split('\n');
  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Always preserve blank lines, comments, and section headers
    if (!trimmed || trimmed.startsWith('#')) {
      output.push(line);
      continue;
    }

    if (!seen.has(trimmed)) {
      seen.add(trimmed);
      output.push(line);
    }
  }

  return output.join('\n');
}

/**
 * Filters stacks by search keyword.
 */
export function searchStacks(
  stacks: GitIgnoreStack[],
  query: string
): GitIgnoreStack[] {
  if (!query.trim()) return stacks;
  const lower = query.toLowerCase();
  return stacks.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.category.toLowerCase().includes(lower)
  );
}

// ===== Comprehensive Stack Library =====

export const GITIGNORE_STACKS: GitIgnoreStack[] = [
  // Languages
  {
    name: 'JavaScript',
    category: 'language',
    rules: ['node_modules/', 'dist/', 'build/', '*.log', 'npm-debug.log*', '.env', '.env.local', '.cache/'],
  },
  {
    name: 'TypeScript',
    category: 'language',
    rules: ['node_modules/', 'dist/', 'build/', '*.tsbuildinfo', '*.js.map', '.env', '.env.local'],
  },
  {
    name: 'Python',
    category: 'language',
    rules: [
      '__pycache__/',
      '*.py[cod]',
      '*$py.class',
      '*.so',
      '.Python',
      'env/',
      'venv/',
      '.venv/',
      '*.egg-info/',
      'dist/',
      'build/',
      '.eggs/',
    ],
  },
  {
    name: 'Java',
    category: 'language',
    rules: [
      '*.class',
      '*.jar',
      '*.war',
      '*.ear',
      'target/',
      '.gradle/',
      'build/',
      'out/',
      '.settings/',
      '.project',
      '.classpath',
    ],
  },
  {
    name: 'Go',
    category: 'language',
    rules: ['*.exe', '*.exe~', '*.dll', '*.so', '*.dylib', '*.test', '*.out', 'vendor/'],
  },
  {
    name: 'Rust',
    category: 'language',
    rules: ['target/', '*.rs.bk', 'Cargo.lock'],
  },
  {
    name: 'PHP',
    category: 'language',
    rules: ['vendor/', 'composer.phar', '*.log', '.env', 'storage/framework/cache/', 'storage/logs/'],
  },
  {
    name: 'C#',
    category: 'language',
    rules: ['bin/', 'obj/', '*.suo', '*.user', '.vs/', 'packages/', '*.nupkg'],
  },
  {
    name: 'C++',
    category: 'language',
    rules: ['*.o', '*.obj', '*.exe', '*.out', '*.app', 'build/', 'cmake-build-*/'],
  },
  {
    name: 'Kotlin',
    category: 'language',
    rules: ['*.class', 'build/', '.gradle/', 'out/', '.idea/'],
  },

  // Frameworks
  {
    name: 'Next.js',
    category: 'framework',
    rules: ['.next/', 'out/', 'node_modules/', '.env*.local', 'next-env.d.ts', '.vercel'],
  },
  {
    name: 'React',
    category: 'framework',
    rules: ['node_modules/', 'build/', '.env.local', '.env.development.local', '.env.test.local', '.env.production.local'],
  },
  {
    name: 'Vue',
    category: 'framework',
    rules: ['node_modules/', 'dist/', '.env.local', '*.local'],
  },
  {
    name: 'Angular',
    category: 'framework',
    rules: ['node_modules/', 'dist/', '.angular/', 'e2e/', '*.js.map'],
  },
  {
    name: 'Laravel',
    category: 'framework',
    rules: ['vendor/', 'node_modules/', '.env', 'storage/*.key', 'public/hot', 'public/storage', 'Homestead.yaml', 'Homestead.json'],
  },
  {
    name: 'Django',
    category: 'framework',
    rules: ['*.pyc', '__pycache__/', 'db.sqlite3', 'media/', 'staticfiles/', '.env'],
  },
  {
    name: 'Flask',
    category: 'framework',
    rules: ['*.pyc', '__pycache__/', 'instance/', '.webassets-cache', 'venv/', '.env'],
  },
  {
    name: 'Spring Boot',
    category: 'framework',
    rules: ['target/', '.gradle/', 'build/', '*.jar', '*.war', '.mvn/wrapper/maven-wrapper.jar'],
  },
  {
    name: 'Express',
    category: 'framework',
    rules: ['node_modules/', 'dist/', '.env', '*.log', 'uploads/'],
  },

  // Tools
  {
    name: 'VSCode',
    category: 'tool',
    rules: ['.vscode/*', '!.vscode/settings.json', '!.vscode/tasks.json', '!.vscode/launch.json', '!.vscode/extensions.json', '*.code-workspace'],
  },
  {
    name: 'JetBrains',
    category: 'tool',
    rules: ['.idea/', '*.iml', '*.ipr', '*.iws', 'out/'],
  },
  {
    name: 'Docker',
    category: 'tool',
    rules: ['Dockerfile.bak', 'docker-compose.override.yml', '.dockerignore'],
  },
  {
    name: 'pnpm',
    category: 'tool',
    rules: ['node_modules/', '.pnpm-store/', 'pnpm-lock.yaml'],
  },
  {
    name: 'npm',
    category: 'tool',
    rules: ['node_modules/', 'package-lock.json', 'npm-debug.log*'],
  },
  {
    name: 'Yarn',
    category: 'tool',
    rules: ['node_modules/', '.yarn/*', '!.yarn/patches', '!.yarn/plugins', '!.yarn/releases', '!.yarn/sdks', '!.yarn/versions', '.pnp.*'],
  },
  {
    name: 'TurboRepo',
    category: 'tool',
    rules: ['.turbo/', 'node_modules/', 'dist/', 'build/'],
  },
  {
    name: 'Nx',
    category: 'tool',
    rules: ['node_modules/', 'dist/', 'tmp/', '.nx/cache'],
  },
  {
    name: 'macOS',
    category: 'tool',
    rules: ['.DS_Store', '.AppleDouble', '.LSOverride', 'Icon', '._*', '.Spotlight-V100', '.Trashes'],
  },
  {
    name: 'Windows',
    category: 'tool',
    rules: ['Thumbs.db', 'Thumbs.db:encryptable', 'ehthumbs.db', 'Desktop.ini', '$RECYCLE.BIN/'],
  },
  {
    name: 'Linux',
    category: 'tool',
    rules: ['*~', '.fuse_hidden*', '.directory', '.Trash-*', '.nfs*'],
  },
];

/**
 * Suggested common stack combinations for quick selection.
 */
export const SUGGESTED_COMBOS: { name: string; stacks: string[] }[] = [
  {
    name: 'Next.js Fullstack',
    stacks: ['TypeScript', 'Next.js', 'pnpm', 'VSCode', 'macOS'],
  },
  {
    name: 'Python Django',
    stacks: ['Python', 'Django', 'VSCode', 'macOS'],
  },
  {
    name: 'Java Spring Boot',
    stacks: ['Java', 'Spring Boot', 'JetBrains', 'macOS'],
  },
  {
    name: 'Laravel PHP',
    stacks: ['PHP', 'Laravel', 'VSCode', 'Docker', 'macOS'],
  },
];
