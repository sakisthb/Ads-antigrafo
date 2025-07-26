// TikTok Ads API Client - OFFICIAL COMPLIANCE & RATE LIMITS
// Uses official TikTok Marketing API v1.3+ with proper authentication
// Reference: https://ads.tiktok.com/marketing_api/docs

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';

export interface TikTokAdvertiser {
  advertiser_id: string;
  advertiser_name: string;
  address: string;
  brand: string;
  company: string;
  contacter: string;
  country: string;
  create_time: string;
  currency: string;
  description: string;
  email: string;
  industry: string;
  language: string;
  license_no: string;
  license_url: string;
  phone_number: string;
  promotion_area: string;
  qualification: string;
  role: string;
  status: string;
  timezone: string;
}

export interface TikTokCampaign {
  advertiser_id: string;
  campaign_id: string;
  campaign_name: string;
  budget: number;
  budget_mode: string;
  create_time: string;
  modify_time: string;
  objective_type: string;
  operation_status: string;
  status: string;
  campaign_type: string;
  is_smart_performance_campaign: boolean;
}

export interface TikTokAdGroup {
  adgroup_id: string;
  adgroup_name: string;
  advertiser_id: string;
  campaign_id: string;
  create_time: string;
  modify_time: string;
  operation_status: string;
  status: string;
  budget: number;
  budget_mode: string;
  bid_type: string;
  bid_price: number;
  billing_event: string;
  optimization_goal: string;
  pacing: string;
  schedule_type: string;
  schedule_start_time: string;
  schedule_end_time: string;
  audience_type: string;
  placements: string[];
}

export interface TikTokAd {
  ad_id: string;
  ad_name: string;
  adgroup_id: string;
  advertiser_id: string;
  campaign_id: string;
  create_time: string;
  modify_time: string;
  operation_status: string;
  status: string;
  ad_format: string;
  ad_text: string;
  call_to_action: string;
  landing_page_url: string;
  display_name: string;
  profile_image: string;
}

export interface TikTokReportMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversions: number;
  conversion_rate: number;
  cost_per_conversion: number;
  reach: number;
  frequency: number;
  video_play_actions: number;
  video_watched_2s: number;
  video_watched_6s: number;
  video_views_p25: number;
  video_views_p50: number;
  video_views_p75: number;
  video_views_p100: number;
}

export interface TikTokReport {
  advertiser_id: string;
  campaign_id?: string;
  adgroup_id?: string;
  ad_id?: string;
  stat_time_day: string;
  metrics: TikTokReportMetrics;
  dimensions?: {
    campaign_name?: string;
    adgroup_name?: string;
    ad_name?: string;
    placement?: string;
    age?: string;
    gender?: string;
    country_code?: string;
  };
}

export class TikTokAdsClient extends BaseAPIClient {
  private static readonly API_VERSION = 'v1.3';
  private static readonly BASE_URL = 'https://business-api.tiktok.com';
  
  // **CRITICAL**: Official TikTok Ads rate limits
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 2,      // Conservative limit
    requestsPerMinute: 60,     // Official: 1000 requests per minute
    requestsPerHour: 3600,     // But we use conservative limits
    requestsPerDay: 86400,     // To prevent any issues
    burstLimit: 10
  };

  constructor(credentials: APICredentials) {
    super('tiktok', credentials, TikTokAdsClient.RATE_LIMITS);
  }

  // **SECURITY**: Official OAuth 2.0 flow
  public static getAuthUrl(clientId: string, redirectUri: string): string {
    const state = Math.random().toString(36).substring(2, 15);
    
    const params = new URLSearchParams({
      app_id: clientId,
      state: state,
      redirect_uri: redirectUri,
      rid: Math.random().toString()
    });

    return `https://ads.tiktok.com/marketing_api/auth?${params.toString()}`;
  }

  // **SECURITY**: Exchange authorization code for access token
  public static async exchangeCodeForToken(
    clientId: string,
    clientSecret: string,
    authCode: string
  ): Promise<{ accessToken: string; expiresIn: number; refreshToken: string } | null> {
    try {
      const response = await fetch(`${TikTokAdsClient.BASE_URL}/open_api/v1.3/oauth2/access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: clientId,
          secret: clientSecret,
          auth_code: authCode
        })
      });

      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        return {
          accessToken: data.data.access_token,
          expiresIn: data.data.access_token_expire_in,
          refreshToken: data.data.refresh_token
        };
      }
      
      throw new Error(data.message || 'Token exchange failed');
    } catch (error) {
      console.error('TikTok token exchange error:', error);
      return null;
    }
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      const url = `${TikTokAdsClient.BASE_URL}/open_api/${TikTokAdsClient.API_VERSION}${request.endpoint}`;
      
      const headers = {
        'Access-Token': this.credentials.accessToken!,
        'Content-Type': 'application/json',
        ...request.headers
      };

      const fetchOptions: RequestInit = {
        method: request.method,
        headers
      };

      if (request.method === 'GET' && request.params) {
        const params = new URLSearchParams(request.params);
        const fullUrl = `${url}?${params.toString()}`;
        const response = await fetch(fullUrl, fetchOptions);
        return this.handleResponse<T>(response);
      } else if (request.body) {
        fetchOptions.body = JSON.stringify(request.body);
        const response = await fetch(url, fetchOptions);
        return this.handleResponse<T>(response);
      }

      const response = await fetch(url, fetchOptions);
      return this.handleResponse<T>(response);

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`) as any;
        error.status = response.status;
        error.code = data.code;
        error.headers = Object.fromEntries(response.headers.entries());
        
        // **CRITICAL**: Handle TikTok-specific error codes
        if (response.status === 401) {
          console.error('TikTok Ads API: Invalid access token');
        } else if (response.status === 403) {
          console.error('TikTok Ads API: Access denied');
        } else if (response.status === 429) {
          console.error('TikTok Ads API: Rate limit exceeded');
        }
        
        throw error;
      }

      // TikTok API returns data in specific format
      if (data.code === 0) {
        return {
          success: true,
          data: data.data
        };
      } else {
        return {
          success: false,
          error: data.message || `TikTok API error: ${data.code}`
        };
      }

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  protected async performTokenRefresh(): Promise<boolean> {
    if (!this.credentials.refreshToken || !this.credentials.clientId || !this.credentials.clientSecret) {
      return false;
    }

    try {
      const response = await fetch(`${TikTokAdsClient.BASE_URL}/open_api/v1.3/oauth2/refresh_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_id: this.credentials.clientId,
          secret: this.credentials.clientSecret,
          refresh_token: this.credentials.refreshToken
        })
      });

      const data = await response.json();
      
      if (data.code === 0 && data.data) {
        this.credentials.accessToken = data.data.access_token;
        this.credentials.refreshToken = data.data.refresh_token;
        this.credentials.expiresAt = Date.now() + (data.data.access_token_expire_in * 1000);
        return true;
      }
    } catch (error) {
      console.error('TikTok token refresh failed:', error);
    }
    
    return false;
  }

  protected getHealthCheckEndpoint(): string {
    return '/advertiser/info/';
  }

  // **API METHODS** - TikTok Marketing API

  public async getAdvertisers(): Promise<APIResponse<TikTokAdvertiser[]>> {
    return this.queueRequest<TikTokAdvertiser[]>({
      endpoint: '/advertiser/info/',
      method: 'GET'
    });
  }

  public async getAdvertiserInfo(advertiserId: string): Promise<APIResponse<TikTokAdvertiser>> {
    return this.queueRequest<TikTokAdvertiser>({
      endpoint: '/advertiser/info/',
      method: 'GET',
      params: {
        advertiser_ids: `["${advertiserId}"]`
      }
    });
  }

  public async getCampaigns(advertiserId: string): Promise<APIResponse<TikTokCampaign[]>> {
    return this.queueRequest<TikTokCampaign[]>({
      endpoint: '/campaign/get/',
      method: 'GET',
      params: {
        advertiser_id: advertiserId,
        page_size: '1000'
      }
    });
  }

  public async getCampaign(advertiserId: string, campaignId: string): Promise<APIResponse<TikTokCampaign>> {
    return this.queueRequest<TikTokCampaign>({
      endpoint: '/campaign/get/',
      method: 'GET',
      params: {
        advertiser_id: advertiserId,
        campaign_ids: `["${campaignId}"]`
      }
    });
  }

  public async getAdGroups(advertiserId: string, campaignId?: string): Promise<APIResponse<TikTokAdGroup[]>> {
    const params: any = {
      advertiser_id: advertiserId,
      page_size: '1000'
    };

    if (campaignId) {
      params.campaign_ids = `["${campaignId}"]`;
    }

    return this.queueRequest<TikTokAdGroup[]>({
      endpoint: '/adgroup/get/',
      method: 'GET',
      params
    });
  }

  public async getAds(advertiserId: string, adGroupId?: string): Promise<APIResponse<TikTokAd[]>> {
    const params: any = {
      advertiser_id: advertiserId,
      page_size: '1000'
    };

    if (adGroupId) {
      params.adgroup_ids = `["${adGroupId}"]`;
    }

    return this.queueRequest<TikTokAd[]>({
      endpoint: '/ad/get/',
      method: 'GET',
      params
    });
  }

  // **REPORTING METHODS**

  public async getBasicReports(
    advertiserId: string,
    level: 'ADVERTISER' | 'CAMPAIGN' | 'ADGROUP' | 'AD',
    startDate: string,
    endDate: string,
    metrics: string[] = [
      'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc',
      'conversions', 'conversion_rate', 'cost_per_conversion',
      'reach', 'frequency'
    ],
    dimensions?: string[],
    filtering?: any
  ): Promise<APIResponse<TikTokReport[]>> {
    
    const requestBody: any = {
      advertiser_id: advertiserId,
      service_type: 'AUCTION',
      report_type: 'BASIC',
      data_level: level,
      dimensions: dimensions || [],
      metrics: metrics,
      start_date: startDate,
      end_date: endDate,
      page_size: 1000
    };

    if (filtering) {
      requestBody.filtering = filtering;
    }

    return this.queueRequest<TikTokReport[]>({
      endpoint: '/report/integrated/get/',
      method: 'POST',
      body: requestBody
    });
  }

  public async getAudienceReports(
    advertiserId: string,
    startDate: string,
    endDate: string,
    dimensions: string[] = ['age', 'gender', 'country_code']
  ): Promise<APIResponse<TikTokReport[]>> {
    
    return this.queueRequest<TikTokReport[]>({
      endpoint: '/report/audience/get/',
      method: 'POST',
      body: {
        advertiser_id: advertiserId,
        data_level: 'AUCTION_AD',
        dimensions: dimensions,
        metrics: [
          'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc',
          'conversions', 'conversion_rate'
        ],
        start_date: startDate,
        end_date: endDate,
        page_size: 1000
      }
    });
  }

  public async getVideoReports(
    advertiserId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<TikTokReport[]>> {
    
    return this.getBasicReports(
      advertiserId,
      'AD',
      startDate,
      endDate,
      [
        'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc',
        'video_play_actions', 'video_watched_2s', 'video_watched_6s',
        'video_views_p25', 'video_views_p50', 'video_views_p75', 'video_views_p100'
      ]
    );
  }

  // **CONVENIENCE METHODS**

  public async getCampaignPerformance(
    advertiserId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<TikTokReport[]>> {
    return this.getBasicReports(
      advertiserId,
      'CAMPAIGN',
      startDate,
      endDate,
      ['spend', 'impressions', 'clicks', 'ctr', 'cpm', 'cpc', 'conversions', 'conversion_rate'],
      ['campaign_name']
    );
  }

  public async getAccountOverview(
    advertiserId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<TikTokReport[]>> {
    return this.getBasicReports(
      advertiserId,
      'ADVERTISER',
      startDate,
      endDate
    );
  }

  // **CRITICAL**: Validate advertiser access
  public async validateAdvertiserAccess(advertiserId: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await this.getAdvertiserInfo(advertiserId);
      
      if (response.success && response.data) {
        return {
          valid: true,
          message: 'Advertiser access validated successfully'
        };
      } else {
        return {
          valid: false,
          message: `Advertiser access validation failed: ${response.error}`
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        message: `Advertiser access validation error: ${error.message}`
      };
    }
  }
}