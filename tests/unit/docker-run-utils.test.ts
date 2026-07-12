import { describe, it, expect } from 'vitest';
import {
  generateDockerRunCommand,
  validateDockerRunConfig,
  DOCKER_RUN_PRESETS,
} from '@/lib/docker-run-utils';

describe('Docker Run Command Utilities (docker-run-utils.ts)', () => {
  it('should generate properly formatted docker run command with flags', () => {
    const config = DOCKER_RUN_PRESETS[0].config;
    const cmd = generateDockerRunCommand(config);

    expect(cmd).toContain('docker run');
    expect(cmd).toContain('-d');
    expect(cmd).toContain('--name postgres-db');
    expect(cmd).toContain('-p 5432:5432');
    expect(cmd).toContain('postgres:16-alpine');
  });

  it('should validate conflicting --rm and --restart flags', () => {
    const res = validateDockerRunConfig({
      containerName: 'test',
      image: 'nginx',
      tag: 'latest',
      detach: true,
      interactiveTty: false,
      removeOnExit: true,
      restartPolicy: 'always',
      ports: [],
      volumes: [],
      env: [],
    });

    expect(res.warnings.some((w) => w.includes('--rm'))).toBe(true);
  });
});
