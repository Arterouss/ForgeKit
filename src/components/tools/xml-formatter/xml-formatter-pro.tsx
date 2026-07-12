'use client';

import { useState, useMemo } from 'react';
import {
  BookOpen,
  SlidersHorizontal,
  ChevronRight,
  ChevronDown,
  Search,
} from 'lucide-react';
import {
  formatXml,
  minifyXml,
  validateXml,
  parseXmlToTree,
  XML_PRESETS,
  type XmlTreeNode,
} from '@/lib/xml-utils';
import { useClipboard, useDownload } from '@/sdk';
import {
  ToolPage,
  ToolToolbar,
  InputPanel,
  OutputPanel,
  StatusArea,
} from '@/components/tools';
import { useWorkspace } from '@/components/workspace';

export type XmlMode = 'format' | 'minify' | 'tree' | 'validate';

function XmlTreeViewer({ node }: { node: XmlTreeNode }) {
  const [expanded, setExpanded] = useState<boolean>(true);
  const hasChildren = node.children.length > 0;
  const attrEntries = Object.entries(node.attributes);

  return (
    <div className="pl-3 border-l border-border/50 text-xs font-mono">
      <div className="flex items-center gap-1.5 py-0.5">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground"
          >
            {expanded ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </button>
        ) : (
          <span className="w-3.5" />
        )}
        <span className="font-bold text-primary">&lt;{node.tag}&gt;</span>
        {attrEntries.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {attrEntries.map(([k, v]) => (
              <span key={k} className="rounded bg-muted/40 px-1 text-[11px]">
                <span className="text-muted-foreground">{k}=</span>
                <span className="text-foreground">&quot;{v}&quot;</span>
              </span>
            ))}
          </div>
        )}
        {node.text && !hasChildren && (
          <span className="text-foreground font-sans pl-1">{node.text}</span>
        )}
      </div>

      {expanded && hasChildren && (
        <div className="space-y-0.5 ml-2">
          {node.text && (
            <div className="pl-5 text-foreground font-sans">{node.text}</div>
          )}
          {node.children.map((child, idx) => (
            <XmlTreeViewer key={idx} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export function XmlFormatterPro() {
  const { addHistoryItem } = useWorkspace();
  const { copyToClipboard: copyOutput } = useClipboard();
  const { downloadFile } = useDownload();

  const [mode, setMode] = useState<XmlMode>('format');
  const [input, setInput] = useState<string>(XML_PRESETS[0].sampleXml);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [xpathQuery, setXpathQuery] = useState<string>('');

  const result = useMemo(() => {
    if (!input.trim()) {
      return {
        output: '',
        isValid: true,
        errorMessage: null as string | null,
        tree: null as XmlTreeNode | null,
      };
    }

    if (mode === 'format') {
      const formatted = formatXml(input, indentSize);
      return {
        output: formatted.output,
        isValid: formatted.isValid,
        errorMessage: formatted.error,
        tree: null,
      };
    } else if (mode === 'minify') {
      const minified = minifyXml(input);
      return {
        output: minified.output,
        isValid: minified.isValid,
        errorMessage: minified.error,
        tree: null,
      };
    } else if (mode === 'tree') {
      const validation = validateXml(input);
      const treeNode = parseXmlToTree(input);
      return {
        output: validation.isValid
          ? 'Tree View Generated successfully.'
          : validation.message,
        isValid: validation.isValid && Boolean(treeNode),
        errorMessage: validation.isValid ? null : validation.message,
        tree: treeNode,
      };
    } else {
      // validate
      const validation = validateXml(input);
      return {
        output: validation.isValid
          ? 'XML Document syntax and tags are 100% valid.'
          : validation.message,
        isValid: validation.isValid,
        errorMessage: validation.isValid ? null : validation.message,
        tree: null,
      };
    }
  }, [input, mode, indentSize]);

  const handleRun = () => {
    addHistoryItem(
      'XML Formatter Pro',
      `${mode.toUpperCase()} XML Document (${result.isValid ? 'Valid' : 'Error'})`
    );
  };

  const handleLoadSample = (presetName: string) => {
    const preset =
      XML_PRESETS.find((p) => p.name === presetName) ?? XML_PRESETS[0];
    setInput(preset.sampleXml);
    setMode('format');
    addHistoryItem('XML Formatter Pro', `Loaded Sample: ${preset.name}`);
  };

  const handleClear = () => {
    setInput('');
  };

  return (
    <ToolPage
      title="XML Formatter Pro"
      description="Beautify, minify, validate, and explore XML documents with interactive tree view and SOAP/RSS/Maven templates"
      category="Formatting"
      splitView={true}
      toolbar={
        <div className="space-y-3">
          {/* Mode Selector & Preset Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/60 p-2.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setMode('format')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'format'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Beautify XML
              </button>
              <button
                onClick={() => setMode('minify')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'minify'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Minify XML
              </button>
              <button
                onClick={() => setMode('tree')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'tree'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Tree View & Inspector
              </button>
              <button
                onClick={() => setMode('validate')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  mode === 'validate'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                Validate Only
              </button>
            </div>

            {/* Indent & Preset Dropdown */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Indent:</span>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-foreground focus:outline-none"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  onChange={(e) => {
                    if (e.target.value) handleLoadSample(e.target.value);
                  }}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Load Sample...
                  </option>
                  {XML_PRESETS.map((preset) => (
                    <option key={preset.name} value={preset.name}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* XPath Placeholder Query Input */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2.5">
            <Search className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            <input
              type="text"
              value={xpathQuery}
              onChange={(e) => setXpathQuery(e.target.value)}
              placeholder="XPath Query Filter (e.g. //dependency or //item/title) — Architecture Ready"
              className="flex-1 rounded-lg border border-border bg-background px-3 py-1 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <ToolToolbar
            onRun={handleRun}
            runLabel={
              mode === 'format'
                ? 'Beautify XML'
                : mode === 'minify'
                  ? 'Minify XML'
                  : mode === 'tree'
                    ? 'Generate Tree View'
                    : 'Validate XML'
            }
            onLoadSample={() => handleLoadSample('Maven POM')}
            onClear={handleClear}
            onCopyOutput={() => copyOutput(result.output)}
            canCopy={result.isValid && Boolean(result.output)}
            onDownloadOutput={() =>
              downloadFile(result.output, `devforge-xml-${mode}.xml`)
            }
            canDownload={result.isValid && Boolean(result.output)}
          />
        </div>
      }
      statusArea={
        result.isValid ? (
          <StatusArea
            status="success"
            message={
              mode === 'format'
                ? 'XML Formatted Cleanly'
                : mode === 'minify'
                  ? 'XML Minified Cleanly'
                  : mode === 'tree'
                    ? 'Interactive XML Tree Displayed'
                    : 'Valid XML Document'
            }
          />
        ) : (
          <StatusArea
            status="error"
            message="XML Validation Error"
            detail={result.errorMessage ?? 'Syntax error or unclosed tag'}
          />
        )
      }
      inputPanel={
        <InputPanel
          title="XML Document Input"
          value={input}
          onChange={setInput}
          language="xml"
          onClear={handleClear}
        />
      }
      outputPanel={
        mode === 'tree' && result.tree ? (
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/60">
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
              <span className="text-xs font-semibold text-foreground">
                Interactive XML Tree View
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                Collapsible Nodes
              </span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <XmlTreeViewer node={result.tree} />
            </div>
          </div>
        ) : (
          <OutputPanel
            title={
              mode === 'format'
                ? 'Beautified XML'
                : mode === 'minify'
                  ? 'Minified XML'
                  : 'Validation Output'
            }
            value={result.output}
            language="xml"
            errorMessage={result.errorMessage ?? undefined}
          />
        )
      }
    />
  );
}
