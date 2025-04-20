import React, { PropsWithChildren } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle-fixed';
import { Link } from 'wouter';

interface AppShellProps extends PropsWithChildren {
  title?: string;
}

export function AppShellWithoutSidebar({ children, title = 'AccessWebPro' }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Accessibility Skip Link */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>
      
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary"
              >
                <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                <path d="M7 8h10" />
                <path d="M7 12h10" />
                <path d="M7 16h10" />
              </svg>
              <span className="font-semibold text-lg hidden md:block">
                {title}
              </span>
            </Link>
          </div>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          {/* Right side header items */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* User menu (placeholder) */}
            <button 
              className="rounded-full p-1 hover:bg-accent"
              aria-label="User profile"
            >
              <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">
                <span className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                  U
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>
      
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}