import React from 'react';
import { SentryErrorBoundary } from '../lib/sentry';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
      <Card className="max-w-md mx-auto border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Κάτι πήγε στραβά
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Συνέβη ένα απροσδόκητο σφάλμα. Το σφάλμα έχει αναφερθεί αυτόματα.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              onClick={resetError}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 rounded-xl transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Δοκιμάστε ξανά
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="flex-1 border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-xl transition-all duration-300"
            >
              Αρχική
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <SentryErrorBoundary 
      fallback={({ error, resetError }) => <ErrorFallback error={error as Error} resetError={resetError} />} 
      showDialog
    >
      {children}
    </SentryErrorBoundary>
  );
}