import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PerformanceDashboard } from '../performance-dashboard';

// Mock the performance monitor hook
vi.mock('../../lib/performance-monitor', () => ({
  usePerformanceMonitor: () => ({
    getMetrics: vi.fn().mockReturnValue([
      { name: 'LCP', value: 1200, rating: 'good', timestamp: Date.now() },
      { name: 'FID', value: 85, rating: 'good', timestamp: Date.now() },
      { name: 'CLS', value: 0.05, rating: 'good', timestamp: Date.now() },
    ]),
    getSummary: vi.fn().mockReturnValue({
      totalMetrics: 15,
      byRating: { good: 12, needsImprovement: 2, poor: 1 },
      coreWebVitals: {
        LCP: { latest: 1200, average: 1350, count: 5, rating: 'good' },
        FID: { latest: 85, average: 92, count: 3, rating: 'good' },
        CLS: { latest: 0.05, average: 0.08, count: 4, rating: 'good' },
      },
      customMetrics: {
        DOM_CONTENT_LOADED: { latest: 800, average: 850, count: 3, rating: 'good' },
        API_CALL: { latest: 450, average: 520, count: 8, rating: 'needs-improvement' },
      }
    })
  })
}));

describe('PerformanceDashboard', () => {
  it('renders dashboard title', () => {
    render(<PerformanceDashboard />);
    expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
  });

  it('displays summary cards', async () => {
    render(<PerformanceDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Metrics')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('Good Metrics')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  it('renders tabs for different metric views', async () => {
    render(<PerformanceDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Core Web Vitals')).toBeInTheDocument();
      expect(screen.getByText('Custom Metrics')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });
  });

  it('displays core web vitals', async () => {
    render(<PerformanceDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('LCP')).toBeInTheDocument();
      expect(screen.getByText('FID')).toBeInTheDocument();
      expect(screen.getByText('CLS')).toBeInTheDocument();
    });
  });

  it('switches to custom metrics tab', async () => {
    render(<PerformanceDashboard />);
    
    const customTab = screen.getByText('Custom Metrics');
    fireEvent.click(customTab);
    
    await waitFor(() => {
      expect(screen.getByText('DOM CONTENT LOADED')).toBeInTheDocument();
      expect(screen.getByText('API CALL')).toBeInTheDocument();
    });
  });

  it('has refresh button that can be clicked', async () => {
    render(<PerformanceDashboard />);
    
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
    
    fireEvent.click(refreshButton);
    // Button should be clickable without error
  });

  it('shows loading state initially', () => {
    // Mock empty summary to simulate loading
    vi.doMock('../../lib/performance-monitor', () => ({
      usePerformanceMonitor: () => ({
        getMetrics: vi.fn().mockReturnValue([]),
        getSummary: vi.fn().mockReturnValue(null)
      })
    }));
    
    render(<PerformanceDashboard />);
    expect(screen.getByText('Loading performance data...')).toBeInTheDocument();
  });
});