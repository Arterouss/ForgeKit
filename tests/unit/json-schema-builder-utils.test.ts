import { describe, it, expect } from 'vitest';
import {
  inferJsonSchema,
  generateTsInterfaceFromJson,
  validateJsonAgainstSchema,
  JSON_SCHEMA_PRESETS,
} from '@/lib/json-schema-builder-utils';

describe('JSON Schema Builder Utilities (json-schema-builder-utils.ts)', () => {
  it('should infer JSON Schema Draft 07 correctly from sample JSON', () => {
    const sample = JSON_SCHEMA_PRESETS[0].sampleJson;
    const { schemaJson, parsedSchema } = inferJsonSchema(sample, 'UserSchema');

    expect(schemaJson).toContain('$schema');
    expect(parsedSchema?.title).toBe('UserSchema');
    expect(parsedSchema?.properties?.username?.type).toBe('string');
  });

  it('should generate valid TypeScript interface string from JSON', () => {
    const sample = JSON_SCHEMA_PRESETS[0].sampleJson;
    const tsCode = generateTsInterfaceFromJson(sample, 'UserProfile');

    expect(tsCode).toContain('export interface UserProfile');
    expect(tsCode).toContain('username: string;');
    expect(tsCode).toContain('isActive: boolean;');
  });

  it('should validate matching JSON instance against inferred schema', () => {
    const sample = JSON_SCHEMA_PRESETS[0].sampleJson;
    const { schemaJson } = inferJsonSchema(sample);

    const validation = validateJsonAgainstSchema(sample, schemaJson);
    expect(validation.isValid).toBe(true);
    expect(validation.errors.length).toBe(0);
  });
});
