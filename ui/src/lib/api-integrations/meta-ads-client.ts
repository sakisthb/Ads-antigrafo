// Meta Ads API Client - OFFICIAL COMPLIANCE & RATE LIMITS
// Uses official Facebook Marketing API v18.0+ with proper rate limiting to prevent bans
// Reference: https://developers.facebook.com/docs/marketing-api/overview

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';

export interface MetaAdAccount {
  id: string;
  name: string;
  account_status: number;
  currency: string;
  timezone_name: string;
  business?: {
    id: string;
    name: string;
  };
}

export interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  created_time: string;
  updated_time: string;
  daily_budget?: string;
  lifetime_budget?: string;
  bid_strategy?: string;
  buying_type?: string;
}

export interface MetaAdInsights {
  date_start: string;
  date_stop: string;
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  ctr: string;
  cpm: string;
  cpp: string;
  cpc: string;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  conversions?: Array<{
    action_type: string;
    value: string;
  }>;
  cost_per_action_type?: Array<{
    action_type: string;
    value: string;
  }>;
}

export class MetaAdsClient extends BaseAPIClient {
  private static readonly API_VERSION = 'v18.0';
  private static readonly BASE_URL = 'https://graph.facebook.com';
  
  // **CRITICAL**: Official Meta rate limits to prevent bans
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 5,      // Conservative limit
    requestsPerMinute: 200,    // Official limit is 200/hour per app user
    requestsPerHour: 200,
    requestsPerDay: 4800,      // 200 * 24 hours
    burstLimit: 10
  };

  constructor(credentials: APICredentials) {
    super('meta', credentials, MetaAdsClient.RATE_LIMITS);
  }

  // **SECURITY**: Official OAuth 2.0 flow - user must authorize through Facebook
  public static getAuthUrl(clientId: string, redirectUri: string): string {
    const scopes = [
      'ads_read',           // Read ads data
      'ads_management',     // Manage ads (if needed for optimizations)
      'business_management' // Access business info
    ].join(',');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      auth_type: 'rerequest'
    });

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  // **SECURITY**: Exchange authorization code for access token
  public static async exchangeCodeForToken(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    code: string
  ): Promise<{ accessToken: string; expiresIn: number } | null> {
    try {
      const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code
      });

      const response = await fetch(`${MetaAdsClient.BASE_URL}/v18.0/oauth/access_token`, {
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
          expiresIn: data.expires_in || 5400 // Default 90 minutes
        };
      }
      
      throw new Error(data.error?.message || 'Token exchange failed');
    } catch (error) {
      console.error('Meta token exchange error:', error);
      return null;
    }
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      const url = `${MetaAdsClient.BASE_URL}/${MetaAdsClient.API_VERSION}${request.endpoint}`;
      const params = new URLSearchParams(request.params || {});
      
      // **CRITICAL**: Always include access token
      params.append('access_token', this.credentials.accessToken!);
      
      const fullUrl = request.method === 'GET' ? 
        `${url}?${params.toString()}` : url;

      const fetchOptions: RequestInit = {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          ...request.headers
        }
      };

      if (request.method !== 'GET' && request.body) {
        fetchOptions.body = JSON.stringify({
          ...request.body,
          access_token: this.credentials.accessToken
        });
      }

      const response = await fetch(fullUrl, fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        // **CRITICAL**: Handle Meta-specific error codes
        if (data.error) {
          const error = new Error(data.error.message) as any;
          error.status = response.status;
          error.code = data.error.code;
          error.type = data.error.type;
          error.headers = Object.fromEntries(response.headers.entries());
          
          // Log specific error types that might indicate policy violations
          if (data.error.code === 190) {
            console.error('Meta API: Invalid access token - requires re-authentication');
          } else if (data.error.code === 17) {
            console.error('Meta API: User request limit reached');
          } else if (data.error.code === 4) {
            console.error('Meta API: Application request limit reached');
          }
          
          throw error;
        }
      }

      return {
        success: true,
        data: data.data || data,
        rateLimitRemaining: response.headers.get('x-app-usage') ? 
          this.parseUsageHeader(response.headers.get('x-app-usage')!) : undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        rateLimitRemaining: error.headers?.['x-app-usage'] ? 
          this.parseUsageHeader(error.headers['x-app-usage']) : undefined
      };
    }
  }

  private parseUsageHeader(usage: string): number {
    try {
      const parsed = JSON.parse(usage);
      return 100 - (parsed.call_count || 0); // Remaining percentage
    } catch {
      return 100;
    }
  }

  protected async performTokenRefresh(): Promise<boolean> {
    // Meta long-lived tokens don't need refresh, but we can extend them
    try {
      const response = await fetch(
        `${MetaAdsClient.BASE_URL}/v18.0/oauth/access_token?` +
        `grant_type=fb_exchange_token&` +
        `client_id=${this.credentials.clientId}&` +
        `client_secret=${this.credentials.clientSecret}&` +
        `fb_exchange_token=${this.credentials.accessToken}`
      );

      const data = await response.json();
      
      if (data.access_token) {
        this.credentials.accessToken = data.access_token;
        this.credentials.expiresAt = Date.now() + (data.expires_in * 1000);
        return true;
      }
    } catch (error) {
      console.error('Meta token refresh failed:', error);
    }
    
    return false;
  }

  protected getHealthCheckEndpoint(): string {
    return '/me'; // Simple endpoint to test connection
  }

  // **API METHODS** - All with proper error handling and rate limiting

  public async getAdAccounts(): Promise<APIResponse<MetaAdAccount[]>> {
    return this.queueRequest<MetaAdAccount[]>({
      endpoint: '/me/adaccounts',
      method: 'GET',
      params: {
        fields: 'id,name,account_status,currency,timezone_name,business'
      }
    });
  }

  public async getCampaigns(adAccountId: string): Promise<APIResponse<MetaCampaign[]>> {
    return this.queueRequest<MetaCampaign[]>({
      endpoint: `/${adAccountId}/campaigns`,
      method: 'GET',
      params: {
        fields: 'id,name,status,objective,created_time,updated_time,daily_budget,lifetime_budget,bid_strategy,buying_type'
      }
    });
  }

  public async getCampaignInsights(
    campaignId: string,
    dateRange: { since: string; until: string },
    level: 'campaign' | 'adset' | 'ad' = 'campaign'
  ): Promise<APIResponse<MetaAdInsights[]>> {
    return this.queueRequest<MetaAdInsights[]>({
      endpoint: `/${campaignId}/insights`,
      method: 'GET',
      params: {
        level: level,
        time_range: JSON.stringify({
          since: dateRange.since,
          until: dateRange.until
        }),
        fields: [
          'date_start',
          'date_stop', 
          'impressions',
          'clicks',
          'spend',
          'reach',
          'frequency',
          'ctr',
          'cpm',
          'cpp',
          'cpc',
          'actions',
          'conversions',
          'cost_per_action_type'
        ].join(',')
      }
    });
  }

  public async getAccountInsights(
    adAccountId: string,
    dateRange: { since: string; until: string },
    breakdowns?: string[]
  ): Promise<APIResponse<MetaAdInsights[]>> {
    const params: any = {
      level: 'account',
      time_range: JSON.stringify({
        since: dateRange.since,
        until: dateRange.until
      }),
      fields: [
        'date_start',
        'date_stop',
        'impressions',
        'clicks', 
        'spend',
        'reach',
        'frequency',
        'ctr',
        'cpm',
        'cpp',
        'cpc',
        'actions',
        'conversions',
        'cost_per_action_type'
      ].join(',')
    };

    if (breakdowns && breakdowns.length > 0) {
      params.breakdowns = breakdowns.join(',');
    }

    return this.queueRequest<MetaAdInsights[]>({
      endpoint: `/${adAccountId}/insights`,
      method: 'GET',
      params
    });
  }

  // **CRITICAL**: Check if user has proper permissions
  public async validatePermissions(): Promise<{ valid: boolean; permissions: string[]; missingPermissions: string[] }> {
    try {
      const response = await this.queueRequest<any>({
        endpoint: '/me/permissions',
        method: 'GET'
      });

      if (response.success && response.data) {
        const grantedPermissions = response.data
          .filter((p: any) => p.status === 'granted')
          .map((p: any) => p.permission);

        const requiredPermissions = ['ads_read', 'ads_management', 'business_management'];
        const missingPermissions = requiredPermissions.filter(
          perm => !grantedPermissions.includes(perm)
        );

        return {
          valid: missingPermissions.length === 0,
          permissions: grantedPermissions,
          missingPermissions
        };
      }

      return {
        valid: false,
        permissions: [],
        missingPermissions: ['ads_read', 'ads_management', 'business_management']
      };

    } catch (error) {
      console.error('Meta permissions check failed:', error);
      return {
        valid: false,
        permissions: [],
        missingPermissions: ['ads_read', 'ads_management', 'business_management']
      };
    }
  }
}