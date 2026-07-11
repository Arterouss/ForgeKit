import React from 'react';
import { registerTool } from './tool-registry';
import type { ToolDefinition } from './tool-types';

// Placeholder Component for all tools prior to full implementation
const PlaceholderComponent = () => {
  return React.createElement(
    'div',
    { className: 'p-6 text-center text-muted-foreground' },
    'This tool is currently under construction. Check back in Sprint v0.9/v1.0!'
  );
};

export const mvpTools: ToolDefinition[] = [
  // Formatting
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, beautify, validate, and minify JSON data instantly.',
    category: 'formatting',
    icon: 'Code2',
    tags: ['json', 'format', 'beautify', 'minify', 'pretty'],
    keywords: ['json', 'pretty print', 'format json'],
    shortcut: 'F1',
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
  {
    slug: 'json-validator',
    name: 'JSON Validator',
    description: 'Check JSON syntax, find syntax errors, and validate RFC guidelines.',
    category: 'formatting',
    icon: 'CheckCircle',
    tags: ['json', 'validate', 'lint', 'syntax'],
    keywords: ['json lint', 'validate json'],
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
  {
    slug: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format, prettify, and prettify XML documents.',
    category: 'formatting',
    icon: 'Code',
    tags: ['xml', 'format', 'beautify'],
    keywords: ['xml pretty print', 'xml format'],
    version: '1.0.0',
    status: 'beta',
    component: PlaceholderComponent,
  },
  {
    slug: 'yaml-formatter',
    name: 'YAML Formatter',
    description: 'Beautify, validate, and convert YAML documents.',
    category: 'formatting',
    icon: 'FileCode',
    tags: ['yaml', 'format', 'beautify'],
    keywords: ['yaml pretty', 'yaml format'],
    version: '1.0.0',
    status: 'beta',
    component: PlaceholderComponent,
  },
  {
    slug: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and prettify raw SQL queries with custom rules.',
    category: 'formatting',
    icon: 'Database',
    tags: ['sql', 'format', 'pretty'],
    keywords: ['sql format', 'beautify sql'],
    version: '1.0.0',
    status: 'experimental',
    component: PlaceholderComponent,
  },

  // Encoding
  {
    slug: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode plain text or files to Base64 or decode Base64 back.',
    category: 'encoding',
    icon: 'Binary',
    tags: ['base64', 'encode', 'decode'],
    keywords: ['base64 encode', 'base64 decode'],
    shortcut: 'F2',
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) payload, header, and signature.',
    category: 'encoding',
    icon: 'ShieldAlert',
    tags: ['jwt', 'decode', 'token', 'auth'],
    keywords: ['jwt', 'token', 'decode jwt'],
    shortcut: 'F3',
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },

  // Generators
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate secure cryptographically random UUIDs (v4 and v7).',
    category: 'generators',
    icon: 'Fingerprint',
    tags: ['uuid', 'guid', 'generate', 'random'],
    keywords: ['uuid', 'guid', 'generate uuid'],
    shortcut: 'F4',
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate highly secure custom random passwords.',
    category: 'generators',
    icon: 'Key',
    tags: ['password', 'generate', 'security', 'random'],
    keywords: ['password', 'generate password'],
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
  {
    slug: 'dockerfile-generator',
    name: 'Dockerfile Generator',
    description: 'Interactive builder to generate optimized Dockerfiles for various stacks.',
    category: 'docker',
    icon: 'FilePlus',
    tags: ['docker', 'dockerfile', 'generator'],
    keywords: ['dockerfile', 'docker file'],
    shortcut: 'F5',
    version: '1.0.0',
    status: 'beta',
    component: PlaceholderComponent,
  },

  // Linux
  {
    slug: 'chmod-calculator',
    name: 'chmod Calculator',
    description: 'Interactive calculator for chmod permissions with numerical and symbolic notation.',
    category: 'linux',
    icon: 'Sliders',
    tags: ['chmod', 'permissions', 'linux', 'octal'],
    keywords: ['chmod', 'octal permissions'],
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },

  // Git
  {
    slug: 'conventional-commits',
    name: 'Conventional Commits Builder',
    description: 'Interactive wizard to build conventional commit messages.',
    category: 'git',
    icon: 'GitCommit',
    tags: ['git', 'commit', 'conventional'],
    keywords: ['conventional commit', 'git commit helper'],
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },

  // Utilities
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test, build, and debug regular expressions with highlighting and explanation.',
    category: 'utilities',
    icon: 'Regex',
    tags: ['regex', 'test', 'match', 'expression'],
    keywords: ['regex tester', 'regex test'],
    shortcut: 'F6',
    version: '1.0.0',
    status: 'stable',
    component: PlaceholderComponent,
  },
];

// Initialize registry
export function initializeRegistry(): void {
  mvpTools.forEach((tool) => registerTool(tool));
}
