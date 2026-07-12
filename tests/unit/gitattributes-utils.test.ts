import { describe, it, expect } from 'vitest';
import {
  generateGitAttributesContent,
  validateGitAttributesConfig,
  GITATTRIBUTES_PRESETS,
} from '@/lib/gitattributes-utils';

describe('.gitattributes Generator Utilities (gitattributes-utils.ts)', () => {
  it('should generate LF normalization and Git LFS rules', () => {
    const config = GITATTRIBUTES_PRESETS[0].config;
    const content = generateGitAttributesContent(config);

    expect(content).toContain('* text=auto eol=lf');
    expect(content).toContain('*.png filter=lfs diff=lfs merge=lfs -text');
    expect(content).toContain('*.bat text eol=crlf');
  });

  it('should generate GitHub Linguist attributes correctly', () => {
    const config = GITATTRIBUTES_PRESETS[1].config;
    const content = generateGitAttributesContent(config);

    expect(content).toContain('dist/** linguist-generated=true');
    expect(content).toContain('vendor/** linguist-vendored=true');
  });

  it('should invalidate empty config with no rules', () => {
    const res = validateGitAttributesConfig({
      defaultLineEnding: 'none',
      enableLfsRules: false,
      lfsExtensions: [],
      customRules: [],
    });

    expect(res.isValid).toBe(false);
  });
});
