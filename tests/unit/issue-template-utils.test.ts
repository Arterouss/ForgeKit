import { describe, it, expect } from 'vitest';
import {
  generateIssueTemplateOutput,
  validateIssueTemplateConfig,
  ISSUE_TEMPLATE_PRESETS,
} from '@/lib/issue-template-utils';

describe('GitHub Issue Template Builder Utilities (issue-template-utils.ts)', () => {
  it('should generate structured YAML Issue Form (.yml) output', () => {
    const config = ISSUE_TEMPLATE_PRESETS[0].config;
    const yaml = generateIssueTemplateOutput(config);

    expect(yaml).toContain('name: "Bug Report"');
    expect(yaml).toContain('body:');
    expect(yaml).toContain('- type: textarea');
    expect(yaml).toContain('required: true');
  });

  it('should generate traditional Markdown issue template (.md) output', () => {
    const config = ISSUE_TEMPLATE_PRESETS[1].config;
    const md = generateIssueTemplateOutput(config);

    expect(md).toContain('---');
    expect(md).toContain('name: "Feature Request"');
    expect(md).toContain('### Problem Statement');
    expect(md).toContain('- [ ] I am willing to submit a Pull Request');
  });

  it('should invalidate missing name or empty fields', () => {
    const res = validateIssueTemplateConfig({
      name: '',
      description: 'Test desc',
      titlePrefix: '',
      labels: [],
      assignees: [],
      format: 'yaml-form',
      fields: [],
    });

    expect(res.isValid).toBe(false);
  });
});
