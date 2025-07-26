// Google Analytics 4 API Client - OFFICIAL COMPLIANCE & RATE LIMITS
// Uses official Google Analytics Data API v1beta+ with proper authentication
// Reference: https://developers.google.com/analytics/devguides/reporting/data/v1

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';

export interface GA4Property {
  name: string;
  propertyId: string;
  displayName: string;
  industryCategory: string;
  timeZone: string;
  currencyCode: string;
  createTime: string;
  updateTime: string;
}

export interface GA4Dimension {
  name: string;
  dimensionExpression?: {
    lowerCase?: {
      dimensionName: string;
    };
    upperCase?: {
      dimensionName: string;
    };
    concatenate?: {
      dimensionNames: string[];
      delimiter: string;
    };
  };
}

export interface GA4Metric {
  name: string;
  expression?: string;
  invisible?: boolean;
}

export interface GA4DateRange {
  startDate: string;
  endDate: string;
  name?: string;
}

export interface GA4ReportRow {
  dimensionValues: Array<{
    value: string;
    oneValue: string;
  }>;
  metricValues: Array<{
    value: string;
    oneValue: string;
  }>;
}

export interface GA4ReportResponse {
  dimensionHeaders: Array<{
    name: string;
  }>;
  metricHeaders: Array<{
    name: string;
    type: string;
  }>;
  rows: GA4ReportRow[];
  totals: GA4ReportRow[];
  maximums: GA4ReportRow[];
  minimums: GA4ReportRow[];
  rowCount: number;
  quota?: {
    tokensPerDay: {
      consumed: number;
      remaining: number;
    };
    tokensPerHour: {
      consumed: number;
      remaining: number;
    };
  };
}

export class GoogleAnalyticsClient extends BaseAPIClient {
  private static readonly API_VERSION = 'v1beta';
  private static readonly BASE_URL = 'https://analyticsdata.googleapis.com';
  
  // **CRITICAL**: Official Google Analytics rate limits
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 2,      // Conservative limit  
    requestsPerMinute: 100,    // Official: 100 requests per 100 seconds per user
    requestsPerHour: 3600,     // 60 * 60
    requestsPerDay: 40000,     // Official daily quota varies by property
    burstLimit: 10
  };

  constructor(credentials: APICredentials) {
    super('google-analytics', credentials, GoogleAnalyticsClient.RATE_LIMITS);
  }

  // **SECURITY**: Uses same OAuth as Google Ads but different scopes
  public static getAuthUrl(clientId: string, redirectUri: string): string {
    const scopes = [
      'https://www.googleapis.com/auth/analytics.readonly'  // Read-only access to Analytics
    ].join(' ');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes,
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      const url = `${GoogleAnalyticsClient.BASE_URL}/${GoogleAnalyticsClient.API_VERSION}${request.endpoint}`;
      
      const headers = {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/json',
        ...request.headers
      };

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
        
        // **CRITICAL**: Handle Google Analytics specific errors
        if (response.status === 401) {
          console.error('Google Analytics API: Invalid credentials');
        } else if (response.status === 403) {
          console.error('Google Analytics API: Access denied - check property permissions');
        } else if (response.status === 429) {
          console.error('Google Analytics API: Quota exceeded');
        }
        
        throw error;
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data,
        rateLimitRemaining: data.quota ? this.calculateRemainingQuota(data.quota) : undefined
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private calculateRemainingQuota(quota: any): number {
    if (quota.tokensPerDay?.remaining !== undefined) {
      return quota.tokensPerDay.remaining;
    }
    return 100; // Default assumption
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
      console.error('Google Analytics token refresh failed:', error);
    }
    
    return false;
  }

  protected getHealthCheckEndpoint(): string {
    return '/metadata'; // Simple endpoint to test connection
  }

  // **API METHODS** - Google Analytics 4 Reporting API

  public async getProperties(): Promise<APIResponse<GA4Property[]>> {
    // Note: This requires the Google Analytics Admin API
    // For now, we'll assume the property ID is provided in credentials
    if (this.credentials.propertyId) {
      return {
        success: true,
        data: [{
          name: `properties/${this.credentials.propertyId}`,
          propertyId: this.credentials.propertyId,
          displayName: 'Connected Property',
          industryCategory: 'OTHER',
          timeZone: 'UTC',
          currencyCode: 'USD',
          createTime: '',
          updateTime: ''
        }]
      };
    }

    return {
      success: false,
      error: 'Property ID not configured'
    };
  }

  public async runReport(
    propertyId: string,
    dimensions: GA4Dimension[],
    metrics: GA4Metric[],
    dateRanges: GA4DateRange[],
    dimensionFilter?: any,
    metricFilter?: any,
    orderBys?: any[],
    limit?: number,
    offset?: number
  ): Promise<APIResponse<GA4ReportResponse>> {
    
    const requestBody: any = {
      dimensions,
      metrics,
      dateRanges
    };

    if (dimensionFilter) {
      requestBody.dimensionFilter = dimensionFilter;
    }

    if (metricFilter) {
      requestBody.metricFilter = metricFilter;
    }

    if (orderBys && orderBys.length > 0) {
      requestBody.orderBys = orderBys;
    }

    if (limit) {
      requestBody.limit = limit;
    }

    if (offset) {
      requestBody.offset = offset;
    }

    return this.queueRequest<GA4ReportResponse>({
      endpoint: `/properties/${propertyId}:runReport`,
      method: 'POST',
      body: requestBody
    });
  }

  // **CONVENIENCE METHODS** for common reports

  public async getTrafficOverview(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<GA4ReportResponse>> {
    return this.runReport(
      propertyId,
      [
        { name: 'date' },
        { name: 'sessionDefaultChannelGrouping' }
      ],
      [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'pageviews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      [{ startDate, endDate }]
    );
  }

  public async getConversionData(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<GA4ReportResponse>> {
    return this.runReport(
      propertyId,
      [
        { name: 'date' },
        { name: 'eventName' }
      ],
      [
        { name: 'conversions' },
        { name: 'totalRevenue' },
        { name: 'purchaseRevenue' },
        { name: 'eventCount' }
      ],
      [{ startDate, endDate }],
      {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            matchType: 'CONTAINS',
            value: 'purchase'
          }
        }
      }
    );
  }

  public async getEcommerceData(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<GA4ReportResponse>> {
    return this.runReport(
      propertyId,
      [
        { name: 'date' },
        { name: 'itemName' },
        { name: 'itemCategory' }
      ],
      [
        { name: 'itemPurchaseQuantity' },
        { name: 'itemRevenue' },
        { name: 'addToCarts' },
        { name: 'checkouts' },
        { name: 'purchaseRevenue' }
      ],
      [{ startDate, endDate }]
    );
  }

  public async getAudienceData(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<GA4ReportResponse>> {
    return this.runReport(
      propertyId,
      [
        { name: 'country' },
        { name: 'deviceCategory' },
        { name: 'operatingSystem' },
        { name: 'browser' }
      ],
      [
        { name: 'totalUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
        { name: 'engagementRate' },
        { name: 'averageSessionDuration' }
      ],
      [{ startDate, endDate }]
    );
  }

  public async getCampaignAttributionData(
    propertyId: string,
    startDate: string,
    endDate: string
  ): Promise<APIResponse<GA4ReportResponse>> {
    return this.runReport(
      propertyId,
      [
        { name: 'sessionCampaignName' },
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
        { name: 'firstUserCampaignName' }
      ],
      [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'conversions' },
        { name: 'totalRevenue' },
        { name: 'costPerAcquisition' }
      ],
      [{ startDate, endDate }]
    );
  }

  // **CRITICAL**: Validate property access
  public async validatePropertyAccess(propertyId: string): Promise<{ valid: boolean; message: string }> {
    try {
      const response = await this.runReport(
        propertyId,
        [{ name: 'date' }],
        [{ name: 'sessions' }],
        [{ 
          startDate: '7daysAgo', 
          endDate: 'today' 
        }],
        undefined,
        undefined,
        undefined,
        1 // Just get 1 row to test access
      );

      if (response.success) {
        return {
          valid: true,
          message: 'Property access validated successfully'
        };
      } else {
        return {
          valid: false,
          message: `Property access validation failed: ${response.error}`
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        message: `Property access validation error: ${error.message}`
      };
    }
  }

  // **UTILITY**: Get available dimensions and metrics
  public async getMetadata(propertyId: string): Promise<APIResponse<any>> {
    return this.queueRequest<any>({
      endpoint: `/properties/${propertyId}/metadata`,
      method: 'GET'
    });
  }
}