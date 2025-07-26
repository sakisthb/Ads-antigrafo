import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Search, 
  Target, 
  DollarSign, 
  Users, 
  ArrowRight,
  Activity,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { FunnelAnalysis, type FunnelStage } from "@/lib/funnel-analysis";

interface FunnelAnalysisDashboardProps {
  analysis: FunnelAnalysis;
}

export function FunnelAnalysisDashboard({ analysis }: FunnelAnalysisDashboardProps) {
  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'Search': return <Search className="w-5 h-5" />;
      case 'Target': return <Target className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const getPerformanceColor = (value: number, threshold: number) => {
    return value >= threshold ? 'text-green-600' : 'text-red-600';
  };

  const getStageColor = (stageName: string) => {
    switch (stageName) {
      case 'Στάδιο Ευαισθητοποίησης': return 'bg-blue-500';
      case 'Στάδιο Εξέτασης': return 'bg-green-500';
      case 'Στάδιο Μετατροπής': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStageCard = (stage: FunnelStage) => (
    <Card key={stage.name} className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${getStageColor(stage.name)}`}></div>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: stage.color + '20' }}>
            <div style={{ color: stage.color }}>
              {getStageIcon(stage.icon)}
            </div>
          </div>
          <div>
            <CardTitle className="text-lg">{stage.name}</CardTitle>
            <CardDescription className="text-sm">{stage.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-2xl font-bold">{stage.metrics.impressions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Εμφανίσεις</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stage.metrics.clicks.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Κλικ</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stage.metrics.conversions.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Μετατροπές</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${stage.metrics.spend.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Δαπάνη</div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">CTR</span>
            <span className="text-sm font-semibold">{stage.metrics.ctr.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Ποσοστό Μετατροπής</span>
            <span className="text-sm font-semibold">{stage.metrics.conversionRate.toFixed(2)}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">ROAS</span>
            <span className={`text-sm font-semibold ${getPerformanceColor(stage.metrics.roas, 2)}`}>
              {stage.metrics.roas.toFixed(2)}x
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Funnel Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5" />
            Επισκόπηση Ροής Μετατροπών
          </CardTitle>
          <CardDescription>
            Ανάλυση σταδίων μετατροπής με ροή πελατών και μετρικά απόδοσης
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {renderStageCard(analysis.tofu)}
            {renderStageCard(analysis.mofu)}
            {renderStageCard(analysis.bofu)}
          </div>
        </CardContent>
      </Card>

      {/* Funnel Flow Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Ροή Μετατροπής Πελατών
          </CardTitle>
          <CardDescription>
            Οπτική αναπαράσταση του ταξιδιού πελάτη μέσω των σταδίων μετατροπής
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* TOFU Stage */}
            <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <span className="font-medium">Στάδιο Ευαισθητοποίησης</span>
                  <div className="text-sm text-muted-foreground">
                    {analysis.tofu.metrics.impressions.toLocaleString()} εμφανίσεις
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysis.tofu.metrics.ctr.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">CTR</div>
              </div>
            </div>

            {/* TOFU to MOFU Conversion */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">{analysis.tofuToMofu.toFixed(2)}% μετατροπή</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* MOFU Stage */}
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <span className="font-medium">Στάδιο Εξέτασης</span>
                  <div className="text-sm text-muted-foreground">
                    {analysis.mofu.metrics.clicks.toLocaleString()} κλικ
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysis.mofu.metrics.conversionRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Ποσοστό Μετατροπής</div>
              </div>
            </div>

            {/* MOFU to BOFU Conversion */}
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                <span className="text-sm">{analysis.mofuToBofu.toFixed(2)}% μετατροπή</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* BOFU Stage */}
            <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <div>
                  <span className="font-medium">Στάδιο Μετατροπής</span>
                  <div className="text-sm text-muted-foreground">
                    {analysis.bofu.metrics.conversions.toLocaleString()} μετατροπές
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysis.bofu.metrics.roas.toFixed(2)}x</div>
                <div className="text-sm text-muted-foreground">ROAS</div>
              </div>
            </div>
          </div>

          {/* Overall Conversion */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Συνολική Μετατροπή</span>
                <div className="text-sm text-muted-foreground">
                  Ποσοστό μετατροπής από άκρο σε άκρο
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{analysis.overallConversion.toFixed(3)}%</div>
                <div className="text-sm text-muted-foreground">
                  {analysis.totalConversions.toLocaleString()} / {analysis.totalImpressions.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Απόδοση Σταδίων
            </CardTitle>
            <CardDescription>Καλύτερα και χειρότερα αποδίδοντα στάδια μετατροπής</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Καλύτερη Απόδοση</span>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {analysis.stagePerformance.bestPerforming.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium">Χρειάζεται Βελτίωση</span>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-600">
                  {analysis.stagePerformance.worstPerforming.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Recommendations:</h4>
                {analysis.stagePerformance.recommendations.map((rec, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Ταξίδι Πελάτη
            </CardTitle>
            <CardDescription>Ανάλυση συμπεριφοράς και εμπλοκής πελατών</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Μέσος Χρόνος στη Ροή</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{analysis.customerJourney.averageTimeInFunnel} ημέρες</div>
                  <div className="text-sm text-muted-foreground">Τυπικό ταξίδι</div>
                </div>
              </div>

              {analysis.customerJourney.dropOffPoints.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Drop-off Points:</h4>
                  {analysis.customerJourney.dropOffPoints.map((point, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-950/20 rounded mb-2">
                      <div>
                        <div className="text-sm font-medium">{point.stage}</div>
                        <div className="text-xs text-muted-foreground">
                          {point.dropOffRate.toFixed(1)}% drop-off
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${point.potentialRevenue.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Potential</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {analysis.customerJourney.reEngagementOpportunities.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Re-engagement Opportunities:</h4>
                  {analysis.customerJourney.reEngagementOpportunities.map((opp, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded mb-2">
                      <div>
                        <div className="text-sm font-medium">{opp.stage}</div>
                        <div className="text-xs text-muted-foreground">
                          {opp.audienceSize.toFixed(0)} users
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          ${opp.estimatedValue.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">Estimated value</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Σύνοψη Απόδοσης Μετατροπών
          </CardTitle>
          <CardDescription>Βασικές μετρήσεις όλων των σταδίων μετατροπής</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.totalImpressions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Συνολικές Προβολές</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Συνολικά Κλικ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analysis.totalConversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Συνολικές Μετατροπές</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${analysis.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Συνολικά Έσοδα</div>
            </div>
          </div>
          
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-lg font-semibold">{analysis.tofuToMofu.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Ευαισθητοποίηση → Εξέταση</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{analysis.mofuToBofu.toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Εξέταση → Μετατροπή</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{analysis.overallConversion.toFixed(3)}%</div>
              <div className="text-sm text-muted-foreground">Συνολική Μετατροπή</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 