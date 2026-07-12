// ==============================================
// DevForge — Tool SDK Utilities
// ==============================================
// Shared utilities for tool metadata validation,
// file downloads, uploads, and clipboard actions.
// ==============================================

/**
 * Validates a tool metadata definition.
 */
export function validateMetadata(tool: unknown): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!tool || typeof tool !== 'object') {
    return { valid: false, errors: ['Tool definition must be an object'] };
  }

  const t = tool as Record<string, unknown>;

  if (typeof t.slug !== 'string' || !t.slug.trim()) {
    errors.push('Missing or invalid "slug" field');
  } else if (!/^[a-z0-9-]+$/.test(t.slug)) {
    errors.push('"slug" must contain only lowercase alphanumeric characters and hyphens');
  }

  if (typeof t.name !== 'string' || !t.name.trim()) {
    errors.push('Missing or invalid "name" field');
  }

  if (typeof t.description !== 'string' || !t.description.trim()) {
    errors.push('Missing or invalid "description" field');
  }

  if (typeof t.category !== 'string' || !t.category.trim()) {
    errors.push('Missing or invalid "category" field');
  }

  if (!Array.isArray(t.tags)) {
    errors.push('"tags" must be an array of strings');
  }

  if (!Array.isArray(t.keywords)) {
    errors.push('"keywords" must be an array of strings');
  }

  if (typeof t.version !== 'string' || !t.version.trim()) {
    errors.push('Missing or invalid "version" field');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Copies string content to the browser clipboard.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Ignore error
  }
  return false;
}

/**
 * Triggers a file download in the browser.
 */
export function downloadAsFile(
  content: string,
  filename: string,
  mimeType = 'text/plain'
): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Reads a File object as string text.
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
