import React from 'react';
import { registerTool } from './tool-registry';
import type { ToolDefinition } from './tool-types';
import { JsonFormatterPro } from '@/components/tools/json-formatter';
import { JwtDecoderPro } from '@/components/tools/jwt-decoder';
import { Base64StudioPro } from '@/components/tools/base64-studio';
import { RegexStudioPro } from '@/components/tools/regex-studio';
import { YamlFormatterPro } from '@/components/tools/yaml-formatter';
import { XmlFormatterPro } from '@/components/tools/xml-formatter';
import { SqlFormatterPro } from '@/components/tools/sql-formatter';
import { DockerComposeBuilderPro } from '@/components/tools/docker-compose-builder';
import { GitIgnoreGeneratorPro } from '@/components/tools/gitignore-generator';

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
    component: JsonFormatterPro,
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
    status: 'stable',
    component: XmlFormatterPro,
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
    status: 'stable',
    component: YamlFormatterPro,
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
    status: 'stable',
    component: SqlFormatterPro,
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
    component: Base64StudioPro,
  },
  {
    slug: 'base64-studio',
    name: 'Base64 Studio Pro',
    description: 'Encode, decode, and inspect text, images, JSON, and binary files with smart MIME detection.',
    category: 'encoding',
    icon: 'Binary',
    tags: ['base64', 'studio', 'encode', 'decode'],
    keywords: ['base64 studio', 'encode file', 'decode image'],
    version: '1.0.0',
    status: 'stable',
    component: Base64StudioPro,
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
    component: JwtDecoderPro,
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
    component: RegexStudioPro,
  },
  {
    slug: 'regex-studio',
    name: 'Regex Studio Pro',
    description: 'Design, test, and debug regular expressions with live group captures, flag toggles, and preset library.',
    category: 'utilities',
    icon: 'Regex',
    tags: ['regex', 'studio', 'match', 'replace'],
    keywords: ['regex studio', 'regex replace', 'test regex'],
    version: '1.0.0',
    status: 'stable',
    component: RegexStudioPro,
  },

  // Docker
  {
    slug: 'docker-compose-builder',
    name: 'Docker Compose Builder Pro',
    description: 'Visual Docker Compose builder with live YAML generation, validation, and production-ready templates.',
    category: 'docker',
    icon: 'Container',
    tags: ['docker', 'compose', 'builder', 'yaml'],
    keywords: ['docker compose', 'docker-compose builder'],
    version: '1.0.0',
    status: 'stable',
    component: DockerComposeBuilderPro,
  },

  // Git
  {
    slug: 'gitignore-generator',
    name: 'GitIgnore Generator Pro',
    description: 'Generate production-ready .gitignore files for any technology stack with smart deduplication.',
    category: 'git',
    icon: 'FileX',
    tags: ['gitignore', 'generator', 'git'],
    keywords: ['gitignore generator', 'gitignore'],
    version: '1.0.0',
    status: 'stable',
    component: GitIgnoreGeneratorPro,
  },
];

// Initialize registry
export function initializeRegistry(): void {
  mvpTools.forEach((tool) => registerTool(tool));
}
