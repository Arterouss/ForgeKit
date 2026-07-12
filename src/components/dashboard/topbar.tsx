'use client';

import { useState } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Github,
  Search,
  ChevronDown,
  User,
  Palette,
  Sliders,
  Info,
  LogOut,
  Menu,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useCommand } from '@/components/command';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TopBarProps {
  onSidebarToggle: () => void;
  onRightPanelToggle: () => void;
  rightPanelOpen: boolean;
}

export function TopBar({
  onSidebarToggle,
  onRightPanelToggle,
  rightPanelOpen,
}: TopBarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { openCommandPalette } = useCommand();

  // Mock notifications list
  const [notifications] = useState([
    { id: 1, title: 'Prisma Client configured', desc: 'Prisma skeleton is active and ready for schema pushes.', time: '2 hrs ago', unread: true },
    { id: 2, title: 'Better Auth prepared', desc: 'Authentication skeleton schema is generated in user model.', time: '1 day ago', unread: false },
    { id: 3, title: 'Version v0.6 active', desc: 'Premium top navigation system is deployed.', time: 'Just now', unread: true },
  ]);

  // Construct breadcrumbs dynamically from pathname
  const getBreadcrumbs = () => {
    const items: { label: string; href?: string }[] = [{ label: 'Dashboard', href: '/dashboard' }];
    if (!pathname) return items;

    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 1) {
      if (parts[1] === 'category') {
        items.push({ label: 'Categories' });
        if (parts[2]) {
          const catName = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
          items.push({ label: catName, href: `/dashboard/category/${parts[2]}` });
        }
      } else if (parts[1] === 'workspace') {
        items.push({ label: 'Workspace', href: '/dashboard/workspace' });
      } else if (parts[1] === 'collections') {
        items.push({ label: 'Collections', href: '/dashboard/collections' });
      } else if (parts[1] === 'pinned') {
        items.push({ label: 'Pinned', href: '/dashboard/pinned' });
      } else if (parts[1] === 'recent') {
        items.push({ label: 'Recent', href: '/dashboard/recent' });
      } else if (parts[1] === 'settings') {
        items.push({ label: 'Settings' });
        if (parts[2]) {
          const section = parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
          items.push({ label: section });
        }
      }
    }
    return items;
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-card/30 px-6 backdrop-blur-md">
      {/* Left Section: Mobile Menu Trigger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onSidebarToggle}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground tracking-wide capitalize">
              {pathname === '/dashboard' ? 'Default Workspace' : 'Workspace'}
            </span>
          </div>
          <Breadcrumb items={getBreadcrumbs()} />
        </div>
      </div>

      {/* Center Section: Global Search Trigger */}
      <div className="flex max-w-md flex-1 px-4 sm:px-8">
        <button
          type="button"
          onClick={openCommandPalette}
          className="group relative flex w-full items-center justify-between rounded-xl border border-border bg-card/50 px-3 py-1.5 transition-all hover:border-primary/40 hover:bg-card focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground">
              Search tools, commands, categories…
            </span>
          </div>
          <kbd className="hidden items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground sm:flex select-none">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* GitHub Repository */}
        <a
          href="https://github.com/Arterouss/ForgeKit"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="GitHub Repository"
        >
          <Github className="h-4 w-4" />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative rounded-xl p-2.5 text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus:outline-none">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-2">
            <DropdownMenuLabel className="flex items-center justify-between text-xs px-3 py-2">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-60 overflow-y-auto space-y-1 py-1">
              {notifications.map((notif) => (
                <DropdownMenuItem
                  key={notif.id}
                  className="flex flex-col items-start gap-1 rounded-lg p-2.5 hover:bg-muted/50 cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <span className={cn("text-xs font-semibold", notif.unread ? "text-primary" : "text-foreground")}>
                      {notif.title}
                    </span>
                    <span className="text-[9px] text-muted-foreground">{notif.time}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-normal">
                    {notif.desc}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Right Panel Toggle (Utility Center) */}
        <button
          onClick={onRightPanelToggle}
          className={cn(
            "hidden lg:flex rounded-xl p-2.5 transition-all hover:bg-muted hover:text-foreground",
            rightPanelOpen ? "bg-primary/10 text-primary" : "text-muted-foreground"
          )}
          title="Toggle Utility Panel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>

        {/* Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-xl p-1 hover:bg-muted/60 transition-colors focus:outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 border border-primary/20 text-primary text-xs font-bold">
              U
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground">User Account</span>
                <span className="text-[10px] text-muted-foreground">dev@devforge.dev</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Sliders className="h-4 w-4 text-muted-foreground" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span>About DevForge</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:bg-destructive/10 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
