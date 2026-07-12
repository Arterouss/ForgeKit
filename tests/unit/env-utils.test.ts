import { describe, it, expect } from 'vitest';
import {
  generateEnvContent,
  generateEnvExampleContent,
  validateEnvVariables,
  ENV_PRESETS,
} from '@/lib/env-utils';

describe('Env Utilities (env-utils.ts)', () => {
  it('should generate valid .env and mask secrets in .env.example', () => {
    const vars = ENV_PRESETS[0].variables;
    const envContent = generateEnvContent(vars);
    const exampleContent = generateEnvExampleContent(vars);

    expect(envContent).toContain('DATABASE_URL=postgresql://');
    expect(exampleContent).toContain('DATABASE_URL=CHANGEME_SECRET_VALUE');
  });

  it('should validate duplicate and invalid env keys', () => {
    const res = validateEnvVariables([
      { id: '1', key: 'INVALID KEY', value: '123' },
      { id: '2', key: 'PORT', value: '3000' },
      { id: '3', key: 'PORT', value: '8080' },
    ]);
    expect(res.isValid).toBe(false);
    expect(res.errors.some((e) => e.includes('Duplicate'))).toBe(true);
  });
});
