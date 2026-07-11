// ==============================================
// DevForge — Command Registry
// ==============================================
// Central registration system for commands.
// ==============================================

import type { CommandDefinition, CommandGroup } from './command-types';

const commandRegistry = new Map<string, CommandDefinition>();

/**
 * Register a command.
 */
export function registerCommand(command: CommandDefinition): void {
  if (commandRegistry.has(command.id)) {
    console.warn(`[CommandRegistry] Command "${command.id}" is already registered. Skipping.`);
    return;
  }
  commandRegistry.set(command.id, command);
}

/**
 * Get all registered commands.
 */
export function getAllCommands(): CommandDefinition[] {
  return Array.from(commandRegistry.values());
}

/**
 * Get commands by group.
 */
export function getCommandsByGroup(group: CommandGroup): CommandDefinition[] {
  return getAllCommands().filter((cmd) => cmd.group === group);
}

/**
 * Search commands by query.
 */
export function searchCommands(query: string): CommandDefinition[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllCommands();

  return getAllCommands().filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(q) ||
      cmd.description?.toLowerCase().includes(q) ||
      cmd.keywords?.some((k) => k.toLowerCase().includes(q))
  );
}

/**
 * Execute a command by ID.
 */
export async function executeCommand(id: string): Promise<void> {
  const command = commandRegistry.get(id);
  if (!command) {
    console.warn(`[CommandRegistry] Command "${id}" not found.`);
    return;
  }
  await command.action();
}
