export interface FunnelStage {
  name: string;
  description: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    conversionRate: number;
    costPerConversion: number;
    revenue: number;
    roas: number;
  };
  color: string;
  icon: string;
}

export interface FunnelAnalysis {
  // Top of Funnel - Awareness Stage
  awareness: FunnelStage;
  
  // Middle of Funnel - Consideration Stage
  consideration: FunnelStage;
  
  // Bottom of Funnel - Conversion Stage
  conversion: FunnelStage;
  
  // Legacy aliases for backward compatibility
  tofu: FunnelStage;
  mofu: FunnelStage;
  bofu: FunnelStage;
  
  // Overall Funnel Metrics
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  totalRevenue: number;
  
  // Funnel Conversion Rates
  awarenessToConsideration: number; // Awareness to Consideration
  considerationToConversion: number; // Consideration to Conversion
  tofuToMofu: number; // Legacy alias
  mofuToBofu: number; // Legacy alias
  overallConversion: number; // End-to-end conversion
  
  // Performance Analysis
  stagePerformance: {
    bestPerforming: 'awareness' | 'consideration' | 'conversion' | 'tofu' | 'mofu' | 'bofu';
    worstPerforming: 'awareness' | 'consideration' | 'conversion' | 'tofu' | 'mofu' | 'bofu';
    recommendations: string[];
  };
  
  // Customer Journey Analysis
  customerJourney: {
    averageTimeInFunnel: number; // days
    dropOffPoints: Array<{
      stage: string;
      dropOffRate: number;
      potentialRevenue: number;
    }>;
    reEngagementOpportunities: Array<{
      stage: string;
      audienceSize: number;
      estimatedValue: number;
    }>;
  };
}

export interface CampaignFunnelData {
  campaignName?: string;
  adSetName?: string;
  adName?: string;
  impressions?: string;
  clicks?: string;
  conversions?: string;
  spend?: string;
  funnelStage?: 'tofu' | 'mofu' | 'bofu';
  objective?: string;
  placement?: string;
  age?: string;
  gender?: string;
  device?: string;
  [key: string]: any;
}

export class FunnelAnalysisService {
  static analyzeFunnel(data: CampaignFunnelData[]): FunnelAnalysis {
    const validData = data.filter(row => 
      row.spend && row.impressions && row.clicks && 
      !isNaN(parseFloat(row.spend)) && !isNaN(parseFloat(row.impressions))
    );

    if (validData.length === 0) {
      throw new Error('No valid data found for funnel analysis');
    }

    // Categorize data by funnel stage
    const tofuData = this.categorizeByFunnelStage(validData, 'tofu');
    const mofuData = this.categorizeByFunnelStage(validData, 'mofu');
    const bofuData = this.categorizeByFunnelStage(validData, 'bofu');

    // Calculate stage metrics
    const tofu = this.calculateStageMetrics(tofuData, 'TOFU - Awareness', '#3B82F6', 'Eye');
    const mofu = this.calculateStageMetrics(mofuData, 'MOFU - Consideration', '#10B981', 'Search');
    const bofu = this.calculateStageMetrics(bofuData, 'BOFU - Conversion', '#F59E0B', 'Target');

    // Calculate overall metrics
    const totalImpressions = tofu.metrics.impressions + mofu.metrics.impressions + bofu.metrics.impressions;
    const totalClicks = tofu.metrics.clicks + mofu.metrics.clicks + bofu.metrics.clicks;
    const totalConversions = tofu.metrics.conversions + mofu.metrics.conversions + bofu.metrics.conversions;
    const totalSpend = tofu.metrics.spend + mofu.metrics.spend + bofu.metrics.spend;
    const totalRevenue = tofu.metrics.revenue + mofu.metrics.revenue + bofu.metrics.revenue;

    // Calculate funnel conversion rates
    const tofuToMofu = mofu.metrics.clicks > 0 ? (mofu.metrics.clicks / tofu.metrics.impressions) * 100 : 0;
    const mofuToBofu = bofu.metrics.conversions > 0 ? (bofu.metrics.conversions / mofu.metrics.clicks) * 100 : 0;
    const overallConversion = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;

    // Performance analysis
    const stagePerformance = this.analyzeStagePerformance(tofu, mofu, bofu);

    // Customer journey analysis
    const customerJourney = this.analyzeCustomerJourney(tofu, mofu, bofu);

    return {
      // New funnel stages
      awareness: tofu,
      consideration: mofu,
      conversion: bofu,
      
      // Legacy aliases for backward compatibility
      tofu,
      mofu,
      bofu,
      
      // Overall metrics
      totalImpressions,
      totalClicks,
      totalConversions,
      totalSpend,
      totalRevenue,
      
      // Conversion rates
      awarenessToConsideration: tofuToMofu,
      considerationToConversion: mofuToBofu,
      tofuToMofu,
      mofuToBofu,
      overallConversion,
      
      // Analysis
      stagePerformance,
      customerJourney
    };
  }

  private static categorizeByFunnelStage(data: CampaignFunnelData[], stage: 'tofu' | 'mofu' | 'bofu'): CampaignFunnelData[] {
    // If explicit funnel stage is provided, use it
    const explicitStageData = data.filter(row => row.funnelStage === stage);
    if (explicitStageData.length > 0) {
      return explicitStageData;
    }

    // Otherwise, categorize based on campaign objective and performance patterns
    return data.filter(row => {
      const objective = row.objective?.toLowerCase() || '';
      const ctr = parseFloat(row.clicks || '0') / parseFloat(row.impressions || '1');
      const conversionRate = parseFloat(row.conversions || '0') / parseFloat(row.clicks || '1');

      switch (stage) {
        case 'tofu':
          // Awareness campaigns: low CTR, low conversion rate
          return objective.includes('awareness') || 
                 objective.includes('reach') || 
                 (ctr < 0.02 && conversionRate < 0.01);
        
        case 'mofu':
          // Consideration campaigns: medium CTR, medium conversion rate
          return objective.includes('consideration') || 
                 objective.includes('traffic') || 
                 objective.includes('engagement') ||
                 (ctr >= 0.02 && ctr < 0.05 && conversionRate >= 0.01 && conversionRate < 0.05);
        
        case 'bofu':
          // Conversion campaigns: high CTR, high conversion rate
          return objective.includes('conversion') || 
                 objective.includes('sales') || 
                 objective.includes('purchase') ||
                 (ctr >= 0.05 && conversionRate >= 0.05);
        
        default:
          return false;
      }
    });
  }

  private static calculateStageMetrics(data: CampaignFunnelData[], name: string, color: string, icon: string): FunnelStage {
    const impressions = data.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    const clicks = data.reduce((sum, row) => sum + parseFloat(row.clicks || '0'), 0);
    const conversions = data.reduce((sum, row) => sum + parseFloat(row.conversions || '0'), 0);
    const spend = data.reduce((sum, row) => sum + parseFloat(row.spend || '0'), 0);

    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const costPerConversion = conversions > 0 ? spend / conversions : 0;
    const revenue = conversions * 50; // Mock revenue per conversion
    const roas = spend > 0 ? revenue / spend : 0;

    return {
      name,
      description: this.getStageDescription(name),
      metrics: {
        impressions,
        clicks,
        conversions,
        spend,
        ctr,
        conversionRate,
        costPerConversion,
        revenue,
        roas
      },
      color,
      icon
    };
  }

  private static getStageDescription(stageName: string): string {
    switch (stageName) {
      case 'TOFU - Awareness':
        return 'Top of funnel campaigns focused on brand awareness and reaching new audiences';
      case 'MOFU - Consideration':
        return 'Middle of funnel campaigns targeting users who are considering your product';
      case 'BOFU - Conversion':
        return 'Bottom of funnel campaigns focused on converting interested users into customers';
      default:
        return '';
    }
  }

  private static analyzeStagePerformance(tofu: FunnelStage, mofu: FunnelStage, bofu: FunnelStage) {
    const stages = [
      { name: 'tofu', stage: tofu, score: tofu.metrics.roas * tofu.metrics.conversionRate },
      { name: 'mofu', stage: mofu, score: mofu.metrics.roas * mofu.metrics.conversionRate },
      { name: 'bofu', stage: bofu, score: bofu.metrics.roas * bofu.metrics.conversionRate }
    ];

    stages.sort((a, b) => b.score - a.score);
    
    const recommendations = [];
    
    // Generate recommendations based on performance
    if (tofu.metrics.ctr < 1) {
      recommendations.push('funnelAnalysis.improveAwarenessCreatives');
    }
    
    if (mofu.metrics.conversionRate < 2) {
      recommendations.push('funnelAnalysis.optimizeConsiderationPages');
    }
    
    if (bofu.metrics.roas < 2) {
      recommendations.push('funnelAnalysis.reviewConversionPricing');
    }

    return {
      bestPerforming: stages[0].name as 'tofu' | 'mofu' | 'bofu',
      worstPerforming: stages[2].name as 'tofu' | 'mofu' | 'bofu',
      recommendations
    };
  }

  private static analyzeCustomerJourney(tofu: FunnelStage, mofu: FunnelStage, bofu: FunnelStage) {
    // Calculate drop-off points
    const dropOffPoints = [];
    
    const tofuToMofuDropOff = 100 - ((mofu.metrics.clicks / tofu.metrics.impressions) * 100);
    if (tofuToMofuDropOff > 80) {
      dropOffPoints.push({
        stage: 'TOFU to MOFU',
        dropOffRate: tofuToMofuDropOff,
        potentialRevenue: mofu.metrics.impressions * 0.02 * 50 // Estimated potential
      });
    }

    const mofuToBofuDropOff = 100 - ((bofu.metrics.conversions / mofu.metrics.clicks) * 100);
    if (mofuToBofuDropOff > 70) {
      dropOffPoints.push({
        stage: 'MOFU to BOFU',
        dropOffRate: mofuToBofuDropOff,
        potentialRevenue: mofu.metrics.clicks * 0.05 * 50 // Estimated potential
      });
    }

    // Re-engagement opportunities
    const reEngagementOpportunities = [];
    
    if (tofu.metrics.impressions > 10000) {
      reEngagementOpportunities.push({
        stage: 'TOFU Audience',
        audienceSize: tofu.metrics.impressions * 0.1, // 10% of impressions
        estimatedValue: tofu.metrics.impressions * 0.1 * 0.01 * 50
      });
    }

    if (mofu.metrics.clicks > 500) {
      reEngagementOpportunities.push({
        stage: 'MOFU Engaged',
        audienceSize: mofu.metrics.clicks * 0.2, // 20% of clicks
        estimatedValue: mofu.metrics.clicks * 0.2 * 0.05 * 50
      });
    }

    return {
      averageTimeInFunnel: 14, // Mock average days
      dropOffPoints,
      reEngagementOpportunities
    };
  }

  static generateFunnelRecommendations(analysis: FunnelAnalysis): Array<{
    category: 'tofu' | 'mofu' | 'bofu' | 'overall';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    estimatedImpact: string;
    effort: 'low' | 'medium' | 'high';
  }> {
    const recommendations = [];

    // TOFU recommendations
    if (analysis.tofu.metrics.ctr < 1.5) {
      recommendations.push({
        category: 'tofu' as const,
        priority: 'high' as const,
        title: 'funnelAnalysis.improveAwarenessCreativesTitle',
        description: 'funnelAnalysis.improveAwarenessCreativesDesc',
        estimatedImpact: '20-40% CTR improvement',
        effort: 'medium' as const
      });
    }

    if (analysis.tofuToMofu < 5) {
      recommendations.push({
        category: 'tofu' as const,
        priority: 'high' as const,
        title: 'funnelAnalysis.optimizeAwarenessFlowTitle',
        description: 'funnelAnalysis.optimizeAwarenessFlowDesc',
        estimatedImpact: '15-30% funnel improvement',
        effort: 'high' as const
      });
    }

    // MOFU recommendations
    if (analysis.mofu.metrics.conversionRate < 3) {
      recommendations.push({
        category: 'mofu' as const,
        priority: 'medium' as const,
        title: 'funnelAnalysis.enhanceConsiderationPagesTitle',
        description: 'funnelAnalysis.enhanceConsiderationPagesDesc',
        estimatedImpact: '25-50% conversion improvement',
        effort: 'medium' as const
      });
    }

    // BOFU recommendations
    if (analysis.bofu.metrics.roas < 2) {
      recommendations.push({
        category: 'bofu' as const,
        priority: 'high' as const,
        title: 'funnelAnalysis.optimizeConversionOffersTitle',
        description: 'funnelAnalysis.optimizeConversionOffersDesc',
        estimatedImpact: '30-60% ROAS improvement',
        effort: 'low' as const
      });
    }

    // Overall recommendations
    if (analysis.overallConversion < 0.1) {
      recommendations.push({
        category: 'overall' as const,
        priority: 'high' as const,
        title: 'funnelAnalysis.endToEndOptimizationTitle',
        description: 'funnelAnalysis.endToEndOptimizationDesc',
        estimatedImpact: '40-80% overall improvement',
        effort: 'high' as const
      });
    }

    return recommendations;
  }
} 