// ==============================================
// DevForge — GitHub Issue Template Builder Utils
// ==============================================
// Generate production-ready GitHub YAML Issue Forms
// (.github/ISSUE_TEMPLATE/xxx.yml) or traditional
// Markdown issue templates with structured fields.
// ==============================================

export type IssueFieldType =
  | 'markdown'
  | 'input'
  | 'textarea'
  | 'dropdown'
  | 'checkboxes';

export interface IssueFormField {
  id: string;
  type: IssueFieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for dropdown or checkboxes
  value?: string; // for markdown static block
}

export type IssueTemplateFormat = 'yaml-form' | 'markdown-template';

export interface IssueTemplateConfig {
  name: string;
  description: string;
  titlePrefix: string;
  labels: string[];
  assignees: string[];
  format: IssueTemplateFormat;
  fields: IssueFormField[];
}

export interface IssueTemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let fieldCounter = 1;
export function generateIssueFormFieldId(): string {
  return `field_${Date.now()}_${fieldCounter++}`;
}

/**
 * Generates formatted YAML Issue Form or Markdown template output.
 */
export function generateIssueTemplateOutput(
  config: IssueTemplateConfig
): string {
  if (config.format === 'markdown-template') {
    const lines: string[] = ['---'];
    lines.push(`name: "${config.name.trim()}"`);
    lines.push(`description: "${config.description.trim()}"`);
    if (config.titlePrefix.trim()) {
      lines.push(`title: "${config.titlePrefix.trim()} "`);
    }
    if (config.labels.length > 0) {
      lines.push(`labels: [${config.labels.map((l) => `"${l}"`).join(', ')}]`);
    }
    if (config.assignees.length > 0) {
      lines.push(
        `assignees: [${config.assignees.map((a) => `"${a}"`).join(', ')}]`
      );
    }
    lines.push('---');
    lines.push('');

    config.fields.forEach((field) => {
      if (field.type === 'markdown') {
        lines.push(field.value || field.description || '');
        lines.push('');
      } else if (field.type === 'checkboxes') {
        lines.push(`### ${field.label}`);
        if (field.description) lines.push(`*${field.description}*`);
        (field.options || ['Checked item']).forEach((opt) => {
          lines.push(`- [ ] ${opt}`);
        });
        lines.push('');
      } else {
        lines.push(`### ${field.label}`);
        if (field.description) lines.push(`<!-- ${field.description} -->`);
        lines.push('');
      }
    });

    return lines.join('\n').trim();
  }

  // YAML Issue Form (.yml)
  const lines: string[] = [];
  lines.push(`name: "${config.name.trim()}"`);
  lines.push(`description: "${config.description.trim()}"`);
  if (config.titlePrefix.trim()) {
    lines.push(`title: "${config.titlePrefix.trim()}: "`);
  }
  if (config.labels.length > 0) {
    lines.push('labels:');
    config.labels.forEach((l) => lines.push(`  - "${l}"`));
  }
  if (config.assignees.length > 0) {
    lines.push('assignees:');
    config.assignees.forEach((a) => lines.push(`  - "${a}"`));
  }
  lines.push('body:');

  config.fields.forEach((field) => {
    lines.push(`  - type: ${field.type}`);
    if (field.id) lines.push(`    id: ${field.id}`);

    lines.push('    attributes:');
    if (field.type === 'markdown') {
      const valLines = (field.value || field.description || '').split('\n');
      lines.push('      value: |');
      valLines.forEach((vl) => lines.push(`        ${vl}`));
    } else {
      lines.push(`      label: "${field.label}"`);
      if (field.description) {
        lines.push(`      description: "${field.description}"`);
      }
      if (field.placeholder) {
        lines.push(`      placeholder: "${field.placeholder}"`);
      }
      if (
        (field.type === 'dropdown' || field.type === 'checkboxes') &&
        field.options &&
        field.options.length > 0
      ) {
        lines.push('      options:');
        field.options.forEach((opt) => {
          if (field.type === 'checkboxes') {
            lines.push(`        - label: "${opt}"`);
          } else {
            lines.push(`        - "${opt}"`);
          }
        });
      }
    }

    if (field.type !== 'markdown' && field.required !== undefined) {
      lines.push('    validations:');
      lines.push(`      required: ${field.required ? 'true' : 'false'}`);
    }
  });

  return lines.join('\n').trim();
}

/**
 * Validates issue template configuration.
 */
export function validateIssueTemplateConfig(
  config: IssueTemplateConfig
): IssueTemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.name.trim()) {
    errors.push('Template Name is required.');
  }
  if (!config.description.trim()) {
    errors.push('Template Description is required.');
  }
  if (config.fields.length === 0) {
    errors.push('At least one form field must be defined.');
  }

  config.fields.forEach((field, idx) => {
    if (field.type !== 'markdown' && !field.label.trim()) {
      errors.push(`Label cannot be empty for field #${idx + 1}.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const ISSUE_TEMPLATE_PRESETS: {
  name: string;
  description: string;
  config: IssueTemplateConfig;
}[] = [
  {
    name: 'Bug Report YAML Issue Form (.yml)',
    description: 'Structured form fields with reproduction steps, environment, and logs',
    config: {
      name: 'Bug Report',
      description: 'File a reproducible bug report to help us fix issues quickly',
      titlePrefix: '[BUG]',
      labels: ['bug', 'triage'],
      assignees: [],
      format: 'yaml-form',
      fields: [
        {
          id: 'intro',
          type: 'markdown',
          label: 'Instructions',
          value: 'Thanks for taking the time to report a bug! Please ensure you have searched existing issues before filing.',
        },
        {
          id: 'summary',
          type: 'input',
          label: 'Bug Summary',
          description: 'A concise one-sentence description of the issue',
          placeholder: 'e.g., Export button crashes when input exceeds 10MB',
          required: true,
        },
        {
          id: 'repro',
          type: 'textarea',
          label: 'Steps to Reproduce',
          description: 'Step-by-step instructions to reproduce the behavior',
          placeholder: '1. Go to...\n2. Click on...\n3. See error...',
          required: true,
        },
        {
          id: 'browser',
          type: 'dropdown',
          label: 'Browser / OS',
          required: true,
          options: ['Chrome / Chromium', 'Firefox', 'Safari', 'Edge', 'Node.js CLI'],
        },
      ],
    },
  },
  {
    name: 'Feature Proposal Markdown Template (.md)',
    description: 'Traditional Markdown issue template with checkboxes and headings',
    config: {
      name: 'Feature Request',
      description: 'Suggest an idea for this project',
      titlePrefix: '[FEATURE]',
      labels: ['enhancement'],
      assignees: [],
      format: 'markdown-template',
      fields: [
        {
          id: 'problem',
          type: 'textarea',
          label: 'Problem Statement',
          description: 'Is your feature request related to a problem? Please describe.',
        },
        {
          id: 'solution',
          type: 'textarea',
          label: 'Proposed Solution',
          description: 'Describe the solution or new feature you would like to see.',
        },
        {
          id: 'checklist',
          type: 'checkboxes',
          label: 'Contribution Readiness',
          options: [
            'I am willing to submit a Pull Request implementing this feature',
            'I have checked that no existing issue requests this feature',
          ],
        },
      ],
    },
  },
];
