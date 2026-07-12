'use client';

import { useState } from 'react';
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

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <CommandProvider>
      <WorkspaceProvider>
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-background font-sans text-foreground select-none">
          <TopBar
            onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onRightPanelToggle={() => setRightPanelOpen(!rightPanelOpen)}
            rightPanelOpen={rightPanelOpen}
          />

          {/* Main Workspace + Sidebar + Panel */}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

            {/* Main Content Area / Workspace Engine */}
            <main className="flex flex-1 flex-col overflow-hidden bg-background/50">
              <WorkspaceTabs />
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
                  className="hidden lg:flex w-[320px] shrink-0 flex-col border-l border-border overflow-hidden"
                >
                  <UtilityPanel />
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* Status Bar */}
          <StatusBar />

          {/* Global Command Palette Modal */}
          <CommandPalette />
        </div>
      </WorkspaceProvider>
    </CommandProvider>
  );
}

