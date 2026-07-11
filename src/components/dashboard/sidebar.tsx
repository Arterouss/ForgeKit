'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  LayoutDashboard,
  FolderOpen,
  Pin,
  Clock,
  Code2,
  Binary,
  Sparkles,
  Terminal,
  GitBranch,
  Webhook,
  Database,
  Globe,
  Shield,
  Wrench,
  Map,
  Github,
  MessageSquare,
  Settings,
  User,
  Palette,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ChevronsUpDown,
  BookOpen,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { APP_VERSION } from '@/constants/app';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// Define Lucide icons map dynamically
const iconMap = {
  Home,
  LayoutDashboard,
  FolderOpen,
  Pin,
  Clock,
  Code2,
  Binary,
  Sparkles,
  Terminal,
  GitBranch,
  Webhook,
  Database,
  Globe,
  Shield,
  Wrench,
  Map,
  Github,
  MessageSquare,
  Settings,
  User,
  Palette,
  Sliders,
};

interface NavigationItem {
  label: string;
  icon: string;
  href: string;
  shortcut?: string;
  counter?: number;
  badge?: string;
  badgeType?: 'success' | 'info';
  external?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [activeWorkspace, setActiveWorkspace] = useState('Default Workspace');

  // Sidebar navigation groups spec
  const navigationGroups: {
    title: string;
    items: NavigationItem[];
  }[] = [
    {
      title: 'Workspace',
      items: [
        { label: 'Home', icon: 'Home', href: '/dashboard', shortcut: '⌘H' },
        { label: 'Workspace', icon: 'LayoutDashboard', href: '/dashboard/workspace', counter: 0 },
        { label: 'Collections', icon: 'FolderOpen', href: '/dashboard/collections', badge: 'New', badgeType: 'success' },
        { label: 'Pinned', icon: 'Pin', href: '/dashboard/pinned', counter: 2 },
        { label: 'Recent', icon: 'Clock', href: '/dashboard/recent' },
      ],
    },
    {
      title: 'Development',
      items: [
        { label: 'Formatting', icon: 'Code2', href: '/dashboard/category/formatting' },
        { label: 'Encoding', icon: 'Binary', href: '/dashboard/category/encoding' },
        { label: 'Generators', icon: 'Sparkles', href: '/dashboard/category/generators', badge: '3', badgeType: 'info' },
        { label: 'Docker', icon: 'Terminal', href: '/dashboard/category/docker' },
        { label: 'Linux', icon: 'Terminal', href: '/dashboard/category/linux' },
        { label: 'Git', icon: 'GitBranch', href: '/dashboard/category/git' },
        { label: 'API', icon: 'Webhook', href: '/dashboard/category/api' },
        { label: 'Database', icon: 'Database', href: '/dashboard/category/database' },
        { label: 'Network', icon: 'Globe', href: '/dashboard/category/network' },
        { label: 'Security', icon: 'Shield', href: '/dashboard/category/security' },
        { label: 'Utilities', icon: 'Wrench', href: '/dashboard/category/utilities' },
      ],
    },
    {
      title: 'Community',
      items: [
        { label: 'Roadmap', icon: 'Map', href: '/dashboard/roadmap' },
        { label: 'GitHub', icon: 'Github', href: 'https://github.com/Arterouss/ForgeKit', external: true },
        { label: 'Discord', icon: 'MessageSquare', href: '/dashboard/discord' },
        { label: 'Feedback', icon: 'MessageSquare', href: '/dashboard/feedback' },
      ],
    },
    {
      title: 'Settings',
      items: [
        { label: 'Profile', icon: 'User', href: '/dashboard/settings/profile' },
        { label: 'Appearance', icon: 'Palette', href: '/dashboard/settings/appearance' },
        { label: 'Preferences', icon: 'Sliders', href: '/dashboard/settings/preferences' },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-card/25 backdrop-blur-lg transition-all duration-300 ease-in-out shrink-0 select-none",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Top Workspace Selector & Collapse Toggle */}
      <div className="flex h-16 shrink-0 items-center justify-between px-3 border-b border-border">
        {collapsed ? (
          <div className="flex w-full justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all hover:bg-primary/20">
                <span>⚒️</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveWorkspace('Default Workspace')}>
                  Default Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveWorkspace('Personal Sandbox')}>
                  Personal Sandbox
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted/60 transition-colors text-left max-w-[190px]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-sm font-semibold shrink-0">
                  ⚒️
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-foreground leading-none truncate">
                    {activeWorkspace}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-1">
                    v{APP_VERSION}
                  </span>
                </div>
                <ChevronsUpDown className="h-3 w-3 text-muted-foreground shrink-0 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Workspace</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveWorkspace('Default Workspace')}>
                  Default Workspace
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveWorkspace('Personal Sandbox')}>
                  Personal Sandbox
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-primary font-medium text-xs">+ Create Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setCollapsed(true)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground shrink-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            {!collapsed && (
              <h5 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </h5>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isCat = item.href.includes('/category/');
                const isSelected = pathname === item.href || (isCat && pathname.startsWith(item.href));
                const IconComponent = iconMap[item.icon as keyof typeof iconMap] || BookOpen;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-primary",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    aria-label={item.label}
                  >
                    {/* Selected Left Bar indicator */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeSidebarIndicator"
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}

                    <motion.div
                      whileHover={{ rotate: collapsed ? 0 : 5 }}
                      className="shrink-0 transition-colors"
                    >
                      <IconComponent className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    </motion.div>

                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}

                    {!collapsed && item.badge && (
                      <Badge
                        variant={item.badgeType === 'success' ? 'success' : 'default'}
                        className="h-4 px-1 text-[8px] font-bold"
                      >
                        {item.badge}
                      </Badge>
                    )}

                    {!collapsed && item.counter !== undefined && item.counter > 0 && (
                      <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                        {item.counter}
                      </span>
                    )}

                    {!collapsed && item.shortcut && (
                      <kbd className="hidden group-hover:block font-mono text-[9px] text-muted-foreground bg-muted px-1 rounded">
                        {item.shortcut}
                      </kbd>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Settings & Theme Switch */}
      <div className="p-3 border-t border-border shrink-0 bg-card/10">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3 py-2">
            <button
              onClick={() => setCollapsed(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              title="Expand sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] text-muted-foreground font-mono">
              DevForge v{APP_VERSION}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
              <a
                href="https://github.com/Arterouss/ForgeKit"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="GitHub Repository"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
