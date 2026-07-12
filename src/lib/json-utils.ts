// ==============================================
// DevForge — JSON Utilities
// ==============================================
// Core JSON processing, formatting, minification,
// validation, and tree traversal helpers.
// ==============================================

export interface FormatJsonResult {
  output: string;
  error: string | null;
  errorLine?: number;
}

export interface ValidateJsonResult {
  isValid: boolean;
  error: string | null;
  errorLine?: number;
}

/**
 * Extracts line number from syntax error message if available.
 */
function extractErrorLine(errorMessage: string, input: string): number | undefined {
  // Try matching "at position <num>"
  const posMatch = errorMessage.match(/at position (\d+)/i);
  if (posMatch && posMatch[1]) {
    const pos = parseInt(posMatch[1], 10);
    if (!isNaN(pos) && pos <= input.length) {
      const substring = input.substring(0, pos);
      return substring.split(/\r\n|\r|\n/).length;
    }
  }

  // Try matching "line <num>"
  const lineMatch = errorMessage.match(/line (\d+)/i);
  if (lineMatch && lineMatch[1]) {
    return parseInt(lineMatch[1], 10);
  }

  return undefined;
}

/**
 * Formats (beautifies) a JSON string with specified indentation.
 */
export function formatJson(input: string, indent: number | 'tab' = 2): FormatJsonResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: null };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const space = indent === 'tab' ? '\t' : indent;
    const formatted = JSON.stringify(parsed, null, space);
    return { output: formatted, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format';
    const errorLine = extractErrorLine(message, trimmed);
    return { output: '', error: message, errorLine };
  }
}

/**
 * Minifies a JSON string by removing all unnecessary whitespace.
 */
export function minifyJson(input: string): FormatJsonResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { output: '', error: null };
  }

  try {
    const parsed = JSON.parse(trimmed);
    const minified = JSON.stringify(parsed);
    return { output: minified, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON format';
    const errorLine = extractErrorLine(message, trimmed);
    return { output: '', error: message, errorLine };
  }
}

/**
 * Validates whether a string is valid JSON.
 */
export function validateJson(input: string): ValidateJsonResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Empty input string' };
  }

  try {
    JSON.parse(trimmed);
    return { isValid: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON syntax';
    const errorLine = extractErrorLine(message, trimmed);
    return { isValid: false, error: message, errorLine };
  }
}

/**
 * Determines the simplified JSON data type of a value.
 */
export type JsonNodeType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';

export function getJsonDataType(value: unknown): JsonNodeType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const t = typeof value;
  if (t === 'object') return 'object';
  if (t === 'number') return 'number';
  if (t === 'boolean') return 'boolean';
  return 'string';
}

/**
 * SAMPLE JSON payload for testing & quick demonstration.
 */
export const SAMPLE_JSON = `{
  "project": "DevForge Professional",
  "version": "1.0.0",
  "isOpenSource": true,
  "stars": 4250,
  "license": null,
  "maintainers": [
    {
      "id": 101,
      "name": "Alex Mercer",
      "role": "Lead Architect",
      "active": true
    },
    {
      "id": 102,
      "name": "Sarah Connor",
      "role": "Core Engine Engineer",
      "active": true
    }
  ],
  "features": {
    "workspaceEngine": {
      "tabs": true,
      "persistence": "localStorage",
      "maxHistory": 50
    },
    "tools": [
      "JSON Formatter",
      "Regex Debugger",
      "JWT Inspector",
      "SQL Beautifier"
    ]
  }
}`;
