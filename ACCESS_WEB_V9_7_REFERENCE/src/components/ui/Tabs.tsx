import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  tabs: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
  className?: string;
  defaultTabId?: string;
}

export function Tabs({ tabs, className, defaultTabId }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);

  return (
    <div className={cn('', className)}>
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'py-3 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
              )}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="pt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(activeTab === tab.id ? 'block' : 'hidden')}
            role="tabpanel"
            aria-labelledby={`${tab.id}-tab`}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}