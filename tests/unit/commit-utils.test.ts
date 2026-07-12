import { describe, it, expect } from 'vitest';
import {
  generateConventionalCommit,
  validateConventionalCommit,
  COMMIT_PRESETS,
} from '@/lib/commit-utils';

describe('Conventional Commit Utilities (commit-utils.ts)', () => {
  it('should generate standard feat commit with scope and issue footer', () => {
    const config = COMMIT_PRESETS[0].config;
    const msg = generateConventionalCommit(config);

    expect(msg).toContain('feat(auth): add JWT Token Decoder Pro visual inspection tool');
    expect(msg).toContain('Closes #104');
  });

  it('should format breaking change exclamation flag and BREAKING CHANGE footer', () => {
    const config = COMMIT_PRESETS[1].config;
    const msg = generateConventionalCommit(config);

    expect(msg).toContain('refactor(sdk)!:');
    expect(msg).toContain('BREAKING CHANGE: ToolConfig interface now requires explicit version');
  });

  it('should validate missing subject', () => {
    const res = validateConventionalCommit({
      type: 'fix',
      subject: '',
      isBreakingChange: false,
      includeEmoji: false,
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('subject description is required');
  });
});
