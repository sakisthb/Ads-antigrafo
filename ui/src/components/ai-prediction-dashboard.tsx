// AI Prediction Dashboard - Advanced Marketing Analytics
// Multiple ML Models Running in Parallel - 25+ Years Marketing Experience

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  Users, 
  DollarSign, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Eye,
  MousePointer,
  ShoppingCart,
  Heart,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";
import { predictionEngine } from '@/lib/ai-prediction-engine';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

export function AIPredictionDashboard() {
  const [predictions, setPredictions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    setLoading(true);
    // Simulate API call - σε production θα καλεί το backend
    setTimeout(() => {
      const data = predictionEngine.getAllPredictions();
      setPredictions(data);
      setLoading(false);
    }, 1500);
  };

  const refreshPredictions = async () => {
    setRefreshing(true);
    setTimeout(() => {
      const data = predictionEngine.getAllPredictions();
      setPredictions(data);
      setRefreshing(false);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Brain className="w-8 h-8 animate-pulse text-blue-600" />
            <Sparkles className="w-6 h-6 animate-bounce text-purple-600 ml-2" />
          </div>
          <h3 className="text-lg font-semibold">AI Models Processing...</h3>
          <p className="text-muted-foreground">
            Τρέχουν 8 διαφορετικά μοντέλα machine learning για να σου δώσουν τις καλύτερες προβλέψεις
          </p>
          <div className="w-64 mx-auto">
            <Progress value={loading ? 75 : 100} className="h-2" />
          </div>
        </div>
      </div>
    );
  }

  const getModelAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.85) return 'text-green-600 bg-green-100';
    if (accuracy >= 0.75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (value < 0) return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            AI Prediction Engine
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              8 ML Models Active
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Advanced marketing analytics με πολλαπλά μοντέλα machine learning
          </p>
        </div>
        <Button 
          onClick={refreshPredictions}
          disabled={refreshing}
          className="bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Predictions
        </Button>
      </div>

      {/* Model Performance Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Model Performance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {predictions?.model_metadata?.map((model: any, index: number) => (
              <div key={index} className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg border">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getModelAccuracyColor(model.accuracy)}`}>
                  {(model.accuracy * 100).toFixed(1)}% Accuracy
                </div>
                <h4 className="font-medium mt-2 text-sm">{model.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{model.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Predictions Tabs */}
      <Tabs value={selectedModel} onValueChange={setSelectedModel} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="roas">ROAS</TabsTrigger>
          <TabsTrigger value="churn">Churn</TabsTrigger>
          <TabsTrigger value="ltv">LTV</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicted 30-Day ROAS</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.67x</div>
                <p className="text-xs text-green-600">+12.3% vs current</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Churn Risk Users</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,686</div>
                <p className="text-xs text-red-600">Immediate action needed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Predicted LTV</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€4,250</div>
                <p className="text-xs text-blue-600">24-month forecast</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Budget Optimization</CardTitle>
                <Zap className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+€2,340</div>
                <p className="text-xs text-purple-600">Potential monthly gain</p>
              </CardContent>
            </Card>
          </div>

          {/* RFM Segments Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments - RFM Analysis</CardTitle>
              <CardDescription>Advanced segmentation με behavioral clustering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions?.rfm_segments?.slice(0, 6).map((segment: any) => (
                  <div key={segment.id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{segment.name}</h4>
                      <Badge variant={segment.churnProbability > 0.5 ? "destructive" : segment.churnProbability > 0.3 ? "secondary" : "default"}>
                        {segment.size.toLocaleString()} users
                      </Badge>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>LTV:</span>
                        <span className="font-medium">€{segment.ltv.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Churn Risk:</span>
                        <span className={`font-medium ${segment.churnProbability > 0.5 ? 'text-red-600' : segment.churnProbability > 0.3 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {(segment.churnProbability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={segment.churnProbability * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROAS Prediction Tab */}
        <TabsContent value="roas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ROAS Forecast - Prophet Time Series Model
              </CardTitle>
              <CardDescription>30-day prediction με confidence intervals και seasonality analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictions?.roas_forecast?.slice(0, 14)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="predicted_roas" stroke="#8884d8" strokeWidth={2} name="Predicted ROAS" />
                    <Line type="monotone" dataKey="confidence_interval.upper" stroke="#82ca9d" strokeDasharray="5 5" name="Upper Bound" />
                    <Line type="monotone" dataKey="confidence_interval.lower" stroke="#ffc658" strokeDasharray="5 5" name="Lower Bound" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {predictions?.roas_forecast?.slice(0, 3).map((day: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{format(new Date(day.date), 'MMM dd')}</span>
                      <Badge className={`${day.confidence_score > 0.9 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {(day.confidence_score * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{day.predicted_roas}x</div>
                    <div className="text-sm text-muted-foreground">
                      Range: {day.confidence_interval.lower}x - {day.confidence_interval.upper}x
                    </div>
                    <div className="mt-2 text-xs">
                      <div>Seasonality: {day.factors.seasonality_impact > 0 ? '+' : ''}{day.factors.seasonality_impact}%</div>
                      <div>Trend: {day.factors.trend_impact > 0 ? '+' : ''}{day.factors.trend_impact}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Churn Prediction Tab */}
        <TabsContent value="churn" className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Critical Alert:</strong> 2,686 customers at high risk of churning within 30 days. 
              Potential revenue impact: €12.4M
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Churn Risk by Segment</CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.churn_analysis?.map((segment: any) => (
                  <div key={segment.segment_id} className="mb-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{segment.segment_name}</h4>
                      <Badge className={segment.risk_level === 'high' ? 'bg-red-100 text-red-700' : 
                                       segment.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                       'bg-green-100 text-green-700'}>
                        {segment.risk_level} risk
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>30-day churn probability:</span>
                        <span className="font-medium">{(segment.predicted_30_day_churn * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={segment.predicted_30_day_churn * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Revenue at risk:</span>
                        <span>€{segment.potential_revenue_at_risk?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Immediate Action Required</CardTitle>
              </CardHeader>
              <CardContent>
                {predictions?.churn_analysis?.filter((s: any) => s.intervention_urgency === 'immediate').map((segment: any) => (
                  <div key={segment.segment_id} className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">{segment.segment_name}</h4>
                    <div className="space-y-2 text-sm">
                      {segment.recommended_actions?.slice(0, 3).map((action: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-red-700 dark:text-red-300">{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* LTV Prediction Tab */}
        <TabsContent value="ltv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Customer Lifetime Value Predictions
              </CardTitle>
              <CardDescription>LTV forecasting με ensemble model ανά acquisition channel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={predictions?.ltv_predictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="acquisition_channel" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`€${value}`, 'LTV']} />
                    <Legend />
                    <Bar dataKey="predicted_ltv_6_months" fill="#8884d8" name="6 Months" />
                    <Bar dataKey="predicted_ltv_12_months" fill="#82ca9d" name="12 Months" />
                    <Bar dataKey="predicted_ltv_24_months" fill="#ffc658" name="24 Months" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {predictions?.ltv_predictions?.map((channel: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-semibold capitalize mb-3">{channel.acquisition_channel.replace('_', ' ')}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>24M LTV:</span>
                        <span className="font-medium">€{channel.predicted_ltv_24_months?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>LTV/CAC Ratio:</span>
                        <span className={`font-medium ${channel.ltv_to_cac_ratio > 3 ? 'text-green-600' : channel.ltv_to_cac_ratio > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {channel.ltv_to_cac_ratio}:1
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payback Period:</span>
                        <span className="font-medium">{channel.payback_period_days} days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trajectory:</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(channel.growth_trajectory === 'accelerating' ? 1 : channel.growth_trajectory === 'declining' ? -1 : 0)}
                          <span className="font-medium capitalize">{channel.growth_trajectory}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add more TabsContent for other predictions... */}
        
      </Tabs>
    </div>
  );
}