// ==============================================
// DevForge — .dockerignore Generator Pro Utilities
// ==============================================
// Technology-based .dockerignore rule generation,
// security secret rules, and deduplication.
// ==============================================

export interface DockerignoreStack {
  name: string;
  category: 'language' | 'framework' | 'security' | 'tool';
  rules: string[];
}

/**
 * Merges selected stack rules and deduplicates lines.
 */
export function mergeDockerignoreRules(stacks: DockerignoreStack[]): string {
  if (stacks.length === 0) return '';

  const sections: string[] = [];

  for (const stack of stacks) {
    sections.push(`# ===== ${stack.name} =====`);
    for (const rule of stack.rules) {
      sections.push(rule);
    }
    sections.push('');
  }

  return deduplicateDockerignore(sections.join('\n'));
}

/**
 * Deduplicates non-comment lines while preserving section headers.
 */
export function deduplicateDockerignore(input: string): string {
  const lines = input.split('\n');
  const seen = new Set<string>();
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
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

export const DOCKERIGNORE_STACKS: DockerignoreStack[] = [
  // Security & Universal
  {
    name: 'Security & Secrets (MUST HAVE)',
    category: 'security',
    rules: [
      '.git',
      '.gitignore',
      '.env',
      '.env.*',
      '*.key',
      '*.pem',
      '*.p12',
      'id_rsa*',
      'credentials.json',
      'docker-compose*.yml',
      'Dockerfile*',
      '.dockerignore',
    ],
  },
  {
    name: 'IDEs & OS Files',
    category: 'tool',
    rules: [
      '.vscode',
      '.idea',
      '*.swp',
      '*.swo',
      '.DS_Store',
      'Thumbs.db',
    ],
  },

  // Languages & Frameworks
  {
    name: 'Node.js & Next.js',
    category: 'language',
    rules: [
      'node_modules',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-lock.yaml',
      '.next',
      'out',
      'build',
      'dist',
      'coverage',
    ],
  },
  {
    name: 'Python & FastAPI / Django',
    category: 'language',
    rules: [
      '__pycache__',
      '*.py[cod]',
      '*$py.class',
      '*.so',
      '.Python',
      'env',
      'venv',
      '.venv',
      '*.egg-info',
      '.pytest_cache',
      'htmlcov',
    ],
  },
  {
    name: 'Golang',
    category: 'language',
    rules: [
      '*.exe',
      '*.test',
      '*.prof',
      'vendor',
      'bin',
    ],
  },
  {
    name: 'Java & Spring Boot',
    category: 'language',
    rules: [
      '*.class',
      'target',
      '.gradle',
      'build',
      '*.jar',
      '*.war',
      '*.ear',
    ],
  },
  {
    name: 'PHP & Laravel',
    category: 'framework',
    rules: [
      'vendor',
      'node_modules',
      'storage/*.key',
      'phpunit.xml',
      '.phpunit.result.cache',
    ],
  },
];
