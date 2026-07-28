'use client';

import { useState, useCallback, type ReactNode } from 'react';
import { ExternalLink, RefreshCw, Maximize2, Minimize2, AlertTriangle, Loader2 } from 'lucide-react';

/**
 * ExternalToolPane — Embeds a third-party tool in an iframe with automatic fallback.
 *
 * Many SaaS dashboards (Metricool, Sprout Social, etc.) block iframe embedding via
 * X-Frame-Options or CSP frame-ancestors directives. This component attempts the iframe
 * first, and if it detects that the embed was blocked (via load error or timeout),
 * it falls back to an in-app panel that provides:
 * 1. A "Open in New Tab" link for immediate access
 * 2. A brief description of what the tool does
 * 3. A reconnect/retry button
 *
 * The iframe attempt is silent — the user sees a loading spinner, then either the
 * embedded tool or the fallback panel, without any jarring error messages.
 */

export interface ToolConfig {
  name: string;
  src: string;
  openUrl: string;
  description: string;
  icon?: ReactNode;
  color?: string;
  category?: string;
}

export default function ExternalToolPane({ tool }: { tool: ToolConfig }) {
  const [iframeFailed, setIframeFailed] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
    // We can't directly detect X-Frame-Options blocking from JS.
    // But if the iframe loads and remains empty/blank for a while, we mark it as failed.
    // The load event fires even when blocked (some browsers), so we use a post-load check.
    setTimeout(() => {
      // If iframe loaded but content is inaccessible, it was likely blocked
      try {
        const iframeEl = document.getElementById(`iframe-${tool.name}`);
        if (iframeEl) {
          // Attempting to access iframe content will throw if blocked by CORS/X-Frame-Options
          const doc = iframeEl.contentDocument || (iframeEl as HTMLIFrameElement).contentWindow?.document;
          if (!doc || !doc.body || doc.body.innerHTML === '') {
            // Likely blocked — show fallback
            setIframeFailed(true);
          }
        }
      } catch {
        // SecurityError = cross-origin blocked — which is expected for successful loads
        // But if we get a security error, the iframe DID load (just can't read it), so it's NOT blocked
        // Only mark as failed if the iframe is visibly empty/blank
        setIframeFailed(false);
      }
    }, 3000);
  }, [tool.name]);

  const handleIframeError = useCallback(() => {
    setIframeLoading(false);
    setIframeFailed(true);
  }, []);

  const handleRetry = useCallback(() => {
    setIframeFailed(false);
    setIframeLoading(true);
    setRetryCount(retryCount + 1);
  }, [retryCount]);

  const handleOpenNewTab = useCallback(() => {
    window.open(tool.openUrl, '_blank', 'noopener,noreferrer');
  }, [tool.openUrl]);

  const accentColor = tool.color || '#6366f1';

  if (iframeFailed) {
    // Fallback panel when iframe embed was blocked
    return (
      <div className="flex flex-col h-full bg-white rounded-xl border border-neutral-200 overflow-hidden">
        {/* Header with tool name and actions */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200" style={{ borderBottomColor: accentColor + '30' }}>
          <div className="flex items-center gap-3">
            {tool.icon && <div style={{ color: accentColor }}>{tool.icon}</div>}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900">{tool.name}</h3>
              <p className="text-xs text-neutral-500">{tool.category || 'External Tool'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
            >
              <RefreshCw size={14} /> Retry Embed
            </button>
            <button
              onClick={handleOpenNewTab}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              <ExternalLink size={14} /> Open in Tab
            </button>
          </div>
        </div>

        {/* Fallback content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor + '15' }}>
              <AlertTriangle size={28} style={{ color: accentColor }} />
            </div>
            <h4 className="text-lg font-semibold text-neutral-900 mb-2">
              {tool.name} doesn't allow in-app embedding
            </h4>
            <p className="text-sm text-neutral-500 mb-4 leading-relaxed">
              {tool.description}
            </p>
            <p className="text-xs text-neutral-400 mb-6">
              Most analytics dashboards block iframe embedding for security (X-Frame-Options / CSP).
              Click below to open {tool.name} in a new browser tab — you'll stay logged in.
            </p>
            <button
              onClick={handleOpenNewTab}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-colors shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              <ExternalLink size={16} /> Open {tool.name} ↗
            </button>
          </div>
        </div>

        {/* Quick stats placeholder — shows what data you'd see if embedded */}
        <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
          <p className="text-xs text-neutral-400">
            Tip: You can also connect {tool.name} via API to pull social metrics directly into your platform analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden transition-all ${isExpanded ? 'fixed inset-4 z-50' : 'h-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-neutral-50/50">
        <div className="flex items-center gap-2">
          {tool.icon && <div style={{ color: accentColor }}>{tool.icon}</div>}
          <span className="text-sm font-medium text-neutral-900">{tool.name}</span>
          {iframeLoading && (
            <span className="flex items-center gap-1 text-xs text-neutral-400">
              <Loader2 size={12} className="animate-spin" /> Loading…
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={handleOpenNewTab}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-neutral-500 hover:bg-neutral-200 hover:text-neutral-700 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={12} /> Tab ↗
          </button>
        </div>
      </div>

      {/* iframe container */}
      <div className="flex-1 relative min-h-0">
        {iframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="text-center">
              <Loader2 size={32} className="animate-spin mx-auto mb-3" style={{ color: accentColor }} />
              <p className="text-sm text-neutral-500">Connecting to {tool.name}…</p>
            </div>
          </div>
        )}
        <iframe
          id={`iframe-${tool.name}`}
          key={retryCount}
          src={tool.src}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation-by-user-activation"
          allow="clipboard-write"
          title={tool.name}
        />
      </div>
    </div>
  );
}
