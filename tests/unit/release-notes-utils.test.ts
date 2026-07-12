import { describe, it, expect } from 'vitest';
import {
  parseRawCommitLog,
  generateReleaseNotesMarkdown,
  RELEASE_NOTES_PRESETS,
} from '@/lib/release-notes-utils';

describe('Release Notes Generator Utilities (release-notes-utils.ts)', () => {
  it('should parse raw git log --oneline output into semantic categories', () => {
    const raw = `
a1b2c3d feat(auth): add JWT decoder
e4f5g6h fix(ui): repair broken status border
9988776 chore: update dependencies
    `;
    const parsed = parseRawCommitLog(raw);

    expect(parsed.length).toBe(3);
    expect(parsed[0].type).toBe('feat');
    expect(parsed[0].scope).toBe('auth');
    expect(parsed[1].type).toBe('fix');
    expect(parsed[2].type).toBe('other');
  });

  it('should generate grouped Markdown changelog with version header', () => {
    const preset = RELEASE_NOTES_PRESETS[0].config;
    const md = generateReleaseNotesMarkdown(preset);

    expect(md).toContain('# Release v2.0.0 (2026-07-12)');
    expect(md).toContain('### ✨ Features');
    expect(md).toContain('### 🐛 Bug Fixes');
    expect(md).toContain('### ❤️ Contributors');
  });
});
