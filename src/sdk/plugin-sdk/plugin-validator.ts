// ==============================================
// DevForge — Plugin Manifest Validator
// ==============================================

import type {
  PluginManifest,
  PluginPermission,
  PluginManifestValidationResult,
} from './plugin-types';

const VALID_PERMISSIONS: PluginPermission[] = [
  'storage',
  'clipboard',
  'network',
  'notifications',
];

const ID_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.]+)?$/;

/**
 * Strictly validate unknown data as a DevForge PluginManifest.
 */
export function validatePluginManifest(
  raw: unknown
): PluginManifestValidationResult {
  const errors: string[] = [];

  if (!raw || typeof raw !== 'object') {
    return {
      valid: false,
      errors: ['Manifest must be a non-null JSON object.'],
    };
  }

  const obj = raw as Record<string, unknown>;

  // Validate ID
  if (typeof obj.id !== 'string' || !obj.id.trim()) {
    errors.push('Missing or invalid "id": must be a non-empty string.');
  } else if (!ID_REGEX.test(obj.id)) {
    errors.push(
      `Invalid "id" format ("${obj.id}"): must be lowercase kebab-case (e.g., "my-plugin-kit").`
    );
  }

  // Validate Name
  if (typeof obj.name !== 'string' || !obj.name.trim()) {
    errors.push('Missing or invalid "name": must be a non-empty string.');
  }

  // Validate Version (SemVer)
  if (typeof obj.version !== 'string' || !obj.version.trim()) {
    errors.push('Missing or invalid "version": must be a semantic version string.');
  } else if (!SEMVER_REGEX.test(obj.version)) {
    errors.push(
      `Invalid "version" format ("${obj.version}"): must be standard SemVer (e.g., "1.0.0").`
    );
  }

  // Validate Author
  if (typeof obj.author !== 'string' || !obj.author.trim()) {
    errors.push('Missing or invalid "author": must be a non-empty string.');
  }

  // Validate Description
  if (typeof obj.description !== 'string' || !obj.description.trim()) {
    errors.push('Missing or invalid "description": must be a non-empty string.');
  }

  // Validate Category
  if (typeof obj.category !== 'string' || !obj.category.trim()) {
    errors.push('Missing or invalid "category": must be a non-empty tool category string.');
  }

  // Validate Permissions array
  if (!Array.isArray(obj.permissions)) {
    errors.push('Missing or invalid "permissions": must be an array of permissions.');
  } else {
    for (const perm of obj.permissions) {
      if (typeof perm !== 'string' || !VALID_PERMISSIONS.includes(perm as PluginPermission)) {
        errors.push(
          `Invalid permission "${String(perm)}". Allowed values: ${VALID_PERMISSIONS.join(', ')}.`
        );
      }
    }
  }

  // Validate Tools array
  if (!Array.isArray(obj.tools) || obj.tools.length === 0) {
    errors.push('Missing or invalid "tools": must be a non-empty array of tool definitions.');
  } else {
    obj.tools.forEach((tool: unknown, idx: number) => {
      if (!tool || typeof tool !== 'object') {
        errors.push(`Tool at index ${idx} is not a valid object.`);
        return;
      }
      const t = tool as Record<string, unknown>;
      if (typeof t.slug !== 'string' || !t.slug.trim()) {
        errors.push(`Tool at index ${idx} is missing a valid "slug".`);
      } else if (!ID_REGEX.test(t.slug)) {
        errors.push(
          `Tool slug "${t.slug}" at index ${idx} must be kebab-case lowercase.`
        );
      }
      if (typeof t.name !== 'string' || !t.name.trim()) {
        errors.push(`Tool at index ${idx} is missing a valid "name".`);
      }
      if (typeof t.description !== 'string' || !t.description.trim()) {
        errors.push(`Tool at index ${idx} is missing a valid "description".`);
      }
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    errors: [],
    manifest: obj as unknown as PluginManifest,
  };
}
