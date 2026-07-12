import { describe, it, expect } from 'vitest';
import {
  searchGitCheatSheet,
  customizeCommandString,
  generateCheatSheetMarkdown,
  GIT_CHEAT_ENTRIES,
} from '@/lib/git-cheat-sheet-utils';

describe('Interactive Git Cheat Sheet Utilities (git-cheat-sheet-utils.ts)', () => {
  it('should search commands by title or keyword', () => {
    const res = searchGitCheatSheet('reflog');
    expect(res.length).toBe(1);
    expect(res[0].id).toBe('u3');
  });

  it('should filter commands by category', () => {
    const res = searchGitCheatSheet('', 'stash');
    expect(res.length).toBe(2);
    expect(res.every((x) => x.category === 'stash')).toBe(true);
  });

  it('should substitute parameter placeholders in command template', () => {
    const template = 'git checkout -b <branch_name>';
    const customized = customizeCommandString(template, {
      branch_name: 'feature/auth-jwt',
    });

    expect(customized).toBe('git checkout -b feature/auth-jwt');
  });

  it('should export full Markdown reference guide', () => {
    const md = generateCheatSheetMarkdown(GIT_CHEAT_ENTRIES);
    expect(md).toContain('# DevForge Interactive Git Cheat Sheet');
    expect(md).toContain('## Branching & Merging');
    expect(md).toContain('git push --force-with-lease');
  });
});
