import { describe, it, expect } from 'vitest';
import {
  generateGitHubActionsWorkflow,
  validateGitHubActionsWorkflow,
  GITHUB_ACTIONS_PRESETS,
} from '@/lib/github-actions-utils';

describe('GitHub Actions Workflow Utilities (github-actions-utils.ts)', () => {
  it('should generate valid Docker Build & Push workflow YAML', () => {
    const preset = GITHUB_ACTIONS_PRESETS[0].config;
    const yaml = generateGitHubActionsWorkflow(preset);

    expect(yaml).toContain('name: Docker Build & Push');
    expect(yaml).toContain('uses: docker/build-push-action@v5');
    expect(yaml).toContain('runs-on: ubuntu-latest');
  });

  it('should fail validation when workflow has no jobs defined', () => {
    const res = validateGitHubActionsWorkflow({
      workflowName: 'Empty CI',
      triggers: ['push'],
      branches: ['main'],
      jobs: [],
    });

    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('job must be defined');
  });
});
