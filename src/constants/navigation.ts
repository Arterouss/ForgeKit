// ==============================================
// DevForge — Navigation Configuration
// ==============================================

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  shortcut?: string;
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const sidebarNavigation: NavGroup[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Home', href: '/dashboard', icon: 'Home', shortcut: 'Ctrl+H' },
      { label: 'Workspace', href: '/dashboard/workspace', icon: 'LayoutDashboard' },
      { label: 'Collections', href: '/dashboard/collections', icon: 'FolderOpen' },
      { label: 'Pinned', href: '/dashboard/pinned', icon: 'Pin' },
      { label: 'Recent', href: '/dashboard/recent', icon: 'Clock' },
    ],
  },
  {
    title: 'Development',
    items: [
      { label: 'Formatting', href: '/dashboard/category/formatting', icon: 'Code2' },
      { label: 'Encoding', href: '/dashboard/category/encoding', icon: 'Binary' },
      { label: 'Generators', href: '/dashboard/category/generators', icon: 'Sparkles' },
      { label: 'Docker', href: '/dashboard/category/docker', icon: 'Container' },
      { label: 'Linux', href: '/dashboard/category/linux', icon: 'Terminal' },
      { label: 'Git', href: '/dashboard/category/git', icon: 'GitBranch' },
      { label: 'API', href: '/dashboard/category/api', icon: 'Webhook' },
      { label: 'Database', href: '/dashboard/category/database', icon: 'Database' },
      { label: 'Network', href: '/dashboard/category/network', icon: 'Globe' },
      { label: 'Security', href: '/dashboard/category/security', icon: 'Shield' },
      { label: 'Utilities', href: '/dashboard/category/utilities', icon: 'Wrench' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Roadmap', href: '/roadmap', icon: 'Map' },
      { label: 'GitHub', href: 'https://github.com/Arterouss/ForgeKit', icon: 'Github' },
      { label: 'Feedback', href: '/feedback', icon: 'MessageSquare' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Profile', href: '/settings/profile', icon: 'User' },
      { label: 'Appearance', href: '/settings/appearance', icon: 'Palette' },
      { label: 'Preferences', href: '/settings/preferences', icon: 'Settings' },
    ],
  },
];
