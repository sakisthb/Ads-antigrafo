import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/test-utils'
import { RealTimeDashboard } from '../realtime-dashboard'

// Mock the realtime metrics hook
const mockMetrics = {
  campaigns: {
    total: 5,
    active: 3,
    paused: 1,
    archived: 1
  },
  performance: {
    impressions: 15000,
    clicks: 750,
    spend: 1250.50,
    conversions: 45,
    ctr: 5.0,
    cpc: 1.67,
    cpm: 83.37,
    roas: 3.2
  },
  traffic: {
    current_visitors: 127,
    page_views: 2450,
    bounce_rate: 34.2,
    avg_session_duration: 185
  },
  alerts: [
    {
      id: '1',
      type: 'warning' as const,
      message: 'Campaign "Summer Sale" CTR below threshold',
      timestamp: new Date().toISOString(),
      campaign_id: 'camp_123'
    },
    {
      id: '2', 
      type: 'success' as const,
      message: 'Daily budget target achieved',
      timestamp: new Date().toISOString(),
      campaign_id: 'camp_456'
    }
  ]
}

const mockUseRealTimeMetrics = {
  status: 'connected' as const,
  metrics: mockMetrics,
  error: null,
  lastUpdate: new Date(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  startDemo: vi.fn()
}

vi.mock('@/hooks/use-realtime-metrics', () => ({
  useRealTimeMetrics: () => mockUseRealTimeMetrics
}))

describe('RealTimeDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Connection Status', () => {
    it('shows connected status when connection is active', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/connected/i)).toBeInTheDocument()
      expect(screen.getByText(/real-time analytics/i)).toBeInTheDocument()
    })

    it('shows disconnected status when connection fails', () => {
      const disconnectedMetrics = {
        ...mockUseRealTimeMetrics,
        status: 'disconnected' as const,
        error: 'Connection failed'
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => disconnectedMetrics)
      
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/disconnected/i)).toBeInTheDocument()
      expect(screen.getByText(/connection failed/i)).toBeInTheDocument()
    })

    it('shows connecting status during connection attempt', () => {
      const connectingMetrics = {
        ...mockUseRealTimeMetrics,
        status: 'connecting' as const,
        metrics: null
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => connectingMetrics)
      
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/connecting/i)).toBeInTheDocument()
    })
  })

  describe('Campaign Metrics Display', () => {
    it('displays campaign statistics correctly', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText('5')).toBeInTheDocument() // total campaigns
      expect(screen.getByText('3')).toBeInTheDocument() // active campaigns
      expect(screen.getByText(/total campaigns/i)).toBeInTheDocument()
      expect(screen.getByText(/active campaigns/i)).toBeInTheDocument()
    })

    it('shows campaign status breakdown', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText('1')).toBeInTheDocument() // paused
      expect(screen.getByText('1')).toBeInTheDocument() // archived
    })
  })

  describe('Performance Metrics Display', () => {
    it('displays key performance indicators', () => {
      render(<RealTimeDashboard />)
      
      // Check for formatted numbers
      expect(screen.getByText(/15,000/)).toBeInTheDocument() // impressions
      expect(screen.getByText(/750/)).toBeInTheDocument() // clicks
      expect(screen.getByText(/\$1,250\.50/)).toBeInTheDocument() // spend
      expect(screen.getByText(/45/)).toBeInTheDocument() // conversions
    })

    it('displays calculated metrics with proper formatting', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/5\.0%/)).toBeInTheDocument() // CTR
      expect(screen.getByText(/\$1\.67/)).toBeInTheDocument() // CPC
      expect(screen.getByText(/\$83\.37/)).toBeInTheDocument() // CPM
      expect(screen.getByText(/3\.2x/)).toBeInTheDocument() // ROAS
    })
  })

  describe('Traffic Metrics Display', () => {
    it('displays website traffic information', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText('127')).toBeInTheDocument() // current visitors
      expect(screen.getByText(/2,450/)).toBeInTheDocument() // page views
      expect(screen.getByText(/34\.2%/)).toBeInTheDocument() // bounce rate
    })

    it('formats session duration correctly', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/3m 5s/)).toBeInTheDocument() // 185 seconds = 3m 5s
    })
  })

  describe('Alerts Display', () => {
    it('displays real-time alerts', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/summer sale.*ctr below threshold/i)).toBeInTheDocument()
      expect(screen.getByText(/daily budget target achieved/i)).toBeInTheDocument()
    })

    it('shows different alert types with appropriate styling', () => {
      render(<RealTimeDashboard />)
      
      const warningAlert = screen.getByText(/summer sale.*ctr below threshold/i).closest('[data-alert-type]')
      const successAlert = screen.getByText(/daily budget target achieved/i).closest('[data-alert-type]')
      
      expect(warningAlert).toHaveAttribute('data-alert-type', 'warning')
      expect(successAlert).toHaveAttribute('data-alert-type', 'success')
    })

    it('displays timestamps for alerts', () => {
      render(<RealTimeDashboard />)
      
      // Should show recent timestamps (e.g., "just now", "1m ago")
      expect(screen.getByText(/just now|ago/)).toBeInTheDocument()
    })
  })

  describe('Interactive Controls', () => {
    it('provides connect button when disconnected', () => {
      const disconnectedMetrics = {
        ...mockUseRealTimeMetrics,
        status: 'disconnected' as const
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => disconnectedMetrics)
      
      render(<RealTimeDashboard />)
      
      const connectButton = screen.getByRole('button', { name: /connect/i })
      expect(connectButton).toBeInTheDocument()
    })

    it('provides disconnect button when connected', () => {
      render(<RealTimeDashboard />)
      
      const disconnectButton = screen.getByRole('button', { name: /disconnect/i })
      expect(disconnectButton).toBeInTheDocument()
    })

    it('provides demo data button', () => {
      render(<RealTimeDashboard />)
      
      const demoButton = screen.getByRole('button', { name: /start demo/i })
      expect(demoButton).toBeInTheDocument()
    })

    it('calls appropriate functions when buttons are clicked', async () => {
      render(<RealTimeDashboard />)
      
      const disconnectButton = screen.getByRole('button', { name: /disconnect/i })
      const demoButton = screen.getByRole('button', { name: /start demo/i })
      
      disconnectButton.click()
      demoButton.click()
      
      await waitFor(() => {
        expect(mockUseRealTimeMetrics.disconnect).toHaveBeenCalledTimes(1)
        expect(mockUseRealTimeMetrics.startDemo).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state when metrics are not available', () => {
      const loadingMetrics = {
        ...mockUseRealTimeMetrics,
        status: 'connecting' as const,
        metrics: null
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => loadingMetrics)
      
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/connecting/i)).toBeInTheDocument()
      expect(screen.queryByText(/15,000/)).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error messages when connection fails', () => {
      const errorMetrics = {
        ...mockUseRealTimeMetrics,
        status: 'disconnected' as const,
        error: 'Failed to connect to server',
        metrics: null
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => errorMetrics)
      
      render(<RealTimeDashboard />)
      
      expect(screen.getByText(/failed to connect to server/i)).toBeInTheDocument()
    })
  })

  describe('Animations and Updates', () => {
    it('animates metric changes', async () => {
      const { rerender } = render(<RealTimeDashboard />)
      
      // Update metrics
      const updatedMetrics = {
        ...mockUseRealTimeMetrics,
        metrics: {
          ...mockMetrics,
          performance: {
            ...mockMetrics.performance,
            impressions: 16000 // Updated value
          }
        }
      }
      
      vi.mocked(vi.importActual('@/hooks/use-realtime-metrics')).useRealTimeMetrics = vi.fn(() => updatedMetrics)
      
      rerender(<RealTimeDashboard />)
      
      await waitFor(() => {
        expect(screen.getByText(/16,000/)).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for metrics', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByLabelText(/campaign metrics/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/performance metrics/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/traffic metrics/i)).toBeInTheDocument()
    })

    it('has proper headings structure', () => {
      render(<RealTimeDashboard />)
      
      expect(screen.getByRole('heading', { name: /real-time analytics/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /campaign overview/i })).toBeInTheDocument()
      expect(screen.getByRole('heading', { name: /performance/i })).toBeInTheDocument()
    })
  })
})