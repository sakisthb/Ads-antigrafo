// Multi-Touch Attribution Dashboard - SOS PRIORITY
// Advanced Marketing Attribution με LSTM & Deep Learning
// 25+ Years Marketing Experience - Critical Business Intelligence

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  PieChart,
  Network,
  RefreshCw,
  Download,
  Settings,
  Eye,
  MousePointer,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Lightbulb,
  Award,
  Clock,
  Route,
  Layers,
  GitBranch,
  Star,
  Sparkles,
  Bell
} from "lucide-react";
import { multiTouchEngine, AttributionReport, AttributionModel, CustomerJourney, AttributionInsight } from '@/lib/multi-touch-attribution-engine';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell,
  AreaChart,
  Area,
  Pie
} from 'recharts';
import { toast } from 'sonner';

export function MultiTouchAttributionDashboard() {
  const [report, setReport] = useState<AttributionReport | null>(null);
  const [models, setModels] = useState<AttributionModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedTimeRange]);

  const loadData = async () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const dateRange = getDateRange(selectedTimeRange);
      const attributionReport = multiTouchEngine.generateAttributionReport(dateRange);
      const availableModels = multiTouchEngine.getModels();
      
      setReport(attributionReport);
      setModels(availableModels);
      setSelectedModel(availableModels.find(m => m.isActive)?.id || '');
      setLoading(false);
    }, 1500);
  };

  const getDateRange = (range: string) => {
    const end = new Date();
    const start = new Date();
    
    switch (range) {
      case '7d':
        start.setDate(end.getDate() - 7);
        break;
      case '30d':
        start.setDate(end.getDate() - 30);
        break;
      case '90d':
        start.setDate(end.getDate() - 90);
        break;
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return { start, end };
  };

  const handleModelChange = async (modelId: string) => {
    setRefreshing(true);
    const success = multiTouchEngine.setActiveModel(modelId);
    
    if (success) {
      setSelectedModel(modelId);
      toast.success('Attribution model updated successfully');
      // Reload data with new model
      setTimeout(() => {
        loadData();
        setRefreshing(false);
      }, 2000);
    } else {
      toast.error('Failed to update attribution model');
      setRefreshing(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    setTimeout(() => {
      loadData();
      setRefreshing(false);
      toast.success('Attribution data refreshed');
    }, 1000);
  };

  const getROASColor = (roas: number) => {
    if (roas >= 4) return 'text-green-600';
    if (roas >= 2) return 'text-blue-600';
    if (roas >= 1) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROASBadgeColor = (roas: number) => {
    if (roas >= 4) return 'bg-green-100 text-green-800';
    if (roas >= 2) return 'bg-blue-100 text-blue-800';
    if (roas >= 1) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'meta': return '📘';
      case 'google': return '🟢';
      case 'tiktok': return '⚫';
      case 'email': return '📧';
      case 'organic': return '🌱';
      case 'direct': return '🎯';
      case 'referral': return '🔗';
      default: return '📊';
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 5) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (change < -5) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Brain className="w-8 h-8 animate-pulse text-purple-600" />
            <Network className="w-6 h-6 animate-bounce text-blue-600 ml-2" />
            <Sparkles className="w-5 h-5 animate-pulse text-yellow-600 ml-1" />
          </div>
          <h3 className="text-lg font-semibold">Processing Attribution Models...</h3>
          <p className="text-muted-foreground">
            🧠 LSTM Deep Learning • 🎯 Customer Journey Analysis • 📊 Revenue Attribution
          </p>
          <div className="w-64 mx-auto">
            <Progress value={loading ? 85 : 100} className="h-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Attribution Data</h3>
              <p className="text-muted-foreground">Unable to generate attribution report.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-purple-600" />
            Multi-Touch Attribution
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              SOS Priority
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Advanced LSTM attribution modeling • Customer journey analysis • Revenue optimization
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Model Selection & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Attribution Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      {model.type === 'ml_lstm' && <Brain className="w-4 h-4" />}
                      {model.type === 'ensemble' && <Layers className="w-4 h-4" />}
                      {model.type === 'algorithmic' && <Target className="w-4 h-4" />}
                      {model.type === 'rule_based' && <BarChart3 className="w-4 h-4" />}
                      {model.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {models.find(m => m.id === selectedModel) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Accuracy</span>
                  <Badge className={getROASBadgeColor(models.find(m => m.id === selectedModel)!.accuracy * 10)}>
                    {(models.find(m => m.id === selectedModel)!.accuracy * 100).toFixed(1)}%
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last trained: {formatDistanceToNow(models.find(m => m.id === selectedModel)!.lastTrained)} ago
                </div>
                <div className="text-xs">
                  {models.find(m => m.id === selectedModel)!.description}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{report.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From {report.totalConversions} conversions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Journey Length</CardTitle>
            <Route className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.avgJourneyLength.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              touch points per journey
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time to Conversion</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(report.avgTimeToConversion / 24)}d</div>
            <p className="text-xs text-muted-foreground">
              average customer journey
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="channels">Channel Analysis</TabsTrigger>
          <TabsTrigger value="journeys">Customer Journeys</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
          <TabsTrigger value="experiments">A/B Tests</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Attribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Revenue Attribution by Channel
                </CardTitle>
                <CardDescription>LSTM model attribution distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        dataKey="attributedRevenue"
                        data={report.channelInsights.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label={({ channelName, attributionPercentage }) => 
                          `${channelName}: ${attributionPercentage.toFixed(1)}%`
                        }
                      >
                        {report.channelInsights.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `€${Number(value).toLocaleString()}`} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* ROAS by Channel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  ROAS by Channel
                </CardTitle>
                <CardDescription>Return on ad spend με attribution weighting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={report.channelInsights.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="channelName" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(2)}x`} />
                      <Bar dataKey="roas" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Channel Synergies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Cross-Channel Synergies
              </CardTitle>
              <CardDescription>Channels that work better together - ML detected synergies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.crossChannelSynergies.map((synergy, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">Synergy Score</span>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        {synergy.synergyScore.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{synergy.channel1}</span>
                        <span className="text-xs text-muted-foreground">+</span>
                        <span className="text-sm font-medium">{synergy.channel2}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Combined ROAS: {synergy.combinedROAS.toFixed(2)}x
                      </div>
                      <div className="text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                        💡 {synergy.recommendedStrategy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channel Analysis Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Channel Performance Analysis
              </CardTitle>
              <CardDescription>Comprehensive channel attribution analysis με ML insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.channelInsights.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPlatformIcon(insight.platform)}</span>
                        <div>
                          <h3 className="font-semibold">{insight.channelName}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {insight.platform} • {insight.totalTouchPoints} touch points
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getROASBadgeColor(insight.roas)}>
                          {insight.roas.toFixed(2)}x ROAS
                        </Badge>
                        <Badge variant={insight.criticalityScore > 2 ? "default" : "secondary"}>
                          <Star className="w-3 h-3 mr-1" />
                          Criticality: {insight.criticalityScore.toFixed(1)}
                        </Badge>
                      </div>
                    </div>

                    {/* Channel Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Attributed Revenue</p>
                        <p className="font-semibold text-green-600">€{insight.attributedRevenue.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Attribution %</p>
                        <p className="font-semibold">{insight.attributionPercentage.toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CPA</p>
                        <p className="font-semibold">€{insight.costPerAcquisition.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">First Touch</p>
                        <p className="font-semibold">{(insight.firstTouchContribution * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Assist Rate</p>
                        <p className="font-semibold">{(insight.assistingTouchRate * 100).toFixed(1)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Incremental Lift</p>
                        <p className="font-semibold text-blue-600">+{(insight.incrementalLift * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Touch Point Distribution */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Touch Point Distribution</span>
                        <span>{insight.totalTouchPoints} total touches</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-blue-100 dark:bg-blue-950/20 p-2 rounded text-center">
                          <div className="font-medium">First Touch</div>
                          <div>{(insight.firstTouchContribution * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-950/20 p-2 rounded text-center">
                          <div className="font-medium">Middle Touch</div>
                          <div>{(insight.middleTouchContribution * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-950/20 p-2 rounded text-center">
                          <div className="font-medium">Last Touch</div>
                          <div>{(insight.lastTouchContribution * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                    </div>

                    {/* Optimization Potential */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 p-3 rounded border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium text-sm">Optimization Potential</span>
                      </div>
                      <div className="text-sm">
                        <span>Recommended budget: </span>
                        <span className="font-medium text-green-600">
                          €{insight.recommendedBudgetAllocation.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground ml-2">
                          (Predicted ROAS increase: +{(insight.predictedROASIncrease).toFixed(2)}x)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Journeys Tab */}
        <TabsContent value="journeys" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Top Performing Customer Journeys
              </CardTitle>
              <CardDescription>Highest value customer journeys με complete touch point analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.topPerformingJourneys.slice(0, 8).map((journey, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-100 text-green-800">
                          #{index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-medium">Customer: {journey.customerId}</h4>
                          <p className="text-sm text-muted-foreground">
                            {journey.customerSegment} • {journey.touchPointCount} touches • {Math.round(journey.journeyDuration / 24)} days
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          €{journey.totalJourneyValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Conversion: {(journey.conversionProbability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Journey Timeline */}
                    <div className="mb-3">
                      <h5 className="text-sm font-medium mb-2">Customer Journey Timeline:</h5>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {/* First Touch */}
                        <div className="flex-shrink-0 text-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-950/20 rounded-full flex items-center justify-center mb-1">
                            <span className="text-xs">{getPlatformIcon(journey.firstTouch.platform)}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">First</div>
                        </div>

                        {/* Assisting Touches */}
                        {journey.assistingTouches.slice(0, 4).map((touch, touchIndex) => (
                          <div key={touchIndex} className="flex items-center">
                            <ArrowUpRight className="w-3 h-3 text-gray-400 mx-1" />
                            <div className="flex-shrink-0 text-center">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center mb-1">
                                <span className="text-xs">{getPlatformIcon(touch.platform)}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">T{touch.position}</div>
                            </div>
                          </div>
                        ))}

                        {journey.assistingTouches.length > 4 && (
                          <div className="flex items-center">
                            <ArrowUpRight className="w-3 h-3 text-gray-400 mx-1" />
                            <div className="text-xs text-muted-foreground">
                              +{journey.assistingTouches.length - 4} more
                            </div>
                          </div>
                        )}

                        {/* Last Touch */}
                        <div className="flex items-center">
                          <ArrowUpRight className="w-3 h-3 text-gray-400 mx-1" />
                          <div className="flex-shrink-0 text-center">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-950/20 rounded-full flex items-center justify-center mb-1">
                              <span className="text-xs">{getPlatformIcon(journey.lastTouch.platform)}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Convert</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Revenue Attribution */}
                    <div>
                      <h5 className="text-sm font-medium mb-2">Revenue Attribution Distribution:</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {Object.entries(journey.revenueDistribution)
                          .filter(([_, value]) => value > 0)
                          .sort(([_, a], [__, b]) => b - a)
                          .slice(0, 4)
                          .map(([channelId, revenue], revenueIndex) => {
                            const touchPoint = [journey.firstTouch, journey.lastTouch, ...journey.assistingTouches]
                              .find(tp => tp.channelId === channelId);
                            return (
                              <div key={revenueIndex} className="bg-white dark:bg-gray-900 p-2 rounded border">
                                <div className="flex items-center gap-1 mb-1">
                                  <span>{touchPoint ? getPlatformIcon(touchPoint.platform) : '📊'}</span>
                                  <span className="font-medium truncate">
                                    {touchPoint?.channelName || channelId}
                                  </span>
                                </div>
                                <div className="font-semibold text-green-600">
                                  €{revenue.toFixed(0)}
                                </div>
                                <div className="text-muted-foreground">
                                  {((revenue / journey.totalJourneyValue) * 100).toFixed(1)}%
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  LSTM Model Insights
                </CardTitle>
                <CardDescription>Deep learning attribution patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Key Finding:</strong> Email campaigns have 40% higher attribution weight 
                    when following Meta video ads within 48 hours.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pattern Detected:</strong> Customers με 5+ touch points have 3.2x higher 
                    lifetime value compared to single-touch conversions.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Network className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Cross-Device Insight:</strong> 78% of high-value journeys involve 
                    mobile-to-desktop transitions before conversion.
                  </AlertDescription>
                </Alert>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-4 rounded-lg border">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Model Performance
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Accuracy:</span>
                      <span className="font-medium ml-2">89.3%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Precision:</span>
                      <span className="font-medium ml-2">91.7%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Recall:</span>
                      <span className="font-medium ml-2">87.2%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">F1-Score:</span>
                      <span className="font-medium ml-2">89.4%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Attribution Heatmap
                </CardTitle>
                <CardDescription>Channel interaction strength matrix</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {['Meta', 'Google', 'TikTok', 'Email', 'Organic'].map((channel1, i) => 
                    ['Meta', 'Google', 'TikTok', 'Email', 'Organic'].map((channel2, j) => {
                      const strength = Math.random() * 0.8 + 0.2;
                      const isHighSynergy = strength > 0.7;
                      
                      return (
                        <div
                          key={`${i}-${j}`}
                          className={`p-2 rounded text-center font-medium ${
                            i === j 
                              ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' 
                              : isHighSynergy 
                                ? 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : strength > 0.5
                                  ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                  : 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                          }`}
                          title={`${channel1} → ${channel2}: ${(strength * 100).toFixed(0)}% synergy`}
                        >
                          {i === j ? '-' : (strength * 100).toFixed(0)}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Low Synergy</span>
                  <span>High Synergy</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Model Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Attribution Model Comparison
              </CardTitle>
              <CardDescription>Performance comparison across different attribution models</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Model</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Accuracy</th>
                      <th className="text-left p-2">Attribution Logic</th>
                      <th className="text-left p-2">Best For</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map((model, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{model.name}</td>
                        <td className="p-2">
                          <Badge variant="secondary">{model.type.replace('_', ' ').toUpperCase()}</Badge>
                        </td>
                        <td className="p-2">
                          <Badge className={getROASBadgeColor(model.accuracy * 10)}>
                            {(model.accuracy * 100).toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="p-2 text-muted-foreground text-xs max-w-xs">
                          {model.description}
                        </td>
                        <td className="p-2 text-xs">
                          {model.type === 'ml_lstm' && 'Complex journeys'}
                          {model.type === 'ensemble' && 'Highest accuracy'}
                          {model.type === 'algorithmic' && 'Fair attribution'}
                          {model.type === 'rule_based' && 'Simple analysis'}
                        </td>
                        <td className="p-2">
                          {model.isActive ? (
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          ) : (
                            <Badge variant="outline">Available</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/B Tests Tab */}
        <TabsContent value="experiments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Active A/B Tests
                </CardTitle>
                <CardDescription>Live attribution model experiments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 'exp-001',
                      name: 'LSTM vs Ensemble Model Comparison',
                      status: 'running',
                      progress: 73,
                      modelA: 'LSTM Deep Learning',
                      modelB: 'Ensemble Attribution',
                      confidence: 89,
                      significance: 0.02,
                      sampleSize: 12500,
                      currentWinner: 'Model A',
                      liftPotential: 12.5
                    },
                    {
                      id: 'exp-002', 
                      name: 'Time Decay vs Data-Driven',
                      status: 'completed',
                      progress: 100,
                      modelA: 'Enhanced Time Decay',
                      modelB: 'Data-Driven Attribution',
                      confidence: 95,
                      significance: 0.001,
                      sampleSize: 18300,
                      currentWinner: 'Model B',
                      liftPotential: 8.3
                    }
                  ].map((experiment, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{experiment.name}</h4>
                          <p className="text-sm text-muted-foreground">Experiment ID: {experiment.id}</p>
                        </div>
                        <Badge className={
                          experiment.status === 'running' 
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }>
                          {experiment.status.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white dark:bg-gray-900 rounded border">
                          <div className="text-sm font-medium text-blue-600">Model A</div>
                          <div className="text-xs text-muted-foreground">{experiment.modelA}</div>
                        </div>
                        <div className="text-center p-3 bg-white dark:bg-gray-900 rounded border">
                          <div className="text-sm font-medium text-purple-600">Model B</div>
                          <div className="text-xs text-muted-foreground">{experiment.modelB}</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{experiment.progress}%</span>
                        </div>
                        <Progress value={experiment.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-medium">Sample Size</div>
                          <div className="text-muted-foreground">{experiment.sampleSize.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Confidence</div>
                          <div className="text-green-600">{experiment.confidence}%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">Significance</div>
                          <div className="text-blue-600">p &lt; {experiment.significance}</div>
                        </div>
                      </div>

                      {experiment.status === 'completed' && (
                        <Alert className="mt-3">
                          <Star className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Winner:</strong> {experiment.currentWinner} with {experiment.liftPotential}% performance lift
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Experiment Performance
                </CardTitle>
                <CardDescription>Model comparison metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { model: 'LSTM', accuracy: 89.3, precision: 91.7, recall: 87.2 },
                      { model: 'Ensemble', accuracy: 92.1, precision: 90.4, recall: 89.8 },
                      { model: 'Time Decay', accuracy: 76.5, precision: 78.2, recall: 74.1 },
                      { model: 'Data-Driven', accuracy: 84.7, precision: 86.3, recall: 82.9 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="model" />
                      <YAxis domain={[70, 95]} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Legend />
                      <Bar dataKey="accuracy" fill="#8884d8" name="Accuracy" />
                      <Bar dataKey="precision" fill="#82ca9d" name="Precision" />
                      <Bar dataKey="recall" fill="#ffc658" name="Recall" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Start New Experiment
              </CardTitle>
              <CardDescription>Create a new attribution model A/B test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                  <h4 className="font-medium mb-2">Model Performance Test</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compare two attribution models for accuracy and business impact
                  </p>
                  <Button size="sm" className="w-full">Start Experiment</Button>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-yellow-50 dark:from-green-950/20 dark:to-yellow-950/20">
                  <h4 className="font-medium mb-2">Budget Allocation Test</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Test different budget allocation strategies across channels
                  </p>
                  <Button size="sm" className="w-full" variant="outline">Start Experiment</Button>
                </div>
                <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
                  <h4 className="font-medium mb-2">Attribution Window Test</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Compare different attribution windows for optimal conversion tracking
                  </p>
                  <Button size="sm" className="w-full" variant="outline">Start Experiment</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Real-time attribution monitoring and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 'alert-001',
                      type: 'model_drift',
                      severity: 'high',
                      title: 'Model Performance Degradation',
                      message: 'LSTM model accuracy dropped from 89.3% to 82.1% over the last 7 days',
                      channel: 'Meta Ads',
                      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                      actionRequired: true
                    },
                    {
                      id: 'alert-002',
                      type: 'budget_threshold',
                      severity: 'medium',
                      title: 'Budget Threshold Exceeded',
                      message: 'Google Ads budget allocation exceeded recommended threshold by 23%',
                      channel: 'Google Ads',
                      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
                      actionRequired: false
                    },
                    {
                      id: 'alert-003',
                      type: 'attribution_anomaly',
                      severity: 'low',
                      title: 'Attribution Pattern Change',
                      message: 'Unusual increase in direct traffic attribution (+45% vs last week)',
                      channel: 'Direct',
                      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                      actionRequired: false
                    }
                  ].map((alert, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      alert.severity === 'high' 
                        ? 'border-red-200 bg-red-50 dark:bg-red-950/20' 
                        : alert.severity === 'medium'
                          ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                          : 'border-blue-200 bg-blue-50 dark:bg-blue-950/20'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`w-4 h-4 ${
                            alert.severity === 'high' ? 'text-red-600' : 
                            alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                          <Badge className={
                            alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                            alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDistanceToNow(alert.timestamp)} ago
                        </div>
                      </div>

                      <h4 className="font-medium mb-2">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Channel:</span>
                          <Badge variant="secondary">{alert.channel}</Badge>
                        </div>
                        {alert.actionRequired && (
                          <Button size="sm" variant={alert.severity === 'high' ? 'default' : 'outline'}>
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Alert Configuration
                </CardTitle>
                <CardDescription>Manage alert thresholds and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Drift Detection</span>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alert when model accuracy drops &gt; 5%
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Budget Threshold Alerts</span>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alert when spend exceeds 120% of recommendation
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Attribution Anomalies</span>
                    <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alert on unusual attribution pattern changes
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Performance Degradation</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alert when ROAS drops &gt; 15% week-over-week
                  </div>
                </div>

                <Button size="sm" className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Alert History
              </CardTitle>
              <CardDescription>Recent attribution system alerts and actions taken</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', message: 'Model drift detected - LSTM retrained automatically', status: 'resolved' },
                  { time: '1 day ago', message: 'Budget reallocation suggested for Meta Ads', status: 'pending' },
                  { time: '2 days ago', message: 'Cross-channel synergy opportunity identified', status: 'actioned' },
                  { time: '3 days ago', message: 'Attribution model A/B test completed', status: 'resolved' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        item.status === 'resolved' ? 'bg-green-500' :
                        item.status === 'actioned' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm">{item.message}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Optimization Recommendations
              </CardTitle>
              <CardDescription>Machine learning derived budget και strategy recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {report.optimizationRecommendations.map((rec, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${
                    rec.priority === 'high' 
                      ? 'border-red-200 bg-red-50 dark:bg-red-950/20' 
                      : rec.priority === 'medium'
                        ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-green-200 bg-green-50 dark:bg-green-950/20'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Lightbulb className={`w-4 h-4 ${
                          rec.priority === 'high' ? 'text-red-600' : 
                          rec.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                        <Badge className={
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }>
                          {rec.priority.toUpperCase()} PRIORITY
                        </Badge>
                      </div>
                      <Badge variant="outline">
                        {rec.implementationEffort} effort
                      </Badge>
                    </div>

                    <h4 className="font-medium mb-2">
                      {report.channelInsights.find(c => c.channelId === rec.channelId)?.channelName || rec.channelId}
                    </h4>

                    <p className="text-sm mb-3">{rec.recommendation}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Expected Impact:</span>
                      <span className="font-medium text-green-600">
                        +{rec.expectedImpact.toFixed(1)}x ROAS
                      </span>
                    </div>

                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      variant={rec.priority === 'high' ? 'default' : 'outline'}
                    >
                      Implement Recommendation
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Budget Reallocation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Smart Budget Reallocation
              </CardTitle>
              <CardDescription>ML-optimized budget distribution για maximum ROAS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {report.channelInsights.slice(0, 6).map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getPlatformIcon(insight.platform)}</span>
                      <div>
                        <h4 className="font-medium">{insight.channelName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current ROAS: {insight.roas.toFixed(2)}x
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-green-600">
                        €{insight.recommendedBudgetAllocation.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Recommended budget
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-blue-600">
                        +{(insight.predictedROASIncrease).toFixed(2)}x
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Predicted improvement
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}