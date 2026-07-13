// ==============================================
// DevForge — JSON Schema Builder & Validator Utils
// ==============================================
// Infer Draft-07 JSON Schema from raw JSON data,
// validate JSON instances against schema rules, and
// generate TypeScript Interface definitions.
// ==============================================

export interface JsonSchemaField {
  type: string | string[];
  description?: string;
  properties?: Record<string, JsonSchemaField>;
  required?: string[];
  items?: JsonSchemaField;
}

export interface JsonSchemaDraft07 {
  $schema: string;
  title: string;
  type: string;
  properties?: Record<string, JsonSchemaField>;
  required?: string[];
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Infer JSON Schema Draft 07 from any JSON value.
 */
export function inferJsonSchema(
  jsonText: string,
  rootTitle = 'GeneratedSchema'
): { schemaJson: string; parsedSchema?: JsonSchemaDraft07; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);

    function inferNode(val: unknown): JsonSchemaField {
      if (val === null) {
        return { type: 'null' };
      }
      if (Array.isArray(val)) {
        if (val.length === 0) {
          return { type: 'array', items: { type: 'string' } };
        }
        return {
          type: 'array',
          items: inferNode(val[0]),
        };
      }
      if (typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        const keys = Object.keys(obj);
        const properties: Record<string, JsonSchemaField> = {};
        keys.forEach((k) => {
          properties[k] = inferNode(obj[k]);
        });
        return {
          type: 'object',
          properties,
          required: keys,
        };
      }
      return { type: typeof val };
    }

    const rootNode = inferNode(parsed);
    const schema: JsonSchemaDraft07 = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: rootTitle,
      type: Array.isArray(parsed) ? 'array' : typeof parsed,
      properties: rootNode.properties,
      required: rootNode.required,
    };

    return {
      schemaJson: JSON.stringify(schema, null, 2),
      parsedSchema: schema,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid JSON input format';
    return {
      schemaJson: '',
      error: `JSON Parse Error: ${message}`,
    };
  }
}

/**
 * Generate TypeScript Interface from JSON data or schema.
 */
export function generateTsInterfaceFromJson(
  jsonText: string,
  interfaceName = 'RootPayload'
): string {
  try {
    const parsed = JSON.parse(jsonText);

    function nodeToTs(val: unknown, depth = 1): string {
      const indent = '  '.repeat(depth);
      if (val === null) return 'null';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        return `${nodeToTs(val[0], depth)}[]`;
      }
      if (typeof val === 'object') {
        const obj = val as Record<string, unknown>;
        const lines = ['{'];
        Object.entries(obj).forEach(([k, v]) => {
          lines.push(`${indent}  ${k}: ${nodeToTs(v, depth + 1)};`);
        });
        lines.push(`${indent}}`);
        return lines.join('\n');
      }
      return typeof val;
    }

    const tsType = nodeToTs(parsed, 0);
    return `export interface ${interfaceName} ${tsType}`;
  } catch {
    return `// Error: Unable to generate TypeScript interface from malformed JSON.`;
  }
}

/**
 * Validate JSON instance string against a basic JSON schema structure.
 */
export function validateJsonAgainstSchema(
  jsonText: string,
  schemaText: string
): SchemaValidationResult {
  const errors: string[] = [];
  let data: unknown;
  let schema: JsonSchemaDraft07;

  try {
    data = JSON.parse(jsonText);
  } catch {
    return { isValid: false, errors: ['Input data is not valid JSON text.'] };
  }

  try {
    schema = JSON.parse(schemaText);
  } catch {
    return { isValid: false, errors: ['JSON Schema is not valid JSON text.'] };
  }

  function checkType(val: unknown, expectedType: string | string[], path = 'root'): void {
    if (Array.isArray(expectedType)) {
      const matches = expectedType.some((t) => checkSingleType(val, t));
      if (!matches) {
        errors.push(`Property '${path}' expected one of [${expectedType.join(', ')}]`);
      }
      return;
    }
    checkSingleType(val, expectedType, path);
  }

  function checkSingleType(val: unknown, expectedType: string, path = 'root'): boolean {
    if (expectedType === 'null') return val === null;
    if (expectedType === 'array') {
      if (!Array.isArray(val)) {
        errors.push(`Property '${path}' expected array, got ${typeof val}`);
        return false;
      }
      return true;
    }
    if (expectedType === 'object') {
      if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        errors.push(`Property '${path}' expected object`);
        return false;
      }
      return true;
    }
    if (typeof val !== expectedType) {
      errors.push(`Property '${path}' expected ${expectedType}, got ${typeof val}`);
      return false;
    }
    return true;
  }

  if (schema.type) {
    checkType(data, schema.type);
  }

  if (schema.required && typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    schema.required.forEach((reqKey) => {
      if (!(reqKey in obj)) {
        errors.push(`Missing required root property '${reqKey}'`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export const JSON_SCHEMA_PRESETS: {
  name: string;
  description: string;
  sampleJson: string;
}[] = [
  {
    name: 'User Profile & Role Settings API',
    description: 'User entity with nested address object, role tags array, and metadata',
    sampleJson: JSON.stringify(
      {
        id: 'usr_99210',
        username: 'devops_eng',
        email: 'ops@devforge.io',
        isActive: true,
        roles: ['admin', 'maintainer'],
        profile: {
          department: 'Cloud Infrastructure',
          level: 4,
        },
      },
      null,
      2
    ),
  },
  {
    name: 'E-Commerce Order Item Payload',
    description: 'Order transaction with line items and numerical summary',
    sampleJson: JSON.stringify(
      {
        orderId: 'ord_2026_0713',
        currency: 'USD',
        totalAmount: 149.99,
        items: [
          {
            sku: 'FK-PRO-LIC',
            quantity: 1,
            price: 149.99,
          },
        ],
      },
      null,
      2
    ),
  },
];
