/**
 * App Provider
 * 
 * Root provider that incorporates all application contexts
 * and providers for a secure and accessible application.
 */

import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '../contexts/AuthContext';
import { SecurityProvider } from './SecurityProvider';
import { ThemeProvider } from './ThemeProvider';
import { AccessibilityTipsProvider } from '../contexts/AccessibilityTipsContext';
import ErrorBoundary from '../components/ErrorBoundary';
import { isDevelopment } from '../utils/environment';

// App provider props
interface AppProviderProps {
  /**
   * Child components
   */
  children: ReactNode;
}

// Create query client for React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: !isDevelopment(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

/**
 * App Provider Component
 * 
 * Top-level provider that wraps the entire application
 */
export function AppProvider({ children }: AppProviderProps): JSX.Element {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <SecurityProvider>
            <BrowserRouter>
              <AuthProvider>
                <AccessibilityTipsProvider>
                  <ThemeProvider>
                    {children}
                  </ThemeProvider>
                </AccessibilityTipsProvider>
              </AuthProvider>
            </BrowserRouter>
          </SecurityProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default AppProvider;