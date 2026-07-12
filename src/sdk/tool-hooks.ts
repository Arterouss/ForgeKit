'use client';

import { useState, useCallback, useEffect } from 'react';
import { getToolBySlug } from './tool-registry';
import type { ToolDefinition } from './tool-types';

/**
 * Hook to manage clipboard copying with an auto-resetting `copied` state.
 */
export function useClipboard(timeoutMs = 1500) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), timeoutMs);
          return true;
        }
      } catch {
        // Fallback or error handling
      }
      return false;
    },
    [timeoutMs]
  );

  return { copied, copyToClipboard };
}

/**
 * Hook to trigger file downloads in the browser.
 */
export function useDownload() {
  const downloadFile = useCallback(
    (content: string, filename: string, mimeType = 'text/plain') => {
      if (typeof window === 'undefined') return;
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    []
  );

  return { downloadFile };
}

/**
 * Hook to read text contents from an uploaded file.
 */
export function useUpload() {
  const readUploadedFile = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }, []);

  return { readUploadedFile };
}

/**
 * Hook for tool state with optional localStorage persistence.
 */
export function useToolState<T>(initialValue: T, storageKey?: string) {
  const [state, setState] = useState<T>(initialValue);

  // Load from localStorage on mount
  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    const timeoutId = setTimeout(() => {
      try {
        const item = localStorage.getItem(`devforge_tool_${storageKey}`);
        if (item) {
          setState(JSON.parse(item) as T);
        }
      } catch {
        // Ignore JSON or localStorage error
      }
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [storageKey]);

  const setPersistentState = useCallback(
    (valueOrFn: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next = typeof valueOrFn === 'function'
          ? (valueOrFn as (p: T) => T)(prev)
          : valueOrFn;
        if (storageKey && typeof window !== 'undefined') {
          try {
            localStorage.setItem(`devforge_tool_${storageKey}`, JSON.stringify(next));
          } catch {
            // Ignore quota errors
          }
        }
        return next;
      });
    },
    [storageKey]
  );

  return [state, setPersistentState] as const;
}

/**
 * Hook to retrieve registered tool definition by slug.
 */
export function useTool(slug: string): ToolDefinition | undefined {
  return getToolBySlug(slug);
}
