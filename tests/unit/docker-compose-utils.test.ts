import { describe, it, expect } from 'vitest';
import {
  createEmptyService,
  generateComposeYaml,
  validateComposeProject,
  DOCKER_PRESETS,
  type DockerComposeProject,
} from '@/lib/docker-compose-utils';

describe('Docker Compose Utilities (docker-compose-utils.ts)', () => {
  const makeProject = (overrides?: Partial<DockerComposeProject>): DockerComposeProject => ({
    version: '3.8',
    services: [createEmptyService('web')],
    globalNetworks: [],
    globalVolumes: [],
    ...overrides,
  });

  it('should generate valid YAML from a project with services', () => {
    const preset = DOCKER_PRESETS[0]; // Next.js + PostgreSQL
    const project = makeProject({
      services: preset.services,
      globalVolumes: ['pgdata'],
    });
    const output = generateComposeYaml(project);
    expect(output).toContain('version:');
    expect(output).toContain('services:');
    expect(output).toContain('postgres:');
    expect(output).toContain('nextjs:');
  });

  it('should validate and error when no services present', () => {
    const project = makeProject({ services: [] });
    const result = validateComposeProject(project);
    expect(result.isValid).toBe(false);
    expect(result.errors[0]).toContain('At least one service');
  });

  it('should detect duplicate host ports across services', () => {
    const svc1 = createEmptyService('web');
    svc1.image = 'nginx';
    svc1.ports = [{ host: '80', container: '80' }];

    const svc2 = createEmptyService('api');
    svc2.image = 'node';
    svc2.ports = [{ host: '80', container: '3000' }];

    const project = makeProject({ services: [svc1, svc2] });
    const result = validateComposeProject(project);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('port 80'))).toBe(true);
  });

  it('should detect missing image or build context', () => {
    const svc = createEmptyService('noimage');
    const project = makeProject({ services: [svc] });
    const result = validateComposeProject(project);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes('no image'))).toBe(true);
  });

  it('should create empty service with sensible defaults', () => {
    const svc = createEmptyService('myapp');
    expect(svc.name).toBe('myapp');
    expect(svc.restartPolicy).toBe('unless-stopped');
    expect(svc.ports).toHaveLength(0);
  });
});
