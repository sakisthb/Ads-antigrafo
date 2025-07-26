// Integration Manager - Centralized & Secure API Management
// Manages all platform integrations with security and compliance at the core

import { MetaAdsClient } from './meta-ads-client';
import { GoogleAdsClient } from './google-ads-client';
import { GoogleAnalyticsClient } from './google-analytics-client';
import { WooCommerceClient } from './woocommerce-client';
import { TikTokAdsClient } from './tiktok-ads-client';
import { APICredentials, APIResponse } from './base-api-client';

export type PlatformType = 'meta' | 'google-ads' | 'google-analytics' | 'tiktok' | 'woocommerce';

export interface PlatformStatus {
  platform: PlatformType;
  connected: boolean;
  lastSync: Date | null;
  error: string | null;
  accountInfo?: any;
}

export interface UnifiedCampaignData {
  id: string;
  name: string;
  platform: PlatformType;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: string;
  endDate?: string;
}

export interface UnifiedMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  overallROAS: number;
  platformBreakdown: Array<{
    platform: PlatformType;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
  }>;
}

export class IntegrationManager {
  private clients: Map<PlatformType, any> = new Map();
  private connectionStatus: Map<PlatformType, PlatformStatus> = new Map();

  constructor() {
    this.initializeStatusMap();
  }

  private initializeStatusMap(): void {
    const platforms: PlatformType[] = ['meta', 'google-ads', 'google-analytics', 'tiktok', 'woocommerce'];
    
    platforms.forEach(platform => {
      this.connectionStatus.set(platform, {
        platform,
        connected: false,
        lastSync: null,
        error: null
      });
    });
  }

  // **SECURITY**: Connect to Meta Ads with proper credentials
  public async connectMeta(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    try {
      const client = new MetaAdsClient(credentials);
      const testResult = await client.testConnection();
      
      if (testResult.success) {
        this.clients.set('meta', client);
        this.updateConnectionStatus('meta', {
          connected: true,
          lastSync: new Date(),
          error: null
        });
        
        // Get account info
        const accountsResponse = await client.getAdAccounts();
        if (accountsResponse.success) {
          this.updateConnectionStatus('meta', {
            accountInfo: accountsResponse.data
          });
        }
        
        return { success: true, message: 'Meta Ads connected successfully' };
      } else {
        this.updateConnectionStatus('meta', {
          connected: false,
          error: testResult.message
        });
        return { success: false, message: testResult.message };
      }
    } catch (error: any) {
      this.updateConnectionStatus('meta', {
        connected: false,
        error: error.message
      });
      return { success: false, message: error.message };
    }
  }

  // **SECURITY**: Connect to Google Ads with developer token
  public async connectGoogleAds(credentials: APICredentials, developerToken: string): Promise<{ success: boolean; message: string }> {
    try {
      const client = new GoogleAdsClient(credentials, developerToken);
      const testResult = await client.testConnection();
      
      if (testResult.success) {
        this.clients.set('google-ads', client);
        this.updateConnectionStatus('google-ads', {
          connected: true,
          lastSync: new Date(),
          error: null
        });
        
        // Get accessible customers
        const customersResponse = await client.getAccessibleCustomers();
        if (customersResponse.success) {
          this.updateConnectionStatus('google-ads', {
            accountInfo: customersResponse.data
          });
        }
        
        return { success: true, message: 'Google Ads connected successfully' };
      } else {
        this.updateConnectionStatus('google-ads', {
          connected: false,
          error: testResult.message
        });
        return { success: false, message: testResult.message };
      }
    } catch (error: any) {
      this.updateConnectionStatus('google-ads', {
        connected: false,
        error: error.message
      });
      return { success: false, message: error.message };
    }
  }

  // **SECURITY**: Connect to Google Analytics
  public async connectGoogleAnalytics(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    try {
      const client = new GoogleAnalyticsClient(credentials);
      const testResult = await client.testConnection();
      
      if (testResult.success) {
        this.clients.set('google-analytics', client);
        this.updateConnectionStatus('google-analytics', {
          connected: true,
          lastSync: new Date(),
          error: null
        });
        
        // Get properties
        const propertiesResponse = await client.getProperties();
        if (propertiesResponse.success) {
          this.updateConnectionStatus('google-analytics', {
            accountInfo: propertiesResponse.data
          });
        }
        
        return { success: true, message: 'Google Analytics connected successfully' };
      } else {
        this.updateConnectionStatus('google-analytics', {
          connected: false,
          error: testResult.message
        });
        return { success: false, message: testResult.message };
      }
    } catch (error: any) {
      this.updateConnectionStatus('google-analytics', {
        connected: false,
        error: error.message
      });
      return { success: false, message: error.message };
    }
  }

  // **SECURITY**: Connect to TikTok Ads
  public async connectTikTok(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    try {
      const client = new TikTokAdsClient(credentials);
      const testResult = await client.testConnection();
      
      if (testResult.success) {
        this.clients.set('tiktok', client);
        this.updateConnectionStatus('tiktok', {
          connected: true,
          lastSync: new Date(),
          error: null
        });
        
        // Get advertisers
        const advertisersResponse = await client.getAdvertisers();
        if (advertisersResponse.success) {
          this.updateConnectionStatus('tiktok', {
            accountInfo: advertisersResponse.data
          });
        }
        
        return { success: true, message: 'TikTok Ads connected successfully' };
      } else {
        this.updateConnectionStatus('tiktok', {
          connected: false,
          error: testResult.message
        });
        return { success: false, message: testResult.message };
      }
    } catch (error: any) {
      this.updateConnectionStatus('tiktok', {
        connected: false,
        error: error.message
      });
      return { success: false, message: error.message };
    }
  }

  // **SECURITY**: Connect to WooCommerce
  public async connectWooCommerce(credentials: APICredentials): Promise<{ success: boolean; message: string }> {
    try {
      const client = new WooCommerceClient(credentials);
      const testResult = await client.testConnection();
      
      if (testResult.success) {
        this.clients.set('woocommerce', client);
        this.updateConnectionStatus('woocommerce', {
          connected: true,
          lastSync: new Date(),
          error: null
        });
        
        // Get system status
        const statusResponse = await client.getSystemStatus();
        if (statusResponse.success) {
          this.updateConnectionStatus('woocommerce', {
            accountInfo: statusResponse.data
          });
        }
        
        return { success: true, message: 'WooCommerce connected successfully' };
      } else {
        this.updateConnectionStatus('woocommerce', {
          connected: false,
          error: testResult.message
        });
        return { success: false, message: testResult.message };
      }
    } catch (error: any) {
      this.updateConnectionStatus('woocommerce', {
        connected: false,
        error: error.message
      });
      return { success: false, message: error.message };
    }
  }

  private updateConnectionStatus(platform: PlatformType, updates: Partial<PlatformStatus>): void {
    const current = this.connectionStatus.get(platform);
    if (current) {
      this.connectionStatus.set(platform, { ...current, ...updates });
    }
  }

  // **UNIFIED DATA RETRIEVAL**

  public async getAllCampaigns(dateRange?: { startDate: string; endDate: string }): Promise<UnifiedCampaignData[]> {
    const allCampaigns: UnifiedCampaignData[] = [];

    // Meta Ads Campaigns
    const metaClient = this.clients.get('meta');
    if (metaClient) {
      try {
        const accountsResponse = await metaClient.getAdAccounts();
        if (accountsResponse.success && accountsResponse.data) {
          for (const account of accountsResponse.data) {
            const campaignsResponse = await metaClient.getCampaigns(account.id);
            if (campaignsResponse.success && campaignsResponse.data) {
              const campaigns = campaignsResponse.data.map((campaign: any) => this.transformMetaCampaign(campaign));
              allCampaigns.push(...campaigns);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Meta campaigns:', error);
      }
    }

    // Google Ads Campaigns
    const googleAdsClient = this.clients.get('google-ads');
    if (googleAdsClient) {
      try {
        const customersResponse = await googleAdsClient.getAccessibleCustomers();
        if (customersResponse.success && customersResponse.data) {
          for (const customer of customersResponse.data) {
            const campaignsResponse = await googleAdsClient.getCampaigns(customer.id);
            if (campaignsResponse.success && campaignsResponse.data) {
              const campaigns = campaignsResponse.data.map((campaign: any) => this.transformGoogleAdsCampaign(campaign));
              allCampaigns.push(...campaigns);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching Google Ads campaigns:', error);
      }
    }

    // TikTok Ads Campaigns
    const tiktokClient = this.clients.get('tiktok');
    if (tiktokClient) {
      try {
        const advertisersResponse = await tiktokClient.getAdvertisers();
        if (advertisersResponse.success && advertisersResponse.data) {
          for (const advertiser of advertisersResponse.data) {
            const campaignsResponse = await tiktokClient.getCampaigns(advertiser.advertiser_id);
            if (campaignsResponse.success && campaignsResponse.data) {
              const campaigns = campaignsResponse.data.map((campaign: any) => this.transformTikTokCampaign(campaign));
              allCampaigns.push(...campaigns);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching TikTok campaigns:', error);
      }
    }

    return allCampaigns;
  }

  public async getUnifiedMetrics(dateRange: { startDate: string; endDate: string }): Promise<UnifiedMetrics> {
    const platformMetrics: Array<{
      platform: PlatformType;
      spend: number;
      impressions: number;
      clicks: number;
      conversions: number;
      roas: number;
    }> = [];

    // Collect metrics from each platform
    for (const [platform, client] of this.clients.entries()) {
      try {
        const metrics = await this.getPlatformMetrics(platform, client, dateRange);
        if (metrics) {
          platformMetrics.push(metrics);
        }
      } catch (error) {
        console.error(`Error fetching metrics for ${platform}:`, error);
      }
    }

    // Calculate unified totals
    const totals = platformMetrics.reduce(
      (acc, metrics) => ({
        totalSpend: acc.totalSpend + metrics.spend,
        totalImpressions: acc.totalImpressions + metrics.impressions,
        totalClicks: acc.totalClicks + metrics.clicks,
        totalConversions: acc.totalConversions + metrics.conversions
      }),
      { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0 }
    );

    return {
      ...totals,
      averageCTR: totals.totalImpressions > 0 ? (totals.totalClicks / totals.totalImpressions) * 100 : 0,
      averageCPC: totals.totalClicks > 0 ? totals.totalSpend / totals.totalClicks : 0,
      overallROAS: totals.totalSpend > 0 ? (totals.totalConversions * 50) / totals.totalSpend : 0, // Assuming avg order value
      platformBreakdown: platformMetrics
    };
  }

  private async getPlatformMetrics(platform: PlatformType, client: any, dateRange: { startDate: string; endDate: string }) {
    // This would be implemented per platform
    // For now, returning mock structure
    return {
      platform,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      roas: 0
    };
  }

  // **TRANSFORMATION METHODS**

  private transformMetaCampaign(campaign: any): UnifiedCampaignData {
    return {
      id: campaign.id,
      name: campaign.name,
      platform: 'meta',
      status: campaign.status,
      budget: parseFloat(campaign.daily_budget || campaign.lifetime_budget || '0'),
      spend: 0, // Would need insights data
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
      startDate: campaign.created_time,
      endDate: campaign.stop_time
    };
  }

  private transformGoogleAdsCampaign(campaign: any): UnifiedCampaignData {
    return {
      id: campaign.id,
      name: campaign.name,
      platform: 'google-ads',
      status: campaign.status,
      budget: 0, // Would need budget resource
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
      startDate: campaign.start_date,
      endDate: campaign.end_date
    };
  }

  private transformTikTokCampaign(campaign: any): UnifiedCampaignData {
    return {
      id: campaign.campaign_id,
      name: campaign.campaign_name,
      platform: 'tiktok',
      status: campaign.status,
      budget: campaign.budget || 0,
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      roas: 0,
      startDate: campaign.create_time,
      endDate: campaign.schedule_end_time
    };
  }

  // **UTILITY METHODS**

  public getConnectionStatus(): Map<PlatformType, PlatformStatus> {
    return new Map(this.connectionStatus);
  }

  public isConnected(platform: PlatformType): boolean {
    return this.connectionStatus.get(platform)?.connected || false;
  }

  public getConnectedPlatforms(): PlatformType[] {
    return Array.from(this.connectionStatus.entries())
      .filter(([_, status]) => status.connected)
      .map(([platform, _]) => platform);
  }

  public disconnect(platform: PlatformType): void {
    if (this.clients.has(platform)) {
      const client = this.clients.get(platform);
      if (client && typeof client.disconnect === 'function') {
        client.disconnect();
      }
      this.clients.delete(platform);
    }
    
    this.updateConnectionStatus(platform, {
      connected: false,
      lastSync: null,
      error: null,
      accountInfo: undefined
    });
  }

  public disconnectAll(): void {
    const platforms = Array.from(this.clients.keys());
    platforms.forEach(platform => this.disconnect(platform));
  }
}

// Singleton instance
export const integrationManager = new IntegrationManager();