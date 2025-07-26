import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { NotificationsProvider } from '@/lib/notifications-context'
import { Toaster } from '@/components/ui/sonner'

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <AuthProvider>
          <NotificationsProvider>
            {children}
            <Toaster />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Helper functions for testing
export const createMockUser = () => ({
  uid: 'test-user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString()
  },
  providerData: [],
  refreshToken: 'mock-refresh-token',
  tenantId: null,
  delete: vi.fn(),
  getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
  getIdTokenResult: vi.fn(),
  reload: vi.fn(),
  toJSON: vi.fn()
})

export const createMockCampaign = () => ({
  id: 'test-campaign-123',
  name: 'Test Campaign',
  status: 'ACTIVE',
  budget: 1000,
  spend: 750,
  impressions: 15000,
  clicks: 500,
  ctr: 3.33,
  cpc: 1.5,
  conversions: 25,
  cpa: 30,
  roas: 2.5,
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  objective: 'CONVERSIONS',
  ad_account_id: 'test-account-123'
})

export const createMockInsights = () => ({
  campaign_id: 'test-campaign-123',
  impressions: 15000,
  clicks: 500,
  spend: 750,
  reach: 12000,
  frequency: 1.25,
  ctr: 3.33,
  cpc: 1.5,
  cpm: 50,
  conversions: 25,
  conversion_rate: 5,
  cost_per_conversion: 30,
  date_start: '2024-01-01',
  date_stop: '2024-01-31'
})

// Mock API responses
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
    redirected: false,
    statusText: status === 200 ? 'OK' : 'Error',
    type: 'basic' as ResponseType,
    url: '',
    clone: vi.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: vi.fn(),
    blob: vi.fn(),
    formData: vi.fn(),
  })
}

// Mock fetch with custom responses
export const mockFetch = (responses: Record<string, any>) => {
  const mockFn = vi.fn((url: string) => {
    const response = responses[url] || responses['default']
    if (!response) {
      return mockApiResponse({ error: 'Not found' }, 404)
    }
    return mockApiResponse(response)
  })
  
  global.fetch = mockFn
  return mockFn
}

// Test helpers for user interactions
export const waitForLoadingToFinish = async () => {
  const { waitForElementToBeRemoved, queryByTestId } = await import('@testing-library/react')
  const loader = queryByTestId(document.body, 'loading-indicator')
  if (loader) {
    await waitForElementToBeRemoved(loader)
  }
}

// Mock logger for tests
export const mockLogger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  critical: vi.fn(),
  withContext: vi.fn(() => mockLogger),
  startTimer: vi.fn(() => vi.fn()),
  userAction: vi.fn(),
  apiRequest: vi.fn(),
  apiResponse: vi.fn(),
  campaignEvent: vi.fn(),
}

// Mock router functions
export const mockNavigate = vi.fn()
export const mockUseLocation = () => ({
  pathname: '/test',
  search: '',
  hash: '',
  state: null,
  key: 'test-key'
})

// Setup mocks for common modules
vi.mock('@/lib/logger', () => ({
  log: mockLogger,
  logger: mockLogger
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: mockUseLocation
  }
})