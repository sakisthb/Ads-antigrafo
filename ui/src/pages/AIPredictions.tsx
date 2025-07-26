import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap,
  Eye,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Lightbulb,
  CheckCircle,
  Clock,
  ArrowRight,
  Star,
  Rocket,
  Shield,
  Gauge
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { toast } from "sonner";
import { 
  AIPredictionsEngine, 
  type CampaignPrediction, 
  type PlatformPrediction,
  type AccountPrediction,
  type BudgetOptimization,
  type CreativeInsight,
  type AudienceInsight
} from "@/lib/ai-predictions";

export function AIPredictions() {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // AI Predictions Data
  const [campaignPredictions, setCampaignPredictions] = useState<CampaignPrediction[]>([]);
  const [platformPredictions, setPlatformPredictions] = useState<PlatformPrediction[]>([]);
  const [accountPredictions, setAccountPredictions] = useState<AccountPrediction[]>([]);
  const [budgetOptimization, setBudgetOptimization] = useState<BudgetOptimization | null>(null);
  const [creativeInsights, setCreativeInsights] = useState<CreativeInsight[]>([]);
  const [audienceInsights, setAudienceInsights] = useState<AudienceInsight[]>([]);
  const [expertRecommendations, setExpertRecommendations] = useState<any[]>([]);
  const [marketIntelligence, setMarketIntelligence] = useState<any[]>([]);

  // Load AI predictions on component mount
  useEffect(() => {
    generateAllPredictions();
  }, []);

  const generateAllPredictions = async () => {
    setIsGenerating(true);
    toast.info('Γενική ανάλυση AI predictions...');
    
    // Simulate AI processing time
    setTimeout(() => {
      setCampaignPredictions(AIPredictionsEngine.generateCampaignPredictions([]));
      setPlatformPredictions(AIPredictionsEngine.generatePlatformPredictions());
      setAccountPredictions(AIPredictionsEngine.generateAccountPredictions('acc_001'));
      setBudgetOptimization(AIPredictionsEngine.generateBudgetOptimization({}));
      setCreativeInsights(AIPredictionsEngine.generateCreativeInsights());
      setAudienceInsights(AIPredictionsEngine.generateAudienceInsights());
      setExpertRecommendations(AIPredictionsEngine.generateExpertRecommendations({}));
      setMarketIntelligence(AIPredictionsEngine.generateMarketIntelligence());
      setLastUpdated(new Date());
      setIsGenerating(false);
      toast.success('AI predictions ενημερώθηκαν επιτυχώς!');
    }, 2500);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <Zap className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Eye className="w-4 h-4 text-blue-600" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'google': return '🔍';
      case 'instagram': return '📷';
      case 'tiktok': return '🎵';
      case 'linkedin': return '💼';
      default: return '🌐';
    }
  };

  const implementRecommendation = (recommendation: CampaignPrediction) => {
    toast.success(`Εφαρμόζεται: ${recommendation.title}`);
    // Here you would implement the actual recommendation
  };

  const dismissPrediction = (predictionId: string) => {
    toast.info('Prediction dismissed');
    // Here you would mark the prediction as dismissed
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Breadcrumbs />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Predictions & Expert Insights
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Προβλέψεις και προτάσεις από AI με 15+ χρόνια media buying εμπειρία
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Button 
            onClick={generateAllPredictions} 
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <Gauge className="w-4 h-4 mr-2 animate-spin" />
                Ανάλυση AI...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Refresh Predictions
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Status & Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Predictions</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaignPredictions.length + platformPredictions.length + accountPredictions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Τελευταία ενημέρωση: {lastUpdated.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {campaignPredictions.filter(p => p.impact === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Απαιτούν άμεση δράση
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{campaignPredictions.reduce((sum, p) => sum + (p.estimatedRevenue || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Αναμενόμενα επιπλέον έσοδα
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Gauge className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(campaignPredictions.reduce((sum, p) => sum + p.confidence, 0) / campaignPredictions.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Μέση βεβαιότητα predictions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="campaigns">Καμπάνιες</TabsTrigger>
          <TabsTrigger value="platforms">Πλατφόρμες</TabsTrigger>
          <TabsTrigger value="budget">Budget AI</TabsTrigger>
          <TabsTrigger value="creative">Creatives</TabsTrigger>
          <TabsTrigger value="expert">Expert AI</TabsTrigger>
        </TabsList>

        {/* Campaign Predictions */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Campaign Predictions & Opportunities
              </CardTitle>
              <CardDescription>
                AI-powered προβλέψεις για τις καμπάνιες σας βάσει advanced pattern recognition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPredictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getUrgencyIcon(prediction.impact)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{prediction.title}</h3>
                            <Badge className={getImpactColor(prediction.impact)}>
                              {prediction.impact.toUpperCase()}
                            </Badge>
                            {prediction.actionRequired && (
                              <Badge variant="destructive">ACTION REQUIRED</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {prediction.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded border-l-4 border-blue-500">
                              <div className="font-medium text-blue-700 dark:text-blue-300 text-sm">
                                🎯 AI Prediction:
                              </div>
                              <div className="text-sm">{prediction.prediction}</div>
                            </div>
                            
                            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded border-l-4 border-green-500">
                              <div className="font-medium text-green-700 dark:text-green-300 text-sm">
                                💡 Expert Recommendation:
                              </div>
                              <div className="text-sm">{prediction.recommendation}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 text-sm">
                            <div>
                              <div className="text-muted-foreground">Confidence</div>
                              <div className="flex items-center gap-2">
                                <Progress value={prediction.confidence} className="flex-1" />
                                <span className="font-medium">{prediction.confidence}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Expected Impact</div>
                              <div className="font-medium text-green-600">{prediction.expectedImprovement}</div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">Timeframe</div>
                              <div className="font-medium">{prediction.timeframe}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {prediction.actionRequired && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button 
                          size="sm" 
                          onClick={() => implementRecommendation(prediction)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Implement Now
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => dismissPrediction(`camp_${index}`)}
                        >
                          Dismiss
                        </Button>
                        {(prediction.estimatedRevenue || prediction.estimatedSavings) && (
                          <Badge className="ml-auto bg-green-100 text-green-700">
                            {prediction.estimatedRevenue ? `+€${prediction.estimatedRevenue}` : `-€${prediction.estimatedSavings}`}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Predictions */}
        <TabsContent value="platforms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Platform Intelligence & Market Insights
              </CardTitle>
              <CardDescription>
                Προβλέψεις για αλλαγές αλγορίθμων, τάσεις αγοράς και competitive intelligence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {platformPredictions.map((prediction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getPlatformIcon(prediction.platform)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{prediction.title}</h3>
                          <Badge className={getImpactColor(prediction.impact)}>
                            {prediction.platform.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                            <div className="font-medium text-yellow-700 dark:text-yellow-300 text-sm mb-1">
                              📊 Market Intelligence:
                            </div>
                            <div className="text-sm">{prediction.prediction}</div>
                          </div>
                          
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded">
                            <div className="font-medium text-blue-700 dark:text-blue-300 text-sm mb-1">
                              🎯 Strategic Recommendation:
                            </div>
                            <div className="text-sm">{prediction.recommendation}</div>
                          </div>
                          
                          <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded">
                            <div className="font-medium text-purple-700 dark:text-purple-300 text-sm mb-1">
                              🧠 Expert Insight:
                            </div>
                            <div className="text-sm">{prediction.marketInsight}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t">
                          <div className="flex items-center gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Confidence: </span>
                              <span className="font-medium">{prediction.confidence}%</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impact: </span>
                              <span className="font-medium capitalize">{prediction.impact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Optimization */}
        <TabsContent value="budget" className="space-y-6">
          {budgetOptimization && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  AI Budget Optimization
                </CardTitle>
                <CardDescription>
                  Intelligent budget allocation για μέγιστη απόδοση ROI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Current vs Recommended */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground">Current Budget</div>
                      <div className="text-2xl font-bold">€{budgetOptimization.currentBudget.toLocaleString()}</div>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="text-sm text-muted-foreground">Recommended Budget</div>
                      <div className="text-2xl font-bold text-green-600">€{budgetOptimization.recommendedBudget.toLocaleString()}</div>
                      <div className="text-sm text-green-600">
                        +{budgetOptimization.totalExpectedLift}% expected lift
                      </div>
                    </div>
                  </div>

                  {/* Platform Reallocation */}
                  <div>
                    <h3 className="font-semibold mb-3">Smart Budget Reallocation</h3>
                    <div className="space-y-3">
                      {budgetOptimization.reallocation.map((platform, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{platform.platform}</h4>
                            <Badge variant="outline">
                              Expected ROAS: {platform.expectedROAS}x
                            </Badge>
                          </div>
                          
                          <div className="grid gap-2 md:grid-cols-2 mb-2">
                            <div>
                              <span className="text-sm text-muted-foreground">Current: </span>
                              <span className="font-medium">€{platform.currentSpend.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Recommended: </span>
                              <span className="font-medium text-green-600">
                                €{platform.recommendedSpend.toLocaleString()}
                              </span>
                              <span className="text-sm text-green-600 ml-2">
                                ({platform.recommendedSpend > platform.currentSpend ? '+' : ''}
                                {Math.round(((platform.recommendedSpend - platform.currentSpend) / platform.currentSpend) * 100)}%)
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">Reasoning: </span>
                            {platform.reasoning}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Implementation */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div>
                      <div className="font-medium">AI Confidence Level</div>
                      <div className="text-sm text-muted-foreground">
                        Βασισμένο σε historical performance και market trends
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={budgetOptimization.confidence} className="w-20" />
                      <span className="font-bold">{budgetOptimization.confidence}%</span>
                    </div>
                  </div>

                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Apply AI Budget Optimization
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Creative Insights */}
        <TabsContent value="creative" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Creative Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Creative Performance AI
                </CardTitle>
                <CardDescription>
                  Ανάλυση creative fatigue και optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creativeInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.creative.name}</h4>
                        <Badge className={
                          insight.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                          insight.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {insight.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 mb-2 text-sm">
                        <div>CTR: {insight.currentPerformance.ctr}%</div>
                        <div>CPM: €{insight.currentPerformance.cpm}</div>
                        <div>Conv: {insight.currentPerformance.conversions}</div>
                      </div>
                      
                      <div className="text-sm mb-2">{insight.prediction}</div>
                      <div className="text-sm font-medium text-green-600">{insight.recommendation}</div>
                      
                      <div className="mt-2">
                        <div className="text-xs text-muted-foreground mb-1">Suggested Actions:</div>
                        {insight.suggestedActions.map((action, i) => (
                          <div key={i} className="text-xs text-muted-foreground">• {action}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audience Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Audience Intelligence
                </CardTitle>
                <CardDescription>
                  AI-driven audience opportunities και expansion insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {audienceInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.audience.name}</h4>
                        <Badge variant="outline">
                          {insight.audience.platform.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                        <div>Current Size: {insight.audience.size.toLocaleString()}</div>
                        <div>Potential: {insight.potentialReach.toLocaleString()}</div>
                        <div>Expected CPA: €{insight.expectedCPA}</div>
                        <div>Confidence: {insight.confidence}%</div>
                      </div>
                      
                      <div className="text-sm mb-2">{insight.insight}</div>
                      <div className="text-sm font-medium text-blue-600">{insight.recommendation}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Expert AI Recommendations */}
        <TabsContent value="expert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Expert AI Recommendations
              </CardTitle>
              <CardDescription>
                Προτάσεις από AI με 15+ χρόνια media buying εμπειρία
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expertRecommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{rec.category === 'Strategic' ? '🎯' : rec.category === 'Technical' ? '⚡' : '🎨'}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <Badge className={
                            rec.priority === 'critical' ? 'bg-red-100 text-red-700' :
                            rec.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }>
                            {rec.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-purple-500">
                            <div className="font-medium text-purple-700 dark:text-purple-300 text-sm mb-1">
                              🧠 Expert Insight:
                            </div>
                            <div className="text-sm">{rec.insight}</div>
                          </div>
                          
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-green-500">
                            <div className="font-medium text-green-700 dark:text-green-300 text-sm mb-1">
                              💡 Recommendation:
                            </div>
                            <div className="text-sm">{rec.recommendation}</div>
                          </div>
                          
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border-l-4 border-blue-500">
                            <div className="font-medium text-blue-700 dark:text-blue-300 text-sm mb-1">
                              📈 Expected Impact:
                            </div>
                            <div className="text-sm font-medium text-green-600">{rec.expectedImpact}</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t">
                          <div className="text-sm font-medium text-orange-600">
                            {rec.action}
                          </div>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Rocket className="w-4 h-4 mr-1" />
                            Implement
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Market Intelligence & Competitive Analysis
              </CardTitle>
              <CardDescription>
                AI-powered market insights και competitive opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketIntelligence.map((intel, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{intel.title}</h3>
                      <Badge className={
                        intel.urgency === 'high' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }>
                        {intel.urgency.toUpperCase()} URGENCY
                      </Badge>
                    </div>
                    
                    <div className="text-sm mb-2">{intel.insight}</div>
                    <div className="text-sm font-medium text-blue-600">{intel.recommendation}</div>
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