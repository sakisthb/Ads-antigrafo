import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Filter,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Target,
  Activity,
  ArrowUpRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useState } from "react";
import { SalesKPIDashboard } from "@/components/sales-kpi-dashboard";
import { FunnelAnalysisDashboard } from "@/components/funnel-analysis-dashboard";
import { AdvancedAnalyticsDashboard } from "@/components/advanced-analytics-dashboard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExportDialog } from "@/components/export-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
  reach: number;
  frequency: number;
  unique_clicks: number;
  unique_ctr: number;
  cost_per_unique_click: number;
  unique_link_clicks: number;
  unique_link_click_ctr: number;
  cost_per_unique_link_click: number;
}

export function Analytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const { t } = useTranslation();

  const mockPerformanceData: PerformanceData[] = [
    { 
      date: '2024-06-01', 
      impressions: 12000, 
      clicks: 320, 
      conversions: 18, 
      spend: 450, 
      revenue: 1800,
      ctr: 2.67, cpc: 1.41, cpa: 25.0, roas: 4.0,
      reach: 8500, frequency: 1.41,
      unique_clicks: 280, unique_ctr: 3.29, cost_per_unique_click: 1.61,
      unique_link_clicks: 250, unique_link_click_ctr: 2.94, cost_per_unique_link_click: 1.8
    },
    { 
      date: '2024-06-02', 
      impressions: 13500, 
      clicks: 380, 
      conversions: 22, 
      spend: 520, 
      revenue: 2200,
      ctr: 2.81, cpc: 1.37, cpa: 23.64, roas: 4.23,
      reach: 9200, frequency: 1.47,
      unique_clicks: 340, unique_ctr: 3.7, cost_per_unique_click: 1.53,
      unique_link_clicks: 300, unique_link_click_ctr: 3.26, cost_per_unique_link_click: 1.73
    },
    { 
      date: '2024-06-03', 
      impressions: 11000, 
      clicks: 290, 
      conversions: 16, 
      spend: 410, 
      revenue: 1600,
      ctr: 2.64, cpc: 1.41, cpa: 25.63, roas: 3.9,
      reach: 7800, frequency: 1.41,
      unique_clicks: 260, unique_ctr: 3.33, cost_per_unique_click: 1.58,
      unique_link_clicks: 230, unique_link_click_ctr: 2.95, cost_per_unique_link_click: 1.78
    },
    { 
      date: '2024-06-04', 
      impressions: 14200, 
      clicks: 420, 
      conversions: 25, 
      spend: 580, 
      revenue: 2500,
      ctr: 2.96, cpc: 1.38, cpa: 23.2, roas: 4.31,
      reach: 9800, frequency: 1.45,
      unique_clicks: 380, unique_ctr: 3.88, cost_per_unique_click: 1.53,
      unique_link_clicks: 340, unique_link_click_ctr: 3.47, cost_per_unique_link_click: 1.71
    },
    { 
      date: '2024-06-05', 
      impressions: 12800, 
      clicks: 350, 
      conversions: 20, 
      spend: 490, 
      revenue: 2000,
      ctr: 2.73, cpc: 1.4, cpa: 24.5, roas: 4.08,
      reach: 8900, frequency: 1.44,
      unique_clicks: 310, unique_ctr: 3.48, cost_per_unique_click: 1.58,
      unique_link_clicks: 280, unique_link_click_ctr: 3.15, cost_per_unique_link_click: 1.75
    },
    { 
      date: '2024-06-06', 
      impressions: 15600, 
      clicks: 480, 
      conversions: 28, 
      spend: 650, 
      revenue: 2800,
      ctr: 3.08, cpc: 1.35, cpa: 23.21, roas: 4.31,
      reach: 10500, frequency: 1.49,
      unique_clicks: 430, unique_ctr: 4.1, cost_per_unique_click: 1.51,
      unique_link_clicks: 390, unique_link_click_ctr: 3.71, cost_per_unique_link_click: 1.67
    },
    { 
      date: '2024-06-07', 
      impressions: 13900, 
      clicks: 390, 
      conversions: 23, 
      spend: 540, 
      revenue: 2300,
      ctr: 2.81, cpc: 1.38, cpa: 23.48, roas: 4.26,
      reach: 9500, frequency: 1.46,
      unique_clicks: 350, unique_ctr: 3.68, cost_per_unique_click: 1.54,
      unique_link_clicks: 320, unique_link_click_ctr: 3.37, cost_per_unique_link_click: 1.69
    },
  ];

  const audienceData = [
    { age: '18-24', percentage: 15, spend: 1200 },
    { age: '25-34', percentage: 35, spend: 2800 },
    { age: '35-44', percentage: 25, spend: 2000 },
    { age: '45-54', percentage: 15, spend: 1200 },
    { age: '55+', percentage: 10, spend: 800 },
  ];

  const deviceData = [
    { device: 'Mobile', percentage: 65, spend: 5200 },
    { device: 'Desktop', percentage: 30, spend: 2400 },
    { device: 'Tablet', percentage: 5, spend: 400 },
  ];

  const getMetricValue = (data: PerformanceData[], metric: string) => {
    return data.reduce((sum, item) => sum + (item as any)[metric], 0);
  };

  const totalImpressions = getMetricValue(mockPerformanceData, 'impressions');
  const totalClicks = getMetricValue(mockPerformanceData, 'clicks');
  const totalConversions = getMetricValue(mockPerformanceData, 'conversions');
  const totalSpend = getMetricValue(mockPerformanceData, 'spend');
  const totalRevenue = getMetricValue(mockPerformanceData, 'revenue');

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Breadcrumbs />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-full border border-purple-200/50 dark:border-purple-800/30">
                  <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t('analytics.title')}</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {t('analytics.title')}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {t('analytics.description', 'Αναλυτικά στατιστικά και αναφορές για τις καμπάνιες σας')}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-48 border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:bg-white/70 dark:focus:bg-gray-900/70 transition-all duration-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl">
                        <SelectItem value="7d">{t('analytics.timeRange7d')}</SelectItem>
                        <SelectItem value="30d">{t('analytics.timeRange30d')}</SelectItem>
                        <SelectItem value="90d">{t('analytics.timeRange90d')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('analytics.timeRangeTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        toast.info('Εφαρμόζονται προχωρημένα φίλτρα Analytics...', {
                          description: 'Φίλτρα για καμπάνιες, audiences, platforms κ.α.'
                        });
                      }}
                      className="border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl hover:bg-white/70 dark:hover:bg-gray-900/70 rounded-2xl px-6 py-3 transition-all duration-300"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {t('analytics.filters')}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('analytics.filtersTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
                
                <ExportDialog 
                  dataType="analytics" 
                  data={mockPerformanceData}
                  trigger={
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 rounded-2xl px-6 py-3 transition-all duration-300 hover:scale-105"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Εξαγωγή
                    </Button>
                  }
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    8.2%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Impressions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalImpressions.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MousePointer className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    3.24%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Clicks</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalClicks.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    15.7%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalConversions.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <Badge 
                    variant="outline" 
                    className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800"
                  >
                    <ArrowUpRight className="w-3 h-3" />
                    12.5%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">€{totalRevenue.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
            <CardContent className="p-6">
              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl p-1 border border-gray-200/50 dark:border-gray-700/50">
                  <TabsTrigger 
                    value="sales" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                  >
                    <Target className="w-4 h-4 mr-2" />
                    {t('analytics.salesKPIs', 'Δείκτες Πωλήσεων')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="funnel" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    {t('analytics.funnelAnalysis', 'Ανάλυση Funnel')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="advanced" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all duration-300"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t('analytics.advanced', 'Προηγμένα')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sales" className="mt-6">
                  <SalesKPIDashboard metrics={{
                    roas: 3.2,
                    revenue: totalRevenue,
                    conversionRate: (totalConversions / totalClicks) * 100,
                    cpa: totalSpend / totalConversions,
                    aov: totalRevenue / totalConversions,
                    cac: totalSpend / totalConversions,
                    salesGrowth: 22.1,
                    leadToSaleRate: 68.5,
                    churnRate: 12.3
                  }} />
                </TabsContent>
                
                <TabsContent value="funnel" className="mt-6">
                  <FunnelAnalysisDashboard analysis={{
                    // New funnel stages
                    awareness: {
                      name: 'TOFU - Ευαισθητοποίηση',
                      description: 'Ευαισθητοποίηση και φήμη',
                      icon: 'Eye',
                      color: '#3B82F6',
                      metrics: {
                        impressions: totalImpressions,
                        clicks: totalClicks,
                        conversions: totalConversions,
                        spend: totalSpend,
                        ctr: (totalClicks / totalImpressions) * 100,
                        conversionRate: (totalConversions / totalClicks) * 100,
                        costPerConversion: totalSpend / totalConversions,
                        revenue: totalRevenue,
                        roas: totalRevenue / totalSpend
                      }
                    },
                    consideration: {
                      name: 'MOFU - Εκτίμηση',
                      description: 'Εκτίμηση και ενδιαφέρον',
                      icon: 'Search',
                      color: '#10B981',
                      metrics: {
                        impressions: totalImpressions * 0.7,
                        clicks: totalClicks * 0.8,
                        conversions: totalConversions * 0.6,
                        spend: totalSpend * 0.7,
                        ctr: (totalClicks * 0.8 / (totalImpressions * 0.7)) * 100,
                        conversionRate: (totalConversions * 0.6 / (totalClicks * 0.8)) * 100,
                        costPerConversion: (totalSpend * 0.7) / (totalConversions * 0.6),
                        revenue: totalRevenue * 0.6,
                        roas: (totalRevenue * 0.6) / (totalSpend * 0.7)
                      }
                    },
                    conversion: {
                      name: 'BOFU - Μετατροπή',
                      description: 'Μετατροπή και πώληση',
                      icon: 'Target',
                      color: '#F59E0B',
                      metrics: {
                        impressions: totalImpressions * 0.3,
                        clicks: totalClicks * 0.4,
                        conversions: totalConversions,
                        spend: totalSpend * 0.3,
                        ctr: (totalClicks * 0.4 / (totalImpressions * 0.3)) * 100,
                        conversionRate: (totalConversions / (totalClicks * 0.4)) * 100,
                        costPerConversion: (totalSpend * 0.3) / totalConversions,
                        revenue: totalRevenue,
                        roas: totalRevenue / (totalSpend * 0.3)
                      }
                    },
                    // Legacy aliases
                    tofu: {
                      name: 'TOFU - Ευαισθητοποίηση',
                      description: 'Ευαισθητοποίηση και φήμη',
                      icon: 'Eye',
                      color: '#3B82F6',
                      metrics: {
                        impressions: totalImpressions,
                        clicks: totalClicks,
                        conversions: totalConversions,
                        spend: totalSpend,
                        ctr: (totalClicks / totalImpressions) * 100,
                        conversionRate: (totalConversions / totalClicks) * 100,
                        costPerConversion: totalSpend / totalConversions,
                        revenue: totalRevenue,
                        roas: totalRevenue / totalSpend
                      }
                    },
                    mofu: {
                      name: 'MOFU - Εκτίμηση',
                      description: 'Εκτίμηση και ενδιαφέρον',
                      icon: 'Search',
                      color: '#10B981',
                      metrics: {
                        impressions: totalImpressions * 0.7,
                        clicks: totalClicks * 0.8,
                        conversions: totalConversions * 0.6,
                        spend: totalSpend * 0.7,
                        ctr: (totalClicks * 0.8 / (totalImpressions * 0.7)) * 100,
                        conversionRate: (totalConversions * 0.6 / (totalClicks * 0.8)) * 100,
                        costPerConversion: (totalSpend * 0.7) / (totalConversions * 0.6),
                        revenue: totalRevenue * 0.6,
                        roas: (totalRevenue * 0.6) / (totalSpend * 0.7)
                      }
                    },
                    bofu: {
                      name: 'BOFU - Μετατροπή',
                      description: 'Μετατροπή και πώληση',
                      icon: 'Target',
                      color: '#F59E0B',
                      metrics: {
                        impressions: totalImpressions * 0.3,
                        clicks: totalClicks * 0.4,
                        conversions: totalConversions,
                        spend: totalSpend * 0.3,
                        ctr: (totalClicks * 0.4 / (totalImpressions * 0.3)) * 100,
                        conversionRate: (totalConversions / (totalClicks * 0.4)) * 100,
                        costPerConversion: (totalSpend * 0.3) / totalConversions,
                        revenue: totalRevenue,
                        roas: totalRevenue / (totalSpend * 0.3)
                      }
                    },
                    // Overall metrics
                    totalImpressions: totalImpressions * 2,
                    totalClicks: totalClicks * 2.2,
                    totalConversions: totalConversions * 1.6,
                    totalSpend: totalSpend * 2,
                    totalRevenue: totalRevenue * 1.6,
                    // Conversion rates
                    awarenessToConsideration: 85.5,
                    considerationToConversion: 45.2,
                    tofuToMofu: 85.5,
                    mofuToBofu: 45.2,
                    overallConversion: (totalConversions * 1.6) / (totalImpressions * 2) * 100,
                    stagePerformance: {
                      bestPerforming: 'bofu',
                      worstPerforming: 'tofu',
                      recommendations: ['Increase budget for BOFU campaigns', 'Optimize TOFU targeting']
                    },
                    customerJourney: {
                      averageTimeInFunnel: 7,
                      dropOffPoints: [
                        { stage: 'TOFU to MOFU', dropOffRate: 14.5, potentialRevenue: totalRevenue * 0.3 },
                        { stage: 'MOFU to BOFU', dropOffRate: 54.8, potentialRevenue: totalRevenue * 0.7 }
                      ],
                      reEngagementOpportunities: [
                        { stage: 'TOFU', audienceSize: totalImpressions * 0.3, estimatedValue: totalRevenue * 0.2 },
                        { stage: 'MOFU', audienceSize: totalClicks * 0.4, estimatedValue: totalRevenue * 0.5 }
                      ]
                    }
                  }} />
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-6">
                  <AdvancedAnalyticsDashboard />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
} 