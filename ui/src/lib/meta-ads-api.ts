// Types for Meta Ads API responses
import { log } from './logger';
export interface MetaAdsCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  stop_time?: string;
  daily_budget?: number;
  lifetime_budget?: number;
  budget_remaining?: number;
  spend_cap?: number;
}

export interface MetaAdsInsights {
  campaign_id: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  date_start: string;
  date_stop: string;
}

export interface MetaAdsAdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: string;
  daily_budget?: number;
  lifetime_budget?: number;
  targeting: {
    age_min?: number;
    age_max?: number;
    genders?: number[];
    geo_locations?: {
      countries?: string[];
      regions?: string[];
      cities?: string[];
    };
    interests?: Array<{ id: string; name: string }>;
    behaviors?: Array<{ id: string; name: string }>;
    custom_audiences?: string[];
    lookalike_audiences?: string[];
  };
  optimization_goal: string;
  billing_event: string;
  bid_amount?: number;
}

export interface MetaAdsAd {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: string;
  creative: {
    id: string;
    name: string;
    object_story_spec?: {
      page_id: string;
      link_data?: {
        link: string;
        message: string;
        name: string;
        description: string;
        image_hash: string;
      };
      video_data?: {
        video_id: string;
        message: string;
      };
    };
    image_hash?: string;
    video_id?: string;
  };
  created_time: string;
  updated_time: string;
}

// Backend API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5900/api/v1';

class MetaAdsAPIService {

  constructor() {
    // For backend proxy, we don't need to store tokens in frontend
    // Tokens are managed securely on the backend
  }

  private checkDemoMode(): boolean {
    return localStorage.getItem('demoMode') === 'true';
  }

  async getCampaigns(): Promise<MetaAdsCampaign[]> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      console.log('Demo mode: Using mock campaigns data');
      return this.getMockCampaigns();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/campaigns`);
      
      if (!response.ok) {
        const errorData = await response.json();
        log.error('Backend API error for campaigns', new Error(errorData.message || 'API Error'), {
          component: 'MetaAdsAPI',
          action: 'getCampaigns',
          url: `${API_BASE_URL}/facebook/campaigns`,
          status: response.status
        });
        return this.getMockCampaigns();
      }
      
      const data = await response.json();
      return (data.data || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        status: c.status,
        objective: c.objective,
        created_time: c.created_time,
        updated_time: c.updated_time,
        start_time: c.start_time,
        stop_time: c.stop_time,
        daily_budget: c.daily_budget ? Number(c.daily_budget) : undefined,
        lifetime_budget: c.lifetime_budget ? Number(c.lifetime_budget) : undefined,
        budget_remaining: c.budget_remaining ? Number(c.budget_remaining) : undefined,
        spend_cap: c.spend_cap ? Number(c.spend_cap) : undefined,
      }));
    } catch (error) {
      log.error('Network error fetching campaigns', error as Error, {
        component: 'MetaAdsAPI',
        action: 'getCampaigns'
      });
      return this.getMockCampaigns();
    }
  }

  async getCampaignInsights(campaignId: string, _dateRange: string = 'last_30d'): Promise<MetaAdsInsights[]> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      log.info('Demo mode: Using mock insights data', {
        component: 'MetaAdsAPI',
        action: 'getCampaignInsights',
        campaignId
      });
      return this.getMockInsights(campaignId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/campaigns/${campaignId}/insights`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API error:', errorData);
        return this.getMockInsights(campaignId);
      }
      
      const data = await response.json();
      
      interface InsightAPIResponse {
        data: {
          impressions: string;
          clicks: string;
          spend: string;
          reach: string;
          frequency: string;
          ctr: string;
          cpc: string;
          cpm: string;
          actions?: Array<{ action_type: string; value: string }>;
          date_start?: string;
          date_stop?: string;
        }[];
      }
      
      return (data.data || []).map((insight: InsightAPIResponse['data'][0]) => ({
        campaign_id: campaignId,
        impressions: parseInt(insight.impressions) || 0,
        clicks: parseInt(insight.clicks) || 0,
        spend: parseFloat(insight.spend) || 0,
        reach: parseInt(insight.reach) || 0,
        frequency: parseFloat(insight.frequency) || 0,
        ctr: parseFloat(insight.ctr) || 0,
        cpc: parseFloat(insight.cpc) || 0,
        cpm: parseFloat(insight.cpm) || 0,
        conversions: this.extractConversions(insight.actions || []),
        conversion_rate: this.calculateConversionRate(insight.actions || [], insight.clicks),
        cost_per_conversion: this.calculateCostPerConversion(insight.spend, insight.actions || []),
        actions: insight.actions,
        date_start: insight.date_start,
        date_stop: insight.date_stop
      }));
    } catch (error) {
      console.error('Error fetching campaign insights:', error);
      return this.getMockInsights(campaignId);
    }
  }

  /**
   * Get ad sets for a campaign
   */
  async getAdSets(campaignId: string): Promise<MetaAdsAdSet[]> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      console.log('Demo mode: Using mock ad sets data');
      return this.getMockAdSets(campaignId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/campaigns/${campaignId}/adsets`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API error:', errorData);
        return this.getMockAdSets(campaignId);
      }
      
      const data = await response.json();
      return (data.data || []).map((adSet: any) => ({
        id: adSet.id,
        name: adSet.name,
        campaign_id: campaignId,
        status: adSet.status,
        daily_budget: adSet.daily_budget ? Number(adSet.daily_budget) : undefined,
        lifetime_budget: adSet.lifetime_budget ? Number(adSet.lifetime_budget) : undefined,
        targeting: adSet.targeting,
        optimization_goal: adSet.optimization_goal,
        billing_event: adSet.billing_event,
        bid_amount: adSet.bid_amount ? Number(adSet.bid_amount) : undefined
      }));
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      return this.getMockAdSets(campaignId);
    }
  }

  /**
   * Get ads for an ad set
   */
  async getAds(adSetId: string): Promise<MetaAdsAd[]> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      console.log('Demo mode: Using mock ads data');
      return this.getMockAds(adSetId);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/adsets/${adSetId}/ads`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API error:', errorData);
        return this.getMockAds(adSetId);
      }
      
      const data = await response.json();
      return (data.data || []).map((ad: any) => ({
        id: ad.id,
        name: ad.name,
        adset_id: adSetId,
        campaign_id: ad.campaign_id,
        status: ad.status,
        creative: ad.creative,
        created_time: ad.created_time,
        updated_time: ad.updated_time
      }));
    } catch (error) {
      console.error('Error fetching ads:', error);
      return this.getMockAds(adSetId);
    }
  }

  /**
   * Get account-level insights
   */
  async getAccountInsights(_dateRange: string = 'last_30d'): Promise<MetaAdsInsights[]> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      console.log('Demo mode: Using mock account insights data');
      return this.getMockAccountInsights();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/account/insights`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend API error:', errorData);
        return this.getMockAccountInsights();
      }
      
      const data = await response.json();
      return (data.data || []).map((insight: any) => ({
        campaign_id: insight.campaign_id,
        impressions: parseInt(insight.impressions) || 0,
        clicks: parseInt(insight.clicks) || 0,
        spend: parseFloat(insight.spend) || 0,
        reach: parseInt(insight.reach) || 0,
        frequency: parseFloat(insight.frequency) || 0,
        ctr: parseFloat(insight.ctr) || 0,
        cpc: parseFloat(insight.cpc) || 0,
        cpm: parseFloat(insight.cpm) || 0,
        conversions: this.extractConversions(insight.actions || []),
        conversion_rate: this.calculateConversionRate(insight.actions || [], insight.clicks),
        cost_per_conversion: this.calculateCostPerConversion(insight.spend, insight.actions || []),
        actions: insight.actions,
        date_start: insight.date_start,
        date_stop: insight.date_stop
      }));
    } catch (error) {
      console.error('Error fetching account insights:', error);
      return this.getMockAccountInsights();
    }
  }

  /**
   * Test Facebook connection through backend
   */
  async testConnection(): Promise<{ success: boolean; message: string; campaigns?: number }> {
    // Check if demo mode is enabled
    if (this.checkDemoMode()) {
      console.log('Demo mode: Simulating successful connection test');
      return {
        success: true,
        message: 'Demo mode: Connection test successful (simulated)',
        campaigns: 5
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/facebook/test`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.error || 'Connection test failed'
        };
      }
      
      const data = await response.json();
      return {
        success: data.success,
        message: data.message,
        campaigns: data.campaignsCount
      };
    } catch (error) {
      console.error('Test connection error:', error);
      return {
        success: false,
        message: 'Failed to test connection'
      };
    }
  }

  // Helper methods for data processing
  private extractConversions(actions: Array<{ action_type: string; value: string }>): number {
    if (!actions) return 0;
    const conversionActions = actions.filter((action) => 
      action.action_type === 'purchase' || 
      action.action_type === 'lead' || 
      action.action_type === 'complete_registration'
    );
    return conversionActions.reduce((sum: number, action) => 
      sum + parseInt(action.value || '0'), 0
    );
  }

  private calculateConversionRate(actions: any[], clicks: string): number {
    const conversions = this.extractConversions(actions);
    const clickCount = parseInt(clicks) || 0;
    return clickCount > 0 ? (conversions / clickCount) * 100 : 0;
  }

  private calculateCostPerConversion(spend: string, actions: any[]): number {
    const conversions = this.extractConversions(actions);
    const spendAmount = parseFloat(spend) || 0;
    return conversions > 0 ? spendAmount / conversions : 0;
  }

  // Mock data methods (fallback when API is not configured)
  private getMockCampaigns(): MetaAdsCampaign[] {
    return [
      {
        id: '1',
        name: 'Κυριακή Εκπτώσεις 2024',
        status: 'ACTIVE',
        objective: 'CONVERSIONS',
        created_time: '2024-06-01T00:00:00Z',
        updated_time: '2024-07-02T00:00:00Z',
        start_time: '2024-06-01T00:00:00Z',
        daily_budget: 5000,
        budget_remaining: 1800
      },
      {
        id: '2',
        name: 'Ενεργειακή Ευαισθητοποίηση Q2',
        status: 'ACTIVE',
        objective: 'BRAND_AWARENESS',
        created_time: '2024-04-01T00:00:00Z',
        updated_time: '2024-07-02T00:00:00Z',
        start_time: '2024-04-01T00:00:00Z',
        daily_budget: 3000,
        budget_remaining: 1200
      }
    ];
  }

  private getMockInsights(campaignId: string): MetaAdsInsights[] {
    return [
      {
        campaign_id: campaignId,
        impressions: 45000,
        clicks: 1200,
        spend: 3200,
        reach: 25000,
        frequency: 1.8,
        ctr: 2.67,
        cpc: 2.67,
        cpm: 12.34,
        conversions: 85,
        conversion_rate: 7.08,
        cost_per_conversion: 37.65,
        date_start: '2024-06-01',
        date_stop: '2024-07-02'
      }
    ];
  }

  private getMockAdSets(campaignId: string): MetaAdsAdSet[] {
    return [
      {
        id: `${campaignId}_adset_1`,
        name: 'Ad Set 1',
        campaign_id: campaignId,
        status: 'ACTIVE',
        daily_budget: 2500,
        targeting: {},
        optimization_goal: 'CONVERSIONS',
        billing_event: 'IMPRESSIONS'
      }
    ];
  }

  private getMockAds(adSetId: string): MetaAdsAd[] {
    return [
      {
        id: `${adSetId}_ad_1`,
        name: 'Ad 1',
        adset_id: adSetId,
        campaign_id: '1',
        status: 'ACTIVE',
        creative: {
          id: 'creative_1',
          name: 'Demo Creative'
        },
        created_time: '2024-06-01T00:00:00Z',
        updated_time: '2024-07-02T00:00:00Z'
      }
    ];
  }

  private getMockAccountInsights(): MetaAdsInsights[] {
    return this.getMockInsights('1');
  }
}

const metaAdsApi = new MetaAdsAPIService();
export default metaAdsApi; 