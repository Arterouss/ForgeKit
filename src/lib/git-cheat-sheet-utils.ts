// ==============================================
// DevForge — Interactive Git Cheat Sheet Utilities
// ==============================================
// Comprehensive categorized Git command catalog
// with keyword searching, interactive parameter
// substitution, and Markdown reference exports.
// ==============================================

export type GitCheatCategory =
  | 'branching'
  | 'stash'
  | 'undo'
  | 'remote'
  | 'inspect';

export interface GitCheatEntry {
  id: string;
  category: GitCheatCategory;
  title: string;
  commandTemplate: string;
  description: string;
  dangerLevel: 'safe' | 'caution' | 'destructive';
}

export const GIT_CHEAT_CATEGORIES: {
  id: GitCheatCategory;
  name: string;
  iconName: string;
}[] = [
  { id: 'branching', name: 'Branching & Merging', iconName: 'GitBranch' },
  { id: 'stash', name: 'Stash & Temporary Work', iconName: 'Archive' },
  { id: 'undo', name: 'Undo, Reset & Recovery', iconName: 'RotateCcw' },
  { id: 'remote', name: 'Remote & Collaboration', iconName: 'Globe' },
  { id: 'inspect', name: 'Inspection & History Debugging', iconName: 'Search' },
];

export const GIT_CHEAT_ENTRIES: GitCheatEntry[] = [
  // Branching
  {
    id: 'b1',
    category: 'branching',
    title: 'Create & switch to new branch',
    commandTemplate: 'git checkout -b <branch_name>',
    description: 'Creates a new branch and checks it out immediately.',
    dangerLevel: 'safe',
  },
  {
    id: 'b2',
    category: 'branching',
    title: 'Interactive Rebase commits',
    commandTemplate: 'git rebase -i HEAD~<number_of_commits>',
    description: 'Squash, reorder, or edit the last N commits.',
    dangerLevel: 'caution',
  },
  {
    id: 'b3',
    category: 'branching',
    title: 'Merge without fast-forward',
    commandTemplate: 'git merge --no-ff <branch_name>',
    description: 'Always create a merge commit even if fast-forward is possible.',
    dangerLevel: 'safe',
  },

  // Stash
  {
    id: 's1',
    category: 'stash',
    title: 'Stash changes with descriptive message',
    commandTemplate: 'git stash push -m "<stash_message>"',
    description: 'Save working directory modifications with a readable label.',
    dangerLevel: 'safe',
  },
  {
    id: 's2',
    category: 'stash',
    title: 'Pop most recent stash entry',
    commandTemplate: 'git stash pop',
    description: 'Apply top stash entry and remove it from stash list.',
    dangerLevel: 'safe',
  },

  // Undo & Recovery
  {
    id: 'u1',
    category: 'undo',
    title: 'Undo last commit (keep staged files)',
    commandTemplate: 'git reset --soft HEAD~1',
    description: 'Moves HEAD back 1 commit while preserving staged work.',
    dangerLevel: 'safe',
  },
  {
    id: 'u2',
    category: 'undo',
    title: 'Discard all uncommitted changes hard',
    commandTemplate: 'git reset --hard HEAD',
    description: 'Resets index and working directory to HEAD state.',
    dangerLevel: 'destructive',
  },
  {
    id: 'u3',
    category: 'undo',
    title: 'Find lost commit hashes in Reflog',
    commandTemplate: 'git reflog -n <limit>',
    description: 'Inspect local HEAD movement history to recover deleted branches or resets.',
    dangerLevel: 'safe',
  },

  // Remote
  {
    id: 'r1',
    category: 'remote',
    title: 'Safe force push (protect others work)',
    commandTemplate: 'git push --force-with-lease <remote> <branch_name>',
    description: 'Only force pushes if remote branch has not changed unexpectedly.',
    dangerLevel: 'caution',
  },
  {
    id: 'r2',
    category: 'remote',
    title: 'Prune dead remote tracking references',
    commandTemplate: 'git fetch --prune <remote>',
    description: 'Delete local references to remote branches that were deleted on GitHub.',
    dangerLevel: 'safe',
  },

  // Inspect
  {
    id: 'i1',
    category: 'inspect',
    title: 'Binary search for bug introducing commit',
    commandTemplate: 'git bisect start <bad_commit> <good_commit>',
    description: 'Start binary search over commit range to isolate regression.',
    dangerLevel: 'safe',
  },
  {
    id: 'i2',
    category: 'inspect',
    title: 'Inspect line-by-line author history',
    commandTemplate: 'git blame -L <start_line>,<end_line> <file_path>',
    description: 'Show commit hash and author for specific line ranges.',
    dangerLevel: 'safe',
  },
];

/**
 * Filter cheat sheet entries by search query and category.
 */
export function searchGitCheatSheet(
  query: string,
  category?: GitCheatCategory | 'all'
): GitCheatEntry[] {
  const q = query.trim().toLowerCase();

  return GIT_CHEAT_ENTRIES.filter((entry) => {
    const matchesCategory =
      !category || category === 'all' || entry.category === category;
    if (!matchesCategory) return false;

    if (!q) return true;

    return (
      entry.title.toLowerCase().includes(q) ||
      entry.commandTemplate.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q)
    );
  });
}

/**
 * Replaces angle bracket placeholders `<param>` with customized dictionary values.
 */
export function customizeCommandString(
  template: string,
  params: Record<string, string>
): string {
  let output = template;
  Object.entries(params).forEach(([key, val]) => {
    if (val.trim()) {
      const regex = new RegExp(`<${key}>`, 'g');
      output = output.replace(regex, val.trim());
    }
  });
  return output;
}

/**
 * Exports selected or all entries formatted as Markdown cheat sheet.
 */
export function generateCheatSheetMarkdown(entries: GitCheatEntry[]): string {
  const lines: string[] = [];
  lines.push('# DevForge Interactive Git Cheat Sheet');
  lines.push('');

  GIT_CHEAT_CATEGORIES.forEach((cat) => {
    const catEntries = entries.filter((e) => e.category === cat.id);
    if (catEntries.length === 0) return;

    lines.push(`## ${cat.name}`);
    catEntries.forEach((entry) => {
      lines.push(`### ${entry.title}`);
      lines.push(`\`\`\`bash\n${entry.commandTemplate}\n\`\`\``);
      lines.push(`${entry.description}`);
      lines.push('');
    });
  });

  return lines.join('\n').trim();
}
