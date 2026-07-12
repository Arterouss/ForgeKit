// ==============================================
// DevForge — Conventional Commit Assistant Utilities
// ==============================================
// Generate standardized Conventional Commits
// specification messages with breaking change
// support, issue closing footers, and validation.
// ==============================================

export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'
  | 'build'
  | 'ci'
  | 'chore'
  | 'revert';

export interface CommitTypeMetadata {
  type: CommitType;
  emoji: string;
  label: string;
  description: string;
}

export const COMMIT_TYPES: CommitTypeMetadata[] = [
  { type: 'feat', emoji: '✨', label: 'Feature', description: 'A new feature for the user' },
  { type: 'fix', emoji: '🐛', label: 'Bug Fix', description: 'A bug fix for the user' },
  { type: 'docs', emoji: '📚', label: 'Documentation', description: 'Documentation only changes' },
  { type: 'style', emoji: '💎', label: 'Style', description: 'Formatting, white-space, missing semi-colons, etc.' },
  { type: 'refactor', emoji: '♻️', label: 'Refactor', description: 'A code change that neither fixes a bug nor adds a feature' },
  { type: 'perf', emoji: '⚡', label: 'Performance', description: 'A code change that improves performance' },
  { type: 'test', emoji: '🧪', label: 'Test', description: 'Adding missing tests or correcting existing tests' },
  { type: 'build', emoji: '📦', label: 'Build', description: 'Changes that affect build system or external dependencies' },
  { type: 'ci', emoji: '⚙️', label: 'CI/CD', description: 'Changes to CI configuration files and scripts' },
  { type: 'chore', emoji: '🔧', label: 'Chore', description: 'Other changes that do not modify src or test files' },
  { type: 'revert', emoji: '⏪', label: 'Revert', description: 'Reverts a previous commit' },
];

export interface ConventionalCommitConfig {
  type: CommitType;
  scope?: string;
  subject: string;
  body?: string;
  isBreakingChange: boolean;
  breakingChangeDescription?: string;
  issueReference?: string; // e.g., 'Closes #42'
  includeEmoji: boolean;
}

export interface CommitValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Generates formatted git commit message string.
 */
export function generateConventionalCommit(config: ConventionalCommitConfig): string {
  const meta = COMMIT_TYPES.find((t) => t.type === config.type);
  const emojiPrefix = config.includeEmoji && meta ? `${meta.emoji} ` : '';

  const scopeStr = config.scope?.trim() ? `(${config.scope.trim().toLowerCase()})` : '';
  const breakingFlag = config.isBreakingChange ? '!' : '';

  const header = `${config.type}${scopeStr}${breakingFlag}: ${emojiPrefix}${config.subject.trim() || 'short descriptive summary'}`;

  const blocks: string[] = [header];

  if (config.body?.trim()) {
    blocks.push('');
    blocks.push(config.body.trim());
  }

  if (config.isBreakingChange) {
    blocks.push('');
    const breakDesc = config.breakingChangeDescription?.trim() || config.subject.trim();
    blocks.push(`BREAKING CHANGE: ${breakDesc}`);
  }

  if (config.issueReference?.trim()) {
    blocks.push('');
    blocks.push(config.issueReference.trim());
  }

  return blocks.join('\n');
}

/**
 * Validates conventional commit configuration.
 */
export function validateConventionalCommit(
  config: ConventionalCommitConfig
): CommitValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.subject.trim()) {
    errors.push('Commit subject description is required.');
  } else {
    if (config.subject.trim().length > 72) {
      warnings.push('Commit subject should ideally be under 72 characters.');
    }
    if (config.subject.trim().endsWith('.')) {
      warnings.push('Conventional commit header subject should not end with a period.');
    }
  }

  if (config.isBreakingChange && !config.breakingChangeDescription?.trim()) {
    warnings.push('Specifying detailed breaking change explanation is recommended.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const COMMIT_PRESETS: {
  name: string;
  description: string;
  config: ConventionalCommitConfig;
}[] = [
  {
    name: 'New Feature with Scope & Issue Reference',
    description: 'Add authentication JWT decoder feature and close ticket #104',
    config: {
      type: 'feat',
      scope: 'auth',
      subject: 'add JWT Token Decoder Pro visual inspection tool',
      body: 'Implement client-side base64url header/payload parser with epoch timestamp expiration alerts.',
      isBreakingChange: false,
      issueReference: 'Closes #104',
      includeEmoji: false,
    },
  },
  {
    name: 'Breaking Change API Refactor',
    description: 'Major architectural change requiring client migration',
    config: {
      type: 'refactor',
      scope: 'sdk',
      subject: 'update Tool Engine payload interface to v2 schema',
      body: 'Migrate all tool state inputs to structured JSON contracts.',
      isBreakingChange: true,
      breakingChangeDescription: 'ToolConfig interface now requires explicit version and metadata attributes.',
      issueReference: 'Ref #200',
      includeEmoji: true,
    },
  },
  {
    name: 'Hotfix for Production Bug',
    description: 'Fix null reference error in regex evaluation worker',
    config: {
      type: 'fix',
      scope: 'regex-studio',
      subject: 'handle empty input string in match highlighter',
      isBreakingChange: false,
      includeEmoji: false,
    },
  },
];
