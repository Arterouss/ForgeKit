import { describe, it, expect } from 'vitest';
import {
  generateGitAliasOutput,
  validateGitAliasConfig,
  GIT_ALIAS_PRESETS,
} from '@/lib/git-alias-utils';

describe('Git Alias Builder Utilities (git-alias-utils.ts)', () => {
  it('should generate valid .gitconfig INI format', () => {
    const config = GIT_ALIAS_PRESETS[0].config;
    const output = generateGitAliasOutput(config);

    expect(output).toContain('[alias]');
    expect(output).toContain('st = status -sb');
    expect(output).toContain('co = checkout');
  });

  it('should generate valid CLI setup commands format', () => {
    const config = {
      ...GIT_ALIAS_PRESETS[0].config,
      outputFormat: 'cli-commands' as const,
    };
    const output = generateGitAliasOutput(config);

    expect(output).toContain('git config --global alias.st "status -sb"');
  });

  it('should detect duplicate alias keys', () => {
    const res = validateGitAliasConfig({
      groupTitle: 'Dup Test',
      outputFormat: 'gitconfig',
      aliases: [
        { id: '1', alias: 'st', command: 'status', description: '' },
        { id: '2', alias: 'st', command: 'status -sb', description: '' },
      ],
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('Duplicate alias');
  });
});
