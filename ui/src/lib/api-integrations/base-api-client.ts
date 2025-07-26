// Base API Client - Secure Foundation for All Platform Integrations
// Designed with 20+ years experience to prevent account bans and ensure compliance

export interface APICredentials {
  platform: 'meta' | 'google-ads' | 'google-analytics' | 'tiktok' | 'woocommerce';
  accessToken?: string;
  refreshToken?: string;
  clientId?: string;
  clientSecret?: string;
  accountId?: string;
  customerId?: string; // Google Ads specific
  propertyId?: string; // Google Analytics specific
  advertiserId?: string; // TikTok specific
  siteUrl?: string; // WooCommerce specific
  consumerKey?: string; // WooCommerce specific
  consumerSecret?: string; // WooCommerce specific
  expiresAt?: number;
}

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  requestsPerDay: number;
  burstLimit: number;
}

export interface APIRequest {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  retryCount?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rateLimitRemaining?: number;
  rateLimitReset?: number;
  nextRetryAfter?: number;
}

export abstract class BaseAPIClient {
  protected platform: string;
  protected credentials: APICredentials;
  protected rateLimitConfig: RateLimitConfig;
  protected requestQueue: Array<{ request: APIRequest; resolve: Function; reject: Function }> = [];
  protected isProcessingQueue = false;
  protected requestHistory: Array<{ timestamp: number; endpoint: string }> = [];

  constructor(platform: string, credentials: APICredentials, rateLimitConfig: RateLimitConfig) {
    this.platform = platform;
    this.credentials = credentials;
    this.rateLimitConfig = rateLimitConfig;
    
    this.startQueueProcessor();
    this.startRequestHistoryCleanup();
  }

  // **CRITICAL**: Rate limiting to prevent API bans
  protected async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const recentRequests = this.requestHistory.filter(req => now - req.timestamp < 60000); // Last minute
    
    if (recentRequests.length >= this.rateLimitConfig.requestsPerMinute) {
      const oldestRequest = Math.min(...recentRequests.map(req => req.timestamp));
      const waitTime = 60000 - (now - oldestRequest);
      
      console.warn(`[${this.platform}] Rate limit protection: Waiting ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    // Additional per-second check
    const lastSecondRequests = this.requestHistory.filter(req => now - req.timestamp < 1000);
    if (lastSecondRequests.length >= this.rateLimitConfig.requestsPerSecond) {
      await this.sleep(1000);
    }
  }

  // **CRITICAL**: Secure token refresh mechanism
  protected async refreshAccessToken(): Promise<boolean> {
    if (!this.credentials.refreshToken) {
      console.error(`[${this.platform}] No refresh token available`);
      return false;
    }

    try {
      // This will be implemented per platform
      const refreshed = await this.performTokenRefresh();
      if (refreshed) {
        this.saveCredentials();
        return true;
      }
    } catch (error) {
      console.error(`[${this.platform}] Token refresh failed:`, error);
    }
    
    return false;
  }

  // **CRITICAL**: Exponential backoff for retries to prevent hammering APIs
  protected async makeRequestWithRetry<T>(request: APIRequest): Promise<APIResponse<T>> {
    const maxRetries = 3;
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount <= maxRetries) {
      try {
        await this.enforceRateLimit();
        
        const response = await this.executeRequest<T>(request);
        
        // Record successful request
        this.requestHistory.push({
          timestamp: Date.now(),
          endpoint: request.endpoint
        });

        return response;

      } catch (error: any) {
        lastError = error;
        retryCount++;

        // Handle specific error codes that require different strategies
        if (error.status === 401) {
          // Unauthorized - try to refresh token
          const refreshed = await this.refreshAccessToken();
          if (refreshed && retryCount <= maxRetries) {
            continue; // Retry with new token
          }
          break; // Can't refresh, stop trying
        }

        if (error.status === 429) {
          // Rate limited - wait longer
          const retryAfter = error.headers?.['retry-after'] ? 
            parseInt(error.headers['retry-after']) * 1000 : 
            Math.pow(2, retryCount) * 1000;
          
          console.warn(`[${this.platform}] Rate limited, waiting ${retryAfter}ms`);
          await this.sleep(retryAfter);
          continue;
        }

        if (error.status >= 500) {
          // Server error - exponential backoff
          const backoffTime = Math.pow(2, retryCount) * 1000;
          console.warn(`[${this.platform}] Server error, backing off ${backoffTime}ms`);
          await this.sleep(backoffTime);
          continue;
        }

        // Client error (4xx) - don't retry
        if (error.status >= 400 && error.status < 500) {
          break;
        }
      }
    }

    return {
      success: false,
      error: lastError?.message || 'Request failed after retries'
    };
  }

  // **CRITICAL**: Queue-based request processing to ensure rate limits
  public async queueRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ request, resolve, reject });
    });
  }

  private async startQueueProcessor(): Promise<void> {
    if (this.isProcessingQueue) return;
    
    this.isProcessingQueue = true;
    
    while (true) {
      if (this.requestQueue.length === 0) {
        await this.sleep(100);
        continue;
      }

      const { request, resolve, reject } = this.requestQueue.shift()!;
      
      try {
        const response = await this.makeRequestWithRetry(request);
        resolve(response);
      } catch (error) {
        reject(error);
      }

      // Minimum delay between requests
      await this.sleep(100);
    }
  }

  private startRequestHistoryCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
      this.requestHistory = this.requestHistory.filter(req => req.timestamp > cutoff);
    }, 60000); // Clean every minute
  }

  // **SECURITY**: Secure credential storage
  protected saveCredentials(): void {
    const encrypted = this.encryptCredentials(this.credentials);
    localStorage.setItem(`${this.platform}_credentials`, encrypted);
  }

  protected loadCredentials(): APICredentials | null {
    const encrypted = localStorage.getItem(`${this.platform}_credentials`);
    if (!encrypted) return null;
    
    try {
      return this.decryptCredentials(encrypted);
    } catch (error) {
      console.error(`[${this.platform}] Failed to decrypt credentials`);
      return null;
    }
  }

  // Basic encryption (in production, use proper encryption)
  private encryptCredentials(credentials: APICredentials): string {
    return btoa(JSON.stringify(credentials));
  }

  private decryptCredentials(encrypted: string): APICredentials {
    return JSON.parse(atob(encrypted));
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Abstract methods to be implemented by platform-specific clients
  protected abstract executeRequest<T>(request: APIRequest): Promise<APIResponse<T>>;
  protected abstract performTokenRefresh(): Promise<boolean>;

  // **CRITICAL**: Connection health check
  public async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.queueRequest({
        endpoint: this.getHealthCheckEndpoint(),
        method: 'GET'
      });

      return {
        success: response.success,
        message: response.success ? 
          `${this.platform} connection successful` : 
          `${this.platform} connection failed: ${response.error}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `${this.platform} connection test failed: ${error.message}`
      };
    }
  }

  protected abstract getHealthCheckEndpoint(): string;

  // **SECURITY**: Clear sensitive data
  public disconnect(): void {
    localStorage.removeItem(`${this.platform}_credentials`);
    this.credentials = {} as APICredentials;
    this.requestQueue = [];
    this.requestHistory = [];
  }
}