import type { Meta, StoryObj } from '@storybook/react';
import { PerformanceDashboard } from '../components/performance-dashboard';

const meta: Meta<typeof PerformanceDashboard> = {
  title: 'Components/PerformanceDashboard',
  component: PerformanceDashboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive dashboard for monitoring application performance metrics including Core Web Vitals and custom metrics.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'The default performance dashboard showing real-time metrics from the application.',
      },
    },
  },
};

export const WithMockData: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Performance dashboard with mock data for demonstration purposes.',
      },
    },
  },
  decorators: [
    (Story) => {
      // Mock performance data for Storybook
      const mockPerformanceMonitor = {
        getMetrics: () => [
          { name: 'LCP', value: 1200, rating: 'good', timestamp: Date.now() },
          { name: 'FID', value: 85, rating: 'good', timestamp: Date.now() },
          { name: 'CLS', value: 0.05, rating: 'good', timestamp: Date.now() },
        ],
        getSummary: () => ({
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
      };
      
      // This would normally require mocking the performance monitor context
      return <Story />;
    }
  ]
};