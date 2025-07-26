// Smart Data Fetching Manager
// Enterprise-Grade Rate Limiting & API Safety
// 20+ Years Experience - Production-Ready Architecture

export interface PlatformConfig {
  name: string;
  interval: number; // hours
  maxRequestsPerDay: number;
  maxRequestsPerHour: number;
  backoffMultiplier: number;
  jitterRange: number; // minutes
  priority: 'high' | 'medium' | 'low';
  endpoints: string[];
}

export interface FetchLimits {
  auto: {
    interval: number; // hours
    maxPerDay: number;
    jitterRange: number; // minutes
  };
  manual: {
    maxPerDay: number;
    cooldownHours: number;
    emergencyLimit: number;
  };
  emergency: {
    maxPerWeek: number;
    requiresApproval: boolean;
  };
}

export interface FetchAttempt {
  id: string;
  platform: string;
  type: 'auto' | 'manual' | 'emergency';
  timestamp: Date;
  status: 'pending' | 'success' | 'error' | 'rate_limited';
  dataSize: number;
  duration: number;
  errorMessage?: string;
  retryCount: number;
}

export interface PlatformHealth {
  platform: string;
  status: 'healthy' | 'degraded' | 'error' | 'rate_limited';
  lastSuccessfulFetch: Date;
  errorRate: number;
  avgResponseTime: number;
  currentBackoff: number;
  requestsToday: number;
  requestsThisHour: number;
  nextAllowedFetch: Date;
}

export class SmartDataFetchManager {
  private static instance: SmartDataFetchManager;
  private platforms: Map<string, PlatformConfig> = new Map();
  private fetchHistory: FetchAttempt[] = [];
  private platformHealth: Map<string, PlatformHealth> = new Map();
  private scheduledFetches: Map<string, NodeJS.Timeout> = new Map();
  private userSettings: FetchLimits;
  private isEnabled: boolean = true;
  private statusListeners: ((status: any) => void)[] = [];

  static getInstance(): SmartDataFetchManager {
    if (!SmartDataFetchManager.instance) {
      SmartDataFetchManager.instance = new SmartDataFetchManager();
    }
    return SmartDataFetchManager.instance;
  }

  constructor() {
    this.userSettings = {
      auto: {
        interval: 8, // κάθε 8 ώρες
        maxPerDay: 3,
        jitterRange: 30 // ±30 λεπτά randomization
      },
      manual: {
        maxPerDay: 2,
        cooldownHours: 4,
        emergencyLimit: 1
      },
      emergency: {
        maxPerWeek: 5,
        requiresApproval: true
      }
    };

    this.initializePlatforms();
    this.loadPersistedData();
    this.startHealthMonitoring();
    this.scheduleAutomaticFetches();
  }

  private initializePlatforms() {
    // Meta Ads Configuration
    this.platforms.set('meta', {
      name: 'Meta Ads',
      interval: 8,
      maxRequestsPerDay: 200,
      maxRequestsPerHour: 25,
      backoffMultiplier: 1.5,
      jitterRange: 45,
      priority: 'high',
      endpoints: ['/insights', '/campaigns', '/adsets', '/ads']
    });

    // Google Ads Configuration  
    this.platforms.set('google', {
      name: 'Google Ads',
      interval: 12, // πιο αυστηρή
      maxRequestsPerDay: 100,
      maxRequestsPerHour: 15,
      backoffMultiplier: 2.0,
      jitterRange: 60,
      priority: 'high',
      endpoints: ['/reports', '/campaigns', '/keywords']
    });

    // TikTok Ads Configuration
    this.platforms.set('tiktok', {
      name: 'TikTok Ads',
      interval: 6, // γρήγορες αλλαγές
      maxRequestsPerDay: 150,
      maxRequestsPerHour: 20,
      backoffMultiplier: 1.8,
      jitterRange: 30,
      priority: 'medium',
      endpoints: ['/reports', '/campaigns', '/ads']
    });

    // LinkedIn Ads Configuration
    this.platforms.set('linkedin', {
      name: 'LinkedIn Ads',
      interval: 24, // πιο αργή
      maxRequestsPerDay: 50,
      maxRequestsPerHour: 5,
      backoffMultiplier: 2.5,
      jitterRange: 90,
      priority: 'low',
      endpoints: ['/analytics', '/campaigns']
    });

    // Initialize health status για κάθε platform
    this.platforms.forEach((config, platform) => {
      this.platformHealth.set(platform, {
        platform,
        status: 'healthy',
        lastSuccessfulFetch: new Date(),
        errorRate: 0,
        avgResponseTime: 0,
        currentBackoff: 0,
        requestsToday: 0,
        requestsThisHour: 0,
        nextAllowedFetch: new Date()
      });
    });
  }

  // Public API Methods

  public async fetchPlatformData(
    platform: string, 
    type: 'auto' | 'manual' | 'emergency' = 'manual',
    endpoints?: string[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log(`🚀 Initiating ${type} fetch for ${platform}...`);

    // Pre-fetch validation
    const canFetch = await this.canFetchData(platform, type);
    if (!canFetch.allowed) {
      console.warn(`❌ Fetch blocked: ${canFetch.reason}`);
      return { success: false, error: canFetch.reason };
    }

    const fetchId = `fetch_${platform}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    // Create fetch attempt record
    const attempt: FetchAttempt = {
      id: fetchId,
      platform,
      type,
      timestamp: new Date(),
      status: 'pending',
      dataSize: 0,
      duration: 0,
      retryCount: 0
    };

    this.fetchHistory.push(attempt);
    this.updatePlatformHealth(platform, 'pending');

    try {
      // Apply jitter για rate limiting
      const jitter = this.calculateJitter(platform);
      if (jitter > 0 && type === 'auto') {
        console.log(`⏳ Applying ${jitter}ms jitter για ${platform}...`);
        await this.sleep(jitter);
      }

      // Simulate platform-specific API call
      const data = await this.performPlatformFetch(platform, endpoints);
      
      const duration = Date.now() - startTime;
      
      // Update successful attempt
      attempt.status = 'success';
      attempt.dataSize = JSON.stringify(data).length;
      attempt.duration = duration;

      // Update platform health
      this.updatePlatformHealth(platform, 'success', {
        responseTime: duration,
        dataSize: attempt.dataSize
      });

      // Update request counters
      this.incrementRequestCounters(platform);

      console.log(`✅ ${platform} fetch completed successfully in ${duration}ms`);
      
      this.notifyStatusListeners();
      this.persistData();

      return { success: true, data };

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Update failed attempt
      attempt.status = 'error';
      attempt.duration = duration;
      attempt.errorMessage = errorMessage;

      // Update platform health
      this.updatePlatformHealth(platform, 'error', {
        error: errorMessage,
        responseTime: duration
      });

      // Apply exponential backoff
      await this.applyBackoff(platform, errorMessage);

      console.error(`❌ ${platform} fetch failed: ${errorMessage}`);
      
      this.notifyStatusListeners();
      this.persistData();

      return { success: false, error: errorMessage };
    }
  }

  private async performPlatformFetch(platform: string, endpoints?: string[]): Promise<any> {
    const config = this.platforms.get(platform);
    if (!config) throw new Error(`Platform ${platform} not configured`);

    // Simulate API delays based on platform
    const baseDelay = platform === 'google' ? 2000 : platform === 'meta' ? 1000 : 800;
    const delay = baseDelay + (Math.random() * 1000);
    await this.sleep(delay);

    // Simulate potential errors (5% chance)
    if (Math.random() < 0.05) {
      const errors = [
        'Rate limit exceeded',
        'Temporary API unavailable', 
        'Authentication token expired',
        'Platform maintenance'
      ];
      throw new Error(errors[Math.floor(Math.random() * errors.length)]);
    }

    // Generate realistic mock data
    return this.generateMockPlatformData(platform);
  }

  private generateMockPlatformData(platform: string): any {
    const baseData = {
      platform,
      fetchedAt: new Date(),
      campaigns: this.generateCampaignData(platform),
      metrics: this.generateMetricsData(platform),
      insights: this.generateInsightsData(platform)
    };

    return baseData;
  }

  private generateCampaignData(platform: string): any[] {
    const campaignCount = Math.floor(Math.random() * 8) + 3;
    const campaigns = [];

    for (let i = 0; i < campaignCount; i++) {
      campaigns.push({
        id: `${platform}_camp_${i + 1}`,
        name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Campaign ${i + 1}`,
        status: Math.random() > 0.2 ? 'active' : 'paused',
        budget: Math.floor(Math.random() * 5000) + 1000,
        spend: Math.floor(Math.random() * 3000) + 500,
        impressions: Math.floor(Math.random() * 100000) + 10000,
        clicks: Math.floor(Math.random() * 2000) + 100,
        conversions: Math.floor(Math.random() * 50) + 5,
        ctr: (Math.random() * 3 + 1).toFixed(2),
        cpc: (Math.random() * 2 + 0.5).toFixed(2),
        roas: (Math.random() * 4 + 1).toFixed(2)
      });
    }

    return campaigns;
  }

  private generateMetricsData(platform: string): any {
    return {
      totalSpend: Math.floor(Math.random() * 20000) + 5000,
      totalRevenue: Math.floor(Math.random() * 80000) + 20000,
      totalImpressions: Math.floor(Math.random() * 500000) + 100000,
      totalClicks: Math.floor(Math.random() * 10000) + 2000,
      totalConversions: Math.floor(Math.random() * 300) + 50,
      avgCtr: (Math.random() * 3 + 1).toFixed(2),
      avgCpc: (Math.random() * 2 + 0.5).toFixed(2),
      avgRoas: (Math.random() * 4 + 1).toFixed(2),
      conversionRate: (Math.random() * 5 + 1).toFixed(2)
    };
  }

  private generateInsightsData(platform: string): any {
    return {
      topPerformingCampaign: `Best ${platform} Campaign`,
      recommendedActions: [
        `Increase budget για high-performing ${platform} campaigns`,
        `Optimize targeting για better ${platform} ROAS`,
        `Test new creative formats on ${platform}`
      ],
      attributionScore: (Math.random() * 40 + 60).toFixed(1),
      optimizationOpportunities: Math.floor(Math.random() * 5) + 2
    };
  }

  public async canFetchData(
    platform: string, 
    type: 'auto' | 'manual' | 'emergency'
  ): Promise<{ allowed: boolean; reason?: string; nextAllowed?: Date }> {
    
    if (!this.isEnabled) {
      return { allowed: false, reason: 'Data fetching is disabled' };
    }

    const health = this.platformHealth.get(platform);
    if (!health) {
      return { allowed: false, reason: `Platform ${platform} not configured` };
    }

    const now = new Date();

    // Check if platform is in backoff
    if (now < health.nextAllowedFetch) {
      return { 
        allowed: false, 
        reason: `Platform in backoff until ${health.nextAllowedFetch.toLocaleTimeString()}`,
        nextAllowed: health.nextAllowedFetch
      };
    }

    // Check platform-specific limits
    const config = this.platforms.get(platform);
    if (!config) {
      return { allowed: false, reason: `Platform ${platform} configuration missing` };
    }

    if (health.requestsToday >= config.maxRequestsPerDay) {
      return { 
        allowed: false, 
        reason: `Daily limit reached for ${platform} (${health.requestsToday}/${config.maxRequestsPerDay})`,
        nextAllowed: this.getNextDayReset()
      };
    }

    if (health.requestsThisHour >= config.maxRequestsPerHour) {
      return { 
        allowed: false, 
        reason: `Hourly limit reached for ${platform} (${health.requestsThisHour}/${config.maxRequestsPerHour})`,
        nextAllowed: this.getNextHourReset()
      };
    }

    // Type-specific validation
    switch (type) {
      case 'manual':
        const manualToday = this.countTodayRequests(platform, 'manual');
        if (manualToday >= this.userSettings.manual.maxPerDay) {
          return { 
            allowed: false, 
            reason: `Manual fetch limit reached (${manualToday}/${this.userSettings.manual.maxPerDay})`,
            nextAllowed: this.getNextDayReset()
          };
        }

        // Check cooldown
        const lastManual = this.getLastRequest(platform, 'manual');
        if (lastManual) {
          const cooldownEnd = new Date(lastManual.timestamp.getTime() + (this.userSettings.manual.cooldownHours * 60 * 60 * 1000));
          if (now < cooldownEnd) {
            return { 
              allowed: false, 
              reason: `Manual fetch cooldown active until ${cooldownEnd.toLocaleTimeString()}`,
              nextAllowed: cooldownEnd
            };
          }
        }
        break;

      case 'emergency':
        const emergencyThisWeek = this.countWeekRequests(platform, 'emergency');
        if (emergencyThisWeek >= this.userSettings.emergency.maxPerWeek) {
          return { 
            allowed: false, 
            reason: `Emergency fetch limit reached (${emergencyThisWeek}/${this.userSettings.emergency.maxPerWeek})`,
            nextAllowed: this.getNextWeekReset()
          };
        }
        break;
    }

    return { allowed: true };
  }

  // Helper Methods

  private calculateJitter(platform: string): number {
    const config = this.platforms.get(platform);
    if (!config) return 0;
    
    const jitterRange = config.jitterRange * 60 * 1000; // convert to milliseconds
    return Math.random() * jitterRange;
  }

  private async applyBackoff(platform: string, error: string): Promise<void> {
    const health = this.platformHealth.get(platform);
    const config = this.platforms.get(platform);
    
    if (!health || !config) return;

    // Determine backoff duration based on error type
    let backoffMultiplier = config.backoffMultiplier;
    
    if (error.includes('rate limit')) {
      backoffMultiplier *= 2; // Double backoff για rate limits
    }

    const currentBackoff = Math.max(health.currentBackoff * backoffMultiplier, 60000); // min 1 minute
    const maxBackoff = 4 * 60 * 60 * 1000; // max 4 hours
    
    health.currentBackoff = Math.min(currentBackoff, maxBackoff);
    health.nextAllowedFetch = new Date(Date.now() + health.currentBackoff);
    health.status = 'rate_limited';

    console.log(`⏳ Applied ${health.currentBackoff / 1000}s backoff to ${platform}`);
  }

  private updatePlatformHealth(
    platform: string, 
    status: 'success' | 'error' | 'pending',
    metadata?: { responseTime?: number; dataSize?: number; error?: string }
  ): void {
    const health = this.platformHealth.get(platform);
    if (!health) return;

    switch (status) {
      case 'success':
        health.status = 'healthy';
        health.lastSuccessfulFetch = new Date();
        health.currentBackoff = 0; // Reset backoff on success
        
        if (metadata?.responseTime) {
          health.avgResponseTime = (health.avgResponseTime + metadata.responseTime) / 2;
        }
        
        // Calculate error rate (last 10 requests)
        const recentAttempts = this.fetchHistory
          .filter(a => a.platform === platform)
          .slice(-10);
        const errorCount = recentAttempts.filter(a => a.status === 'error').length;
        health.errorRate = (errorCount / Math.max(recentAttempts.length, 1)) * 100;
        break;

      case 'error':
        health.status = health.errorRate > 50 ? 'error' : 'degraded';
        break;
    }
  }

  private incrementRequestCounters(platform: string): void {
    const health = this.platformHealth.get(platform);
    if (!health) return;

    health.requestsToday++;
    health.requestsThisHour++;
  }

  private countTodayRequests(platform: string, type?: 'auto' | 'manual' | 'emergency'): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.fetchHistory.filter(attempt => 
      attempt.platform === platform &&
      attempt.timestamp >= today &&
      (type ? attempt.type === type : true)
    ).length;
  }

  private countWeekRequests(platform: string, type?: 'auto' | 'manual' | 'emergency'): number {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return this.fetchHistory.filter(attempt => 
      attempt.platform === platform &&
      attempt.timestamp >= weekAgo &&
      (type ? attempt.type === type : true)
    ).length;
  }

  private getLastRequest(platform: string, type: 'auto' | 'manual' | 'emergency'): FetchAttempt | null {
    const requests = this.fetchHistory
      .filter(a => a.platform === platform && a.type === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return requests[0] || null;
  }

  private getNextDayReset(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }

  private getNextHourReset(): Date {
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
    return nextHour;
  }

  private getNextWeekReset(): Date {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);
    return nextWeek;
  }

  private scheduleAutomaticFetches(): void {
    this.platforms.forEach((config, platform) => {
      const intervalMs = config.interval * 60 * 60 * 1000; // convert to milliseconds
      
      // Add initial random delay to spread out fetches
      const initialDelay = Math.random() * 30 * 60 * 1000; // 0-30 minutes
      
      setTimeout(() => {
        // Perform initial fetch
        this.fetchPlatformData(platform, 'auto');
        
        // Schedule recurring fetches
        const intervalId = setInterval(() => {
          this.fetchPlatformData(platform, 'auto');
        }, intervalMs);
        
        this.scheduledFetches.set(platform, intervalId);
      }, initialDelay);
    });
  }

  private startHealthMonitoring(): void {
    // Reset hourly counters
    setInterval(() => {
      this.platformHealth.forEach(health => {
        health.requestsThisHour = 0;
      });
    }, 60 * 60 * 1000); // Every hour

    // Reset daily counters
    setInterval(() => {
      this.platformHealth.forEach(health => {
        health.requestsToday = 0;
      });
    }, 24 * 60 * 60 * 1000); // Every day

    // Health check every 5 minutes
    setInterval(() => {
      this.performHealthCheck();
    }, 5 * 60 * 1000);
  }

  private performHealthCheck(): void {
    const now = new Date();
    
    this.platformHealth.forEach((health, platform) => {
      // Auto-recovery από backoff αν έχει περάσει αρκετός χρόνος
      if (health.status === 'rate_limited' && now >= health.nextAllowedFetch) {
        health.status = 'healthy';
        health.currentBackoff = 0;
        console.log(`✅ ${platform} recovered from backoff`);
      }

      // Check για stale data (αν δεν έχουμε successful fetch > 24 ώρες)
      const staleThreshold = 24 * 60 * 60 * 1000;
      if (now.getTime() - health.lastSuccessfulFetch.getTime() > staleThreshold) {
        if (health.status === 'healthy') {
          health.status = 'degraded';
          console.warn(`⚠️ ${platform} data is stale (last successful fetch: ${health.lastSuccessfulFetch})`);
        }
      }
    });

    this.notifyStatusListeners();
  }

  // Settings & Control Methods

  public updateSettings(newSettings: Partial<FetchLimits>): void {
    this.userSettings = { ...this.userSettings, ...newSettings };
    this.persistData();
    console.log('📝 Fetch settings updated:', this.userSettings);
  }

  public enableFetching(): void {
    this.isEnabled = true;
    this.scheduleAutomaticFetches();
    console.log('✅ Data fetching enabled');
  }

  public disableFetching(): void {
    this.isEnabled = false;
    this.scheduledFetches.forEach(interval => clearInterval(interval));
    this.scheduledFetches.clear();
    console.log('🛑 Data fetching disabled');
  }

  // Status & Monitoring

  public getStatus(): {
    isEnabled: boolean;
    platforms: { [key: string]: PlatformHealth };
    settings: FetchLimits;
    stats: {
      totalFetches: number;
      successRate: number;
      avgResponseTime: number;
    };
  } {
    const platforms: { [key: string]: PlatformHealth } = {};
    this.platformHealth.forEach((health, platform) => {
      platforms[platform] = { ...health };
    });

    const totalFetches = this.fetchHistory.length;
    const successfulFetches = this.fetchHistory.filter(a => a.status === 'success').length;
    const successRate = totalFetches > 0 ? (successfulFetches / totalFetches) * 100 : 0;
    
    const avgResponseTime = this.fetchHistory
      .filter(a => a.status === 'success')
      .reduce((sum, a) => sum + a.duration, 0) / Math.max(successfulFetches, 1);

    return {
      isEnabled: this.isEnabled,
      platforms,
      settings: this.userSettings,
      stats: {
        totalFetches,
        successRate,
        avgResponseTime
      }
    };
  }

  public getRecentActivity(limit: number = 20): FetchAttempt[] {
    return this.fetchHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public onStatusChange(callback: (status: any) => void): () => void {
    this.statusListeners.push(callback);
    
    return () => {
      const index = this.statusListeners.indexOf(callback);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  private notifyStatusListeners(): void {
    const status = this.getStatus();
    this.statusListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('Error in status listener:', error);
      }
    });
  }

  // Persistence

  private persistData(): void {
    try {
      const data = {
        fetchHistory: this.fetchHistory.slice(-100), // Keep last 100 attempts
        platformHealth: Array.from(this.platformHealth.entries()),
        userSettings: this.userSettings,
        lastUpdated: new Date()
      };
      
      localStorage.setItem('ads_pro_fetch_manager', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist fetch manager data:', error);
    }
  }

  private loadPersistedData(): void {
    try {
      const stored = localStorage.getItem('ads_pro_fetch_manager');
      if (!stored) return;

      const data = JSON.parse(stored);
      
      if (data.fetchHistory) {
        this.fetchHistory = data.fetchHistory.map((attempt: any) => ({
          ...attempt,
          timestamp: new Date(attempt.timestamp)
        }));
      }

      if (data.platformHealth) {
        data.platformHealth.forEach(([platform, health]: [string, any]) => {
          this.platformHealth.set(platform, {
            ...health,
            lastSuccessfulFetch: new Date(health.lastSuccessfulFetch),
            nextAllowedFetch: new Date(health.nextAllowedFetch)
          });
        });
      }

      if (data.userSettings) {
        this.userSettings = data.userSettings;
      }

      console.log('✅ Fetch manager data loaded from storage');
    } catch (error) {
      console.error('Failed to load persisted data:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const dataFetchManager = SmartDataFetchManager.getInstance();