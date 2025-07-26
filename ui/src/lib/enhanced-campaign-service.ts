import { type AdvancedCampaignData } from './advanced-analytics';

export interface EnhancedCampaignMetrics {
  // Basic Performance
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  
  // Core KPIs
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  
  // Sales & Revenue KPIs
  roas: number;
  costPerConversion: number;
  revenuePerConversion: number;
  totalRevenue: number;
  profitMargin: number;
  customerLifetimeValue: number;
  customerAcquisitionCost: number;
  
  // Advanced Sales KPIs
  averageOrderValue: number;
  repeatPurchaseRate: number;
  customerRetentionRate: number;
  churnRate: number;
  netPromoterScore: number;
  
  // Marketing Efficiency
  marketingQualifiedLeads: number;
  salesQualifiedLeads: number;
  leadToCustomerRate: number;
  salesCycleLength: number;
  
  // Attribution & ROI
  firstTouchAttribution: number;
  lastTouchAttribution: number;
  multiTouchAttribution: number;
  marketingROI: number;
  
  // Competitive Metrics
  marketShare: number;
  shareOfVoice: number;
  brandAwareness: number;
  competitivePosition: number;
}

export interface CampaignInsights {
  // Performance Trends
  trendAnalysis: {
    period: string;
    metric: string;
    currentValue: number;
    previousValue: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  
  // Anomaly Detection
  anomalies: {
    metric: string;
    value: number;
    expectedRange: [number, number];
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  
  // Predictive Analytics
  predictions: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    confidence: number;
    timeframe: string;
  }[];
  
  // Optimization Opportunities
  opportunities: {
    category: 'budget' | 'creative' | 'audience' | 'timing' | 'bidding';
    title: string;
    description: string;
    potentialImpact: number;
    effort: 'low' | 'medium' | 'high';
    priority: 'low' | 'medium' | 'high';
    estimatedROI: number;
  }[];
}

export class EnhancedCampaignService {
  static calculateEnhancedMetrics(data: AdvancedCampaignData[]): EnhancedCampaignMetrics {
    const validData = data.filter(row => 
      row.spend && row.impressions && row.clicks && 
      !isNaN(parseFloat(row.spend)) && !isNaN(parseFloat(row.impressions))
    );

    if (validData.length === 0) {
      throw new Error('No valid data found');
    }

    // Basic calculations
    const impressions = validData.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    const clicks = validData.reduce((sum, row) => sum + parseFloat(row.clicks || '0'), 0);
    const conversions = validData.reduce((sum, row) => sum + parseFloat(row.conversions || '0'), 0);
    const spend = validData.reduce((sum, row) => sum + parseFloat(row.spend || '0'), 0);

    // Core KPIs
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

    // Sales & Revenue KPIs
    const revenuePerConversion = 50; // Mock value
    const totalRevenue = conversions * revenuePerConversion;
    const roas = spend > 0 ? totalRevenue / spend : 0;
    const costPerConversion = conversions > 0 ? spend / conversions : 0;
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - spend) / totalRevenue) * 100 : 0;
    const customerLifetimeValue = revenuePerConversion * 3; // 3x repeat purchases
    const customerAcquisitionCost = costPerConversion;

    // Advanced Sales KPIs (mock calculations)
    const averageOrderValue = totalRevenue / conversions || 0;
    const repeatPurchaseRate = 0.35; // 35% repeat customers
    const customerRetentionRate = 0.68; // 68% retention
    const churnRate = 1 - customerRetentionRate;
    const netPromoterScore = 42; // Mock NPS score

    // Marketing Efficiency
    const marketingQualifiedLeads = clicks * 0.25; // 25% of clicks become MQLs
    const salesQualifiedLeads = marketingQualifiedLeads * 0.4; // 40% of MQLs become SQLs
    const leadToCustomerRate = salesQualifiedLeads > 0 ? (conversions / salesQualifiedLeads) * 100 : 0;
    const salesCycleLength = 14; // 14 days average

    // Attribution & ROI
    const firstTouchAttribution = totalRevenue * 0.3; // 30% first touch
    const lastTouchAttribution = totalRevenue * 0.4; // 40% last touch
    const multiTouchAttribution = totalRevenue * 0.3; // 30% multi-touch
    const marketingROI = spend > 0 ? ((totalRevenue - spend) / spend) * 100 : 0;

    // Competitive Metrics (mock data)
    const marketShare = 0.085; // 8.5% market share
    const shareOfVoice = 0.12; // 12% share of voice
    const brandAwareness = 0.23; // 23% brand awareness
    const competitivePosition = 0.65; // 65% competitive position

    return {
      impressions,
      clicks,
      conversions,
      spend,
      ctr,
      cpc,
      cpm,
      conversionRate,
      roas,
      costPerConversion,
      revenuePerConversion,
      totalRevenue,
      profitMargin,
      customerLifetimeValue,
      customerAcquisitionCost,
      averageOrderValue,
      repeatPurchaseRate,
      customerRetentionRate,
      churnRate,
      netPromoterScore,
      marketingQualifiedLeads,
      salesQualifiedLeads,
      leadToCustomerRate,
      salesCycleLength,
      firstTouchAttribution,
      lastTouchAttribution,
      multiTouchAttribution,
      marketingROI,
      marketShare,
      shareOfVoice,
      brandAwareness,
      competitivePosition
    };
  }

  static generateInsights(data: AdvancedCampaignData[]): CampaignInsights {
    const metrics = this.calculateEnhancedMetrics(data);
    
    // Trend Analysis
    const trendAnalysis = [
      {
        period: 'Last 30 days',
        metric: 'ROAS',
        currentValue: metrics.roas,
        previousValue: metrics.roas * 0.85, // Mock previous value
        change: ((metrics.roas - (metrics.roas * 0.85)) / (metrics.roas * 0.85)) * 100,
        trend: 'up' as const
      },
      {
        period: 'Last 30 days',
        metric: 'CTR',
        currentValue: metrics.ctr,
        previousValue: metrics.ctr * 0.92,
        change: ((metrics.ctr - (metrics.ctr * 0.92)) / (metrics.ctr * 0.92)) * 100,
        trend: 'up' as const
      },
      {
        period: 'Last 30 days',
        metric: 'Conversion Rate',
        currentValue: metrics.conversionRate,
        previousValue: metrics.conversionRate * 1.1,
        change: ((metrics.conversionRate - (metrics.conversionRate * 1.1)) / (metrics.conversionRate * 1.1)) * 100,
        trend: 'down' as const
      }
    ];

    // Anomaly Detection
    const anomalies = [];
    if (metrics.cpc > 5) {
      anomalies.push({
        metric: 'CPC',
        value: metrics.cpc,
        expectedRange: [2, 5] as [number, number],
        severity: 'high' as const,
        description: 'Cost per click is significantly above expected range'
      });
    }
    if (metrics.roas < 2) {
      anomalies.push({
        metric: 'ROAS',
        value: metrics.roas,
        expectedRange: [2, 5] as [number, number],
        severity: 'high' as const,
        description: 'Return on ad spend is below minimum threshold'
      });
    }

    // Predictive Analytics
    const predictions = [
      {
        metric: 'ROAS',
        currentValue: metrics.roas,
        predictedValue: metrics.roas * 1.15,
        confidence: 0.78,
        timeframe: 'Next 30 days'
      },
      {
        metric: 'Conversions',
        currentValue: metrics.conversions,
        predictedValue: metrics.conversions * 1.08,
        confidence: 0.82,
        timeframe: 'Next 30 days'
      }
    ];

    // Optimization Opportunities
    const opportunities = [];
    
    if (metrics.roas < 3) {
      opportunities.push({
        category: 'budget' as const,
        title: 'Budget Reallocation',
        description: 'Reallocate budget from low-performing campaigns to high-ROAS campaigns',
        potentialImpact: 25,
        effort: 'medium' as const,
        priority: 'high' as const,
        estimatedROI: 35
      });
    }

    if (metrics.ctr < 2) {
      opportunities.push({
        category: 'creative' as const,
        title: 'Creative Optimization',
        description: 'Test new ad creatives with stronger CTAs and compelling visuals',
        potentialImpact: 20,
        effort: 'low' as const,
        priority: 'medium' as const,
        estimatedROI: 25
      });
    }

    if (metrics.customerRetentionRate < 0.7) {
      opportunities.push({
        category: 'audience' as const,
        title: 'Retention Campaign',
        description: 'Implement retention campaigns to improve customer lifetime value',
        potentialImpact: 30,
        effort: 'high' as const,
        priority: 'medium' as const,
        estimatedROI: 40
      });
    }

    return {
      trendAnalysis,
      anomalies,
      predictions,
      opportunities
    };
  }

  static generateSalesReport(data: AdvancedCampaignData[]): any {
    const metrics = this.calculateEnhancedMetrics(data);
    const insights = this.generateInsights(data);

    return {
      summary: {
        totalRevenue: metrics.totalRevenue,
        totalSpent: metrics.spend,
        netProfit: metrics.totalRevenue - metrics.spend,
        profitMargin: metrics.profitMargin,
        roas: metrics.roas,
        customerAcquisitionCost: metrics.customerAcquisitionCost,
        customerLifetimeValue: metrics.customerLifetimeValue,
        ltvToCacRatio: metrics.customerLifetimeValue / metrics.customerAcquisitionCost
      },
      salesFunnel: {
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        conversions: metrics.conversions,
        conversionRate: metrics.conversionRate,
        costPerConversion: metrics.costPerConversion,
        revenuePerConversion: metrics.revenuePerConversion
      },
      customerMetrics: {
        averageOrderValue: metrics.averageOrderValue,
        repeatPurchaseRate: metrics.repeatPurchaseRate,
        customerRetentionRate: metrics.customerRetentionRate,
        churnRate: metrics.churnRate,
        netPromoterScore: metrics.netPromoterScore
      },
      marketingEfficiency: {
        marketingQualifiedLeads: metrics.marketingQualifiedLeads,
        salesQualifiedLeads: metrics.salesQualifiedLeads,
        leadToCustomerRate: metrics.leadToCustomerRate,
        salesCycleLength: metrics.salesCycleLength,
        marketingROI: metrics.marketingROI
      },
      insights: insights
    };
  }
} 