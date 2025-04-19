import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface EmbedBadgeProps {
  url: string;
  timestamp: string;
}

export function EmbedBadge({ url, timestamp }: EmbedBadgeProps) {
  const [copied, setCopied] = useState(false);

  // Create a unique identifier for the website based on URL and timestamp
  const siteId = btoa(url + timestamp).replace(/[^a-zA-Z0-9]/g, '');
  
  const badgeScript = `<script src="${window.location.origin}/badge.js" data-site-id="${siteId}" async></script>`;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(badgeScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎉 Congratulations! Your site passed all accessibility tests
          </h3>
          <p className="text-sm text-green-700 mb-4">
            Show your commitment to web accessibility by adding this badge to your website
          </p>
        </div>
        <div className="ml-4">
          {/* Preview of how the badge will look */}
          <div className="inline-flex items-center bg-emerald-600 text-white px-3 py-2 rounded-full text-sm font-medium">
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            WCAG 2.1 Compliant
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-white p-3 rounded-md border border-green-100">
        <div className="flex items-center justify-between">
          <code className="text-sm text-gray-800 break-all">{badgeScript}</code>
          <button
            onClick={handleCopy}
            className="ml-4 shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            aria-label={copied ? "Copied to clipboard" : "Copy badge code"}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-600">
        Add this code to your website to display the accessibility compliance badge. The badge will automatically update if your site's accessibility status changes.
      </p>
    </div>
  );
}