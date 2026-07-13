// ==============================================
// DevForge — Mock Community Marketplace Plugins
// ==============================================

import type { PluginManifest } from './plugin-types';

export const FEATURED_MARKETPLACE_PLUGINS: PluginManifest[] = [
  {
    id: 'plugin-ai-prompt-studio',
    name: 'AI Prompt Engineering & Token Studio',
    version: '1.2.0',
    author: 'DevForge Core AI Lab',
    description:
      'Interactive prompt template editor with real-time approximate token counting (GPT-4 / Claude / Gemini) and variable interpolation.',
    category: 'text',
    permissions: ['storage', 'clipboard'],
    iconName: 'Sparkles',
    homepage: 'https://github.com/devforge/plugin-ai-prompt-studio',
    tools: [
      {
        slug: 'ai-prompt-studio',
        name: 'AI Prompt & Token Studio',
        description:
          'Design, interpolate, and estimate token counts for complex system prompts and few-shot templates.',
        category: 'text',
        keywords: ['ai', 'prompt', 'llm', 'token', 'gpt', 'claude', 'gemini'],
      },
    ],
  },
  {
    id: 'plugin-redis-simulator',
    name: 'Interactive Redis CLI & Key Inspector',
    version: '1.0.4',
    author: 'RedisLabs Community Devs',
    description:
      'Simulate Redis CLI commands (SET, GET, INCR, EXPIRE, HSET, TTL) in an in-memory key-value database simulator.',
    category: 'database',
    permissions: ['storage'],
    iconName: 'Database',
    homepage: 'https://github.com/devforge/plugin-redis-simulator',
    tools: [
      {
        slug: 'redis-cli-simulator',
        name: 'Redis CLI Command Simulator',
        description:
          'Simulate Redis operations, test TTL expirations, and inspect hash sets in a virtual Redis instance.',
        category: 'database',
        keywords: ['redis', 'cache', 'cli', 'key-value', 'database'],
      },
    ],
  },
  {
    id: 'plugin-tailwind-sorter',
    name: 'Tailwind CSS Class Sorter & Linter',
    version: '2.1.0',
    author: 'Frontend Craft Guild',
    description:
      'Automatically order Tailwind CSS classes according to official recommendation and flag contradictory utility classes.',
    category: 'formatting',
    permissions: ['clipboard'],
    iconName: 'Braces',
    homepage: 'https://github.com/devforge/plugin-tailwind-sorter',
    tools: [
      {
        slug: 'tailwind-class-sorter',
        name: 'Tailwind CSS Class Sorter',
        description:
          'Sort Tailwind utility classes consistently and detect duplicate or conflicting padding, margin, or layout rules.',
        category: 'formatting',
        keywords: ['tailwind', 'css', 'classes', 'sorter', 'formatting'],
      },
    ],
  },
  {
    id: 'plugin-svg-optimizer',
    name: 'SVGO SVG Markup Cleaner & Data URI Exporter',
    version: '1.1.2',
    author: 'VectorOps Studio',
    description:
      'Strip redundant metadata, comments, and empty groups from SVG files and export ready-to-use CSS background Data URIs.',
    category: 'encoding',
    permissions: ['clipboard', 'storage'],
    iconName: 'Code',
    homepage: 'https://github.com/devforge/plugin-svg-optimizer',
    tools: [
      {
        slug: 'svg-optimizer-pro',
        name: 'SVG Markup Optimizer & Cleaner',
        description:
          'Beautify or minify SVG markup and generate optimized inline Data URI strings for React or CSS.',
        category: 'encoding',
        keywords: ['svg', 'svgo', 'vector', 'optimizer', 'data-uri'],
      },
    ],
  },
  {
    id: 'plugin-http-mock',
    name: 'Mock HTTP API Endpoint Generator',
    version: '1.3.1',
    author: 'CloudREST Engineering',
    description:
      'Design mock JSON API endpoints with custom status codes, latency simulation, and dynamic response headers.',
    category: 'api',
    permissions: ['storage', 'network'],
    iconName: 'Globe',
    homepage: 'https://github.com/devforge/plugin-http-mock',
    tools: [
      {
        slug: 'http-mock-server',
        name: 'Mock HTTP API Endpoint Simulator',
        description:
          'Generate mock API responses, simulate network delays, and inspect sample fetch payloads.',
        category: 'api',
        keywords: ['http', 'mock', 'api', 'rest', 'simulator'],
      },
    ],
  },
  {
    id: 'plugin-cron-webhook',
    name: 'Cron Job Heartbeat & Webhook Monitor',
    version: '1.0.0',
    author: 'DevOps Pulse Kit',
    description:
      'Construct cron job health check heartbeat webhook payloads for BetterStack, Sentry, and PagerDuty monitoring.',
    category: 'devops',
    permissions: ['clipboard'],
    iconName: 'Terminal',
    homepage: 'https://github.com/devforge/plugin-cron-webhook',
    tools: [
      {
        slug: 'cron-monitor-webhook',
        name: 'Cron Heartbeat Webhook Payload Builder',
        description:
          'Build standardized JSON monitoring payloads to report automated cron task success or failure.',
        category: 'devops',
        keywords: ['cron', 'webhook', 'heartbeat', 'monitoring', 'devops'],
      },
    ],
  },
];
