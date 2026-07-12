// ==============================================
// DevForge — GitHub Actions Workflow Builder Pro Utilities
// ==============================================
// Generate production GitHub Actions workflows with
// cross-tool Docker image build/push integration.
// ==============================================

export type WorkflowTrigger = 'push' | 'pull_request' | 'workflow_dispatch';

export interface GitHubActionsStep {
  id: string;
  name: string;
  uses?: string;
  run?: string;
  withParams?: Record<string, string>;
}

export interface GitHubActionsJob {
  id: string;
  name: string;
  runsOn: string;
  steps: GitHubActionsStep[];
}

export interface GitHubActionsConfig {
  workflowName: string;
  triggers: WorkflowTrigger[];
  branches: string[];
  jobs: GitHubActionsJob[];
}

export interface GitHubActionsValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let stepCounter = 1;
export function generateWorkflowStepId(): string {
  return `gh_step_${Date.now()}_${stepCounter++}`;
}

/**
 * Generates valid GitHub Actions YAML workflow string.
 */
export function generateGitHubActionsWorkflow(config: GitHubActionsConfig): string {
  const lines: string[] = [];

  lines.push(`name: ${config.workflowName || 'CI/CD Pipeline'}`);
  lines.push('');
  lines.push('on:');
  config.triggers.forEach((trigger) => {
    if (trigger === 'workflow_dispatch') {
      lines.push('  workflow_dispatch:');
    } else {
      lines.push(`  ${trigger}:`);
      lines.push(`    branches: [${config.branches.map((b) => `"${b}"`).join(', ')}]`);
    }
  });
  lines.push('');

  lines.push('jobs:');
  config.jobs.forEach((job) => {
    lines.push(`  ${job.id}:`);
    lines.push(`    name: ${job.name}`);
    lines.push(`    runs-on: ${job.runsOn}`);
    lines.push('    steps:');
    job.steps.forEach((step) => {
      lines.push(`      - name: ${step.name}`);
      if (step.uses) {
        lines.push(`        uses: ${step.uses}`);
        if (step.withParams && Object.keys(step.withParams).length > 0) {
          lines.push('        with:');
          Object.entries(step.withParams).forEach(([k, v]) => {
            lines.push(`          ${k}: ${v}`);
          });
        }
      } else if (step.run) {
        lines.push(`        run: ${step.run}`);
      }
    });
    lines.push('');
  });

  return lines.join('\n').trim();
}

/**
 * Validates workflow configuration.
 */
export function validateGitHubActionsWorkflow(
  config: GitHubActionsConfig
): GitHubActionsValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.workflowName.trim()) {
    errors.push('Workflow name is required.');
  }

  if (config.triggers.length === 0) {
    errors.push('At least one event trigger (e.g., push) must be selected.');
  }

  if (config.jobs.length === 0) {
    errors.push('At least one job must be defined in the workflow.');
  }

  config.jobs.forEach((job, idx) => {
    if (job.steps.length === 0) {
      warnings.push(`Job "${job.name}" (#${idx + 1}) has no steps defined.`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const GITHUB_ACTIONS_PRESETS: {
  name: string;
  description: string;
  config: GitHubActionsConfig;
}[] = [
  {
    name: 'Docker Build & GHCR Publish (Cross-Tool Integration)',
    description: 'Build production Dockerfile and push image to GitHub Container Registry',
    config: {
      workflowName: 'Docker Build & Push',
      triggers: ['push', 'pull_request'],
      branches: ['master', 'main'],
      jobs: [
        {
          id: 'docker',
          name: 'Build and Push Docker Image',
          runsOn: 'ubuntu-latest',
          steps: [
            {
              id: generateWorkflowStepId(),
              name: 'Checkout repository',
              uses: 'actions/checkout@v4',
            },
            {
              id: generateWorkflowStepId(),
              name: 'Set up Docker Buildx',
              uses: 'docker/setup-buildx-action@v3',
            },
            {
              id: generateWorkflowStepId(),
              name: 'Log in to GitHub Container Registry',
              uses: 'docker/login-action@v3',
              withParams: {
                registry: 'ghcr.io',
                username: '${{ github.actor }}',
                password: '${{ secrets.GITHUB_TOKEN }}',
              },
            },
            {
              id: generateWorkflowStepId(),
              name: 'Build and push container image',
              uses: 'docker/build-push-action@v5',
              withParams: {
                context: '.',
                push: '${{ github.event_name != \'pull_request\' }}',
                tags: 'ghcr.io/${{ github.repository }}:latest',
              },
            },
          ],
        },
      ],
    },
  },
  {
    name: 'Node.js / Next.js CI Check',
    description: 'Install dependencies, lint, type-check, and run Vitest suite',
    config: {
      workflowName: 'CI Verification Pipeline',
      triggers: ['push', 'pull_request'],
      branches: ['master', 'main'],
      jobs: [
        {
          id: 'test',
          name: 'Lint, Type-Check, and Unit Test',
          runsOn: 'ubuntu-latest',
          steps: [
            {
              id: generateWorkflowStepId(),
              name: 'Checkout Code',
              uses: 'actions/checkout@v4',
            },
            {
              id: generateWorkflowStepId(),
              name: 'Setup Node.js 20',
              uses: 'actions/setup-node@v4',
              withParams: { 'node-version': '20' },
            },
            {
              id: generateWorkflowStepId(),
              name: 'Install pnpm & dependencies',
              run: 'npm install -g pnpm && pnpm ci',
            },
            {
              id: generateWorkflowStepId(),
              name: 'Run Lint & Type Check',
              run: 'pnpm lint && pnpm type-check',
            },
            {
              id: generateWorkflowStepId(),
              name: 'Run Unit Tests',
              run: 'pnpm test',
            },
          ],
        },
      ],
    },
  },
];
