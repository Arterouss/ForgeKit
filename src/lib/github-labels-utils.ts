// ==============================================
// DevForge — GitHub Labels Generator Utilities
// ==============================================
// Create standardized repository issue labels with
// hex colors and descriptions, exporting to GitHub CLI
// (gh label create), JSON arrays, or YAML configs.
// ==============================================

export interface GitHubLabel {
  id: string;
  name: string;
  color: string; // Hex without # or with #
  description: string;
}

export type LabelsOutputFormat = 'gh-cli' | 'json' | 'yaml';

export interface GitHubLabelsConfig {
  repoOwner: string;
  repoName: string;
  outputFormat: LabelsOutputFormat;
  labels: GitHubLabel[];
}

export interface GitHubLabelsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let labelCounter = 1;
export function generateGitHubLabelId(): string {
  return `label_${Date.now()}_${labelCounter++}`;
}

/**
 * Clean hex color to 6 alphanumeric uppercase/lowercase characters without #
 */
export function normalizeHexColor(color: string): string {
  return color.replace(/^#/, '').trim().toLowerCase();
}

/**
 * Generates formatted output (GitHub CLI commands, JSON, or YAML) for label creation.
 */
export function generateGitHubLabelsOutput(config: GitHubLabelsConfig): string {
  if (config.outputFormat === 'json') {
    const formatted = config.labels.map((l) => ({
      name: l.name.trim(),
      color: normalizeHexColor(l.color),
      description: l.description.trim(),
    }));
    return JSON.stringify(formatted, null, 2);
  }

  if (config.outputFormat === 'yaml') {
    const lines: string[] = ['# GitHub Repository Labels'];
    config.labels.forEach((l) => {
      lines.push(`- name: "${l.name.trim()}"`);
      lines.push(`  color: "${normalizeHexColor(l.color)}"`);
      if (l.description.trim()) {
        lines.push(`  description: "${l.description.trim()}"`);
      }
    });
    return lines.join('\n');
  }

  // gh-cli
  const lines: string[] = [
    `# Run with GitHub CLI (gh auth login required)`,
    `# Target repo: ${config.repoOwner || 'owner'}/${config.repoName || 'repo'}`,
    '',
  ];

  const repoFlag =
    config.repoOwner && config.repoName
      ? `--repo ${config.repoOwner}/${config.repoName}`
      : '';

  config.labels.forEach((l) => {
    const hex = normalizeHexColor(l.color);
    const descFlag = l.description.trim()
      ? `--description "${l.description.trim().replace(/"/g, '\\"')}"`
      : '';
    lines.push(
      `gh label create "${l.name.trim()}" --color "${hex}" ${descFlag} --force ${repoFlag}`.trim()
    );
  });

  return lines.join('\n');
}

/**
 * Validates GitHub labels configuration.
 */
export function validateGitHubLabelsConfig(
  config: GitHubLabelsConfig
): GitHubLabelsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.labels.length === 0) {
    errors.push('At least one label must be defined.');
  }

  const seen = new Set<string>();
  config.labels.forEach((label, idx) => {
    if (!label.name.trim()) {
      errors.push(`Label name is missing on row #${idx + 1}.`);
    } else {
      const lower = label.name.trim().toLowerCase();
      if (seen.has(lower)) {
        errors.push(`Duplicate label name "${label.name}".`);
      } else {
        seen.add(lower);
      }
    }

    const hex = normalizeHexColor(label.color);
    if (!/^[0-9a-f]{6}$/i.test(hex)) {
      errors.push(`Invalid 6-char hex color "${label.color}" for label "${label.name}".`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const GITHUB_LABELS_PRESETS: {
  name: string;
  description: string;
  config: GitHubLabelsConfig;
}[] = [
  {
    name: 'Semantic Triage & Priority Pack',
    description: 'Modern labels for type (bug/feature), priority (p0-p2), and status',
    config: {
      repoOwner: 'Arterouss',
      repoName: 'ForgeKit',
      outputFormat: 'gh-cli',
      labels: [
        {
          id: generateGitHubLabelId(),
          name: 'type: bug 🐛',
          color: 'd73a4a',
          description: 'Something is not working properly',
        },
        {
          id: generateGitHubLabelId(),
          name: 'type: feature ✨',
          color: 'a2eeef',
          description: 'New feature request or enhancement',
        },
        {
          id: generateGitHubLabelId(),
          name: 'priority: P0-critical 🔥',
          color: 'b60205',
          description: 'Urgent production outage or severe security bug',
        },
        {
          id: generateGitHubLabelId(),
          name: 'priority: P1-high ⚡',
          color: 'fbca04',
          description: 'High priority scheduled for next release sprint',
        },
        {
          id: generateGitHubLabelId(),
          name: 'good first issue 👋',
          color: '7057ff',
          description: 'Good for newcomers and community contributors',
        },
      ],
    },
  },
  {
    name: 'Standard GitHub Default Set',
    description: 'Clean default GitHub labels formatted as JSON array',
    config: {
      repoOwner: 'owner',
      repoName: 'repo',
      outputFormat: 'json',
      labels: [
        {
          id: generateGitHubLabelId(),
          name: 'bug',
          color: 'd73a4a',
          description: "Something isn't working",
        },
        {
          id: generateGitHubLabelId(),
          name: 'documentation',
          color: '0075ca',
          description: 'Improvements or additions to documentation',
        },
        {
          id: generateGitHubLabelId(),
          name: 'duplicate',
          color: 'cfd3d7',
          description: 'This issue or pull request already exists',
        },
      ],
    },
  },
];
