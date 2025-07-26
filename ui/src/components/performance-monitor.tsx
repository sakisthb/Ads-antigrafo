import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  totalRenders: number;
  averageDuration: number;
  slowRenders: number;
  lastRenderTime: number;
  performanceScore: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  children: React.ReactNode;
  id: string;
  enabled?: boolean;
}

export function PerformanceMonitor({ children, id, enabled = true }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    totalRenders: 0,
    averageDuration: 0,
    slowRenders: 0,
    lastRenderTime: 0,
    performanceScore: 100
  });
  const [isMonitoring, setIsMonitoring] = useState(enabled);

  const renderStartRef = React.useRef<number | null>(null);
  useEffect(() => {
    if (!isMonitoring) return;
    renderStartRef.current = performance.now();
    return () => {
      if (!isMonitoring) return;
      const endTime = performance.now();
      const duration = endTime - (renderStartRef.current ?? endTime);
      setMetrics(prev => {
        const totalRenders = prev.totalRenders + 1;
        const averageDuration = ((prev.averageDuration * prev.totalRenders) + duration) / totalRenders;
        const slowRenders = prev.slowRenders + (duration > 16 ? 1 : 0);
        const lastRenderTime = Date.now();
        const performanceScore = Math.max(0, 100 - (slowRenders / totalRenders) * 100);
        return {
          ...prev,
          totalRenders,
          averageDuration,
          slowRenders,
          lastRenderTime,
          performanceScore
        };
      });
      if (process.env.NODE_ENV === 'development' && duration > 16) {
        console.warn(`Slow render detected in ${id}:`, {
          duration: `${duration.toFixed(2)}ms`
        });
      }
    };
  }, [isMonitoring]);

  // Monitor memory usage
  useEffect(() => {
    if (!isMonitoring || !('memory' in performance)) return;

    const updateMemoryUsage = () => {
      const memory = (performance as any).memory;
      if (memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
        }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const clearMetrics = () => {
    setMetrics({
      totalRenders: 0,
      averageDuration: 0,
      slowRenders: 0,
      lastRenderTime: 0,
      performanceScore: 100
    });
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-80 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Performance Monitor
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleMonitoring}
                    className="h-6 px-2 text-xs"
                  >
                    {isMonitoring ? 'Pause' : 'Resume'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearMetrics}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Renders:</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.totalRenders}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>Avg:</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.averageDuration.toFixed(1)}ms
                  </Badge>
                </div>
              </div>
              
              {metrics.memoryUsage && (
                <div className="flex items-center gap-1 text-xs">
                  <span>Memory:</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.memoryUsage.toFixed(1)}MB
                  </Badge>
                </div>
              )}
              
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Performance Score</span>
                  <span className="font-medium">{metrics.performanceScore.toFixed(0)}%</span>
                </div>
                <Progress value={metrics.performanceScore} className="h-1" />
              </div>
              
              {metrics.slowRenders > 0 && (
                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{metrics.slowRenders} slow renders detected</span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Last render: {metrics.lastRenderTime ? new Date(metrics.lastRenderTime).toLocaleTimeString() : 'Never'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Hook for performance monitoring
export function usePerformanceMonitor() {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(0);

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    setLastRenderTime(Date.now());
  });

  return {
    renderCount,
    lastRenderTime,
    isDevelopment: process.env.NODE_ENV === 'development'
  };
} 