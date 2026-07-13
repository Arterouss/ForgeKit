// ==============================================
// DevForge — OpenAPI Viewer & Explorer Utils
// ==============================================
// Parse OpenAPI 3.0 / Swagger 2.0 specs, extract
// endpoints, filter routes, and generate sample cURL
// requests for testing specs.
// ==============================================

export interface OpenApiEndpoint {
  id: string;
  path: string;
  method: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: {
    name: string;
    in: string;
    required: boolean;
    description?: string;
  }[];
  responses: Record<string, string>;
}

export interface OpenApiSpecSummary {
  isValid: boolean;
  title: string;
  version: string;
  description: string;
  servers: string[];
  endpoints: OpenApiEndpoint[];
  errorMessage?: string;
}

/**
 * Parse OpenAPI / Swagger spec string (JSON format support).
 */
export function parseOpenApiSpec(specText: string): OpenApiSpecSummary {
  if (!specText.trim()) {
    return {
      isValid: false,
      title: '',
      version: '',
      description: '',
      servers: [],
      endpoints: [],
      errorMessage: 'Specification text is empty.',
    };
  }

  try {
    const spec = JSON.parse(specText);
    const title = spec.info?.title || 'Untitled API Spec';
    const version = spec.info?.version || '1.0.0';
    const description = spec.info?.description || '';
    const servers: string[] = Array.isArray(spec.servers)
      ? spec.servers.map((s: { url: string }) => s.url)
      : spec.host
      ? [`https://${spec.host}${spec.basePath || ''}`]
      : ['https://api.devforge.io/v1'];

    const endpoints: OpenApiEndpoint[] = [];
    const paths = spec.paths || {};

    Object.entries(paths).forEach(([pathStr, pathItem]) => {
      if (typeof pathItem !== 'object' || pathItem === null) return;
      const methodsObj = pathItem as Record<string, unknown>;

      ['get', 'post', 'put', 'patch', 'delete', 'options'].forEach((method) => {
        const operation = methodsObj[method] as Record<string, unknown> | undefined;
        if (!operation) return;

        const rawParams = Array.isArray(operation.parameters)
          ? operation.parameters
          : [];

        const parsedParams = rawParams.map((p: Record<string, unknown>) => ({
          name: String(p.name || 'param'),
          in: String(p.in || 'query'),
          required: Boolean(p.required),
          description: p.description ? String(p.description) : undefined,
        }));

        const responsesMap: Record<string, string> = {};
        const rawResponses = (operation.responses || {}) as Record<string, Record<string, unknown>>;
        Object.entries(rawResponses).forEach(([code, resObj]) => {
          responsesMap[code] = String(resObj?.description || 'Response');
        });

        endpoints.push({
          id: `${method.toUpperCase()}_${pathStr}`,
          path: pathStr,
          method: method.toUpperCase(),
          summary: String(operation.summary || operation.operationId || pathStr),
          description: String(operation.description || ''),
          tags: Array.isArray(operation.tags)
            ? operation.tags.map((t) => String(t))
            : ['Default'],
          parameters: parsedParams,
          responses: responsesMap,
        });
      });
    });

    return {
      isValid: true,
      title,
      version,
      description,
      servers,
      endpoints,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Malformed JSON specification';
    return {
      isValid: false,
      title: '',
      version: '',
      description: '',
      servers: [],
      endpoints: [],
      errorMessage: `Failed to parse OpenAPI spec: ${msg}`,
    };
  }
}

/**
 * Generate sample cURL command for an endpoint.
 */
export function generateEndpointCurl(
  baseUrl: string,
  endpoint: OpenApiEndpoint
): string {
  const url = `${baseUrl.replace(/\/$/, '')}${endpoint.path}`;
  const flags: string[] = [];

  if (endpoint.method !== 'GET') {
    flags.push(`-X ${endpoint.method}`);
  }
  flags.push('-H "Accept: application/json"');

  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
    flags.push('-H "Content-Type: application/json"');
    flags.push("-d '{}'");
  }

  return `curl ${flags.join(' ')} "${url}"`;
}

export const OPENAPI_SAMPLE_SPECS: {
  name: string;
  description: string;
  jsonText: string;
}[] = [
  {
    name: 'DevForge Cloud Management API (OpenAPI 3.0)',
    description: 'Endpoints for managing cloud deployments and secret tokens',
    jsonText: JSON.stringify(
      {
        openapi: '3.0.3',
        info: {
          title: 'DevForge Cloud Management API',
          version: '2.4.0',
          description: 'RESTful API endpoints for orchestrating DevForge cloud environments.',
        },
        servers: [{ url: 'https://api.devforge.io/v1' }],
        paths: {
          '/deployments': {
            get: {
              summary: 'List Active Deployments',
              tags: ['Deployments'],
              parameters: [
                {
                  name: 'env',
                  in: 'query',
                  required: false,
                  description: 'Filter by environment (prod, staging)',
                },
              ],
              responses: {
                '200': { description: 'Array of deployment objects' },
              },
            },
            post: {
              summary: 'Create New Deployment',
              tags: ['Deployments'],
              responses: {
                '201': { description: 'Deployment triggered successfully' },
              },
            },
          },
          '/secrets/{key}': {
            get: {
              summary: 'Retrieve Secret Metadata',
              tags: ['Secrets'],
              parameters: [
                {
                  name: 'key',
                  in: 'path',
                  required: true,
                  description: 'Secret identifier key',
                },
              ],
              responses: {
                '200': { description: 'Secret info returned' },
                '404': { description: 'Secret key not found' },
              },
            },
          },
        },
      },
      null,
      2
    ),
  },
];
