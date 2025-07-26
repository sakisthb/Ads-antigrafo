export interface CampaignData {
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
  [key: string]: any;
}

export interface AnalyticsResult {
  totalSpent: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  averageCTR: number;
  averageCPC: number;
  averageCPM: number;
  roas: number;
  topCampaigns: Array<{ name: string; spend: number; conversions: number; roas: number }>;
  audienceInsights: Array<{ demographic: string; percentage: number; performance: number }>;
  deviceBreakdown: Array<{ device: string; percentage: number; spend: number }>;
  recommendations: Array<{ type: 'success' | 'warning' | 'info'; title: string; description: string }>;
}

export class AnalyticsService {
  static processData(data: CampaignData[]): AnalyticsResult {
    // Filter out invalid rows
    const validData = data.filter(row => 
      row.spend && row.impressions && row.clicks && 
      !isNaN(parseFloat(row.spend)) && !isNaN(parseFloat(row.impressions))
    );

    if (validData.length === 0) {
      throw new Error('No valid data found in CSV');
    }

    // Calculate totals
    const totalSpent = validData.reduce((sum, row) => sum + parseFloat(row.spend || '0'), 0);
    const totalImpressions = validData.reduce((sum, row) => sum + parseFloat(row.impressions || '0'), 0);
    const totalClicks = validData.reduce((sum, row) => sum + parseFloat(row.clicks || '0'), 0);
    const totalConversions = validData.reduce((sum, row) => sum + parseFloat(row.conversions || '0'), 0);

    // Calculate averages
    const averageCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCPC = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const averageCPM = totalImpressions > 0 ? (totalSpent / totalImpressions) * 1000 : 0;
    const roas = totalSpent > 0 ? (totalConversions * 50) / totalSpent : 0; // Assuming $50 per conversion

    // Top campaigns
    const campaignData = validData.reduce((acc, row) => {
      const campaignName = row.campaignName || 'Unknown Campaign';
      if (!acc[campaignName]) {
        acc[campaignName] = { spend: 0, conversions: 0, impressions: 0 };
      }
      acc[campaignName].spend += parseFloat(row.spend || '0');
      acc[campaignName].conversions += parseFloat(row.conversions || '0');
      acc[campaignName].impressions += parseFloat(row.impressions || '0');
      return acc;
    }, {} as Record<string, { spend: number; conversions: number; impressions: number }>);

    const topCampaigns = Object.entries(campaignData)
      .map(([name, data]) => ({
        name,
        spend: data.spend,
        conversions: data.conversions,
        roas: data.spend > 0 ? (data.conversions * 50) / data.spend : 0
      }))
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 5);

    // Audience insights
    const ageData = validData.reduce((acc, row) => {
      const age = row.age || 'Unknown';
      if (!acc[age]) {
        acc[age] = { spend: 0, conversions: 0, impressions: 0 };
      }
      acc[age].spend += parseFloat(row.spend || '0');
      acc[age].conversions += parseFloat(row.conversions || '0');
      acc[age].impressions += parseFloat(row.impressions || '0');
      return acc;
    }, {} as Record<string, { spend: number; conversions: number; impressions: number }>);

    const audienceInsights = Object.entries(ageData)
      .map(([age, data]) => ({
        demographic: age,
        percentage: totalSpent > 0 ? (data.spend / totalSpent) * 100 : 0,
        performance: data.impressions > 0 ? (data.conversions / data.impressions) * 100 : 0
      }))
      .sort((a, b) => b.performance - a.performance);

    // Device breakdown
    const deviceData = validData.reduce((acc, row) => {
      const device = row.device || 'Unknown';
      if (!acc[device]) {
        acc[device] = { spend: 0, impressions: 0 };
      }
      acc[device].spend += parseFloat(row.spend || '0');
      acc[device].impressions += parseFloat(row.impressions || '0');
      return acc;
    }, {} as Record<string, { spend: number; impressions: number }>);

    const deviceBreakdown = Object.entries(deviceData)
      .map(([device, data]) => ({
        device,
        percentage: totalSpent > 0 ? (data.spend / totalSpent) * 100 : 0,
        spend: data.spend
      }))
      .sort((a, b) => b.spend - a.spend);

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      averageCTR,
      averageCPC,
      roas,
      totalSpend: totalSpent,
      totalConversions,
      audienceInsights,
      deviceBreakdown
    });

    return {
      totalSpent,
      totalImpressions,
      totalClicks,
      totalConversions,
      averageCTR,
      averageCPC,
      averageCPM,
      roas,
      topCampaigns,
      audienceInsights,
      deviceBreakdown,
      recommendations
    };
  }

  private static generateRecommendations(data: {
    averageCTR: number;
    averageCPC: number;
    roas: number;
    totalSpend: number;
    totalConversions: number;
    audienceInsights: Array<{ demographic: string; percentage: number; performance: number }>;
    deviceBreakdown: Array<{ device: string; percentage: number; spend: number }>;
  }): Array<{ type: 'success' | 'warning' | 'info'; title: string; description: string }> {
    const recommendations: Array<{ type: 'success' | 'warning' | 'info'; title: string; description: string }> = [];

    // CTR analysis
    if (data.averageCTR < 1.5) {
      recommendations.push({
        type: 'warning',
        title: 'Low Click-Through Rate',
        description: `Your CTR of ${data.averageCTR.toFixed(2)}% is below the industry average. Consider testing new ad creatives and improving targeting.`
      });
    } else if (data.averageCTR > 3) {
      recommendations.push({
        type: 'success',
        title: 'Excellent Click-Through Rate',
        description: `Your CTR of ${data.averageCTR.toFixed(2)}% is performing well above average. Consider scaling successful campaigns.`
      });
    }

    // ROAS analysis
    if (data.roas < 2) {
      recommendations.push({
        type: 'warning',
        title: 'Low Return on Ad Spend',
        description: `Your ROAS of ${data.roas.toFixed(2)}x is below the recommended 2x minimum. Review your conversion funnel and landing pages.`
      });
    } else if (data.roas > 4) {
      recommendations.push({
        type: 'success',
        title: 'Strong Return on Ad Spend',
        description: `Your ROAS of ${data.roas.toFixed(2)}x is excellent. Consider increasing budget allocation to high-performing campaigns.`
      });
    }

    // Best performing audience
    const bestAudience = data.audienceInsights[0];
    if (bestAudience && bestAudience.performance > 2) {
      recommendations.push({
        type: 'info',
        title: 'High-Performing Audience',
        description: `Age group ${bestAudience.demographic} shows the highest conversion rate at ${bestAudience.performance.toFixed(2)}%. Consider increasing budget allocation.`
      });
    }

    // Mobile optimization
    const mobileData = data.deviceBreakdown.find(d => d.device.toLowerCase().includes('mobile'));
    if (mobileData && mobileData.percentage > 50) {
      recommendations.push({
        type: 'info',
        title: 'Mobile-First Strategy',
        description: `${mobileData.percentage.toFixed(1)}% of your traffic comes from mobile. Ensure your landing pages are mobile-optimized.`
      });
    }

    return recommendations;
  }

  static getDemoData(): AnalyticsResult {
    return {
      totalSpent: 15420.50,
      totalImpressions: 1250000,
      totalClicks: 18750,
      totalConversions: 385,
      averageCTR: 1.5,
      averageCPC: 0.82,
      averageCPM: 12.34,
      roas: 3.2,
      topCampaigns: [
        { name: 'Κυριακή Εκπτώσεις 2024', spend: 5200, conversions: 145, roas: 4.2 },
        { name: 'Ενεργειακή Ευαισθητοποίηση Q2', spend: 3800, conversions: 89, roas: 2.9 },
        { name: 'Black Friday Special', spend: 2900, conversions: 67, roas: 3.1 },
        { name: 'Χειμερινή Συλλογή', spend: 2100, conversions: 45, roas: 2.7 },
        { name: 'Εαρινή Προώθηση', spend: 1420.50, conversions: 39, roas: 2.8 }
      ],
      audienceInsights: [
        { demographic: '25-34', percentage: 35, performance: 2.8 },
        { demographic: '35-44', percentage: 28, performance: 2.1 },
        { demographic: '18-24', percentage: 22, performance: 1.9 },
        { demographic: '45-54', percentage: 12, performance: 1.5 },
        { demographic: '55+', percentage: 3, performance: 0.8 }
      ],
      deviceBreakdown: [
        { device: 'Mobile', percentage: 65, spend: 10023.33 },
        { device: 'Desktop', percentage: 28, spend: 4317.74 },
        { device: 'Tablet', percentage: 7, spend: 1079.44 }
      ],
      recommendations: [
        {
          type: 'success',
          title: 'Εξαιρετική Απόδοση ROAS',
          description: 'Το ROAS σας 3.2x είναι πολύ καλό. Σκεφτείτε να αυξήσετε τον προϋπολογισμό στις καλύτερες καμπάνιες.'
        },
        {
          type: 'info',
          title: 'Καλή Απόδοση Mobile',
          description: 'Το 65% του traffic έρχεται από mobile. Βεβαιωθείτε ότι οι landing pages είναι mobile-optimized.'
        },
        {
          type: 'warning',
          title: 'Βελτίωση CTR',
          description: 'Το CTR σας 1.5% είναι κοντά στον μέσο όρο. Δοκιμάστε νέα ad creatives για καλύτερη απόδοση.'
        },
        {
          type: 'info',
          title: 'Καλύτερη Ομάδα Ηλικίας',
          description: 'Η ομάδα 25-34 ετών έχει την καλύτερη conversion rate (2.8%). Σκεφτείτε να αυξήσετε τον προϋπολογισμό.'
        }
      ]
    };
  }
} 