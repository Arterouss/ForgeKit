import { describe, it, expect } from 'vitest';
import {
  generateDockerfile,
  validateDockerfile,
  suggestDockerignoreRules,
  DOCKERFILE_PRESETS,
} from '@/lib/dockerfile-utils';

describe('Dockerfile Utilities (dockerfile-utils.ts)', () => {
  it('should generate valid multi-stage Dockerfile from preset', () => {
    const preset = DOCKERFILE_PRESETS[0]; // Next.js multi-stage
    const output = generateDockerfile(preset.config);
    expect(output).toContain('FROM node:20-alpine AS deps');
    expect(output).toContain('FROM node:20-alpine AS builder');
    expect(output).toContain('FROM node:20-alpine AS runner');
    expect(output).toContain('EXPOSE 3000');
  });

  it('should validate and warn when final stage runs as root', () => {
    const config = {
      stages: [
        {
          id: 's1',
          baseImage: 'node:20',
          steps: [{ id: '1', type: 'CMD' as const, value: '["node"]' }],
        },
      ],
    };
    const res = validateDockerfile(config);
    expect(res.isValid).toBe(true);
    expect(res.warnings.some((w) => w.includes('runs as root'))).toBe(true);
  });

  it('should return errors if no FROM stage is defined', () => {
    const res = validateDockerfile({ stages: [] });
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain('At least one FROM stage');
  });

  it('should suggest .dockerignore rules based on base image', () => {
    const rulesNode = suggestDockerignoreRules('node:20-alpine');
    expect(rulesNode).toContain('node_modules');
    const rulesPy = suggestDockerignoreRules('python:3.12-slim');
    expect(rulesPy).toContain('__pycache__');
  });
});
