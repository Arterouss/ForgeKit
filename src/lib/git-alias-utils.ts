// ==============================================
// DevForge — Git Alias Builder Utilities
// ==============================================
// Generate production .gitconfig [alias] blocks,
// global CLI setup commands, and shell aliases.
// ==============================================

export interface GitAliasRule {
  id: string;
  alias: string; // e.g. 'st'
  command: string; // e.g. 'status -sb'
  description: string;
}

export interface GitAliasConfig {
  groupTitle: string;
  outputFormat: 'gitconfig' | 'cli-commands' | 'shell-aliases';
  aliases: GitAliasRule[];
}

export interface GitAliasValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

let aliasCounter = 1;
export function generateGitAliasId(): string {
  return `alias_${Date.now()}_${aliasCounter++}`;
}

/**
 * Generates formatted Git Alias output based on selected output format.
 */
export function generateGitAliasOutput(config: GitAliasConfig): string {
  const lines: string[] = [];

  if (config.outputFormat === 'gitconfig') {
    lines.push('# Add this section to ~/.gitconfig or .git/config');
    lines.push('[alias]');
    config.aliases.forEach((rule) => {
      lines.push(`  ${rule.alias} = ${rule.command}`);
    });
  } else if (config.outputFormat === 'cli-commands') {
    lines.push('# Run these commands in your terminal to set global git aliases');
    config.aliases.forEach((rule) => {
      const escapedCmd = rule.command.replace(/"/g, '\\"');
      lines.push(`git config --global alias.${rule.alias} "${escapedCmd}"`);
    });
  } else {
    // shell-aliases
    lines.push('# Add these aliases to your ~/.bashrc or ~/.zshrc');
    config.aliases.forEach((rule) => {
      const escapedCmd = rule.command.replace(/'/g, "'\\''");
      lines.push(`alias g${rule.alias}='git ${escapedCmd}'`);
    });
  }

  return lines.join('\n');
}

/**
 * Validates git alias configuration.
 */
export function validateGitAliasConfig(config: GitAliasConfig): GitAliasValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (config.aliases.length === 0) {
    errors.push('At least one alias rule must be defined.');
  }

  const seen = new Set<string>();
  config.aliases.forEach((rule, idx) => {
    if (!rule.alias.trim()) {
      errors.push(`Alias name is missing on row #${idx + 1}.`);
    } else if (seen.has(rule.alias.trim())) {
      errors.push(`Duplicate alias "${rule.alias.trim()}" found.`);
    } else {
      seen.add(rule.alias.trim());
    }

    if (!rule.command.trim()) {
      errors.push(`Git command is empty for alias "${rule.alias}".`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export const GIT_ALIAS_PRESETS: {
  name: string;
  description: string;
  config: GitAliasConfig;
}[] = [
  {
    name: 'Developer Productivity Superpack',
    description: 'Essential everyday shortcuts (st, co, br, cm, lg, unstage)',
    config: {
      groupTitle: 'Everyday Git Shortcuts',
      outputFormat: 'gitconfig',
      aliases: [
        {
          id: generateGitAliasId(),
          alias: 'st',
          command: 'status -sb',
          description: 'Concise status with branch info',
        },
        {
          id: generateGitAliasId(),
          alias: 'co',
          command: 'checkout',
          description: 'Checkout branch or commit',
        },
        {
          id: generateGitAliasId(),
          alias: 'br',
          command: 'branch -v',
          description: 'Verbose list of branches',
        },
        {
          id: generateGitAliasId(),
          alias: 'cm',
          command: 'commit -m',
          description: 'Quick commit with message',
        },
        {
          id: generateGitAliasId(),
          alias: 'lg',
          command: 'log --graph --abbrev-commit --decorate --format=format:\'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(auto)%d%C(reset)\' --all',
          description: 'Beautiful colorful tree graph log',
        },
        {
          id: generateGitAliasId(),
          alias: 'unstage',
          command: 'reset HEAD --',
          description: 'Unstage files out of index',
        },
      ],
    },
  },
  {
    name: 'Safe Branch & Merge Cleanup',
    description: 'Aliases to prune merged branches and synchronize origins safely',
    config: {
      groupTitle: 'Clean up Operations',
      outputFormat: 'cli-commands',
      aliases: [
        {
          id: generateGitAliasId(),
          alias: 'prune-branches',
          command: '!git branch --merged | grep -v "\\*" | xargs -n 1 git branch -d',
          description: 'Delete local branches already merged into current HEAD',
        },
        {
          id: generateGitAliasId(),
          alias: 'sync',
          command: 'pull --rebase --prune',
          description: 'Rebase pull and prune dead remote tracking refs',
        },
      ],
    },
  },
];
