// ==============================================
// DevForge — Linux Command Explorer Utils
// ==============================================
// Curated interactive Linux & DevOps server command
// repository categorized by system administration,
// networking, disk inspection, and process management.
// ==============================================

export type LinuxCommandCategory =
  | 'system_processes'
  | 'network_ports'
  | 'file_permissions'
  | 'disk_memory'
  | 'archive_compression';

export interface LinuxCommandFlag {
  flag: string;
  description: string;
}

export interface LinuxCommandEntry {
  id: string;
  name: string;
  category: LinuxCommandCategory;
  categoryLabel: string;
  syntax: string;
  description: string;
  flags: LinuxCommandFlag[];
  example: string;
  tags: string[];
}

export const LINUX_COMMAND_DATABASE: LinuxCommandEntry[] = [
  {
    id: 'ps-aux',
    name: 'List All Running Processes (ps aux)',
    category: 'system_processes',
    categoryLabel: 'Process & System Monitoring',
    syntax: 'ps aux | grep <pattern>',
    description: 'Displays all running processes across all users with CPU/Memory utilization percentages and process IDs (PIDs).',
    flags: [
      { flag: 'a', description: 'Show processes for all users' },
      { flag: 'u', description: 'Display user/owner and resource utilization details' },
      { flag: 'x', description: 'Include daemon processes not attached to a TTY terminal' },
    ],
    example: 'ps aux | grep node',
    tags: ['process', 'pid', 'cpu', 'memory', 'daemon'],
  },
  {
    id: 'lsof-port',
    name: 'Find Process Listening on Port (lsof)',
    category: 'system_processes',
    categoryLabel: 'Process & System Monitoring',
    syntax: 'sudo lsof -i :<PORT>',
    description: 'Inspects open files and network sockets to identify which application daemon or process ID is occupying a specific port.',
    flags: [
      { flag: '-i :port', description: 'Filter open file descriptors to IPv4/IPv6 sockets on target port number' },
      { flag: '-P', description: 'Inhibit port name resolution to display raw numeric port numbers' },
      { flag: '-n', description: 'Inhibit DNS name lookups for faster execution' },
    ],
    example: 'sudo lsof -i :3000 -P -n',
    tags: ['port', 'socket', 'lsof', 'pid', 'listen'],
  },
  {
    id: 'systemctl-status',
    name: 'Check Systemd Service Status (systemctl)',
    category: 'system_processes',
    categoryLabel: 'Process & System Monitoring',
    syntax: 'sudo systemctl status <service_name>',
    description: 'Inspects active status, systemd unit health, process tree, and recent journalctl log lines for a background Linux daemon.',
    flags: [
      { flag: 'status', description: 'Display service runtime status and recent log entries' },
      { flag: 'restart', description: 'Stop and immediately restart target service' },
      { flag: 'enable --now', description: 'Enable service on system boot and start it immediately' },
    ],
    example: 'sudo systemctl status nginx.service',
    tags: ['systemd', 'service', 'daemon', 'systemctl'],
  },
  {
    id: 'ss-ports',
    name: 'Inspect Open TCP/UDP Ports (ss)',
    category: 'network_ports',
    categoryLabel: 'Network & Troubleshooting',
    syntax: 'sudo ss -tulpn',
    description: 'Modern replacement for netstat displaying active TCP and UDP sockets with associated process names and listening state.',
    flags: [
      { flag: '-t', description: 'Display TCP sockets' },
      { flag: '-u', description: 'Display UDP sockets' },
      { flag: '-l', description: 'Only show listening sockets' },
      { flag: '-p', description: 'Show process ID (PID) and program name' },
      { flag: '-n', description: 'Do not resolve service names (show numeric IP and port)' },
    ],
    example: 'sudo ss -tulpn | grep :80',
    tags: ['network', 'ports', 'tcp', 'udp', 'listening', 'netstat'],
  },
  {
    id: 'curl-headers',
    name: 'Inspect HTTP Response Headers (curl)',
    category: 'network_ports',
    categoryLabel: 'Network & Troubleshooting',
    syntax: 'curl -I -L <URL>',
    description: 'Fetches HTTP headers from target web URL to verify status code, redirects, caching policies, and SSL/TLS response headers.',
    flags: [
      { flag: '-I, --head', description: 'Fetch HTTP response headers only (HEAD request)' },
      { flag: '-L, --location', description: 'Follow HTTP 3xx redirect locations automatically' },
      { flag: '-v, --verbose', description: 'Show full TLS handshake and raw request/response trace' },
    ],
    example: 'curl -I -L https://devforge.io',
    tags: ['http', 'curl', 'headers', 'tls', 'redirect'],
  },
  {
    id: 'chmod-recursive',
    name: 'Recursively Set Directory & File Permissions',
    category: 'file_permissions',
    categoryLabel: 'File Permissions & Ownership',
    syntax: 'find . -type d -exec chmod 755 {} \\; && find . -type f -exec chmod 644 {} \\;',
    description: 'Safely sets standard Linux web server permissions (directories 755 rwxr-xr-x, regular files 644 rw-r--r--) without making files accidentally executable.',
    flags: [
      { flag: '-type d', description: 'Match directories only' },
      { flag: '-type f', description: 'Match regular files only' },
      { flag: '-exec chmod ... {} \\;', description: 'Execute chmod mode on each matched item' },
    ],
    example: 'sudo find /var/www/html -type d -exec chmod 755 {} \\;',
    tags: ['chmod', 'permissions', 'find', 'security'],
  },
  {
    id: 'chown-recursive',
    name: 'Recursively Change Directory Ownership',
    category: 'file_permissions',
    categoryLabel: 'File Permissions & Ownership',
    syntax: 'sudo chown -R <user>:<group> <path>',
    description: 'Assigns recursive file ownership and group membership for web application directories.',
    flags: [
      { flag: '-R, --recursive', description: 'Apply ownership change to all files and subdirectories' },
      { flag: '--no-dereference', description: 'Affect symbolic links instead of referenced target files' },
    ],
    example: 'sudo chown -R www-data:www-data /var/www/devforge',
    tags: ['chown', 'ownership', 'www-data', 'recursive'],
  },
  {
    id: 'df-disk',
    name: 'Check Disk Space & Mounted Volumes (df)',
    category: 'disk_memory',
    categoryLabel: 'Disk & Memory',
    syntax: 'df -hT',
    description: 'Displays filesystem disk usage, available storage capacity, filesystem type (ext4, xfs), and mount points in human-readable units.',
    flags: [
      { flag: '-h', description: 'Format sizes in human-readable powers of 1024 (MB, GB, TB)' },
      { flag: '-T', description: 'Print filesystem type column (ext4, tmpfs, overlay)' },
    ],
    example: 'df -hT | grep -v tmpfs',
    tags: ['disk', 'storage', 'df', 'filesystem'],
  },
  {
    id: 'du-folder',
    name: 'Find Largest Subdirectories (du)',
    category: 'disk_memory',
    categoryLabel: 'Disk & Memory',
    syntax: 'du -sh * | sort -hr | head -10',
    description: 'Calculates directory size summaries in current working folder and sorts them from largest to smallest.',
    flags: [
      { flag: '-s', description: 'Display summary total for each specified directory' },
      { flag: '-h', description: 'Format sizes in human-readable MB/GB units' },
      { flag: 'sort -hr', description: 'Sort numeric human-readable values descending' },
    ],
    example: 'sudo du -sh /var/log/* | sort -hr | head -10',
    tags: ['du', 'storage', 'size', 'logs'],
  },
  {
    id: 'tar-archive',
    name: 'Create Gzip Tarball Archive (tar)',
    category: 'archive_compression',
    categoryLabel: 'Archive & Compression',
    syntax: 'tar -czvf <archive_name.tar.gz> <directory_path>',
    description: 'Bundles a directory tree into a single compressed gzip tarball archive file.',
    flags: [
      { flag: '-c', description: 'Create a new archive file' },
      { flag: '-z', description: 'Compress archive using gzip compression algorithm' },
      { flag: '-v', description: 'Verbosely list files processed' },
      { flag: '-f', description: 'Specify target output archive filename' },
    ],
    example: 'tar -czvf app-backup-$(date +%F).tar.gz /var/www/devforge',
    tags: ['tar', 'archive', 'gzip', 'backup', 'compression'],
  },
];

/**
 * Filter Linux command database by search query or category.
 */
export function filterLinuxCommands(
  query: string,
  category: string
): LinuxCommandEntry[] {
  const q = query.trim().toLowerCase();

  return LINUX_COMMAND_DATABASE.filter((entry) => {
    const matchesCategory =
      !category || category === 'all' || entry.category === category;

    if (!q) return matchesCategory;

    const matchesName = entry.name.toLowerCase().includes(q);
    const matchesSyntax = entry.syntax.toLowerCase().includes(q);
    const matchesDesc = entry.description.toLowerCase().includes(q);
    const matchesTags = entry.tags.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && (matchesName || matchesSyntax || matchesDesc || matchesTags);
  });
}
