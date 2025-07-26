export interface AdvancedCampaignData {
  campaignName?: string;
  adSetName?: string;
  adName?: string;
  impressions?: string;
  clicks?: string;
  conversions?: string;
  spend?: string;
  cpc?: string;
  cpm?: string;
  date?: string;
  age?: string;
  gender?: string;
  device?: string;
  reach?: string;
  frequency?: string;
  qualityRanking?: string;
  engagementRate?: string;
  videoViews?: string;
  videoViewRate?: string;
  [key: string]: any;
}

export interface AdvancedAnalyticsResult {
  // Basic Metrics
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  
  // Performance Metrics
  averageCTR: number;
  averageCPC: number;
  averageCPM: number;
  conversionRate: number;
  
  // Sales & Revenue KPIs
  roas: number;
  costPerConversion: number;
  revenuePerConversion: number;
  totalRevenue: number;
  profitMargin: number;
  customerLifetimeValue: number;
  
  // Advanced KPIs
  reach: number;
  frequency: number;
  qualityScore: number;
  engagementRate: number;
  videoViewRate: number;
  
  // Campaign Performance Analysis
  topPerformingCampaigns: Array<{
    name: string;
    spend: number;
    conversions: number;
    roas: number;
    ctr: number;
    cpc: number;
    qualityScore: number;
  }>;
  
  // Audience Insights
  audienceInsights: Array<{
    demographic: string;
    percentage: number;
    performance: number;
    roas: number;
    conversionRate: number;
  }>;
  
  // Device Performance
  deviceBreakdown: Array<{
    device: string;
    percentage: number;
    spend: number;
    roas: number;
    conversionRate: number;
  }>;
  
  // Time-based Analysis
  dailyPerformance: Array<{
    date: string;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    revenue: number;
    roas: number;
  }>;
  
  // Recommendations
  recommendations: Array<{
    type: 'success' | 'warning' | 'info' | 'critical';
    category: 'budget' | 'creative' | 'audience' | 'timing' | 'bidding';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    estimatedImprovement: string;
  }>;
  
  // Sales Funnel Analysis
  salesFunnel: {
    impressions: number;
    clicks: number;
    landingPageViews: number;
    addToCart: number;
    purchases: number;
    conversionRates: {
      clickToLanding: number;
      landingToCart: number;
      cartToPurchase: number;
      overall: number;
    };
  };
}

export class AdvancedAnalyticsService {
  static processData(data: AdvancedCampaignData[]): AdvancedAnalyticsResult {
    const validData = data.filter(row => 
      row.spend && row.impressions && row.clicks && 
      !isNaN(parseFloat(row.spend)) && !isNaN(parseFloat(row.impressions))
    );

    if (validData.length === 0) {
      throw new Error('No valid data found in CSV');
    }

    // Basic calculations
    const totalSpent = validData.reduce((sum, row) => sum + parseFloat(row.spend || '0'), 0);
    const totalImpressions = validData.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    const totalClicks = validData.reduce((sum, row) => sum + parseFloat(row.clicks || '0'), 0);
    const totalConversions = validData.reduce((sum, row) => sum + parseFloat(row.conversions || '0'), 0);

    // Performance metrics
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCPC = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const averageCPM = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
    const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Sales & Revenue KPIs (assuming $50 per conversion for demo)
    const revenuePerConversion = 50;
    const totalRevenue = totalConversions * revenuePerConversion;
    const roas = totalSpent > 0 ? totalRevenue / totalSpent : 0;
    const costPerConversion = totalConversions > 0 ? totalSpent / totalConversions : 0;
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalSpent) / totalRevenue) * 100 : 0;
    const customerLifetimeValue = revenuePerConversion * 3; // Assuming 3x repeat purchases

    // Advanced KPIs
    const reach = validData.reduce((sum, row) => sum + parseFloat(row.reach || '0'), 0);
    const frequency = reach > 0 ? totalImpressions / reach : 0;
    const qualityScore = this.calculateQualityScore(validData);
    const engagementRate = this.calculateEngagementRate(validData);
    const videoViewRate = this.calculateVideoViewRate(validData);

    // Campaign performance analysis
    const topPerformingCampaigns = this.analyzeCampaignPerformance(validData);

    // Audience insights
    const audienceInsights = this.analyzeAudiencePerformance(validData, totalSpent);

    // Device breakdown
    const deviceBreakdown = this.analyzeDevicePerformance(validData, totalSpent);

    // Daily performance
    const dailyPerformance = this.analyzeDailyPerformance(validData);

    // Sales funnel
    const salesFunnel = this.analyzeSalesFunnel(validData);

    // Generate recommendations
    const recommendations = this.generateAdvancedRecommendations({
      totalSpent,
      totalConversions,
      averageCTR,
      averageCPC,
      roas,
      conversionRate,
      qualityScore,
      audienceInsights,
      deviceBreakdown,
      salesFunnel
    });

    return {
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      averageCTR,
      averageCPC,
      averageCPM,
      conversionRate,
      roas,
      costPerConversion,
      revenuePerConversion,
      totalRevenue,
      profitMargin,
      customerLifetimeValue,
      reach,
      frequency,
      qualityScore,
      engagementRate,
      videoViewRate,
      topPerformingCampaigns,
      audienceInsights,
      deviceBreakdown,
      dailyPerformance,
      recommendations,
      salesFunnel
    };
  }

  private static calculateQualityScore(data: AdvancedCampaignData[]): number {
    // Mock quality score calculation based on CTR, engagement, and other factors
    const avgCTR = data.reduce((sum, row) => {
      const impressions = parseFloat(row.impressions || '0');
      const clicks = parseFloat(row.clicks || '0');
      return sum + (impressions > 0 ? (clicks / impressions) * 100 : 0);
    }, 0) / data.length;

    // Quality score 1-10 based on performance
    if (avgCTR > 3) return 9;
    if (avgCTR > 2) return 7;
    if (avgCTR > 1) return 5;
    return 3;
  }

  private static calculateEngagementRate(data: AdvancedCampaignData[]): number {
    // Mock engagement rate calculation
    const totalEngagements = data.reduce((sum, row) => {
      const clicks = parseFloat(row.clicks || '0');
      const videoViews = parseFloat(row.videoViews || '0');
      return sum + clicks + (videoViews * 0.5);
    }, 0);
    
    const totalImpressions = data.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    return totalImpressions > 0 ? (totalEngagements / totalImpressions) * 100 : 0;
  }

  private static calculateVideoViewRate(data: AdvancedCampaignData[]): number {
    const totalVideoViews = data.reduce((sum, row) => sum + parseFloat(row.videoViews || '0'), 0);
    const totalImpressions = data.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    return totalImpressions > 0 ? (totalVideoViews / totalImpressions) * 100 : 0;
  }

  private static analyzeCampaignPerformance(data: AdvancedCampaignData[]) {
    const campaignData = data.reduce((acc, row) => {
      const campaignName = row.campaignName || 'Unknown Campaign';
      if (!acc[campaignName]) {
        acc[campaignName] = { 
          spend: 0, 
          conversions: 0, 
          impressions: 0, 
          clicks: 0,
          qualityScore: 0
        };
      }
      acc[campaignName].spend += parseFloat(row.spend || '0');
      acc[campaignName].conversions += parseFloat(row.conversions || '0');
      acc[campaignName].impressions += parseFloat(row.impressions || '0');
      acc[campaignName].clicks += parseFloat(row.clicks || '0');
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(campaignData)
      .map(([name, data]) => ({
        name,
        spend: data.spend,
        conversions: data.conversions,
        roas: data.spend > 0 ? (data.conversions * 50) / data.spend : 0,
        ctr: data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0,
        cpc: data.clicks > 0 ? data.spend / data.clicks : 0,
        qualityScore: this.calculateQualityScore([{ impressions: data.impressions.toString(), clicks: data.clicks.toString() }])
      }))
      .sort((a, b) => b.roas - a.roas)
      .slice(0, 5);
  }

  private static analyzeAudiencePerformance(data: AdvancedCampaignData[], totalSpent: number) {
    const ageData = data.reduce((acc, row) => {
      const age = row.age || 'Unknown';
      if (!acc[age]) {
        acc[age] = { spend: 0, conversions: 0, impressions: 0 };
      }
      acc[age].spend += parseFloat(row.spend || '0');
      acc[age].conversions += parseFloat(row.conversions || '0');
      acc[age].impressions += parseFloat(row.impressions || '0');
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(ageData)
      .map(([age, data]) => ({
        demographic: age,
        percentage: totalSpent > 0 ? (data.spend / totalSpent) * 100 : 0,
        performance: data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0,
        roas: data.spend > 0 ? (data.conversions * 50) / data.spend : 0,
        conversionRate: data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0
      }))
      .sort((a, b) => b.performance - a.performance);
  }

  private static analyzeDevicePerformance(data: AdvancedCampaignData[], totalSpent: number) {
    const deviceData = data.reduce((acc, row) => {
      const device = row.device || 'Unknown';
      if (!acc[device]) {
        acc[device] = { spend: 0, impressions: 0, conversions: 0 };
      }
      acc[device].spend += parseFloat(row.spend || '0');
      acc[device].impressions += parseFloat(row.impressions || '0');
      acc[device].conversions += parseFloat(row.conversions || '0');
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(deviceData)
      .map(([device, data]) => ({
        device,
        percentage: totalSpent > 0 ? (data.spend / totalSpent) * 100 : 0,
        spend: data.spend,
        roas: data.spend > 0 ? (data.conversions * 50) / data.spend : 0,
        conversionRate: data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0
      }))
      .sort((a, b) => b.spend - a.spend);
  }

  private static analyzeDailyPerformance(data: AdvancedCampaignData[]) {
    const dailyData = data.reduce((acc, row) => {
      const date = row.date || new Date().toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { impressions: 0, clicks: 0, conversions: 0, spend: 0 };
      }
      acc[date].impressions += parseFloat(row.impressions || '0');
      acc[date].clicks += parseFloat(row.clicks || '0');
      acc[date].conversions += parseFloat(row.conversions || '0');
      acc[date].spend += parseFloat(row.spend || '0');
      return acc;
    }, {} as Record<string, any>);

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        impressions: data.impressions,
        clicks: data.clicks,
        conversions: data.conversions,
        spend: data.spend,
        revenue: data.conversions * 50,
        roas: data.spend > 0 ? (data.conversions * 50) / data.spend : 0
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  private static analyzeSalesFunnel(data: AdvancedCampaignData[]) {
    const totalImpressions = data.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    const totalClicks = data.reduce((sum, row) => sum + parseFloat(row.clicks || '0'), 0);
    const totalConversions = data.reduce((sum, row) => sum + parseFloat(row.conversions || '0'), 0);
    
    // Mock funnel data (in real app, this would come from actual funnel tracking)
    const landingPageViews = totalClicks * 0.85; // 85% of clicks reach landing page
    const addToCart = landingPageViews * 0.15; // 15% add to cart
    const purchases = totalConversions;

    return {
      impressions: totalImpressions,
      clicks: totalClicks,
      landingPageViews,
      addToCart,
      purchases,
      conversionRates: {
        clickToLanding: totalClicks > 0 ? (landingPageViews / totalClicks) * 100 : 0,
        landingToCart: landingPageViews > 0 ? (addToCart / landingPageViews) * 100 : 0,
        cartToPurchase: addToCart > 0 ? (purchases / addToCart) * 100 : 0,
        overall: totalImpressions > 0 ? (purchases / totalImpressions) * 100 : 0
      }
    };
  }

  private static generateAdvancedRecommendations(data: any) {
    const recommendations = [];

    // Budget optimization
    if (data.roas < 2) {
      recommendations.push({
        type: 'critical' as const,
        category: 'budget' as const,
        title: 'Low ROAS - Budget Reallocation Needed',
        description: `Your ROAS of ${data.roas.toFixed(2)}x is below the recommended 2x minimum. Consider reallocating budget to higher-performing campaigns.`,
        impact: 'high' as const,
        estimatedImprovement: '20-40% ROAS improvement'
      });
    }

    // Creative optimization
    if (data.averageCTR < 1.5) {
      recommendations.push({
        type: 'warning' as const,
        category: 'creative' as const,
        title: 'Low Click-Through Rate',
        description: `Your CTR of ${data.averageCTR.toFixed(2)}% is below industry average. Test new ad creatives with stronger CTAs.`,
        impact: 'medium' as const,
        estimatedImprovement: '15-25% CTR improvement'
      });
    }

    // Audience optimization
    const bestAudience = data.audienceInsights[0];
    if (bestAudience && bestAudience.roas > 3) {
      recommendations.push({
        type: 'success' as const,
        category: 'audience' as const,
        title: 'High-Performing Audience Identified',
        description: `${bestAudience.demographic} shows ROAS of ${bestAudience.roas.toFixed(2)}x. Increase budget allocation by 30-50%.`,
        impact: 'high' as const,
        estimatedImprovement: '25-35% overall ROAS improvement'
      });
    }

    // Bidding optimization
    if (data.averageCPC > 3) {
      recommendations.push({
        type: 'warning' as const,
        category: 'bidding' as const,
        title: 'High Cost Per Click',
        description: `Your CPC of $${data.averageCPC.toFixed(2)} is above optimal. Consider adjusting bid strategies and targeting.`,
        impact: 'medium' as const,
        estimatedImprovement: '10-20% cost reduction'
      });
    }

    // Timing optimization
    recommendations.push({
      type: 'info' as const,
      category: 'timing' as const,
      title: 'Peak Performance Hours',
      description: 'Analyze hourly performance data to identify optimal ad scheduling times.',
      impact: 'low' as const,
      estimatedImprovement: '5-15% efficiency improvement'
    });

    return recommendations;
  }
} 