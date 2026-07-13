// ==============================================
// DevForge — Tool Registry
// ==============================================
// Central registration system for all tools.
// ==============================================

import type { ToolDefinition, ToolCategory } from './tool-types';

const toolRegistry = new Map<string, ToolDefinition>();

/**
 * Register a tool in the global registry.
 */
export function registerTool(tool: ToolDefinition): void {
  if (toolRegistry.has(tool.slug)) {
    console.warn(`[ToolRegistry] Tool "${tool.slug}" is already registered. Skipping.`);
    return;
  }
  toolRegistry.set(tool.slug, tool);
}

/**
 * Unregister a tool from the global registry (used by dynamic plugins).
 */
export function unregisterTool(slug: string): boolean {
  return toolRegistry.delete(slug);
}

/**
 * Check if a tool slug is registered.
 */
export function isToolRegistered(slug: string): boolean {
  return toolRegistry.has(slug);
}

/**
 * Get a tool by its slug.
 */
export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return toolRegistry.get(slug);
}

/**
 * Get all registered tools.
 */
export function getAllTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values());
}

/**
 * Get tools filtered by category.
 */
export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return getAllTools().filter((tool) => tool.category === category);
}

/**
 * Search tools by query (matches name, description, tags, keywords).
 */
export function searchTools(query: string): ToolDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllTools();

  return getAllTools().filter(
    (tool) =>
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q)) ||
      tool.keywords.some((k) => k.toLowerCase().includes(q))
  );
}

/**
 * Get the total count of registered tools.
 */
export function getToolCount(): number {
  return toolRegistry.size;
}
