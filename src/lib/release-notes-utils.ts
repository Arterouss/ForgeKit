// ==============================================
// DevForge — Release Notes Generator Utilities
// ==============================================
// Parse raw git log --oneline output or custom commits
// and generate structured Markdown changelogs grouped
// by conventional commit semantic category.
// ==============================================

export interface ParsedCommitEntry {
  id: string;
  hash?: string;
  type: 'feat' | 'fix' | 'perf' | 'docs' | 'other';
  scope?: string;
  subject: string;
  author?: string;
}

export interface ReleaseNotesConfig {
  version: string;
  dateString: string;
  githubRepo: string;
  previousVersion?: string;
  commits: ParsedCommitEntry[];
  includeContributors: boolean;
}

export interface ReleaseNotesValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let commitCounter = 1;
export function generateCommitEntryId(): string {
  return `commit_${Date.now()}_${commitCounter++}`;
}

/**
 * Parses a raw `git log --oneline` or multiline conventional commit string
 * into structured ParsedCommitEntry array.
 */
export function parseRawCommitLog(rawText: string): ParsedCommitEntry[] {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const result: ParsedCommitEntry[] = [];

  lines.forEach((line) => {
    // Example line: "a1b2c3d feat(auth): add JWT decoder tool (@Bayu)"
    // Or just: "feat: add release notes parser"
    const hashMatch = line.match(/^([a-z0-9]{6,12})\s+(.+)$/i);
    let hash: string | undefined;
    let rest = line;

    if (hashMatch) {
      hash = hashMatch[1];
      rest = hashMatch[2];
    }

    // Conventional match: "type(scope): subject"
    const convMatch = rest.match(/^([a-z]+)(?:\(([^)]+)\))?(!?):\s*(.+)$/i);
    if (convMatch) {
      const rawType = convMatch[1].toLowerCase();
      const scope = convMatch[2];
      const subject = convMatch[4];

      let category: ParsedCommitEntry['type'] = 'other';
      if (rawType === 'feat') category = 'feat';
      else if (rawType === 'fix') category = 'fix';
      else if (rawType === 'perf') category = 'perf';
      else if (rawType === 'docs') category = 'docs';

      result.push({
        id: generateCommitEntryId(),
        hash,
        type: category,
        scope,
        subject,
      });
    } else {
      result.push({
        id: generateCommitEntryId(),
        hash,
        type: 'other',
        subject: rest,
      });
    }
  });

  return result;
}

/**
 * Generates formatted Markdown release notes from config.
 */
export function generateReleaseNotesMarkdown(config: ReleaseNotesConfig): string {
  const lines: string[] = [];

  lines.push(`# Release ${config.version || 'v1.0.0'} (${config.dateString || '2026-07-12'})`);
  lines.push('');

  if (config.githubRepo && config.previousVersion) {
    lines.push(
      `[Full Changelog](https://github.com/${config.githubRepo}/compare/${config.previousVersion}...${config.version})`
    );
    lines.push('');
  }

  const feats = config.commits.filter((c) => c.type === 'feat');
  const fixes = config.commits.filter((c) => c.type === 'fix');
  const perfs = config.commits.filter((c) => c.type === 'perf');
  const docs = config.commits.filter((c) => c.type === 'docs');
  const others = config.commits.filter((c) => c.type === 'other');

  const renderSection = (title: string, list: ParsedCommitEntry[]) => {
    if (list.length === 0) return;
    lines.push(`### ${title}`);
    list.forEach((c) => {
      const hashBadge = c.hash ? ` [\`${c.hash}\`]` : '';
      const scopeBadge = c.scope ? `**${c.scope}**: ` : '';
      lines.push(`- ${scopeBadge}${c.subject}${hashBadge}`);
    });
    lines.push('');
  };

  renderSection('✨ Features', feats);
  renderSection('🐛 Bug Fixes', fixes);
  renderSection('⚡ Performance Improvements', perfs);
  renderSection('📚 Documentation & Guides', docs);
  renderSection('♻️ Maintenance & Chores', others);

  if (config.includeContributors) {
    const authors = Array.from(
      new Set(config.commits.map((c) => c.author).filter(Boolean))
    );
    if (authors.length > 0) {
      lines.push('### ❤️ Contributors');
      lines.push(`Thanks to ${authors.join(', ')} for making this release possible!`);
      lines.push('');
    }
  }

  return lines.join('\n').trim();
}

/**
 * Validates release notes configuration.
 */
export function validateReleaseNotesConfig(
  config: ReleaseNotesConfig
): ReleaseNotesValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.version.trim()) {
    errors.push('Release version tag (e.g. v2.0.0) is required.');
  }

  if (config.commits.length === 0) {
    warnings.push('Changelog currently has no commits added.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const RELEASE_NOTES_PRESETS: {
  name: string;
  description: string;
  config: ReleaseNotesConfig;
}[] = [
  {
    name: 'DevForge v2.0.0 Docker & DevOps Pack',
    description: 'Release changelog grouped by features, fixes, and docs',
    config: {
      version: 'v2.0.0',
      dateString: '2026-07-12',
      githubRepo: 'Arterouss/ForgeKit',
      previousVersion: 'v1.9.0',
      includeContributors: true,
      commits: [
        {
          id: generateCommitEntryId(),
          hash: '91f2a49',
          type: 'feat',
          scope: 'devops',
          subject: 'add Docker Run Command Builder Pro with volume & port mappings',
          author: '@Bayu',
        },
        {
          id: generateCommitEntryId(),
          hash: 'a1b2c3d',
          type: 'feat',
          scope: 'actions',
          subject: 'implement GitHub Actions Workflow Builder with Docker build/push preset',
          author: '@Bayu',
        },
        {
          id: generateCommitEntryId(),
          hash: 'e4f5g6h',
          type: 'fix',
          scope: 'lint',
          subject: 'remove unused icon imports from tool components',
          author: '@Bayu',
        },
        {
          id: generateCommitEntryId(),
          hash: '7j8k9l0',
          type: 'docs',
          scope: 'walkthrough',
          subject: 'update Phase 2 verification results and tool table',
          author: '@Bayu',
        },
      ],
    },
  },
];
