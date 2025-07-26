import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Activity,
  Filter,
  Download,
} from "lucide-react";

import { SalesKPIDashboard } from "@/components/sales-kpi-dashboard";
import { AdvancedAIDashboard } from '../components/advanced-ai-dashboard';
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { toast } from "sonner";

export function CampaignAnalysis() {
  const { t } = useTranslation();

  // Mock data for demonstration
  const mockData = {
    totalSpent: 15420.50,
    totalImpressions: 125000,
    totalClicks: 3200,
    totalConversions: 180,
    averageCTR: 2.56,
    averageCPC: 4.82,
    averageCPM: 12.34,
    conversionRate: 5.63,
    roas: 3.2,
    costPerConversion: 85.67,
    revenuePerConversion: 50,
    totalRevenue: 9000,
    profitMargin: 41.6,
    customerLifetimeValue: 150,
    reach: 45000,
    frequency: 2.78,
    qualityScore: 7.5,
    engagementRate: 3.2,
    videoViewRate: 1.8,
    topPerformingCampaigns: [
      { name: "Summer Sale 2024", spend: 5200, conversions: 45, roas: 4.3, ctr: 3.2, cpc: 3.8, qualityScore: 8.5 },
      { name: "Brand Awareness Q2", spend: 3800, conversions: 32, roas: 3.8, ctr: 2.8, cpc: 4.2, qualityScore: 7.2 },
      { name: "Product Launch", spend: 2800, conversions: 25, roas: 3.1, ctr: 2.1, cpc: 5.1, qualityScore: 6.8 }
    ],
    audienceInsights: [
      { demographic: "25-34", percentage: 35, performance: 4.2, roas: 4.1, conversionRate: 6.2 },
      { demographic: "35-44", percentage: 28, performance: 3.8, roas: 3.5, conversionRate: 5.1 },
      { demographic: "18-24", percentage: 22, performance: 3.2, roas: 2.8, conversionRate: 4.3 }
    ],
    deviceBreakdown: [
      { device: "Mobile", percentage: 65, spend: 10023, roas: 3.8, conversionRate: 6.1 },
      { device: "Desktop", percentage: 30, spend: 4626, roas: 2.4, conversionRate: 4.2 },
      { device: "Tablet", percentage: 5, spend: 771, roas: 2.8, conversionRate: 4.8 }
    ],
    dailyPerformance: [
      { date: "2024-06-01", impressions: 12000, clicks: 320, conversions: 18, spend: 450, revenue: 900, roas: 2.0 },
      { date: "2024-06-02", impressions: 13500, clicks: 380, conversions: 22, spend: 520, revenue: 1100, roas: 2.1 },
      { date: "2024-06-03", impressions: 11000, clicks: 290, conversions: 16, spend: 410, revenue: 800, roas: 1.9 }
    ],
    salesFunnel: {
      impressions: 125000,
      clicks: 3200,
      landingPageViews: 2720,
      addToCart: 408,
      purchases: 180,
      conversionRates: {
        clickToLanding: 85,
        landingToCart: 15,
        cartToPurchase: 44.1,
        overall: 0.14
      }
    },
    recommendations: [
      {
        type: 'success' as const,
        category: 'audience' as const,
        title: 'High-Performing Audience Identified',
        description: 'Age group 25-34 shows ROAS of 4.10x. Increase budget allocation by 30-50%.',
        impact: 'high' as const,
        estimatedImprovement: '25-35% overall ROAS improvement'
      },
      {
        type: 'warning' as const,
        category: 'creative' as const,
        title: 'Mobile Optimization Opportunity',
        description: '65% of traffic comes from mobile but conversion rate is lower than desktop.',
        impact: 'medium' as const,
        estimatedImprovement: '15-25% mobile conversion improvement'
      }
    ]
  };



  return (
    <div className="space-y-8">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-4">{t('campaignAnalysis.title')}</h1>
      <section>
        <h2 className="text-xl font-semibold mb-2">{t('campaignAnalysis.aiInsights')}</h2>
        <AdvancedAIDashboard />
      </section>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('campaignAnalysis.title')}</h1>
            <p className="text-muted-foreground">
              {t('campaignAnalysis.description')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                toast.info('Εξαγωγή αναφοράς - Σύντομα διαθέσιμη!');
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              {t('campaignAnalysis.exportReport')}
            </Button>
            <Button 
              onClick={() => {
                toast.info('Φίλτρα ανάλυσης - Σύντομα διαθέσιμα!');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              {t('campaignAnalysis.filters')}
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('campaignAnalysis.roas')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.roas.toFixed(2)}x</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+22.1%</span> {t('campaignAnalysis.fromLastPeriod')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('campaignAnalysis.profitMargin')}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.profitMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.5%</span> {t('campaignAnalysis.fromLastPeriod')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('campaignAnalysis.customerLTV')}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${mockData.customerLifetimeValue}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> {t('campaignAnalysis.fromLastPeriod')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('campaignAnalysis.qualityScore')}</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.qualityScore}/10</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.5</span> {t('campaignAnalysis.fromLastPeriod')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sales Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>{t('campaignAnalysis.salesFunnelAnalysis')}</CardTitle>
            <CardDescription>
              {t('campaignAnalysis.salesFunnelDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{mockData.salesFunnel.impressions.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{t('campaignAnalysis.impressions')}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mockData.salesFunnel.clicks.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{t('campaignAnalysis.clicks')}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{mockData.salesFunnel.landingPageViews.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{t('campaignAnalysis.landingPageViews')}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{mockData.salesFunnel.addToCart.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{t('campaignAnalysis.addToCart')}</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{mockData.salesFunnel.purchases.toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">{t('campaignAnalysis.purchases')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales KPIs Dashboard */}
        <SalesKPIDashboard metrics={{
          roas: mockData.roas,
          revenue: mockData.totalRevenue,
          conversionRate: mockData.conversionRate,
          cpa: mockData.costPerConversion,
          aov: mockData.totalRevenue / mockData.totalConversions,
          cac: mockData.costPerConversion,
          salesGrowth: 22.1,
          leadToSaleRate: 68.5,
          churnRate: 12.3
        }} />
      </div>
    </div>
  );
} 