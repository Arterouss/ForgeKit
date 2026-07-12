import { describe, it, expect } from 'vitest';
import {
  generateGitHubLabelsOutput,
  validateGitHubLabelsConfig,
  normalizeHexColor,
  GITHUB_LABELS_PRESETS,
} from '@/lib/github-labels-utils';

describe('GitHub Labels Generator Utilities (github-labels-utils.ts)', () => {
  it('should normalize hex color codes', () => {
    expect(normalizeHexColor('#D73A4A')).toBe('d73a4a');
    expect(normalizeHexColor('a2eeef ')).toBe('a2eeef');
  });

  it('should generate valid GitHub CLI commands', () => {
    const config = GITHUB_LABELS_PRESETS[0].config;
    const output = generateGitHubLabelsOutput(config);

    expect(output).toContain('gh label create "type: bug 🐛" --color "d73a4a"');
    expect(output).toContain('--repo Arterouss/ForgeKit');
  });

  it('should generate valid JSON array format', () => {
    const config = GITHUB_LABELS_PRESETS[1].config;
    const output = generateGitHubLabelsOutput(config);

    const parsed = JSON.parse(output);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].name).toBe('bug');
    expect(parsed[0].color).toBe('d73a4a');
  });

  it('should invalidate invalid hex color codes', () => {
    const res = validateGitHubLabelsConfig({
      repoOwner: '',
      repoName: '',
      outputFormat: 'gh-cli',
      labels: [
        { id: '1', name: 'bad-color', color: 'red', description: '' },
      ],
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('Invalid 6-char hex color');
  });
});
