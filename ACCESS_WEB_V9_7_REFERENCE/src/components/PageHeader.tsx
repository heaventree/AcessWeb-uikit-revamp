import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-5">
      <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex-shrink-0 mt-4 sm:ml-4 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}