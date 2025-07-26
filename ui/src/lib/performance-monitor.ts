// Note: web-vitals is not installed, using mock functions for development
const getCLS = (callback: any) => callback({ value: 0, id: 'mock-cls' });
const getFID = (callback: any) => callback({ value: 0, id: 'mock-fid' });
const getFCP = (callback: any) => callback({ value: 0, id: 'mock-fcp' });
const getLCP = (callback: any) => callback({ value: 0, id: 'mock-lcp' });
const getTTFB = (callback: any) => callback({ value: 0, id: 'mock-ttfb' });
const onCLS = (callback: any) => callback({ value: 0, id: 'mock-cls' });
const onFID = (callback: any) => callback({ value: 0, id: 'mock-fid' });
const onFCP = (callback: any) => callback({ value: 0, id: 'mock-fcp' });
const onLCP = (callback: any) => callback({ value: 0, id: 'mock-lcp' });
const onTTFB = (callback: any) => callback({ value: 0, id: 'mock-ttfb' });
import { reportMessage, addBreadcrumb } from './sentry';
import React from 'react';

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private enabled: boolean;

  constructor() {
    this.enabled = import.meta.env.PROD || import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
    
    if (this.enabled) {
      this.initializeWebVitals();
      this.initializeCustomMetrics();
    }
  }

  private initializeWebVitals() {
    // Core Web Vitals
    onCLS(this.handleMetric.bind(this));
    onFID(this.handleMetric.bind(this));
    onFCP(this.handleMetric.bind(this));
    onLCP(this.handleMetric.bind(this));
    onTTFB(this.handleMetric.bind(this));
  }

  private initializeCustomMetrics() {
    // Track navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.trackCustomMetric('DOM_CONTENT_LOADED', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.trackCustomMetric('LOAD_EVENT', navigation.loadEventEnd - navigation.loadEventStart);
        this.trackCustomMetric('DNS_LOOKUP', navigation.domainLookupEnd - navigation.domainLookupStart);
        this.trackCustomMetric('TCP_CONNECTION', navigation.connectEnd - navigation.connectStart);
      }
    });

    // Track resource loading
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          const resource = entry as PerformanceResourceTiming;
          
          // Track slow resources (>1s)
          if (resource.duration > 1000) {
            this.trackCustomMetric('SLOW_RESOURCE', resource.duration, {
              resource: resource.name,
              type: resource.initiatorType
            });
          }
        }
      }
    }).observe({ type: 'resource', buffered: true });

    // Track long tasks
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackCustomMetric('LONG_TASK', entry.duration, {
          startTime: entry.startTime
        });
      }
    }).observe({ type: 'longtask', buffered: true });
  }

  private handleMetric(metric: any) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    };

    this.metrics.push(performanceMetric);
    
    // Report to Sentry if metric is poor
    if (metric.rating === 'poor') {
      reportMessage(`Poor ${metric.name}: ${metric.value}`, 'warning');
    }

    // Add breadcrumb for debugging
    addBreadcrumb(`${metric.name}: ${metric.value}ms (${metric.rating})`, 'performance', {
      value: metric.value,
      rating: metric.rating
    });

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`🔍 Performance: ${metric.name}`, metric);
    }
  }

  private trackCustomMetric(name: string, value: number, data?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      rating: this.getRating(name, value),
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Add breadcrumb
    addBreadcrumb(`${name}: ${value}ms`, 'performance', data);

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`🔍 Custom Metric: ${name}`, { value, data });
    }
  }

  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Custom thresholds for different metrics
    const thresholds: Record<string, { good: number; poor: number }> = {
      'DOM_CONTENT_LOADED': { good: 800, poor: 1800 },
      'LOAD_EVENT': { good: 100, poor: 300 },
      'DNS_LOOKUP': { good: 100, poor: 300 },
      'TCP_CONNECTION': { good: 300, poor: 1000 },
      'SLOW_RESOURCE': { good: 1000, poor: 3000 },
      'LONG_TASK': { good: 50, poor: 300 }
    };

    const threshold = thresholds[name];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  // Public API
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(name: string): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  getAverageMetric(name: string): number | null {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return null;
    
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }

  clearMetrics(): void {
    this.metrics = [];
  }

  // Manual performance tracking
  startTiming(label: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.trackCustomMetric(`CUSTOM_${label.toUpperCase()}`, duration);
    };
  }

  // Track React component render times
  trackComponentRender(componentName: string, renderTime: number): void {
    this.trackCustomMetric(`COMPONENT_${componentName.toUpperCase()}_RENDER`, renderTime);
  }

  // Track API call performance
  trackApiCall(endpoint: string, duration: number, status: number): void {
    this.trackCustomMetric('API_CALL', duration, {
      endpoint,
      status,
      success: status >= 200 && status < 300
    });
  }

  // Get performance summary
  getSummary() {
    const summary = {
      totalMetrics: this.metrics.length,
      byRating: {
        good: this.metrics.filter(m => m.rating === 'good').length,
        needsImprovement: this.metrics.filter(m => m.rating === 'needs-improvement').length,
        poor: this.metrics.filter(m => m.rating === 'poor').length
      },
      coreWebVitals: {},
      customMetrics: {}
    };

    // Group by metric name
    const metricGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.name]) {
        groups[metric.name] = [];
      }
      groups[metric.name].push(metric);
      return groups;
    }, {} as Record<string, PerformanceMetric[]>);

    // Calculate averages for each metric
    Object.entries(metricGroups).forEach(([name, metrics]) => {
      const average = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
      const latest = metrics[metrics.length - 1];
      
      const metricSummary = {
        average: Math.round(average),
        latest: Math.round(latest.value),
        count: metrics.length,
        rating: latest.rating
      };

      if (['CLS', 'FID', 'FCP', 'LCP', 'TTFB'].includes(name)) {
        (summary.coreWebVitals as any)[name] = metricSummary;
      } else {
        (summary.customMetrics as any)[name] = metricSummary;
      }
    });

    return summary;
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return {
    startTiming: performanceMonitor.startTiming.bind(performanceMonitor),
    trackComponentRender: performanceMonitor.trackComponentRender.bind(performanceMonitor),
    trackApiCall: performanceMonitor.trackApiCall.bind(performanceMonitor),
    getMetrics: performanceMonitor.getMetrics.bind(performanceMonitor),
    getSummary: performanceMonitor.getSummary.bind(performanceMonitor)
  };
}

// HOC for tracking component render performance
export function withPerformanceTracking<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string
) {
  const ComponentWithPerformanceTracking = (props: T) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    
    React.useEffect(() => {
      const endTiming = performanceMonitor.startTiming(`${name}_mount`);
      return endTiming;
    }, []);

    return React.createElement(WrappedComponent, props);
  };

  ComponentWithPerformanceTracking.displayName = `withPerformanceTracking(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  
  return ComponentWithPerformanceTracking;
}