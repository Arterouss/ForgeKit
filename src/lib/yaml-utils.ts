// ==============================================
// DevForge — YAML Formatter Pro Utilities
// ==============================================
// Pure YAML beautification, validation, and
// YAML <-> JSON conversion utilities.
// ==============================================

import * as yamlLib from 'js-yaml';
// Ensure compatibility between ESM default import and CJS module
const yaml = (yamlLib as unknown as { default?: typeof yamlLib }).default ?? yamlLib;

export interface YamlFormatResult {
  isValid: boolean;
  output: string;
  error: string | null;
  errorLine?: number;
  errorColumn?: number;
}

export interface YamlValidationResult {
  isValid: boolean;
  message: string;
  errorLine?: number;
  errorColumn?: number;
}

/**
 * Beautifies and formats raw YAML string with consistent indentation.
 */
export function formatYaml(input: string, indent = 2): YamlFormatResult {
  if (!input.trim()) {
    return {
      isValid: true,
      output: '',
      error: null,
    };
  }

  try {
    const parsed = yaml.load(input, { json: false });
    if (parsed === undefined) {
      return {
        isValid: true,
        output: input.trim(),
        error: null,
      };
    }

    const formatted = yaml.dump(parsed, {
      indent,
      lineWidth: 100,
      noRefs: true,
      sortKeys: false,
    });

    return {
      isValid: true,
      output: formatted,
      error: null,
    };
  } catch (err: unknown) {
    const errorObj = err as yamlLib.YAMLException;
    return {
      isValid: false,
      output: '',
      error: errorObj.reason ?? errorObj.message ?? 'Invalid YAML syntax',
      errorLine: errorObj.mark ? errorObj.mark.line + 1 : undefined,
      errorColumn: errorObj.mark ? errorObj.mark.column + 1 : undefined,
    };
  }
}

/**
 * Validates YAML document syntax and indentation.
 */
export function validateYaml(input: string): YamlValidationResult {
  if (!input.trim()) {
    return {
      isValid: false,
      message: 'Document is empty.',
    };
  }

  try {
    yaml.load(input, { json: false });
    return {
      isValid: true,
      message: 'Valid YAML document.',
    };
  } catch (err: unknown) {
    const errorObj = err as yamlLib.YAMLException;
    return {
      isValid: false,
      message: errorObj.reason ?? errorObj.message ?? 'Syntax error in YAML',
      errorLine: errorObj.mark ? errorObj.mark.line + 1 : undefined,
      errorColumn: errorObj.mark ? errorObj.mark.column + 1 : undefined,
    };
  }
}

/**
 * Converts YAML string to formatted JSON string.
 */
export function yamlToJson(
  input: string,
  indent = 2
): { isValid: boolean; output: string; error: string | null } {
  if (!input.trim()) {
    return { isValid: true, output: '', error: null };
  }

  try {
    const parsed = yaml.load(input);
    return {
      isValid: true,
      output: JSON.stringify(parsed, null, indent),
      error: null,
    };
  } catch (err: unknown) {
    const errorObj = err as yamlLib.YAMLException;
    return {
      isValid: false,
      output: '',
      error: errorObj.reason ?? errorObj.message ?? 'Failed to parse YAML',
    };
  }
}

/**
 * Converts JSON string to YAML string.
 */
export function jsonToYaml(
  input: string,
  indent = 2
): { isValid: boolean; output: string; error: string | null } {
  if (!input.trim()) {
    return { isValid: true, output: '', error: null };
  }

  try {
    const parsed = JSON.parse(input);
    const output = yaml.dump(parsed, {
      indent,
      lineWidth: 100,
    });
    return {
      isValid: true,
      output,
      error: null,
    };
  } catch (err: unknown) {
    const errorObj = err as Error;
    return {
      isValid: false,
      output: '',
      error: errorObj.message || 'Invalid JSON input',
    };
  }
}

export const SAMPLE_DOCKER_COMPOSE_YAML = `version: '3.8'
services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    environment:
      NODE_ENV: production
    restart: always
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: devforge
      POSTGRES_PASSWORD: secretpassword
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`;

export const SAMPLE_KUBERNETES_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: devforge-app
  labels:
    app: devforge
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devforge
  template:
    metadata:
      labels:
        app: devforge
    spec:
      containers:
        - name: devforge-core
          image: devforge/app:latest
          ports:
            - containerPort: 3000`;

export const SAMPLE_GITHUB_ACTIONS_YAML = `name: DevForge CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test`;
