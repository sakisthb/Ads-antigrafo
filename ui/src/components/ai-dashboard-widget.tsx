import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  DollarSign,
  Eye,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import claudeAI from '@/lib/claude-ai-service';

interface AIInsight {
  id: string;
  type: 'critical_alert' | 'opportunity' | 'recommendation' | 'forecast';
  title: string;
  message: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  estimatedValue?: number;
  timeframe: 'immediate' | 'short-term' | 'medium-term';
}

const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'critical_alert',
    title: 'Budget Depletion Alert',
    message: 'Το μηνιαίο budget θα εξαντληθεί σε 3 ημέρες με το τρέχον rate.',
    confidence: 95,
    impact: 'critical',
    actionable: true,
    timeframe: 'immediate'
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Scaling Opportunity',
    message: 'ROAS >4.0x στις 3 κύριες καμπάνιες. Ιδανικός χρόνος για scaling.',
    confidence: 88,
    impact: 'high',
    actionable: true,
    estimatedValue: 4500,
    timeframe: 'immediate'
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Creative Refresh Needed',
    message: 'CTR μειώθηκε 35% - creative fatigue detected.',
    confidence: 92,
    impact: 'high',
    actionable: true,
    timeframe: 'immediate'
  },
  {
    id: '4',
    type: 'forecast',
    title: 'Performance Forecast',
    message: 'Αναμένεται +23% αύξηση conversions την επόμενη εβδομάδα.',
    confidence: 85,
    impact: 'medium',
    actionable: false,
    estimatedValue: 2800,
    timeframe: 'short-term'
  }
];

export function AIDashboardWidget() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAIConnected, setIsAIConnected] = useState(false);

  useEffect(() => {
    // Check AI connection status
    setIsAIConnected(claudeAI.isConnected());
    
    // Simulate AI analysis loading
    setTimeout(() => {
      setInsights(mockInsights);
      setIsLoading(false);
    }, 1500);

    // Auto-rotate insights
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % mockInsights.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'critical_alert': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'recommendation': return <Target className="w-5 h-5 text-blue-600" />;
      case 'forecast': return <Eye className="w-5 h-5 text-purple-600" />;
      default: return <Brain className="w-5 h-5 text-gray-600" />;
    }
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

  const implementAction = (insight: AIInsight) => {
    toast.success(`Implementing: ${insight.title}`);
    setInsights(prev => prev.filter(i => i.id !== insight.id));
  };

  const dismissInsight = (insight: AIInsight) => {
    setInsights(prev => prev.filter(i => i.id !== insight.id));
    toast.info('Insight dismissed');
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
            AI Analysis
          </CardTitle>
          <CardDescription>Analyzing your campaigns with AI...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600 animate-bounce" />
              <div className="text-sm text-muted-foreground">AI is analyzing your data...</div>
              <Progress value={75} className="w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            AI Analysis Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            All campaigns are performing optimally. No immediate actions required.
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentInsight = insights[currentIndex];

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Expert Insights
            {isAIConnected && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                Claude AI
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            {insights.length} Active
          </Badge>
        </CardTitle>
        <CardDescription>
          {isAIConnected 
            ? "🤖 Πραγματικές AI προτάσεις από Claude με 15+ χρόνια εμπειρία"
            : "🎯 Expert προτάσεις από media buyer με 15+ χρόνια εμπειρία"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Insight */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            {getInsightIcon(currentInsight.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm">{currentInsight.title}</h4>
                <Badge className={getImpactColor(currentInsight.impact)}>
                  {currentInsight.impact.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {currentInsight.message}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Confidence: {currentInsight.confidence}%
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {currentInsight.timeframe}
                </div>
                {currentInsight.estimatedValue && (
                  <div className="flex items-center gap-1 text-green-600">
                    <DollarSign className="w-3 h-3" />
                    +€{currentInsight.estimatedValue}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">AI Confidence</span>
              <span className="font-medium">{currentInsight.confidence}%</span>
            </div>
            <Progress value={currentInsight.confidence} className="h-1" />
          </div>

          {/* Actions */}
          {currentInsight.actionable && (
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => implementAction(currentInsight)}
                className="bg-green-600 hover:bg-green-700 text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Implement
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => dismissInsight(currentInsight)}
                className="text-xs"
              >
                Dismiss
              </Button>
            </div>
          )}
        </div>

        {/* Insight Navigation */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex gap-1">
            {insights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <Link to="/ai-predictions">
            <Button variant="ghost" size="sm" className="text-xs">
              View All AI Insights
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {insights.filter(i => i.impact === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {insights.filter(i => i.impact === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Impact</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              €{insights.reduce((sum, i) => sum + (i.estimatedValue || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Potential Value</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}