// Real-Time Streaming Analytics Engine
// Advanced Marketing Data Streams - 25+ Years Experience
// Simulates Kafka/Redis streams για live campaign monitoring

export interface LiveMetric {
  timestamp: Date;
  campaignId: string;
  campaignName: string;
  platform: 'meta' | 'google' | 'tiktok';
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  alert?: {
    type: 'danger' | 'warning' | 'success';
    message: string;
  };
}

export interface RealTimeEvent {
  id: string;
  timestamp: Date;
  type: 'click' | 'impression' | 'conversion' | 'cost_spike' | 'budget_threshold' | 'audience_fatigue';
  campaignId: string;
  platform: string;
  data: any;
  severity: 'low' | 'medium' | 'high';
  actionRequired: boolean;
}

export interface LiveCampaignStatus {
  id: string;
  name: string;
  platform: 'meta' | 'google' | 'tiktok';
  status: 'active' | 'paused' | 'ended' | 'error';
  spend: number;
  budget: number;
  budgetUtilization: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  lastUpdate: Date;
  alerts: number;
  performance: 'excellent' | 'good' | 'poor' | 'concerning';
}

class RealTimeAnalyticsEngine {
  private static instance: RealTimeAnalyticsEngine;
  private subscribers: Map<string, (data: any) => void> = new Map();
  private isStreaming: boolean = false;
  private streamInterval?: NodeJS.Timeout;
  private campaigns: LiveCampaignStatus[] = [];
  private events: RealTimeEvent[] = [];

  static getInstance(): RealTimeAnalyticsEngine {
    if (!RealTimeAnalyticsEngine.instance) {
      RealTimeAnalyticsEngine.instance = new RealTimeAnalyticsEngine();
    }
    return RealTimeAnalyticsEngine.instance;
  }

  constructor() {
    this.initializeCampaigns();
    this.initializeEvents();
  }

  private initializeCampaigns() {
    this.campaigns = [
      {
        id: 'camp_001',
        name: 'Summer Sale 2024 - Video Campaign',
        platform: 'meta',
        status: 'active',
        spend: 4250,
        budget: 5000,
        budgetUtilization: 85,
        impressions: 125000,
        clicks: 3500,
        conversions: 180,
        ctr: 2.8,
        cpc: 1.21,
        roas: 4.2,
        lastUpdate: new Date(),
        alerts: 1,
        performance: 'excellent'
      },
      {
        id: 'camp_002', 
        name: 'Product Launch - Search Ads',
        platform: 'google',
        status: 'active',
        spend: 2800,
        budget: 3500,
        budgetUtilization: 80,
        impressions: 85000,
        clicks: 2100,
        conversions: 95,
        ctr: 2.47,
        cpc: 1.33,
        roas: 3.8,
        lastUpdate: new Date(),
        alerts: 0,
        performance: 'good'
      },
      {
        id: 'camp_003',
        name: 'Gen-Z Retargeting - TikTok',
        platform: 'tiktok',
        status: 'active',
        spend: 1850,
        budget: 2000,
        budgetUtilization: 92.5,
        impressions: 95000,
        clicks: 4200,
        conversions: 85,
        ctr: 4.42,
        cpc: 0.44,
        roas: 2.1,
        lastUpdate: new Date(),
        alerts: 2,
        performance: 'concerning'
      },
      {
        id: 'camp_004',
        name: 'Lookalike Expansion - Meta',
        platform: 'meta',
        status: 'active',
        spend: 950,
        budget: 1200,
        budgetUtilization: 79.2,
        impressions: 45000,
        clicks: 950,
        conversions: 42,
        ctr: 2.11,
        cpc: 1.0,
        roas: 3.2,
        lastUpdate: new Date(),
        alerts: 0,
        performance: 'good'
      },
      {
        id: 'camp_005',
        name: 'Brand Awareness - Display',
        platform: 'google',
        status: 'paused',
        spend: 3200,
        budget: 4000,
        budgetUtilization: 80,
        impressions: 150000,
        clicks: 1200,
        conversions: 28,
        ctr: 0.8,
        cpc: 2.67,
        roas: 1.5,
        lastUpdate: new Date(),
        alerts: 3,
        performance: 'poor'
      }
    ];
  }

  private initializeEvents() {
    this.events = [
      {
        id: 'event_001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        type: 'conversion',
        campaignId: 'camp_001',
        platform: 'meta',
        data: { value: 125.50, product: 'Premium Package' },
        severity: 'low',
        actionRequired: false
      },
      {
        id: 'event_002',
        timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
        type: 'cost_spike',
        campaignId: 'camp_003',
        platform: 'tiktok',
        data: { message: 'CPC increased by 25%', oldCpc: 0.44, newCpc: 0.55 },
        severity: 'medium',
        actionRequired: true
      },
      {
        id: 'event_003',
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        type: 'budget_threshold',
        campaignId: 'camp_002',
        platform: 'google',
        data: { message: 'Budget utilization at 85%', utilization: 85 },
        severity: 'medium',
        actionRequired: true
      },
      {
        id: 'event_004',
        timestamp: new Date(Date.now() - 1 * 60 * 1000), // 1 minute ago
        type: 'click',
        campaignId: 'camp_001',
        platform: 'meta',
        data: { cpc: 1.21, quality: 'high' },
        severity: 'low',
        actionRequired: false
      }
    ];
  }

  // Start real-time streaming simulation
  startStreaming() {
    if (this.isStreaming) return;
    
    this.isStreaming = true;
    console.log('🔴 Real-time analytics streaming started');

    // Simulate live data updates every 2 seconds
    this.streamInterval = setInterval(() => {
      this.generateLiveUpdate();
    }, 2000);

    // Generate events every 5 seconds
    setInterval(() => {
      this.generateRealTimeEvent();
    }, 5000);
  }

  stopStreaming() {
    if (this.streamInterval) {
      clearInterval(this.streamInterval);
    }
    this.isStreaming = false;
    console.log('⏹️ Real-time analytics streaming stopped');
  }

  private generateLiveUpdate() {
    // Update campaign metrics με realistic fluctuations
    this.campaigns.forEach(campaign => {
      if (campaign.status === 'active') {
        // Simulate spend increase
        const spendIncrease = Math.random() * 10 + 2;
        campaign.spend += spendIncrease;
        campaign.budgetUtilization = (campaign.spend / campaign.budget) * 100;

        // Simulate traffic fluctuations
        const impressionIncrease = Math.floor(Math.random() * 500 + 100);
        const clickIncrease = Math.floor(impressionIncrease * (campaign.ctr / 100) * (0.8 + Math.random() * 0.4));
        const conversionIncrease = Math.floor(clickIncrease * 0.05 * (0.5 + Math.random()));
        
        campaign.impressions += impressionIncrease;
        campaign.clicks += clickIncrease;
        campaign.conversions += conversionIncrease;
        
        // Recalculate metrics
        campaign.ctr = (campaign.clicks / campaign.impressions) * 100;
        campaign.cpc = campaign.spend / campaign.clicks;
        campaign.roas = (campaign.conversions * 45) / campaign.spend; // Assuming €45 average order value
        
        // Update performance status
        campaign.performance = campaign.roas > 4 ? 'excellent' : 
                              campaign.roas > 3 ? 'good' :
                              campaign.roas > 2 ? 'poor' : 'concerning';

        // Generate alerts
        if (campaign.budgetUtilization > 90) {
          campaign.alerts++;
        }
        if (campaign.roas < 2) {
          campaign.alerts++;
        }

        campaign.lastUpdate = new Date();
      }
    });

    // Notify subscribers
    this.notifySubscribers('campaigns_update', this.campaigns);
    this.notifySubscribers('metrics_update', this.generateLiveMetrics());
  }

  private generateRealTimeEvent() {
    const eventTypes = ['click', 'impression', 'conversion', 'cost_spike', 'budget_threshold', 'audience_fatigue'];
    const campaigns = this.campaigns.filter(c => c.status === 'active');
    
    if (campaigns.length === 0) return;

    const randomCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const randomEventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const event: RealTimeEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type: randomEventType as any,
      campaignId: randomCampaign.id,
      platform: randomCampaign.platform,
      data: this.generateEventData(randomEventType, randomCampaign),
      severity: this.calculateEventSeverity(randomEventType, randomCampaign),
      actionRequired: this.shouldRequireAction(randomEventType, randomCampaign)
    };

    this.events.unshift(event);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(0, 100);
    }

    this.notifySubscribers('new_event', event);
    this.notifySubscribers('events_update', this.events.slice(0, 20));
  }

  private generateEventData(eventType: string, campaign: LiveCampaignStatus) {
    switch (eventType) {
      case 'cost_spike':
        return {
          previousCPC: campaign.cpc,
          currentCPC: campaign.cpc * (1.2 + Math.random() * 0.3),
          increase: Math.floor(20 + Math.random() * 30),
          message: `CPC αυξήθηκε κατά ${Math.floor(20 + Math.random() * 30)}% στην καμπάνια ${campaign.name}`
        };
      
      case 'budget_threshold':
        return {
          budgetUtilization: campaign.budgetUtilization,
          remainingBudget: campaign.budget - campaign.spend,
          estimatedTimeToDepletion: Math.floor(4 + Math.random() * 8),
          message: `Προσοχή: Το budget θα εξαντληθεί σε ${Math.floor(4 + Math.random() * 8)} ώρες`
        };
      
      case 'audience_fatigue':
        return {
          ctrDrop: Math.floor(15 + Math.random() * 25),
          frequency: Math.floor(3 + Math.random() * 4),
          message: `Audience fatigue detected: CTR έπεσε κατά ${Math.floor(15 + Math.random() * 25)}%`
        };
      
      case 'conversion':
        return {
          value: Math.floor(30 + Math.random() * 100),
          source: campaign.platform,
          conversionType: ['purchase', 'signup', 'lead'][Math.floor(Math.random() * 3)],
          message: `Νέα conversion €${Math.floor(30 + Math.random() * 100)} από ${campaign.platform}`
        };
      
      default:
        return {
          value: Math.floor(Math.random() * 100),
          message: `${eventType} event στην καμπάνια ${campaign.name}`
        };
    }
  }

  private calculateEventSeverity(eventType: string, campaign: LiveCampaignStatus): 'low' | 'medium' | 'high' {
    switch (eventType) {
      case 'cost_spike':
        return campaign.cpc > 2 ? 'high' : 'medium';
      case 'budget_threshold':
        return campaign.budgetUtilization > 95 ? 'high' : campaign.budgetUtilization > 85 ? 'medium' : 'low';
      case 'audience_fatigue':
        return campaign.ctr < 1.5 ? 'high' : 'medium';
      case 'conversion':
        return 'low';
      default:
        return 'medium';
    }
  }

  private shouldRequireAction(eventType: string, campaign: LiveCampaignStatus): boolean {
    switch (eventType) {
      case 'cost_spike':
        return campaign.cpc > 2.5;
      case 'budget_threshold':
        return campaign.budgetUtilization > 95;
      case 'audience_fatigue':
        return campaign.ctr < 1.0;
      default:
        return false;
    }
  }

  private generateLiveMetrics(): LiveMetric[] {
    const metrics = [];
    const metricTypes = ['impressions', 'clicks', 'conversions', 'spend', 'ctr', 'cpc', 'roas'];
    
    this.campaigns.filter(c => c.status === 'active').forEach(campaign => {
      metricTypes.forEach(metricType => {
        const baseValue = this.getMetricValue(campaign, metricType);
        const change = (Math.random() - 0.5) * 0.2; // ±10% change
        const trend = change > 0.05 ? 'up' : change < -0.05 ? 'down' : 'stable';
        
        let alert = undefined;
        if (metricType === 'cpc' && baseValue > 2) {
          alert = { type: 'warning' as const, message: 'CPC υψηλότερο από target' };
        }
        if (metricType === 'roas' && baseValue < 2) {
          alert = { type: 'danger' as const, message: 'ROAS κάτω από κόκκινη γραμμή' };
        }

        metrics.push({
          timestamp: new Date(),
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          metric: metricType,
          value: baseValue,
          change: Number((change * 100).toFixed(1)),
          trend,
          alert
        });
      });
    });

    return metrics;
  }

  private getMetricValue(campaign: LiveCampaignStatus, metric: string): number {
    switch (metric) {
      case 'impressions': return campaign.impressions;
      case 'clicks': return campaign.clicks;
      case 'conversions': return campaign.conversions;
      case 'spend': return Number(campaign.spend.toFixed(2));
      case 'ctr': return Number(campaign.ctr.toFixed(2));
      case 'cpc': return Number(campaign.cpc.toFixed(2));
      case 'roas': return Number(campaign.roas.toFixed(2));
      default: return 0;
    }
  }

  // Subscription methods
  subscribe(channel: string, callback: (data: any) => void): string {
    const id = Math.random().toString(36).substr(2, 9);
    this.subscribers.set(`${channel}_${id}`, callback);
    return id;
  }

  unsubscribe(id: string) {
    this.subscribers.delete(id);
  }

  private notifySubscribers(channel: string, data: any) {
    this.subscribers.forEach((callback, key) => {
      if (key.startsWith(channel)) {
        callback(data);
      }
    });
  }

  // Public methods
  getCampaigns(): LiveCampaignStatus[] {
    return this.campaigns;
  }

  getEvents(): RealTimeEvent[] {
    return this.events.slice(0, 20);
  }

  getLiveMetrics(): LiveMetric[] {
    return this.generateLiveMetrics();
  }

  getIsStreaming(): boolean {
    return this.isStreaming;
  }

  // Campaign controls
  pauseCampaign(campaignId: string) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      campaign.status = 'paused';
      this.notifySubscribers('campaigns_update', this.campaigns);
    }
  }

  resumeCampaign(campaignId: string) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      campaign.status = 'active';
      this.notifySubscribers('campaigns_update', this.campaigns);
    }
  }

  increaseBudget(campaignId: string, amount: number) {
    const campaign = this.campaigns.find(c => c.id === campaignId);
    if (campaign) {
      campaign.budget += amount;
      campaign.budgetUtilization = (campaign.spend / campaign.budget) * 100;
      this.notifySubscribers('campaigns_update', this.campaigns);
    }
  }
}

// Export singleton instance
export const realTimeEngine = RealTimeAnalyticsEngine.getInstance();