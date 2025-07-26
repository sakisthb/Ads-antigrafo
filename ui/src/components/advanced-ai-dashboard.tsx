import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  Zap,
  Clock,
  Users,
  Activity,
  Brain,
  Play,
  Pause,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  aiInsightsService,
  PredictiveMetric,
  OptimizationRecommendation,
  AnomalyDetection,
  SeasonalityAnalysis,
  AudienceInsight,
  BudgetOptimization,
  AutomatedAction
} from '../lib/ai-insights-service';
import { toast } from 'sonner';

interface AdvancedAIDashboardProps {
  className?: string;
}

export function AdvancedAIDashboard({ className }: AdvancedAIDashboardProps) {
  const [activeTab, setActiveTab] = useState('predictions');
  const [predictions, setPredictions] = useState<PredictiveMetric[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyDetection[]>([]);
  const [seasonality, setSeasonality] = useState<SeasonalityAnalysis[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight[]>([]);
  const [budgetOptimizations, setBudgetOptimizations] = useState<BudgetOptimization[]>([]);
  const [automatedActions, setAutomatedActions] = useState<AutomatedAction[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const mockData: any[] = [];
      const [
        predictionsData,
        recommendationsData,
        anomaliesData,
        seasonalityData,
        audienceData,
        budgetData,
        actionsData,
        summaryData
      ] = await Promise.all([
        aiInsightsService.generatePredictions(mockData),
        aiInsightsService.generateOptimizationRecommendations(mockData),
        aiInsightsService.detectAnomalies(mockData),
        aiInsightsService.analyzeSeasonality(mockData),
        aiInsightsService.generateAudienceInsights(mockData),
        aiInsightsService.optimizeBudget(mockData),
        aiInsightsService.getAutomatedActions(),
        aiInsightsService.getInsightsSummary()
      ]);

      setPredictions(predictionsData);
      setRecommendations(recommendationsData);
      setAnomalies(anomaliesData);
      setSeasonality(seasonalityData);
      setAudienceInsights(audienceData);
      setBudgetOptimizations(budgetData);
      setAutomatedActions(actionsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Error loading AI data:', error);
      toast.error('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOptimization = async (recommendationId: string) => {
    try {
      const result = await aiInsightsService.applyOptimization(recommendationId);
      if (result.success) {
        toast.success(result.message);
        // Refresh data
        loadAllData();
      } else {
        toast.error('Failed to apply optimization');
      }
    } catch (error) {
      toast.error('Error applying optimization');
    }
  };

  const toggleAutoOptimization = () => {
    setAutoOptimizationEnabled(!autoOptimizationEnabled);
    toast.success(
      autoOptimizationEnabled 
        ? 'Automated optimization disabled' 
        : 'Automated optimization enabled'
    );
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    const matchesCategory = filterCategory === 'all' || rec.category === filterCategory;
    const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rec.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            Advanced AI Insights
          </h2>
          <p className="text-muted-foreground">
            Predictive analytics and automated optimization powered by AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoOptimizationEnabled ? "default" : "outline"}
            onClick={toggleAutoOptimization}
            className="flex items-center gap-2"
          >
            {autoOptimizationEnabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            {autoOptimizationEnabled ? 'Auto-Optimization ON' : 'Auto-Optimization OFF'}
          </Button>
          <Button variant="outline" onClick={loadAllData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Insights</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalInsights || 0}</div>
            <p className="text-xs text-muted-foreground">AI-generated insights</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.criticalAlerts || 0}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Opportunities</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary?.optimizationOpportunities || 0}</div>
            <p className="text-xs text-muted-foreground">Ready to implement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Predicted Improvements</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{summary?.predictedImprovements || 0}%</div>
            <p className="text-xs text-muted-foreground">Expected performance gains</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automated Actions</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary?.automatedActions || 0}</div>
            <p className="text-xs text-muted-foreground">AI-executed optimizations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Optimizations
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="seasonality" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Seasonality
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Automation
          </TabsTrigger>
        </TabsList>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Predictions Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Predictions (30 Days)
                </CardTitle>
                <CardDescription>
                  AI-powered forecasts for key metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="metric" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="currentValue" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      name="Current"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predictedValue" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Predicted"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Predictions List */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Predictions</CardTitle>
                <CardDescription>
                  Confidence levels and contributing factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{prediction.metric}</span>
                        {getTrendIcon(prediction.trend)}
                      </div>
                      <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {prediction.currentValue} → {prediction.predictedValue} ({prediction.timeframe})
                    </div>
                    <Progress value={prediction.confidence} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      <strong>Factors:</strong> {prediction.factors.join(', ')}
                    </div>
                    {index < predictions.length - 1 && <Separator />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Optimizations Tab */}
        <TabsContent value="optimizations" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      placeholder="Search optimizations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border rounded-md"
                    />
                  </div>
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border rounded-md"
                >
                  <option value="all">All Categories</option>
                  <option value="performance">Performance</option>
                  <option value="efficiency">Efficiency</option>
                  <option value="growth">Growth</option>
                  <option value="cost-saving">Cost Saving</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Optimizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <Card key={recommendation.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {recommendation.description}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getPriorityColor(recommendation.priority)}>
                        {recommendation.priority}
                      </Badge>
                      {recommendation.automated && (
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          <Zap className="h-3 w-3 mr-1" />
                          Automated
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Expected Impact</div>
                      <div className="text-lg font-bold text-green-600">
                        +{recommendation.expectedImpact.improvement}% {recommendation.expectedImpact.metric}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {recommendation.expectedImpact.confidence}% confidence
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Implementation</div>
                      <div className="text-sm">{recommendation.implementation.difficulty}</div>
                      <div className="text-xs text-muted-foreground">
                        {recommendation.implementation.timeRequired}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Implementation Steps</div>
                    <ol className="text-sm space-y-1">
                      {recommendation.implementation.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-xs bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getPriorityColor(recommendation.risk)}>
                        Risk: {recommendation.risk}
                      </Badge>
                      <Badge variant="outline">
                        {recommendation.type}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {recommendation.canAutoApply ? (
                        <Button
                          size="sm"
                          onClick={() => handleApplyOptimization(recommendation.id)}
                          className="flex items-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Auto-Apply
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApplyOptimization(recommendation.id)}
                        >
                          Apply Manually
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Anomalies Tab */}
        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {anomalies.map((anomaly) => (
              <Card key={anomaly.id} className="border-l-4 border-red-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-red-600 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      {anomaly.metric} Anomaly
                    </CardTitle>
                    <Badge className={getSeverityColor(anomaly.severity)}>
                      {anomaly.severity}
                    </Badge>
                  </div>
                  <CardDescription>
                    {anomaly.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Current Value</div>
                      <div className="text-lg font-bold">{anomaly.currentValue}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Expected Value</div>
                      <div className="text-lg font-bold">{anomaly.expectedValue}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Possible Causes</div>
                    <ul className="text-sm space-y-1">
                      {anomaly.possibleCauses.map((cause, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Recommendations</div>
                    <ul className="text-sm space-y-1">
                      {anomaly.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Detected: {anomaly.detectedAt.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Seasonality Tab */}
        <TabsContent value="seasonality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {seasonality.map((season, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {season.metric} Seasonality
                  </CardTitle>
                  <CardDescription>
                    Pattern: {season.pattern}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Peak Days</div>
                      <div className="text-sm">{season.peakDays.join(', ')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Peak Hours</div>
                      <div className="text-sm">{season.peakHours.join(', ')}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Seasonal Factors</div>
                    <div className="text-sm">{season.seasonalFactors.join(', ')}</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Recommendations</div>
                    <ul className="text-sm space-y-1">
                      {season.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {audienceInsights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {insight.segment}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">ROAS</div>
                      <div className="text-lg font-bold text-green-600">{insight.performance.roas}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                      <div className="text-lg font-bold">{insight.performance.conversionRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">CPA</div>
                      <div className="text-lg font-bold">${insight.performance.cpa}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">LTV</div>
                      <div className="text-lg font-bold">${insight.performance.ltv}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">Behavior</div>
                    <div className="text-sm space-y-1">
                      <div>Preferred Time: {insight.behavior.preferredTime}</div>
                      <div>Preferred Device: {insight.behavior.preferredDevice}</div>
                      <div>Engagement Rate: {insight.behavior.engagementRate}%</div>
                      <div>Retention Rate: {insight.behavior.retentionRate}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="text-sm font-medium text-green-600 mb-2">Opportunities</div>
                      <ul className="text-sm space-y-1">
                        {insight.opportunities.map((opp, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-red-600 mb-2">Risks</div>
                      <ul className="text-sm space-y-1">
                        {insight.risks.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">⚠</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automated Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Automated Actions
                </CardTitle>
                <CardDescription>
                  AI-executed optimizations and their results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {automatedActions.map((action) => (
                  <div key={action.id} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{action.type.replace('_', ' ')}</span>
                        {action.status === 'applied' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {action.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                        {action.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <Badge variant="outline">{action.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                    <div className="text-sm">
                      Expected: {action.impact.expectedChange > 0 ? '+' : ''}{action.impact.expectedChange}% {action.impact.metric}
                    </div>
                    {action.result && (
                      <div className="text-sm">
                        Actual: {action.result.actualChange > 0 ? '+' : ''}{action.result.actualChange}% 
                        {action.result.success ? ' (Success)' : ' (Failed)'}
                      </div>
                    )}
                    {action.appliedAt && (
                      <div className="text-xs text-muted-foreground">
                        Applied: {action.appliedAt.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Budget Optimizations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Optimizations
                </CardTitle>
                <CardDescription>
                  AI-recommended budget adjustments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetOptimizations.map((optimization, index) => (
                  <div key={index} className="space-y-2 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Campaign {optimization.campaignId}</span>
                      <Badge variant="outline" className={getPriorityColor(optimization.riskLevel)}>
                        {optimization.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Current Budget</div>
                        <div className="font-medium">${optimization.currentBudget}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Recommended</div>
                        <div className="font-medium">${optimization.recommendedBudget}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      Expected ROI: {optimization.expectedROI}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {optimization.reasoning.join(', ')}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 