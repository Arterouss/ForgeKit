'use client';

import { useState, useMemo } from 'react';
import { Clock, AlertCircle, Terminal, Sparkles } from 'lucide-react';
import {
  generateCronExpression,
  parseCronExpression,
  explainCronExpression,
  generateCrontabEntry,
  validateCronFields,
  CRON_PRESETS,
  type CronFields,
} from '@/lib/cron-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export function CronBuilderPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [fields, setFields] = useState<CronFields>(() =>
    parseCronExpression(CRON_PRESETS[4].expression)!
  );
  const [user, setUser] = useState('root');
  const [command, setCommand] = useState(
    '/usr/bin/pg_dump -U postgres dbname > /backups/db.sql'
  );

  const cronExpression = useMemo(
    () => generateCronExpression(fields),
    [fields]
  );
  const explanation = useMemo(
    () => explainCronExpression(fields),
    [fields]
  );
  const crontabEntry = useMemo(() => {
    return generateCrontabEntry({ fields, user, command });
  }, [fields, user, command]);

  const validation = useMemo(() => validateCronFields(fields), [fields]);

  const handleRun = () => {
    addHistoryItem(
      'Cron Expression Builder',
      `Schedule: ${cronExpression} (${explanation})`
    );
  };

  const handleClear = () => {
    setFields({
      minute: '*',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*',
    });
    setUser('root');
    setCommand('/path/to/script.sh');
  };

  return (
    <ToolPage
      title="Cron Expression Builder"
      description="Interactive 5-field Linux crontab schedule generator with human-readable natural language descriptor, execution presets, and system user crontab formatting"
      category="Linux"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <select
              onChange={(e) => {
                const preset = CRON_PRESETS.find(
                  (p) => p.name === e.target.value
                );
                if (preset) {
                  const parsed = parseCronExpression(preset.expression);
                  if (parsed) setFields(parsed);
                }
              }}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-semibold text-foreground focus:outline-none"
              defaultValue=""
            >
              <option value="" disabled>
                Load Cron Preset Schedule...
              </option>
              {CRON_PRESETS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{cronExpression}</span>
            </div>
          </div>

          {validation.errors.length > 0 && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 space-y-1">
              {validation.errors.map((err, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 text-xs text-destructive font-medium"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{err}</span>
                </div>
              ))}
            </div>
          )}

          <ToolToolbar
            onRun={handleRun}
            runLabel="Save Schedule"
            onLoadSample={() =>
              setFields(parseCronExpression(CRON_PRESETS[4].expression)!)
            }
            onClear={handleClear}
            onCopyOutput={() => copyOutput(crontabEntry)}
            canCopy={Boolean(crontabEntry)}
            onDownloadOutput={() => downloadFile(crontabEntry, 'crontab')}
            canDownload={Boolean(crontabEntry)}
          />
        </div>
      }
      statusArea={
        validation.isValid ? (
          <StatusArea
            status="success"
            message="Schedule Valid"
            detail={explanation}
          />
        ) : (
          <StatusArea
            status="error"
            message="Syntax Error"
            detail={validation.errors[0] ?? 'Check field characters'}
          />
        )
      }
      inputPanel={
        <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-border bg-card/60 p-4 space-y-4">
          {/* Natural Language Banner */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Natural Language Explanation
                </div>
                <div className="text-sm font-extrabold text-foreground">
                  “{explanation}”
                </div>
              </div>
            </div>
          </div>

          {/* 5 Fields Grid */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <span className="text-xs font-bold text-foreground">
              Cron 5-Field Schedule Specification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground">
                  1. Minute (0-59)
                </label>
                <input
                  type="text"
                  value={fields.minute}
                  onChange={(e) =>
                    setFields({ ...fields, minute: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-bold text-primary text-center"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground">
                  2. Hour (0-23)
                </label>
                <input
                  type="text"
                  value={fields.hour}
                  onChange={(e) =>
                    setFields({ ...fields, hour: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-bold text-primary text-center"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground">
                  3. Day of Month (1-31)
                </label>
                <input
                  type="text"
                  value={fields.dayOfMonth}
                  onChange={(e) =>
                    setFields({ ...fields, dayOfMonth: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-bold text-primary text-center"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground">
                  4. Month (1-12)
                </label>
                <input
                  type="text"
                  value={fields.month}
                  onChange={(e) =>
                    setFields({ ...fields, month: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-bold text-primary text-center"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground">
                  5. Day of Week (0-7)
                </label>
                <input
                  type="text"
                  value={fields.dayOfWeek}
                  onChange={(e) =>
                    setFields({ ...fields, dayOfWeek: e.target.value })
                  }
                  className="mt-1 w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-sm font-bold text-primary text-center"
                />
              </div>
            </div>
          </div>

          {/* System Crontab Command Editor */}
          <div className="rounded-xl border border-border bg-background p-3 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground border-b border-border pb-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span>System Crontab Execution Entry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-1">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Run as User (System Crontab)
                </label>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="root or deploy"
                  className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs font-bold text-foreground"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="text-[10px] font-semibold text-muted-foreground">
                  Command or Script Path
                </label>
                <input
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="/usr/bin/backup.sh >> /var/log/backup.log 2>&1"
                  className="w-full rounded border border-border bg-card px-2.5 py-1.5 font-mono text-xs text-foreground"
                />
              </div>
            </div>
          </div>
        </div>
      }
      outputPanel={
        <OutputPanel
          title="Generated Crontab Entry Line"
          value={crontabEntry}
          language="bash"
        />
      }
    />
  );
}
