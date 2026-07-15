'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import {
  WorkspaceProvider,
  WorkspaceTabs,
  ToolContainer,
  UtilityPanel,
  StatusBar,
} from '@/components/workspace';
import { CommandProvider, CommandPalette } from '@/components/command';
import { PluginProvider } from '@/components/plugins';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const showTabs = pathname?.startsWith('/dashboard/workspace');

  return (
    <CommandProvider>
      <PluginProvider>
        <WorkspaceProvider>
          <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#09090b] font-sans text-foreground">
            <TopBar
              onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              onRightPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
              rightPanelOpen={rightPanelOpen}
            />

            {/* Main Workspace + Sidebar + Panel */}
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
              />

              {/* Main Content Area / Workspace Engine */}
              <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#09090b]">
                {showTabs && <WorkspaceTabs />}
                <ToolContainer>{children}</ToolContainer>
              </main>

              {/* Collapsible Utility Panel */}
              <AnimatePresence>
                {rightPanelOpen && (
                  <motion.aside
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 320, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="hidden w-[320px] shrink-0 flex-col overflow-hidden border-l border-white/[.07] bg-[#101014]/90 backdrop-blur-xl lg:flex"
                  >
                    <UtilityPanel />
                  </motion.aside>
                )}
              </AnimatePresence>
            </div>

            <StatusBar />
            <CommandPalette />
          </div>
        </WorkspaceProvider>
      </PluginProvider>
    </CommandProvider>
  );
}
