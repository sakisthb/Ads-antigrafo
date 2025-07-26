import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { performanceMonitor, usePerformanceMonitor } from '../performance-monitor';

// Mock web-vitals
vi.mock('web-vitals', () => ({
  getCLS: vi.fn(),
  getFID: vi.fn(),
  getFCP: vi.fn(),
  getLCP: vi.fn(),
  getTTFB: vi.fn(),
  onCLS: vi.fn(),
  onFID: vi.fn(),
  onFCP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));

// Mock Sentry
vi.mock('../sentry', () => ({
  reportMessage: vi.fn(),
  addBreadcrumb: vi.fn(),
}));

describe('Performance Monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    performanceMonitor.clearMetrics();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('trackApiCall', () => {
    it('should track API call performance', () => {
      performanceMonitor.trackApiCall('/api/campaigns', 250, 200);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].name).toBe('API_CALL');
      expect(metrics[0].value).toBe(250);
    });

    it('should track failed API calls', () => {
      performanceMonitor.trackApiCall('/api/error', 500, 500);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics[0].name).toBe('API_CALL');
    });
  });

  describe('trackComponentRender', () => {
    it('should track component render time', () => {
      performanceMonitor.trackComponentRender('Dashboard', 15);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics[0].name).toBe('COMPONENT_DASHBOARD_RENDER');
      expect(metrics[0].value).toBe(15);
    });
  });

  describe('startTiming', () => {
    it('should return a function to end timing', () => {
      const endTiming = performanceMonitor.startTiming('test_operation');
      expect(typeof endTiming).toBe('function');
      
      // End timing
      endTiming();
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics[0].name).toBe('CUSTOM_TEST_OPERATION');
      expect(metrics[0].value).toBeGreaterThan(0);
    });
  });

  describe('getMetricsByName', () => {
    it('should filter metrics by name', () => {
      performanceMonitor.trackApiCall('/api/test1', 100, 200);
      performanceMonitor.trackApiCall('/api/test2', 200, 200);
      performanceMonitor.trackComponentRender('Test', 50);
      
      const apiMetrics = performanceMonitor.getMetricsByName('API_CALL');
      expect(apiMetrics).toHaveLength(2);
      
      const componentMetrics = performanceMonitor.getMetricsByName('COMPONENT_TEST_RENDER');
      expect(componentMetrics).toHaveLength(1);
    });
  });

  describe('getAverageMetric', () => {
    it('should calculate average for metrics', () => {
      performanceMonitor.trackApiCall('/api/test', 100, 200);
      performanceMonitor.trackApiCall('/api/test', 200, 200);
      performanceMonitor.trackApiCall('/api/test', 300, 200);
      
      const average = performanceMonitor.getAverageMetric('API_CALL');
      expect(average).toBe(200);
    });

    it('should return null for non-existent metrics', () => {
      const average = performanceMonitor.getAverageMetric('NON_EXISTENT');
      expect(average).toBe(null);
    });
  });

  describe('getSummary', () => {
    it('should provide performance summary', () => {
      performanceMonitor.trackApiCall('/api/test', 100, 200);
      performanceMonitor.trackComponentRender('Test', 50);
      
      const summary = performanceMonitor.getSummary();
      
      expect(summary.totalMetrics).toBe(2);
      expect(summary.byRating.good).toBeGreaterThanOrEqual(0);
      expect(summary.customMetrics).toBeDefined();
    });
  });

  describe('usePerformanceMonitor hook', () => {
    it('should provide performance monitoring functions', () => {
      const hook = usePerformanceMonitor();
      
      expect(typeof hook.startTiming).toBe('function');
      expect(typeof hook.trackComponentRender).toBe('function');
      expect(typeof hook.trackApiCall).toBe('function');
      expect(typeof hook.getMetrics).toBe('function');
      expect(typeof hook.getSummary).toBe('function');
    });
  });
});