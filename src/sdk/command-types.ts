// ==============================================
// DevForge — Command Types
// ==============================================
// Defines the interface for the Command Palette.
// ==============================================

/**
 * Command groups for organizing the palette.
 */
export type CommandGroup =
  | 'navigation'
  | 'tools'
  | 'actions'
  | 'settings'
  | 'help';

/**
 * A command that can be executed from the palette.
 */
export interface CommandDefinition {
  id: string;
  title: string;
  description?: string;
  group: CommandGroup;
  icon?: string;
  shortcut?: string;
  keywords?: string[];
  action: () => void | Promise<void>;
}
