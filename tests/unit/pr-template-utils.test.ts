import { describe, it, expect } from 'vitest';
import {
  generatePrTemplateMarkdown,
  validatePrTemplateConfig,
  PR_TEMPLATE_PRESETS,
} from '@/lib/pr-template-utils';

describe('Pull Request Template Builder Utilities (pr-template-utils.ts)', () => {
  it('should generate complete engineering PR review template Markdown', () => {
    const config = PR_TEMPLATE_PRESETS[0].config;
    const md = generatePrTemplateMarkdown(config);

    expect(md).toContain('## 📝 Summary');
    expect(md).toContain('Closes #<!-- Issue Number -->');
    expect(md).toContain('- [ ] 🐛 Bug fix');
    expect(md).toContain('## ✅ Verification & Quality Checklist');
    expect(md).toContain('pnpm lint');
  });

  it('should generate concise PR template correctly', () => {
    const config = PR_TEMPLATE_PRESETS[1].config;
    const md = generatePrTemplateMarkdown(config);

    expect(md).toContain('## 📝 Summary');
    expect(md).not.toContain('## 📦 Type of Change');
    expect(md).toContain('- [ ] Code self-reviewed');
  });

  it('should invalidate empty PR config', () => {
    const res = validatePrTemplateConfig({
      includeIssueLink: false,
      includeChangeTypes: false,
      changeTypes: [],
      includeChecklist: false,
      checklistItems: [],
      customSections: [],
    });

    expect(res.isValid).toBe(false);
  });
});
