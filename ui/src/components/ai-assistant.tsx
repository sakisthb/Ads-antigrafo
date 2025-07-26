import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Brain, 
  Send, 
  Zap, 
  TrendingUp,
  DollarSign,
  Target,
  Eye,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Sparkles,
  Clock,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import claudeAI from '@/lib/claude-ai-service';

interface AIMessage {
  id: string;
  type: 'ai' | 'user' | 'insight' | 'recommendation';
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  actionable?: boolean;
  data?: any;
}

interface AIInsight {
  type: 'performance_alert' | 'budget_warning' | 'opportunity' | 'optimization';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  action?: string;
  impact?: string;
}

const mockAIInsights: AIInsight[] = [
  {
    type: 'performance_alert',
    title: 'Performance Drop Detected',
    message: 'Η καμπάνια "Summer Sale" έχει 35% μείωση στο CTR τις τελευταίες 4 ώρες. Πιθανή αιτία: creative fatigue.',
    priority: 'critical',
    actionable: true,
    action: 'Ενεργοποιήστε backup creative variants',
    impact: 'Potential revenue loss: €2,400/day'
  },
  {
    type: 'opportunity',
    title: 'Budget Scaling Opportunity',
    message: 'Το ROAS σας είναι σταθερά >4.0x. Ιδανικός χρόνος για 40% budget increase στις top-performing καμπάνιες.',
    priority: 'high',
    actionable: true,
    action: 'Scale budget από €500 σε €700/day',
    impact: 'Expected additional revenue: €800/day'
  },
  {
    type: 'budget_warning',
    title: 'Budget Pacing Alert',
    message: 'Το μηνιαίο budget θα εξαντληθεί 5 ημέρες νωρίτερα με το τρέχον spending rate.',
    priority: 'medium',
    actionable: true,
    action: 'Μειώστε daily budget κατά 15%',
    impact: 'Budget optimization για month-end'
  },
  {
    type: 'optimization',
    title: 'Audience Expansion Ready',
    message: 'Η lookalike audience 1% έχει εξαντλήσει το potential. Ώρα για expansion σε 2-3%.',
    priority: 'medium',
    actionable: true,
    action: 'Δημιουργήστε νέα lookalike 2-3%',
    impact: '+60% potential reach'
  }
];

const expertResponses = [
  {
    trigger: ['budget', 'scaling', 'increase'],
    response: '💡 **Expert Insight**: Για budget scaling, ακολουθώ την "20% rule" - αυξάνω το budget μέχρι 20% κάθε 3 ημέρες. Πάνω από αυτό, ο αλγόριθμος χάνει την learning phase. Βάσει των ROAS metrics σας, μπορείτε να scale safely.'
  },
  {
    trigger: ['creative', 'fatigue', 'ads'],
    response: '🎨 **Creative Strategy**: Βλέπω creative fatigue στα ads σας. Η εμπειρία μου λέει ότι χρειάζεστε 5-7 νέα creative variants εβδομαδιαίως. Προτείνω UGC approach με real customer testimonials - convert rate +40% στο vertical σας.'
  },
  {
    trigger: ['audience', 'targeting', 'lookalike'],
    response: '🎯 **Targeting Expertise**: Για το business σας, οι lookalike 1-3% είναι το sweet spot. Πάνω από 5% η ποιότητα πέφτει drastically. Εστιάστε σε behavior-based interests + lookalikes για optimal performance.'
  },
  {
    trigger: ['roas', 'performance', 'optimization'],
    response: '📈 **Performance Analysis**: Το ROAS >3.0x είναι excellent για το industry σας. Τώρα focus στο volume scaling. Broad targeting + automatic placements + dynamic ads είναι η επόμενη στρατηγική για 2x growth.'
  },
  {
    trigger: ['platform', 'facebook', 'google', 'meta'],
    response: '🌐 **Platform Strategy**: Βάσει 15ετή εμπειρία, το Facebook είναι ideal για awareness + retargeting, το Google για high-intent searches. Split budget: 60% Facebook, 30% Google, 10% testing (TikTok/LinkedIn).'
  }
];

export function AIAssistant({ isFloating = false }: { isFloating?: boolean }) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>(mockAIInsights);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: AIMessage = {
      id: 'welcome',
      type: 'ai',
      content: '👋 Γεια σας! Είμαι ο AI Media Buyer Assistant σας με 15+ χρόνια εμπειρία. Πώς μπορώ να σας βοηθήσω σήμερα;',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Add real-time insights
    setTimeout(() => {
      addInsightMessages();
    }, 3000);
  }, []);

  const addInsightMessages = () => {
    insights.forEach((insight, index) => {
      setTimeout(() => {
        const insightMessage: AIMessage = {
          id: `insight_${index}`,
          type: 'insight',
          content: insight.message,
          timestamp: new Date(),
          priority: insight.priority,
          actionable: insight.actionable,
          data: insight
        };
        setMessages(prev => [...prev, insightMessage]);
      }, index * 2000);
    });
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: AIMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(inputValue);
      const aiMessage: AIMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = async (input: string): Promise<string> => {
    try {
      // Try to get real Claude AI response
      const aiResponse = await claudeAI.generateResponse({
        prompt: input,
        maxTokens: 800,
        temperature: 0.7
      });

      // Add AI status indicator
      const statusIndicator = aiResponse.isFromAI ? '🤖 **Claude AI**' : '🎯 **Expert Mode**';
      const confidenceIndicator = `(Confidence: ${Math.round(aiResponse.confidence)}%)`;
      
      return `${statusIndicator} ${confidenceIndicator}\n\n${aiResponse.content}`;
      
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback to expert responses
      const lowerInput = input.toLowerCase();
      
      const matchedResponse = expertResponses.find(response => 
        response.trigger.some(trigger => lowerInput.includes(trigger))
      );

      if (matchedResponse) {
        return `🎯 **Expert Mode** (Offline)\n\n${matchedResponse.response}`;
      }

      // Default responses for common questions
      if (lowerInput.includes('hello') || lowerInput.includes('γεια')) {
        return '👋 Χαίρομαι που μιλάμε! Είμαι εδώ για να σας βοηθήσω με οποιοδήποτε ερώτημα για media buying, campaign optimization, ή στρατηγική προτάσεις.';
      }

      if (lowerInput.includes('help') || lowerInput.includes('βοήθεια')) {
        return `🤖 **Μπορώ να σας βοηθήσω με:**
• Campaign performance analysis & optimization
• Budget allocation και scaling strategies  
• Creative fatigue analysis και recommendations
• Audience targeting και expansion
• Platform-specific best practices
• ROI improvement strategies
• Competitive analysis insights

Τι θα θέλατε να εξερευνήσουμε;`;
      }

      // General fallback response
      return `🧠 Κατανοώ το ερώτημά σας. Βάσει της εμπειρίας μου στο media buying, θα σας προτείνω μια εξατομικευμένη στρατηγική. Μπορείτε να μου δώσετε περισσότερες λεπτομέρειες για να σας δώσω πιο specific recommendations;`;
    }
  };

  const implementAction = (insight: AIInsight) => {
    toast.success(`Εφαρμόζεται: ${insight.action}`);
    // Here you would implement the actual action
    setInsights(prev => prev.filter(i => i !== insight));
  };

  const dismissInsight = (insight: AIInsight) => {
    setInsights(prev => prev.filter(i => i !== insight));
    toast.info('Insight dismissed');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      case 'medium': return <Eye className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (isFloating) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 h-96 z-50 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="w-4 h-4 text-purple-600" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {messages.slice(-5).map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type !== 'user' && (
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                        <Brain className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] p-2 rounded text-xs ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.type === 'insight'
                        ? 'bg-yellow-50 border border-yellow-200'
                        : 'bg-gray-100'
                    }`}
                  >
                    {message.content}
                    {message.actionable && message.data && (
                      <div className="mt-1 flex gap-1">
                        <Button size="sm" className="h-6 text-xs" onClick={() => implementAction(message.data)}>
                          Apply
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-2 border-t">
            <div className="flex gap-1">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask AI..."
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={sendMessage} className="h-8 w-8 p-0">
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* AI Chat */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Media Buyer Assistant
            </CardTitle>
            <CardDescription>
              Συνομιλήστε με AI που έχει 15+ χρόνια εμπειρία στο media buying
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96 mb-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type !== 'user' && (
                      <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          {message.type === 'insight' ? <Sparkles className="w-4 h-4" /> : <Brain className="w-4 h-4" />}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : message.type === 'insight'
                          ? `border ${getPriorityColor(message.priority || 'low')}`
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}
                    >
                      {message.priority && (
                        <div className="flex items-center gap-2 mb-2">
                          {getPriorityIcon(message.priority)}
                          <Badge className={getPriorityColor(message.priority)}>
                            {message.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      {message.actionable && message.data && (
                        <div className="mt-3 flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => implementAction(message.data)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {message.data.action}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => dismissInsight(message.data)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      )}
                      
                      {message.data?.impact && (
                        <div className="mt-2 text-sm text-green-600 font-medium">
                          💰 {message.data.impact}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar>
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Brain className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ρωτήστε τον AI για campaign optimization, budget scaling, audience targeting..."
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Insights */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Live AI Insights
            </CardTitle>
            <CardDescription>
              Real-time προτάσεις και alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight, index) => (
                <div key={index} className={`p-3 rounded border ${getPriorityColor(insight.priority)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {getPriorityIcon(insight.priority)}
                    <span className="font-medium text-sm">{insight.title}</span>
                  </div>
                  <div className="text-xs mb-2">{insight.message}</div>
                  {insight.actionable && (
                    <div className="flex flex-col gap-1">
                      <Button 
                        size="sm" 
                        className="h-7 text-xs w-full"
                        onClick={() => implementAction(insight)}
                      >
                        {insight.action}
                      </Button>
                      {insight.impact && (
                        <div className="text-xs text-green-600 font-medium">
                          {insight.impact}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Quick AI Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setInputValue('Analyze my campaign performance')}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Analyze Performance
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setInputValue('Suggest budget optimization')}>
                <DollarSign className="w-4 h-4 mr-2" />
                Budget Optimization
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setInputValue('Check for creative fatigue')}>
                <Eye className="w-4 h-4 mr-2" />
                Creative Analysis
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm" onClick={() => setInputValue('Audience expansion opportunities')}>
                <Target className="w-4 h-4 mr-2" />
                Audience Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}