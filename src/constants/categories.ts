// ==============================================
// DevForge — Category Definitions
// ==============================================

import type { CategoryDefinition } from '@/sdk/tool-types';

export const categories: CategoryDefinition[] = [
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'Format and beautify code in various languages',
    icon: 'Code2',
    color: 'var(--color-primary)',
  },
  {
    id: 'encoding',
    name: 'Encoding',
    description: 'Encode, decode, and transform data',
    icon: 'Binary',
    color: 'var(--color-secondary)',
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'Generate UUIDs, passwords, configs, and more',
    icon: 'Sparkles',
    color: 'var(--color-warning)',
  },
  {
    id: 'docker',
    name: 'Docker',
    description: 'Docker and container utilities',
    icon: 'Container',
    color: '#2496ED',
  },
  {
    id: 'linux',
    name: 'Linux',
    description: 'Linux command and permission tools',
    icon: 'Terminal',
    color: '#FCC624',
  },
  {
    id: 'git',
    name: 'Git',
    description: 'Git workflow and commit helpers',
    icon: 'GitBranch',
    color: '#F05032',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Database query and conversion tools',
    icon: 'Database',
    color: '#336791',
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Network and connectivity utilities',
    icon: 'Globe',
    color: 'var(--color-success)',
  },
  {
    id: 'api',
    name: 'API',
    description: 'API testing and development tools',
    icon: 'Webhook',
    color: '#FF6B6B',
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security and cryptography utilities',
    icon: 'Shield',
    color: '#E74C3C',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    description: 'General purpose developer utilities',
    icon: 'Wrench',
    color: 'var(--color-text-secondary)',
  },
];
