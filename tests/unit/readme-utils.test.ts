import { describe, it, expect } from 'vitest';
import {
  generateReadmeContent,
  validateReadmeConfig,
  README_PRESETS,
} from '@/lib/readme-utils';

describe('README Generator Utilities (readme-utils.ts)', () => {
  it('should generate complete README markdown with badges and table of contents', () => {
    const config = README_PRESETS[0].config;
    const md = generateReadmeContent(config);

    expect(md).toContain('# DevForge Developer Studio');
    expect(md).toContain('img.shields.io/github/license/Arterouss/ForgeKit');
    expect(md).toContain('## Table of Contents');
    expect(md).toContain('## Features');
    expect(md).toContain('## License');
  });

  it('should validate missing project name', () => {
    const res = validateReadmeConfig({
      projectName: '',
      tagline: '',
      githubRepo: 'test/repo',
      includeBadges: false,
      includeToc: false,
      features: [],
      techStack: [],
      installCommand: '',
      devCommand: '',
      contributingEnabled: false,
      license: 'MIT',
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('cannot be empty');
  });
});
