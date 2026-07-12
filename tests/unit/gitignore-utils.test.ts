import { describe, it, expect } from 'vitest';
import {
  mergeGitignoreRules,
  deduplicateRules,
  searchStacks,
  GITIGNORE_STACKS,
  SUGGESTED_COMBOS,
} from '@/lib/gitignore-utils';

describe('GitIgnore Utilities (gitignore-utils.ts)', () => {
  it('should merge multiple stacks into a single .gitignore output', () => {
    const ts = GITIGNORE_STACKS.find((s) => s.name === 'TypeScript')!;
    const next = GITIGNORE_STACKS.find((s) => s.name === 'Next.js')!;
    const result = mergeGitignoreRules([ts, next]);
    expect(result).toContain('# ===== TypeScript =====');
    expect(result).toContain('# ===== Next.js =====');
    expect(result).toContain('.next/');
    // node_modules/ appears in both but should be deduplicated
    const matches = result.match(/^node_modules\/$/gm);
    expect(matches).toHaveLength(1);
  });

  it('should deduplicate rules while preserving comments', () => {
    const input = `# Header\nnode_modules/\ndist/\nnode_modules/\n# Footer\ndist/`;
    const result = deduplicateRules(input);
    const nodeMatches = result.match(/^node_modules\/$/gm);
    expect(nodeMatches).toHaveLength(1);
    expect(result).toContain('# Header');
    expect(result).toContain('# Footer');
  });

  it('should search stacks by name', () => {
    const results = searchStacks(GITIGNORE_STACKS, 'next');
    expect(results.some((s) => s.name === 'Next.js')).toBe(true);
  });

  it('should search stacks by category', () => {
    const results = searchStacks(GITIGNORE_STACKS, 'framework');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((s) => s.category === 'framework')).toBe(true);
  });

  it('should have suggested combos that reference valid stacks', () => {
    for (const combo of SUGGESTED_COMBOS) {
      for (const stackName of combo.stacks) {
        const exists = GITIGNORE_STACKS.some((s) => s.name === stackName);
        expect(exists).toBe(true);
      }
    }
  });
});
