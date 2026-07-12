'use client';

import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  Braces,
  Brackets,
} from 'lucide-react';
import { getJsonDataType, JsonNodeType } from '@/lib/json-utils';
import { cn } from '@/lib/utils';

interface JsonTreeNodeProps {
  nodeKey?: string;
  value: unknown;
  path: string;
  depth?: number;
}

export function JsonTreeNode({
  nodeKey,
  value,
  path,
  depth = 0,
}: JsonTreeNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2); // Expand top 2 levels by default
  const [copiedPath, setCopiedPath] = useState(false);

  const dataType: JsonNodeType = getJsonDataType(value);
  const isComplex = dataType === 'object' || dataType === 'array';

  const handleCopyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 1500);
  };

  const renderValueBadge = () => {
    switch (dataType) {
      case 'string':
        return (
          <span className="text-emerald-500 font-mono break-all">
            &quot;{String(value)}&quot;
          </span>
        );
      case 'number':
        return <span className="text-amber-500 font-mono">{String(value)}</span>;
      case 'boolean':
        return <span className="text-sky-500 font-mono">{String(value)}</span>;
      case 'null':
        return <span className="text-rose-500 font-mono italic">null</span>;
      case 'array': {
        const arr = value as unknown[];
        return (
          <span className="text-muted-foreground font-mono text-[11px]">
            Array ({arr.length} {arr.length === 1 ? 'item' : 'items'})
          </span>
        );
      }
      case 'object': {
        const keys = Object.keys(value as Record<string, unknown>);
        return (
          <span className="text-muted-foreground font-mono text-[11px]">
            Object ({keys.length} {keys.length === 1 ? 'key' : 'keys'})
          </span>
        );
      }
    }
  };

  return (
    <div className="flex flex-col text-xs font-mono select-none">
      {/* Node Header Row */}
      <div
        onClick={() => isComplex && setExpanded(!expanded)}
        className={cn(
          'group flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:bg-muted/60',
          isComplex && 'cursor-pointer'
        )}
      >
        {/* Indent spacer */}
        {depth > 0 && (
          <span
            className="inline-block shrink-0"
            style={{ width: `${depth * 14}px` }}
          />
        )}

        {/* Expand / Collapse Icon */}
        {isComplex ? (
          expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )
        ) : (
          <span className="w-3.5 shrink-0" />
        )}

        {/* Type Icon indicator */}
        {dataType === 'object' && <Braces className="h-3.5 w-3.5 text-primary shrink-0" />}
        {dataType === 'array' && <Brackets className="h-3.5 w-3.5 text-accent shrink-0" />}

        {/* Node Key */}
        {nodeKey !== undefined && (
          <span className="font-semibold text-foreground mr-1">
            {nodeKey}:
          </span>
        )}

        {/* Value Display */}
        {renderValueBadge()}

        {/* Path copy action badge on hover */}
        <button
          onClick={handleCopyPath}
          className="opacity-0 group-hover:opacity-100 ml-auto flex items-center gap-1 rounded bg-background/80 border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:text-foreground transition-opacity"
          title={`Copy path: ${path}`}
        >
          {copiedPath ? (
            <>
              <Check className="h-2.5 w-2.5 text-success" />
              <span className="text-success font-semibold">Path Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-2.5 w-2.5" />
              <span>Copy Path</span>
            </>
          )}
        </button>
      </div>

      {/* Children rendering if expanded */}
      {isComplex && expanded && (
        <div className="flex flex-col border-l border-border/40 ml-4 pl-1">
          {dataType === 'array'
            ? (value as unknown[]).map((item, idx) => (
                <JsonTreeNode
                  key={idx}
                  nodeKey={`[${idx}]`}
                  value={item}
                  path={`${path}[${idx}]`}
                  depth={depth + 1}
                />
              ))
            : Object.entries(value as Record<string, unknown>).map(
                ([key, val]) => (
                  <JsonTreeNode
                    key={key}
                    nodeKey={key}
                    value={val}
                    path={`${path}.${key}`}
                    depth={depth + 1}
                  />
                )
              )}
        </div>
      )}
    </div>
  );
}

interface JsonTreeViewProps {
  jsonString: string;
}

export function JsonTreeView({ jsonString }: JsonTreeViewProps) {
  let parsed: unknown = null;
  let parseError: string | null = null;

  try {
    parsed = JSON.parse(jsonString);
  } catch (err: unknown) {
    parseError = err instanceof Error ? err.message : 'Invalid JSON';
  }

  if (parseError) {
    return (
      <div className="p-6 text-xs text-destructive flex flex-col items-center justify-center h-full">
        <p className="font-semibold">Cannot display Tree View</p>
        <p className="font-mono text-[11px] mt-1 text-muted-foreground">{parseError}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto p-4 bg-card/40 rounded-xl">
      <JsonTreeNode value={parsed} path="$" depth={0} />
    </div>
  );
}
