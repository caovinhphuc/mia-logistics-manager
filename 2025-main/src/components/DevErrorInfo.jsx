import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

const DevErrorInfo = ({ error, errorInfo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const errorDetails = {
    message: error?.message || 'Unknown error',
    stack: error?.stack || 'No stack trace',
    componentStack: errorInfo?.componentStack || 'No component stack',
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-4 border border-orange-200 rounded-lg bg-orange-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-orange-100 transition-colors"
      >
        <span className="font-medium text-orange-800">
          🔧 Development Error Details
        </span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-orange-600" />
        ) : (
          <ChevronRight className="h-4 w-4 text-orange-600" />
        )}
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-orange-200">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-orange-800">Error Information</h4>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-200 hover:bg-orange-300 rounded text-orange-800 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  Copy
                </>
              )}
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Error Message:
              </label>
              <code className="block p-2 bg-orange-100 rounded text-sm text-orange-900 break-all">
                {errorDetails.message}
              </code>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Stack Trace:
              </label>
              <pre className="p-2 bg-orange-100 rounded text-xs text-orange-900 overflow-auto max-h-40 whitespace-pre-wrap">
                {errorDetails.stack}
              </pre>
            </div>

            <div>
              <label className="block text-sm font-medium text-orange-800 mb-1">
                Component Stack:
              </label>
              <pre className="p-2 bg-orange-100 rounded text-xs text-orange-900 overflow-auto max-h-32 whitespace-pre-wrap">
                {errorDetails.componentStack}
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-medium text-orange-800">Timestamp:</span>
                <br />
                <span className="text-orange-700">{errorDetails.timestamp}</span>
              </div>
              <div>
                <span className="font-medium text-orange-800">URL:</span>
                <br />
                <span className="text-orange-700 break-all">{errorDetails.url}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevErrorInfo;
