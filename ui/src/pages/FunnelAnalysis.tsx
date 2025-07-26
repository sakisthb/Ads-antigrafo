import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Target,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Clock,
  Filter,
  Download,
  Eye,
  Search,
} from "lucide-react";
import { FunnelAnalysisService, type FunnelAnalysis } from "@/lib/funnel-analysis";
import { FunnelAnalysisDashboard } from "@/components/funnel-analysis-dashboard";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExportDialog } from "@/components/export-dialog";
import { toast } from "sonner";

export function FunnelAnalysis() {
  const { t } = useTranslation();

  // Mock funnel data for demonstration
  const mockFunnelData: FunnelAnalysis = {
    // New funnel stages
    awareness: {
      name: t('funnelAnalysis.awarenessStage'),
      description: t('funnelAnalysis.awarenessDescription'),
      metrics: {
        impressions: 85000,
        clicks: 1700,
        conversions: 85,
        spend: 4250,
        ctr: 2.0,
        conversionRate: 5.0,
        costPerConversion: 50.0,
        revenue: 4250,
        roas: 1.0
      },
      color: "#3B82F6",
      icon: "Eye"
    },
    consideration: {
      name: t('funnelAnalysis.considerationStage'),
      description: t('funnelAnalysis.considerationDescription'),
      metrics: {
        impressions: 25000,
        clicks: 1250,
        conversions: 125,
        spend: 3750,
        ctr: 5.0,
        conversionRate: 10.0,
        costPerConversion: 30.0,
        revenue: 6250,
        roas: 1.67
      },
      color: "#10B981",
      icon: "Search"
    },
    conversion: {
      name: t('funnelAnalysis.conversionStage'),
      description: t('funnelAnalysis.conversionDescription'),
      metrics: {
        impressions: 15000,
        clicks: 1500,
        conversions: 300,
        spend: 7420,
        ctr: 10.0,
        conversionRate: 20.0,
        costPerConversion: 24.73,
        revenue: 15000,
        roas: 2.02
      },
      color: "#F59E0B",
      icon: "Target"
    },
    // Legacy aliases
    tofu: {
      name: t('funnelAnalysis.awarenessStage'),
      description: t('funnelAnalysis.awarenessDescription'),
      metrics: {
        impressions: 85000,
        clicks: 1700,
        conversions: 85,
        spend: 4250,
        ctr: 2.0,
        conversionRate: 5.0,
        costPerConversion: 50.0,
        revenue: 4250,
        roas: 1.0
      },
      color: "#3B82F6",
      icon: "Eye"
    },
    mofu: {
      name: t('funnelAnalysis.considerationStage'),
      description: t('funnelAnalysis.considerationDescription'),
      metrics: {
        impressions: 25000,
        clicks: 1250,
        conversions: 125,
        spend: 3750,
        ctr: 5.0,
        conversionRate: 10.0,
        costPerConversion: 30.0,
        revenue: 6250,
        roas: 1.67
      },
      color: "#10B981",
      icon: "Search"
    },
    bofu: {
      name: t('funnelAnalysis.conversionStage'),
      description: t('funnelAnalysis.conversionDescription'),
      metrics: {
        impressions: 15000,
        clicks: 1500,
        conversions: 300,
        spend: 7420,
        ctr: 10.0,
        conversionRate: 20.0,
        costPerConversion: 24.73,
        revenue: 15000,
        roas: 2.02
      },
      color: "#F59E0B",
      icon: "Target"
    },
    // Overall metrics
    totalImpressions: 125000,
    totalClicks: 4450,
    totalConversions: 510,
    totalSpend: 15420,
    totalRevenue: 25500,
    // Conversion rates
    awarenessToConsideration: 2.0,
    considerationToConversion: 24.0,
    tofuToMofu: 2.0,
    mofuToBofu: 24.0,
    overallConversion: 0.408,
    stagePerformance: {
      bestPerforming: 'bofu',
      worstPerforming: 'tofu',
      recommendations: [
        t('funnelAnalysis.improveAwarenessCreatives'),
        t('funnelAnalysis.optimizeConsiderationPages'),
        t('funnelAnalysis.reviewConversionPricing')
      ]
    },
    customerJourney: {
      averageTimeInFunnel: 14,
      dropOffPoints: [
        {
          stage: 'TOFU to MOFU',
          dropOffRate: 98.0,
          potentialRevenue: 8500
        }
      ],
      reEngagementOpportunities: [
        {
          stage: 'TOFU Audience',
          audienceSize: 8500,
          estimatedValue: 4250
        },
        {
          stage: 'MOFU Engaged',
          audienceSize: 250,
          estimatedValue: 1250
        }
      ]
    }
  };

  const getRecommendationIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'medium': return <Info className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRecommendationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800';
      case 'low': return 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800';
      default: return 'bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Breadcrumbs />
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('funnelAnalysis.title')}</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t('funnelAnalysis.subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <ExportDialog 
            dataType="funnel" 
            data={[
              {
                stage: 'TOFU - Awareness',
                impressions: mockFunnelData.tofu.metrics.impressions,
                clicks: mockFunnelData.tofu.metrics.clicks,
                conversions: mockFunnelData.tofu.metrics.conversions,
                rate: mockFunnelData.tofu.metrics.conversionRate,
                cost: mockFunnelData.tofu.metrics.spend,
                cpa: mockFunnelData.tofu.metrics.costPerConversion,
                dropoff_rate: 98.0
              },
              {
                stage: 'MOFU - Consideration',
                impressions: mockFunnelData.mofu.metrics.impressions,
                clicks: mockFunnelData.mofu.metrics.clicks,
                conversions: mockFunnelData.mofu.metrics.conversions,
                rate: mockFunnelData.mofu.metrics.conversionRate,
                cost: mockFunnelData.mofu.metrics.spend,
                cpa: mockFunnelData.mofu.metrics.costPerConversion,
                dropoff_rate: 90.0
              },
              {
                stage: 'BOFU - Conversion',
                impressions: mockFunnelData.bofu.metrics.impressions,
                clicks: mockFunnelData.bofu.metrics.clicks,
                conversions: mockFunnelData.bofu.metrics.conversions,
                rate: mockFunnelData.bofu.metrics.conversionRate,
                cost: mockFunnelData.bofu.metrics.spend,
                cpa: mockFunnelData.bofu.metrics.costPerConversion,
                dropoff_rate: 80.0
              }
            ]}
            trigger={
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Εξαγωγή
              </Button>
            }
          />
          <Button 
            onClick={() => {
              toast.info('Φίλτρα Funnel Analysis - Σύντομα διαθέσιμα!');
            }}
            className="w-full sm:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('funnelAnalysis.filters')}
          </Button>
        </div>
      </div>

      {/* Key Funnel KPIs */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('funnelAnalysis.tofuToMofu')}</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{mockFunnelData.tofuToMofu.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">-15.2%</span> {t('funnelAnalysis.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('funnelAnalysis.mofuToBofu')}</CardTitle>
            <Search className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{mockFunnelData.mofuToBofu.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.5%</span> {t('funnelAnalysis.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('funnelAnalysis.overallConversion')}</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{mockFunnelData.overallConversion.toFixed(3)}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.3%</span> {t('funnelAnalysis.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('funnelAnalysis.funnelROAS')}</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{(mockFunnelData.totalRevenue / mockFunnelData.totalSpend).toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.8%</span> {t('funnelAnalysis.fromLastPeriod')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Analysis Dashboard */}
      <FunnelAnalysisDashboard analysis={mockFunnelData} />

      {/* Funnel Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Zap className="w-5 h-5" />
            {t('funnelAnalysis.optimizationRecommendations')}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t('funnelAnalysis.optimizationSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {FunnelAnalysisService.generateFunnelRecommendations(mockFunnelData).map((rec, index) => (
              <div key={index} className={`p-3 sm:p-4 rounded-lg border ${getRecommendationColor(rec.priority)}`}>
                <div className="flex items-start gap-3">
                  {getRecommendationIcon(rec.priority)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h4 className="font-semibold text-sm sm:text-base">{t(rec.title) || rec.title}</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          {t(`funnelAnalysis.priority${rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)}`)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {t(`funnelAnalysis.effort${rec.effort.charAt(0).toUpperCase() + rec.effort.slice(1)}`)}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm mb-2">{t(rec.description) || rec.description}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {t('funnelAnalysis.impact')}: {rec.estimatedImpact}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('funnelAnalysis.category')}: {rec.category.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funnel Stage Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('funnelAnalysis.stagePerformanceComparison')}
          </CardTitle>
          <CardDescription>
            {t('funnelAnalysis.stagePerformanceDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* TOFU vs MOFU vs BOFU */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockFunnelData.tofu.metrics.ctr.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">TOFU CTR</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.tofu.metrics.impressions.toLocaleString()} εμφανίσεις
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockFunnelData.mofu.metrics.ctr.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">MOFU CTR</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.mofu.metrics.impressions.toLocaleString()} εμφανίσεις
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{mockFunnelData.bofu.metrics.ctr.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">BOFU CTR</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.bofu.metrics.impressions.toLocaleString()} εμφανίσεις
                </div>
              </div>
            </div>

            {/* Conversion Rates */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockFunnelData.tofu.metrics.conversionRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">TOFU Conversion</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.tofu.metrics.conversions.toLocaleString()} μετατροπές
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockFunnelData.mofu.metrics.conversionRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">MOFU Conversion</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.mofu.metrics.conversions.toLocaleString()} μετατροπές
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{mockFunnelData.bofu.metrics.conversionRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">BOFU Conversion</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {mockFunnelData.bofu.metrics.conversions.toLocaleString()} μετατροπές
                </div>
              </div>
            </div>

            {/* ROAS Comparison */}
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mockFunnelData.tofu.metrics.roas.toFixed(2)}x</div>
                <div className="text-sm text-muted-foreground">TOFU ROAS</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${mockFunnelData.tofu.metrics.revenue.toLocaleString()} έσοδα
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mockFunnelData.mofu.metrics.roas.toFixed(2)}x</div>
                <div className="text-sm text-muted-foreground">MOFU ROAS</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${mockFunnelData.mofu.metrics.revenue.toLocaleString()} έσοδα
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{mockFunnelData.bofu.metrics.roas.toFixed(2)}x</div>
                <div className="text-sm text-muted-foreground">BOFU ROAS</div>
                <div className="text-xs text-muted-foreground mt-1">
                  ${mockFunnelData.bofu.metrics.revenue.toLocaleString()} έσοδα
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 