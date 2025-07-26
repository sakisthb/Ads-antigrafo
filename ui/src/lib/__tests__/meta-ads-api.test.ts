import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockFetch, mockApiResponse, createMockCampaign, createMockInsights } from '@/test/test-utils'

// Import the service
const MetaAdsAPIService = await import('../meta-ads-api').then(m => m.default)

describe('MetaAdsAPIService', () => {
  let service: any
  const originalLocalStorage = global.localStorage

  beforeEach(() => {
    service = new MetaAdsAPIService()
    vi.clearAllMocks()
    
    // Reset localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    global.localStorage = originalLocalStorage
  })

  describe('Demo Mode Detection', () => {
    it('detects demo mode when localStorage flag is set', () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      expect(service.checkDemoMode()).toBe(true)
    })

    it('returns false when demo mode is not set', () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      expect(service.checkDemoMode()).toBe(false)
    })
  })

  describe('getCampaigns', () => {
    it('returns mock data in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      
      const campaigns = await service.getCampaigns()
      
      expect(Array.isArray(campaigns)).toBe(true)
      expect(campaigns.length).toBeGreaterThan(0)
      expect(campaigns[0]).toHaveProperty('id')
      expect(campaigns[0]).toHaveProperty('name')
      expect(campaigns[0]).toHaveProperty('status')
    })

    it('makes API call when not in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      const mockCampaign = createMockCampaign()
      mockFetch({
        'http://localhost:5900/api/v1/facebook/campaigns': {
          data: [mockCampaign]
        }
      })

      const campaigns = await service.getCampaigns()
      
      expect(fetch).toHaveBeenCalledWith('http://localhost:5900/api/v1/facebook/campaigns')
      expect(campaigns).toHaveLength(1)
      expect(campaigns[0].id).toBe(mockCampaign.id)
    })

    it('falls back to mock data on API error', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      mockFetch({
        'http://localhost:5900/api/v1/facebook/campaigns': {
          error: 'API Error'
        }
      })
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const campaigns = await service.getCampaigns()
      
      expect(Array.isArray(campaigns)).toBe(true)
      expect(campaigns.length).toBeGreaterThan(0)
    })

    it('handles API response errors gracefully', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' })
      })

      const campaigns = await service.getCampaigns()
      
      expect(Array.isArray(campaigns)).toBe(true)
      expect(campaigns.length).toBeGreaterThan(0) // Should return mock data
    })
  })

  describe('getCampaignInsights', () => {
    const campaignId = 'test-campaign-123'

    it('returns mock insights in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      
      const insights = await service.getCampaignInsights(campaignId)
      
      expect(Array.isArray(insights)).toBe(true)
      expect(insights.length).toBeGreaterThan(0)
      expect(insights[0]).toHaveProperty('campaign_id', campaignId)
      expect(insights[0]).toHaveProperty('impressions')
      expect(insights[0]).toHaveProperty('clicks')
      expect(insights[0]).toHaveProperty('spend')
    })

    it('makes API call for insights when not in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      const mockInsights = createMockInsights()
      mockFetch({
        [`http://localhost:5900/api/v1/facebook/campaigns/${campaignId}/insights`]: {
          data: [mockInsights]
        }
      })

      const insights = await service.getCampaignInsights(campaignId)
      
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5900/api/v1/facebook/campaigns/${campaignId}/insights?date_range=last_30d`
      )
      expect(insights).toHaveLength(1)
      expect(insights[0].campaign_id).toBe(campaignId)
    })

    it('handles insights API errors gracefully', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      const insights = await service.getCampaignInsights(campaignId)
      
      expect(Array.isArray(insights)).toBe(true)
      expect(insights.length).toBeGreaterThan(0)
      expect(insights[0].campaign_id).toBe(campaignId)
    })
  })

  describe('Helper Methods', () => {
    it('extracts conversions from actions array', () => {
      const actions = [
        { action_type: 'purchase', value: '10' },
        { action_type: 'click', value: '100' },
        { action_type: 'lead', value: '5' },
        { action_type: 'complete_registration', value: '3' }
      ]

      const conversions = service.extractConversions(actions)
      expect(conversions).toBe(18) // 10 + 5 + 3
    })

    it('handles empty actions array', () => {
      const conversions = service.extractConversions([])
      expect(conversions).toBe(0)
    })

    it('handles null actions', () => {
      const conversions = service.extractConversions(null)
      expect(conversions).toBe(0)
    })

    it('calculates conversion rate correctly', () => {
      const actions = [{ action_type: 'purchase', value: '10' }]
      const clicks = '100'

      const conversionRate = service.calculateConversionRate(actions, clicks)
      expect(conversionRate).toBe(10) // 10 conversions / 100 clicks * 100
    })

    it('handles zero clicks for conversion rate', () => {
      const actions = [{ action_type: 'purchase', value: '10' }]
      const clicks = '0'

      const conversionRate = service.calculateConversionRate(actions, clicks)
      expect(conversionRate).toBe(0)
    })

    it('calculates cost per conversion correctly', () => {
      const spend = '100'
      const actions = [{ action_type: 'purchase', value: '10' }]

      const costPerConversion = service.calculateCostPerConversion(spend, actions)
      expect(costPerConversion).toBe(10) // 100 spend / 10 conversions
    })

    it('handles zero conversions for cost per conversion', () => {
      const spend = '100'
      const actions: any[] = []

      const costPerConversion = service.calculateCostPerConversion(spend, actions)
      expect(costPerConversion).toBe(0)
    })
  })

  describe('getAdSets', () => {
    const campaignId = 'test-campaign-123'

    it('returns mock ad sets in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      
      const adSets = await service.getAdSets(campaignId)
      
      expect(Array.isArray(adSets)).toBe(true)
      expect(adSets.length).toBeGreaterThan(0)
      expect(adSets[0]).toHaveProperty('id')
      expect(adSets[0]).toHaveProperty('campaign_id', campaignId)
    })

    it('makes API call for ad sets when not in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue(null)
      
      mockFetch({
        [`http://localhost:5900/api/v1/facebook/campaigns/${campaignId}/adsets`]: {
          data: [{
            id: 'adset-123',
            name: 'Test AdSet',
            campaign_id: campaignId,
            status: 'ACTIVE'
          }]
        }
      })

      const adSets = await service.getAdSets(campaignId)
      
      expect(fetch).toHaveBeenCalledWith(
        `http://localhost:5900/api/v1/facebook/campaigns/${campaignId}/adsets`
      )
      expect(adSets).toHaveLength(1)
      expect(adSets[0].campaign_id).toBe(campaignId)
    })
  })

  describe('getAds', () => {
    const adSetId = 'test-adset-123'

    it('returns mock ads in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      
      const ads = await service.getAds(adSetId)
      
      expect(Array.isArray(ads)).toBe(true)
      expect(ads.length).toBeGreaterThan(0)
      expect(ads[0]).toHaveProperty('id')
      expect(ads[0]).toHaveProperty('adset_id', adSetId)
      expect(ads[0]).toHaveProperty('creative')
      expect(ads[0].creative).toHaveProperty('id')
      expect(ads[0].creative).toHaveProperty('name')
    })
  })

  describe('getAccountInsights', () => {
    it('returns mock account insights in demo mode', async () => {
      global.localStorage.getItem = vi.fn().mockReturnValue('true')
      
      const insights = await service.getAccountInsights()
      
      expect(Array.isArray(insights)).toBe(true)
      expect(insights.length).toBeGreaterThan(0)
      expect(insights[0]).toHaveProperty('impressions')
      expect(insights[0]).toHaveProperty('clicks')
      expect(insights[0]).toHaveProperty('spend')
    })
  })
})