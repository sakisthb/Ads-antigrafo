import * as Sentry from '@sentry/react';

export function initSentry() {
  // Only initialize Sentry in production or if explicitly enabled
  if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_SENTRY === 'true') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.NODE_ENV || 'development',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0,
      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions will be recorded
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with an error will be recorded
      
      beforeSend(event) {
        // Filter out development errors or non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          
          // Skip common development errors
          if (error?.value?.includes('ResizeObserver loop limit exceeded')) {
            return null;
          }
          
          // Skip network errors in development
          if (import.meta.env.DEV && error?.value?.includes('NetworkError')) {
            return null;
          }
        }
        
        return event;
      },
    });
  }
}

// Error boundary component for React
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Performance monitoring utilities
export const sentryProfiler = Sentry.Profiler;

// Manual error reporting
export function reportError(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.setContext('error_context', context);
  }
  Sentry.captureException(error);
}

// Manual message reporting
export function reportMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

// User identification
export function identifyUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

// Add breadcrumbs for better debugging
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
  Sentry.addBreadcrumb({
    message,
    category: category || 'custom',
    data,
    timestamp: Date.now() / 1000,
  });
}