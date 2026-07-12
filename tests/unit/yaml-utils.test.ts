import { describe, it, expect } from 'vitest';
import {
  formatYaml,
  validateYaml,
  yamlToJson,
  jsonToYaml,
  SAMPLE_DOCKER_COMPOSE_YAML,
} from '@/lib/yaml-utils';

describe('YAML Utilities (yaml-utils.ts)', () => {
  it('should format valid YAML cleanly', () => {
    const raw = 'version: "3.8"\nservices:\n web:\n  image: nginx';
    const res = formatYaml(raw, 2);
    expect(res.isValid).toBe(true);
    expect(res.output).toContain('version:');
    expect(res.output).toContain('image: nginx');
  });

  it('should format SAMPLE_DOCKER_COMPOSE_YAML successfully', () => {
    const res = formatYaml(SAMPLE_DOCKER_COMPOSE_YAML, 2);
    expect(res.isValid).toBe(true);
    expect(res.output).toContain('services:');
  });

  it('should validate YAML and return line/column on syntax error', () => {
    const invalid = 'services:\n  web:\n    image: [invalid unclosed list';
    const res = validateYaml(invalid);
    expect(res.isValid).toBe(false);
    expect(res.errorLine).toBeDefined();
  });

  it('should convert YAML to JSON correctly', () => {
    const yamlStr = 'name: DevForge\nversion: 1.0\ntags:\n  - tools\n  - nextjs';
    const res = yamlToJson(yamlStr);
    expect(res.isValid).toBe(true);
    const parsed = JSON.parse(res.output);
    expect(parsed.name).toBe('DevForge');
    expect(parsed.tags).toEqual(['tools', 'nextjs']);
  });

  it('should convert JSON to YAML correctly', () => {
    const jsonStr = JSON.stringify({ app: 'devforge', port: 3000 });
    const res = jsonToYaml(jsonStr);
    expect(res.isValid).toBe(true);
    expect(res.output).toContain('app: devforge');
    expect(res.output).toContain('port: 3000');
  });
});
