import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Filter, 
  Download, 
  Settings,
  Calendar,
  Users,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  ShoppingCart,
  Zap,
  PieChart,
  LineChart,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Map
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExportDialog } from "@/components/export-dialog";
import { toast } from "sonner";

// Advanced Analytics Types
interface AdvancedMetrics {
  totalSpend: number;
  totalRevenue: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  overallROAS: number;
  overallCTR: number;
  overallCR: number;
  averageCPC: number;
  averageCPM: number;
  averageCPA: number;
}

interface PlatformPerformance {
  platform: string;
  spend: number;
  revenue: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  ctr: number;
  cr: number;
  growth: number;
}

interface AttributionData {
  touchpoint: string;
  platform: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  attributionWeight: number;
  position: 'first-touch' | 'last-touch' | 'middle-touch';
}

interface DemographicData {
  segment: string;
  type: 'age' | 'gender' | 'device' | 'location';
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  percentage: number;
}

export function AdvancedAnalytics() {
  const { t } = useTranslation();
  const [selectedDateRange, setSelectedDateRange] = useState('last-30-days');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['all']);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Advanced Analytics Data
  const advancedMetrics: AdvancedMetrics = {
    totalSpend: 125840,
    totalRevenue: 387520,
    totalImpressions: 2840000,
    totalClicks: 54800,
    totalConversions: 1895,
    overallROAS: 3.08,
    overallCTR: 1.93,
    overallCR: 3.46,
    averageCPC: 2.30,
    averageCPM: 12.50,
    averageCPA: 66.40
  };

  const platformPerformance: PlatformPerformance[] = [
    {
      platform: 'Facebook Ads',
      spend: 48500,
      revenue: 156800,
      impressions: 1240000,
      clicks: 22400,
      conversions: 785,
      roas: 3.23,
      ctr: 1.81,
      cr: 3.50,
      growth: 12.5
    },
    {
      platform: 'Google Ads',
      spend: 52300,
      revenue: 165200,
      impressions: 980000,
      clicks: 21800,
      conversions: 720,
      roas: 3.16,
      ctr: 2.22,
      cr: 3.30,
      growth: 8.7
    },
    {
      platform: 'Instagram Ads',
      spend: 18400,
      revenue: 48600,
      impressions: 420000,
      clicks: 7200,
      conversions: 245,
      roas: 2.64,
      ctr: 1.71,
      cr: 3.40,
      growth: 15.2
    },
    {
      platform: 'TikTok Ads',
      spend: 6640,
      revenue: 16920,
      impressions: 200000,
      clicks: 3400,
      conversions: 145,
      roas: 2.55,
      ctr: 1.70,
      cr: 4.26,
      growth: 28.4
    }
  ];

  const attributionData: AttributionData[] = [
    {
      touchpoint: 'Facebook Video Ad',
      platform: 'Facebook',
      impressions: 450000,
      clicks: 8200,
      conversions: 145,
      revenue: 7250,
      attributionWeight: 0.35,
      position: 'first-touch'
    },
    {
      touchpoint: 'Google Search',
      platform: 'Google',
      impressions: 120000,
      clicks: 3600,
      conversions: 285,
      revenue: 18525,
      attributionWeight: 0.45,
      position: 'last-touch'
    },
    {
      touchpoint: 'Instagram Story',
      platform: 'Instagram',
      impressions: 280000,
      clicks: 4200,
      conversions: 95,
      revenue: 5700,
      attributionWeight: 0.20,
      position: 'middle-touch'
    }
  ];

  const demographicData: DemographicData[] = [
    {
      segment: '25-34',
      type: 'age',
      spend: 45200,
      revenue: 142500,
      conversions: 685,
      roas: 3.15,
      percentage: 36.2
    },
    {
      segment: '35-44',
      type: 'age',
      spend: 38900,
      revenue: 125800,
      conversions: 580,
      roas: 3.23,
      percentage: 30.6
    },
    {
      segment: 'Female',
      type: 'gender',
      spend: 72400,
      revenue: 238600,
      conversions: 1145,
      roas: 3.29,
      percentage: 60.4
    },
    {
      segment: 'Mobile',
      type: 'device',
      spend: 89200,
      revenue: 267400,
      conversions: 1385,
      roas: 3.00,
      percentage: 73.1
    },
    {
      segment: 'Athens',
      type: 'location',
      spend: 38500,
      revenue: 125800,
      conversions: 595,
      roas: 3.27,
      percentage: 31.4
    }
  ];

  const getPerformanceColor = (value: number, benchmark: number) => {
    if (value >= benchmark * 1.1) return 'text-green-600';
    if (value >= benchmark * 0.9) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth === 0) return 'text-gray-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Advanced Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Προχωρημένα αναλυτικά στοιχεία και cross-platform attribution
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => toast.info('Φίλτρα σύντομα διαθέσιμα!')}
          >
            <Filter className="w-4 h-4 mr-2" />
            Φίλτρα
          </Button>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto"
            onClick={() => toast.info('Report Builder σύντομα διαθέσιμο!')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Report Builder
          </Button>
          <ExportDialog 
            dataType="analytics" 
            data={[]}
            trigger={
              <Button variant="outline" className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Εξαγωγή
              </Button>
            }
          />
        </div>
      </div>

      {/* Overview KPIs */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Συνολικά Έσοδα</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(advancedMetrics.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> από την προηγούμενη περίοδο
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Συνολικό ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedMetrics.overallROAS.toFixed(2)}x</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.3%</span> βελτίωση
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Μετατροπές</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{advancedMetrics.totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.2%</span> αύξηση
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Μέσο CPA</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(advancedMetrics.averageCPA)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600">+3.1%</span> αύξηση κόστους
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Πλατφόρμες</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="demographics">Δημογραφικά</TabsTrigger>
          <TabsTrigger value="trends">Τάσεις</TabsTrigger>
        </TabsList>

        {/* Platform Performance */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Απόδοση Πλατφορμών
              </CardTitle>
              <CardDescription>
                Σύγκριση απόδοσης μεταξύ διαφορετικών διαφημιστικών πλατφορμών
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformPerformance.map((platform) => (
                  <div key={platform.platform} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <h3 className="font-semibold">{platform.platform}</h3>
                        <Badge variant="outline" className={getGrowthColor(platform.growth)}>
                          {platform.growth > 0 ? '+' : ''}{platform.growth}%
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(platform.revenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          ROAS: {platform.roas.toFixed(2)}x
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Δαπάνες</div>
                        <div className="font-medium">{formatCurrency(platform.spend)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Εμφανίσεις</div>
                        <div className="font-medium">{platform.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">CTR</div>
                        <div className={`font-medium ${getPerformanceColor(platform.ctr, 2.0)}`}>
                          {formatPercentage(platform.ctr)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">CR</div>
                        <div className={`font-medium ${getPerformanceColor(platform.cr, 3.0)}`}>
                          {formatPercentage(platform.cr)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attribution Analysis */}
        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Multi-Touch Attribution
              </CardTitle>
              <CardDescription>
                Ανάλυση του customer journey και η συνεισφορά κάθε touchpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attributionData.map((touchpoint, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <h3 className="font-semibold">{touchpoint.touchpoint}</h3>
                        <Badge variant="outline">
                          {touchpoint.position === 'first-touch' ? 'Πρώτη Επαφή' :
                           touchpoint.position === 'last-touch' ? 'Τελευταία Επαφή' : 'Μεσαία Επαφή'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(touchpoint.revenue)}</div>
                        <div className="text-sm text-muted-foreground">
                          Βάρος: {(touchpoint.attributionWeight * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Πλατφόρμα</div>
                        <div className="font-medium">{touchpoint.platform}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Εμφανίσεις</div>
                        <div className="font-medium">{touchpoint.impressions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Κλικ</div>
                        <div className="font-medium">{touchpoint.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Μετατροπές</div>
                        <div className="font-medium">{touchpoint.conversions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demographics */}
        <TabsContent value="demographics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Δημογραφική Ανάλυση
              </CardTitle>
              <CardDescription>
                Απόδοση ανά δημογραφικό τμήμα και συσκευή
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Age Groups */}
                <div>
                  <h3 className="font-semibold mb-3">Ηλικιακές Ομάδες</h3>
                  <div className="space-y-3">
                    {demographicData.filter(d => d.type === 'age').map((segment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div>
                          <div className="font-medium">{segment.segment} ετών</div>
                          <div className="text-sm text-muted-foreground">
                            {segment.percentage}% του κοινού
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(segment.revenue)}</div>
                          <div className="text-sm text-muted-foreground">
                            ROAS: {segment.roas.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Devices */}
                <div>
                  <h3 className="font-semibold mb-3">Συσκευές</h3>
                  <div className="space-y-3">
                    {demographicData.filter(d => d.type === 'device').map((segment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          {segment.segment === 'Mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                          <div>
                            <div className="font-medium">{segment.segment}</div>
                            <div className="text-sm text-muted-foreground">
                              {segment.percentage}% της κίνησης
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(segment.revenue)}</div>
                          <div className="text-sm text-muted-foreground">
                            ROAS: {segment.roas.toFixed(2)}x
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Τάσεις απόδοσης τελευταίων 30 ημερών
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">ROAS Trend</div>
                      <div className="text-sm text-muted-foreground">Μέσος όρος 30 ημερών</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">↗ +8.5%</div>
                      <div className="text-sm text-muted-foreground">Ανοδική τάση</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">CTR Optimization</div>
                      <div className="text-sm text-muted-foreground">Βελτίωση εβδομάδας</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">↗ +12.3%</div>
                      <div className="text-sm text-muted-foreground">Σημαντική βελτίωση</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">CPA Reduction</div>
                      <div className="text-sm text-muted-foreground">Μείωση κόστους</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">↗ +3.1%</div>
                      <div className="text-sm text-muted-foreground">Χρειάζεται βελτίωση</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Seasonal Insights
                </CardTitle>
                <CardDescription>
                  Εποχικές τάσεις και προβλέψεις
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                    <div className="font-medium text-blue-700 dark:text-blue-300">Καλύτερες Ώρες</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      18:00 - 22:00 (Δευτέρα - Παρασκευή)
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded">
                    <div className="font-medium text-green-700 dark:text-green-300">Peak Days</div>
                    <div className="text-sm text-green-600 dark:text-green-400">
                      Κυριακή, Τρίτη (+15% conversions)
                    </div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                    <div className="font-medium text-orange-700 dark:text-orange-300">Πρόβλεψη</div>
                    <div className="text-sm text-orange-600 dark:text-orange-400">
                      Αναμενόμενη αύξηση 20% στις γιορτές
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}