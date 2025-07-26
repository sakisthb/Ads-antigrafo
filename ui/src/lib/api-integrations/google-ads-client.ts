// Google Ads API Client - OFFICIAL COMPLIANCE & RATE LIMITS  
// Uses official Google Ads API v14+ with proper authentication to prevent bans
// Reference: https://developers.google.com/google-ads/api/docs/concepts/overview

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';

export interface GoogleAdsCustomer {
  resourceName: string;
  id: string;
  descriptiveName: string;
  currencyCode: string;
  timeZone: string;
  trackingUrlTemplate?: string;
  testAccount: boolean;
  manager: boolean;
}

export interface GoogleAdsCampaign {
  resourceName: string;
  id: string;
  name: string;
  status: string;
  servingStatus: string;
  adServingOptimizationStatus: string;
  advertisingChannelType: string;
  biddingStrategyType: string;
  campaignBudget: string;
  startDate: string;
  endDate?: string;
}

export interface GoogleAdsMetrics {
  impressions: string;
  clicks: string;
  costMicros: string;
  ctr: number;
  averageCpc: string;
  averageCpm: string;
  conversions: number;
  conversionValue: number;
  costPerConversion: number;
  valuePerConversion: number;
  allConversions: number;
  allConversionsValue: number;
}

export interface GoogleAdsReport {
  campaign?: GoogleAdsCampaign;
  metrics: GoogleAdsMetrics;
  segments?: {
    date: string;
    device: string;
    adNetworkType: string;
  };
}

export class GoogleAdsClient extends BaseAPIClient {
  private static readonly API_VERSION = 'v14';
  private static readonly BASE_URL = 'https://googleads.googleapis.com';
  
  // **CRITICAL**: Official Google Ads rate limits
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 1,      // Very conservative for Google Ads
    requestsPerMinute: 15,     // Official quota: 15,000 operations per minute per developer token
    requestsPerHour: 900,      // 15 * 60
    requestsPerDay: 21600,     // 900 * 24
    burstLimit: 5
  };

  private developerToken: string;
  
  constructor(credentials: APICredentials, developerToken: string) {
    super('google-ads', credentials, GoogleAdsClient.RATE_LIMITS);
    this.developerToken = developerToken;
  }

  // **SECURITY**: Official OAuth 2.0 flow
  public static getAuthUrl(clientId: string, redirectUri: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/adwords'  // Read and manage Google Ads accounts
    ].join(' ');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      access_type: 'offline',     // Get refresh token
      prompt: 'consent'           // Force consent screen to get refresh token
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  // **SECURITY**: Exchange authorization code for tokens
  public static async exchangeCodeForTokens(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    code: string
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number } | null> {
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
        grant_type: 'authorization_code'
      });

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const data = await response.json();
      
      if (data.access_token) {
        return {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in || 3600
        };
      }
      
      throw new Error(data.error_description || 'Token exchange failed');
    } catch (error) {
      console.error('Google Ads token exchange error:', error);
      return null;
    }
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      const url = `${GoogleAdsClient.BASE_URL}/${GoogleAdsClient.API_VERSION}${request.endpoint}`;
      
      const headers = {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'developer-token': this.developerToken,
        'Content-Type': 'application/json',
        ...request.headers
      };

      // Add customer ID to headers if available
      if (this.credentials.customerId) {
        headers['login-customer-id'] = this.credentials.customerId;
      }

      const fetchOptions: RequestInit = {
        method: request.method,
        headers
      };

      if (request.body) {
        fetchOptions.body = JSON.stringify(request.body);
      }

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error?.message || `HTTP ${response.status}`) as any;
        error.status = response.status;
        error.code = errorData.error?.code;
        error.headers = Object.fromEntries(response.headers.entries());
        
        // **CRITICAL**: Handle Google Ads specific errors
        if (response.status === 401) {
          console.error('Google Ads API: Invalid credentials - token may need refresh');
        } else if (response.status === 403) {
          console.error('Google Ads API: Access denied - check developer token and permissions');
        } else if (response.status === 429) {
          console.error('Google Ads API: Rate limit exceeded');
        }
        
        throw error;
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        rateLimitRemaining: this.parseRateLimitHeaders(response.headers)
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private parseRateLimitHeaders(headers: Headers): number | undefined {
    // Google Ads doesn't expose rate limit headers directly
    // We'll track internally in our base client
    return undefined;
  }

  protected async performTokenRefresh(): Promise<boolean> {
    if (!this.credentials.refreshToken || !this.credentials.clientId || !this.credentials.clientSecret) {
      return false;
    }

    try {
      const params = new URLSearchParams({
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        refresh_token: this.credentials.refreshToken,
        grant_type: 'refresh_token'
      });

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params
      });

      const data = await response.json();
      
      if (data.access_token) {
        this.credentials.accessToken = data.access_token;
        this.credentials.expiresAt = Date.now() + (data.expires_in * 1000);
        return true;
      }
    } catch (error) {
      console.error('Google Ads token refresh failed:', error);
    }
    
    return false;
  }

  protected getHealthCheckEndpoint(): string {
    return '/customers:listAccessibleCustomers';
  }

  // **API METHODS** - Using Google Ads Query Language (GAQL)

  public async getAccessibleCustomers(): Promise<APIResponse<GoogleAdsCustomer[]>> {
    const response = await this.queueRequest<any>({
      endpoint: '/customers:listAccessibleCustomers',
      method: 'GET'
    });

    if (response.success && response.data?.resourceNames) {
      // Extract customer IDs from resource names
      const customerIds = response.data.resourceNames.map((rn: string) => 
        rn.replace('customers/', '')
      );
      
      // Get detailed customer info
      return this.getCustomerDetails(customerIds);
    }

    return response;
  }

  private async getCustomerDetails(customerIds: string[]): Promise<APIResponse<GoogleAdsCustomer[]>> {
    if (customerIds.length === 0) {
      return { success: true, data: [] };
    }

    const query = `
      SELECT 
        customer.resource_name,
        customer.id,
        customer.descriptive_name,
        customer.currency_code,
        customer.time_zone,
        customer.test_account,
        customer.manager
      FROM customer
      WHERE customer.id IN (${customerIds.map(id => `'${id}'`).join(',')})
    `;

    const results: GoogleAdsCustomer[] = [];
    
    for (const customerId of customerIds) {
      const response = await this.queueRequest<any>({
        endpoint: `/customers/${customerId}/googleAds:search`,
        method: 'POST',
        body: { query }
      });

      if (response.success && response.data?.results) {
        results.push(...response.data.results.map((result: any) => result.customer));
      }
    }

    return { success: true, data: results };
  }

  public async getCampaigns(customerId: string): Promise<APIResponse<GoogleAdsCampaign[]>> {
    const query = `
      SELECT 
        campaign.resource_name,
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.serving_status,
        campaign.ad_serving_optimization_status,
        campaign.advertising_channel_type,
        campaign.bidding_strategy_type,
        campaign.campaign_budget,
        campaign.start_date,
        campaign.end_date
      FROM campaign
      WHERE campaign.status != 'REMOVED'
    `;

    const response = await this.queueRequest<any>({
      endpoint: `/customers/${customerId}/googleAds:search`,
      method: 'POST',
      body: { query }
    });

    if (response.success && response.data?.results) {
      const campaigns = response.data.results.map((result: any) => result.campaign);
      return { success: true, data: campaigns };
    }

    return response;
  }

  public async getCampaignMetrics(
    customerId: string,
    campaignIds?: string[],
    dateRange?: { startDate: string; endDate: string }
  ): Promise<APIResponse<GoogleAdsReport[]>> {
    let query = `
      SELECT 
        campaign.resource_name,
        campaign.id,
        campaign.name,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm,
        metrics.conversions,
        metrics.conversions_value,
        metrics.cost_per_conversion,
        metrics.value_per_conversion,
        metrics.all_conversions,
        metrics.all_conversions_value
      FROM campaign
      WHERE campaign.status != 'REMOVED'
    `;

    if (campaignIds && campaignIds.length > 0) {
      query += ` AND campaign.id IN (${campaignIds.map(id => `'${id}'`).join(',')})`;
    }

    if (dateRange) {
      query += ` AND segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'`;
    }

    const response = await this.queueRequest<any>({
      endpoint: `/customers/${customerId}/googleAds:search`,
      method: 'POST',
      body: { query }
    });

    if (response.success && response.data?.results) {
      const reports = response.data.results.map((result: any) => ({
        campaign: result.campaign,
        metrics: result.metrics,
        segments: result.segments
      }));
      return { success: true, data: reports };
    }

    return response;
  }

  public async getAccountMetrics(
    customerId: string,
    dateRange?: { startDate: string; endDate: string }
  ): Promise<APIResponse<GoogleAdsMetrics>> {
    let query = `
      SELECT 
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm,
        metrics.conversions,
        metrics.conversions_value,
        metrics.cost_per_conversion,
        metrics.value_per_conversion,
        metrics.all_conversions,
        metrics.all_conversions_value
      FROM customer
    `;

    if (dateRange) {
      query += ` WHERE segments.date BETWEEN '${dateRange.startDate}' AND '${dateRange.endDate}'`;
    }

    const response = await this.queueRequest<any>({
      endpoint: `/customers/${customerId}/googleAds:search`,
      method: 'POST',
      body: { query }
    });

    if (response.success && response.data?.results && response.data.results.length > 0) {
      const aggregatedMetrics = this.aggregateMetrics(
        response.data.results.map((result: any) => result.metrics)
      );
      return { success: true, data: aggregatedMetrics };
    }

    return response;
  }

  private aggregateMetrics(metricsArray: GoogleAdsMetrics[]): GoogleAdsMetrics {
    return metricsArray.reduce((acc, metrics) => ({
      impressions: (parseInt(acc.impressions || '0') + parseInt(metrics.impressions || '0')).toString(),
      clicks: (parseInt(acc.clicks || '0') + parseInt(metrics.clicks || '0')).toString(),
      costMicros: (parseInt(acc.costMicros || '0') + parseInt(metrics.costMicros || '0')).toString(),
      ctr: acc.ctr + metrics.ctr,
      averageCpc: acc.averageCpc, // Will need weighted average calculation
      averageCpm: acc.averageCpm, // Will need weighted average calculation
      conversions: acc.conversions + metrics.conversions,
      conversionValue: acc.conversionValue + metrics.conversionValue,
      costPerConversion: acc.costPerConversion, // Will need weighted average
      valuePerConversion: acc.valuePerConversion, // Will need weighted average
      allConversions: acc.allConversions + metrics.allConversions,
      allConversionsValue: acc.allConversionsValue + metrics.allConversionsValue
    }), {
      impressions: '0',
      clicks: '0', 
      costMicros: '0',
      ctr: 0,
      averageCpc: '0',
      averageCpm: '0',
      conversions: 0,
      conversionValue: 0,
      costPerConversion: 0,
      valuePerConversion: 0,
      allConversions: 0,
      allConversionsValue: 0
    });
  }

  // **CRITICAL**: Validate developer token and access
  public async validateDeveloperToken(): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await this.getAccessibleCustomers();
      
      if (response.success) {
        return {
          valid: true,
          message: 'Developer token and access validated successfully'
        };
      } else {
        return {
          valid: false,
          message: `Developer token validation failed: ${response.error}`
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        message: `Developer token validation error: ${error.message}`
      };
    }
  }
}