import React, { Suspense, lazy, ComponentType } from 'react';
import { Card, CardContent } from './ui/card';
import { Loader2 } from 'lucide-react';

interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <Card className="w-full max-w-sm">
      <CardContent className="flex flex-col items-center gap-4 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Φόρτωση...</p>
      </CardContent>
    </Card>
  </div>
);

export function LazyLoader({ children, fallback }: LazyLoaderProps) {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
}

// Utility function to create lazy components with error boundaries
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyComponentWrapper(props: React.ComponentProps<T>) {
    return (
      <LazyLoader fallback={fallback}>
        <LazyComponent {...props} />
      </LazyLoader>
    );
  };
}

// Example usage:
// const LazyComponent = createLazyComponent(() => import('./MyComponent')); 