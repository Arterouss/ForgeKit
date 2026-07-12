import { describe, it, expect } from 'vitest';
import {
  validateMetadata,
  registerTool,
  getToolBySlug,
  getAllTools,
  searchTools,
  getToolsByCategory,
  getToolCount,
} from '@/sdk';
import type { ToolDefinition } from '@/sdk/tool-types';

describe('Tool SDK (registry & utilities)', () => {
  it('should validate tool metadata successfully for valid definitions', () => {
    const validMeta = {
      slug: 'test-tool',
      name: 'Test Tool',
      description: 'A test utility',
      category: 'formatting',
      icon: 'Code',
      tags: ['test'],
      keywords: ['test'],
      version: '1.0.0',
      status: 'stable',
    };

    const res = validateMetadata(validMeta);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('should fail validation when slug or fields are missing or malformed', () => {
    const invalidMeta = {
      slug: 'INVALID SLUG WITH SPACES',
      name: '',
      tags: 'not-an-array',
    };

    const res = validateMetadata(invalidMeta);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });

  it('should register and retrieve tools from the registry', () => {
    const dummyTool: ToolDefinition = {
      slug: 'unit-test-tool',
      name: 'Unit Test Tool',
      description: 'Testing registration',
      category: 'utilities',
      icon: 'TestTube',
      tags: ['test', 'unit'],
      keywords: ['unit test'],
      version: '1.0.0',
      status: 'beta',
      component: () => null,
    };

    const initialCount = getToolCount();
    registerTool(dummyTool);
    expect(getToolCount()).toBe(initialCount + 1);

    const retrieved = getToolBySlug('unit-test-tool');
    expect(retrieved?.name).toBe('Unit Test Tool');
  });

  it('should search registered tools by name, tag, or keyword', () => {
    const res = searchTools('Unit Test Tool');
    expect(res.some((t) => t.slug === 'unit-test-tool')).toBe(true);
  });

  it('should filter tools by category accurately and return all tools via getAllTools', () => {
    const all = getAllTools();
    expect(all.length).toBeGreaterThan(0);
    const utils = getToolsByCategory('utilities');
    expect(utils.some((t) => t.slug === 'unit-test-tool')).toBe(true);
  });
});
