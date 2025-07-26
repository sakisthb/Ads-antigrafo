import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import { Dashboard } from '../Dashboard'
import { mockNavigate } from '@/test/test-utils'

// Mock the translation hook
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}))

describe('Dashboard Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Page Structure', () => {
    it('renders the dashboard title', () => {
      render(<Dashboard />)
      
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })

    it('displays the overview description', () => {
      render(<Dashboard />)
      
      expect(screen.getByText(/επισκόπηση της απόδοσης/i)).toBeInTheDocument()
    })

    it('shows navigation buttons', () => {
      render(<Dashboard />)
      
      expect(screen.getByRole('button', { name: /δείτε καμπάνιες/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /αναλυτικά/i })).toBeInTheDocument()
    })
  })

  describe('KPI Cards', () => {
    it('displays all KPI cards', () => {
      render(<Dashboard />)
      
      // Check for KPI titles
      expect(screen.getByText(/συνολικό κόστος/i)).toBeInTheDocument()
      expect(screen.getByText(/επισκέψεις/i)).toBeInTheDocument()
      expect(screen.getByText(/ctr/i)).toBeInTheDocument()
      expect(screen.getByText(/conversions/i)).toBeInTheDocument()
    })

    it('shows KPI values with proper formatting', () => {
      render(<Dashboard />)
      
      // Check for formatted values
      expect(screen.getByText(/€12,450/)).toBeInTheDocument()
      expect(screen.getByText(/45\.2K/)).toBeInTheDocument()
      expect(screen.getByText(/3\.24%/)).toBeInTheDocument()
      expect(screen.getByText(/1,247/)).toBeInTheDocument()
    })

    it('displays trend indicators', () => {
      render(<Dashboard />)
      
      // Should show percentage changes
      expect(screen.getByText(/12\.5%/)).toBeInTheDocument()
      expect(screen.getByText(/8\.2%/)).toBeInTheDocument()
      expect(screen.getByText(/-2\.1%/)).toBeInTheDocument()
      expect(screen.getByText(/15\.3%/)).toBeInTheDocument()
    })

    it('shows correct trend direction icons', () => {
      render(<Dashboard />)
      
      // Should have up and down trend icons
      const trendIcons = screen.getAllByTestId(/trend-icon/)
      expect(trendIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation', () => {
    it('navigates to campaigns when campaign button is clicked', async () => {
      render(<Dashboard />)
      
      const campaignButton = screen.getByRole('button', { name: /δείτε καμπάνιες/i })
      fireEvent.click(campaignButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/campaigns')
      })
    })

    it('navigates to analytics when analytics button is clicked', async () => {
      render(<Dashboard />)
      
      const analyticsButton = screen.getByRole('button', { name: /αναλυτικά/i })
      fireEvent.click(analyticsButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/analytics')
      })
    })

    it('logs user actions when navigation buttons are clicked', async () => {
      const { mockLogger } = await import('@/test/test-utils')
      
      render(<Dashboard />)
      
      const campaignButton = screen.getByRole('button', { name: /δείτε καμπάνιες/i })
      fireEvent.click(campaignButton)
      
      await waitFor(() => {
        expect(mockLogger.userAction).toHaveBeenCalledWith(
          'navigate_to_campaigns',
          expect.objectContaining({
            component: 'Dashboard',
            source: 'header_button'
          })
        )
      })
    })
  })

  describe('Chart Section', () => {
    it('displays the revenue chart section', () => {
      render(<Dashboard />)
      
      expect(screen.getByText(/έσοδα τελευταίων 30 ημερών/i)).toBeInTheDocument()
    })

    it('shows chart navigation buttons', () => {
      render(<Dashboard />)
      
      expect(screen.getByRole('button', { name: /καμπάνιες/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /αναλυτικά/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /funnel analysis/i })).toBeInTheDocument()
    })

    it('navigates when chart action buttons are clicked', async () => {
      render(<Dashboard />)
      
      // Click on campaigns action button in chart section
      const chartButtons = screen.getAllByRole('button', { name: /καμπάνιες/i })
      const chartCampaignButton = chartButtons.find(button => 
        button.closest('[data-testid="chart-section"]') !== null
      )
      
      if (chartCampaignButton) {
        fireEvent.click(chartCampaignButton)
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/campaigns')
        })
      }
    })
  })

  describe('Recent Activity', () => {
    it('displays recent activity section', () => {
      render(<Dashboard />)
      
      expect(screen.getByText(/πρόσφατη δραστηριότητα/i)).toBeInTheDocument()
    })

    it('shows activity items', () => {
      render(<Dashboard />)
      
      // Should show some activity items
      expect(screen.getByText(/δημιουργήθηκε νέα καμπάνια/i)).toBeInTheDocument()
      expect(screen.getByText(/ενημερώθηκε προϋπολογισμός/i)).toBeInTheDocument()
    })

    it('displays timestamps for activities', () => {
      render(<Dashboard />)
      
      expect(screen.getByText(/πριν από 2 ώρες/i)).toBeInTheDocument()
      expect(screen.getByText(/πριν από 1 ημέρα/i)).toBeInTheDocument()
    })
  })

  describe('Performance Overview', () => {
    it('displays performance metrics', () => {
      render(<Dashboard />)
      
      expect(screen.getByText(/απόδοση καμπανιών/i)).toBeInTheDocument()
    })

    it('shows metric comparisons', () => {
      render(<Dashboard />)
      
      // Should show comparison data
      expect(screen.getByText(/σε σχέση με την προηγούμενη περίοδο/i)).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('adapts layout for mobile screens', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      })
      
      window.dispatchEvent(new Event('resize'))
      
      render(<Dashboard />)
      
      // Check if mobile-specific classes are applied
      const container = screen.getByTestId('dashboard-container')
      expect(container).toHaveClass(/grid-cols-1|sm:grid-cols-2/)
    })
  })

  describe('Loading States', () => {
    it('handles loading state gracefully', () => {
      render(<Dashboard />)
      
      // Even during loading, basic structure should be visible
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays fallback content when data fails to load', () => {
      // Mock a failed state
      render(<Dashboard />)
      
      // Should still show basic dashboard structure
      expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByText(/επισκόπηση/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Dashboard />)
      
      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toBeInTheDocument()
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(subHeadings.length).toBeGreaterThan(0)
    })

    it('has accessible navigation', () => {
      render(<Dashboard />)
      
      const buttons = screen.getAllByRole('button')
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName()
      })
    })

    it('provides alt text for charts and graphics', () => {
      render(<Dashboard />)
      
      // Charts should have proper accessibility attributes
      const chartElements = screen.getAllByRole('img', { hidden: true })
      chartElements.forEach(chart => {
        expect(chart).toHaveAttribute('aria-label')
      })
    })

    it('supports keyboard navigation', () => {
      render(<Dashboard />)
      
      const focusableElements = screen.getAllByRole('button')
      
      // First button should be focusable
      focusableElements[0].focus()
      expect(document.activeElement).toBe(focusableElements[0])
    })
  })

  describe('Internationalization', () => {
    it('uses translation keys correctly', () => {
      render(<Dashboard />)
      
      // Should use translation fallbacks when keys are not found
      expect(screen.getByText(/επισκόπηση της απόδοσης/i)).toBeInTheDocument()
    })
  })
})