import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { BarChart3, Sparkles, Brain, TrendingUp, AlertTriangle, CheckCircle, XCircle, Info, Zap, Target, Lightbulb, ArrowRight, MessageCircle, Bell, Send, Bot, User, Clock, Star, TrendingDown, Users, Filter, PieChart as PieChartIcon, Activity, X, Mic, Download, Settings } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart as ReBarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class AnalyticsStudioErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('AnalyticsStudio Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 dark:bg-red-950/20 flex items-center justify-center p-8">
          <div className="max-w-2xl bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-red-900 dark:text-red-100">
                Σφάλμα στο Analytics Studio
              </h1>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Συνέβη ένα απροσδόκητο σφάλμα κατά τη φόρτωση του Analytics Studio.
            </p>
            <details className="bg-gray-100 dark:bg-gray-800 rounded p-4 mb-4">
              <summary className="cursor-pointer font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Τεχνικές λεπτομέρειες (μόνο για ανάπτυξη)
              </summary>
              <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <div className="flex gap-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Ανανέωση σελίδας
              </Button>
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
              >
                Επιστροφή
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const KPIS = [
  { title: 'Impressions', value: '1,200,000', change: 8.5, color: 'from-blue-500 to-blue-700', trend: 'up' },
  { title: 'Clicks', value: '45,000', change: 5.2, color: 'from-green-500 to-emerald-500', trend: 'up' },
  { title: 'CTR', value: '3.75%', change: 0.3, color: 'from-purple-500 to-pink-500', trend: 'up' },
  { title: 'Conversions', value: '2,300', change: 2.1, color: 'from-orange-500 to-yellow-500', trend: 'up' },
  { title: 'ROAS', value: '4.2', change: 0.7, color: 'from-indigo-500 to-blue-400', trend: 'up' },
  { title: 'Revenue', value: '€18,500', change: 12.3, color: 'from-teal-500 to-green-400', trend: 'up' },
];

const lineData = [
  { name: 'Mon', Impressions: 120000, Clicks: 4000 },
  { name: 'Tue', Impressions: 135000, Clicks: 4200 },
  { name: 'Wed', Impressions: 110000, Clicks: 3900 },
  { name: 'Thu', Impressions: 142000, Clicks: 4800 },
  { name: 'Fri', Impressions: 130000, Clicks: 4100 },
  { name: 'Sat', Impressions: 125000, Clicks: 4300 },
  { name: 'Sun', Impressions: 140000, Clicks: 4700 },
];

const barData = [
  { platform: 'Facebook', Conversions: 1200 },
  { platform: 'Instagram', Conversions: 900 },
  { platform: 'Google Ads', Conversions: 600 },
  { platform: 'TikTok', Conversions: 400 },
];

const pieData = [
  { name: 'Facebook', value: 45 },
  { name: 'Instagram', value: 30 },
  { name: 'Google Ads', value: 15 },
  { name: 'TikTok', value: 10 },
];
const pieColors = ['#3B82F6', '#A21CAF', '#F59E42', '#111827'];

// AI Recommendations Data
const aiRecommendations = [
  {
    id: 1,
    type: 'insight',
    title: 'CTR Optimization Opportunity',
    description: 'Το Instagram έχει 40% χαμηλότερο CTR από το Facebook. Προτείνουμε A/B testing για ad copy.',
    impact: 'high',
    confidence: 92,
    action: 'Εφάρμοσε πρόταση',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 2,
    type: 'alert',
    title: 'Budget Alert',
    description: 'Το TikTok budget θα εξαντληθεί σε 2 μέρες. Προτείνουμε αύξηση ή αναδιανομή.',
    impact: 'medium',
    confidence: 88,
    action: 'Δες λεπτομέρειες',
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 3,
    type: 'prediction',
    title: 'Revenue Forecast',
    description: 'Με βάση τα τρέχοντα trends, αναμένουμε 15% αύξηση revenue επόμενη εβδομάδα.',
    impact: 'high',
    confidence: 85,
    action: 'Εφάρμοσε πρόταση',
    icon: Target,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 4,
    type: 'optimization',
    title: 'Audience Targeting',
    description: 'Η ηλικιακή ομάδα 25-34 έχει 3x καλύτερο ROAS. Προτείνουμε επικέντρωση.',
    impact: 'medium',
    confidence: 78,
    action: 'Εφάρμοσε πρόταση',
    icon: Lightbulb,
    color: 'from-purple-500 to-purple-600'
  }
];

// Sakis AI Chat Messages
const aiChatMessages = [
  {
    id: 1,
    type: 'ai',
    message: 'Γεια σου! Είμαι ο Saki, ο AI assistant σου! 🚀 Μπορώ να σε βοηθήσω με analytics, προτάσεις βελτίωσης, ή να απαντήσω σε ερωτήσεις για τα δεδομένα σου. Τι θα ήθελες να μάθεις;',
    timestamp: '14:30'
  },
  {
    id: 2,
    type: 'user',
    message: 'Ποια πλατφόρμα έχει το καλύτερο ROAS;',
    timestamp: '14:31'
  },
  {
    id: 3,
    type: 'ai',
    message: 'Γεια σου! Είμαι ο Saki! 😊 Με βάση τα τρέχοντα δεδομένα, το **Facebook** έχει το καλύτερο ROAS με 4.2, ακολουθούμενο από το Instagram με 3.8. Το TikTok έχει το χαμηλότερο με 2.1. Προτείνω να αυξήσεις το budget στο Facebook για καλύτερα αποτελέσματα!',
    timestamp: '14:31'
  }
];

// Quick Actions for Saki
const quickActions = [
  {
    id: 1,
    text: 'Ποια πλατφόρμα έχει το καλύτερο ROAS;',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 2,
    text: 'Πρόταση βελτίωσης CTR',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 3,
    text: 'Προβλέψεις για επόμενη εβδομάδα',
    icon: Activity,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    text: 'Ανάλυση audience',
    icon: Users,
    color: 'from-orange-500 to-orange-600'
  }
];

// AI-powered Filter Suggestions
const aiFilterSuggestions = [
  {
    id: 1,
    title: 'High-Performing Campaigns',
    description: 'Εμφάνισε μόνο campaigns με CTR > 3%',
    filter: { ctr: { min: 3 } },
    confidence: 95,
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 2,
    title: 'Budget Optimization',
    description: 'Campaigns με ROAS < 2.5 για βελτίωση',
    filter: { roas: { max: 2.5 } },
    confidence: 88,
    icon: Target,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 3,
    title: 'Emerging Trends',
    description: 'Πλατφόρμες με αύξηση > 10%',
    filter: { growth: { min: 10 } },
    confidence: 82,
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 4,
    title: 'Audience Insights',
    description: '25-34 age group performance',
    filter: { ageGroup: '25-34' },
    confidence: 90,
    icon: Users,
    color: 'from-purple-500 to-purple-600'
  }
];

// Performance Predictions Data
const performancePredictions = [
  {
    metric: 'Revenue',
    current: 18500,
    predicted: 22500,
    confidence: 85,
    trend: 'up',
    factors: ['Seasonal increase', 'Campaign optimization', 'Audience growth']
  },
  {
    metric: 'CTR',
    current: 3.75,
    predicted: 4.2,
    confidence: 78,
    trend: 'up',
    factors: ['Ad copy improvements', 'Targeting refinement']
  },
  {
    metric: 'ROAS',
    current: 4.2,
    predicted: 4.8,
    confidence: 82,
    trend: 'up',
    factors: ['Budget reallocation', 'Performance optimization']
  },
  {
    metric: 'Conversions',
    current: 2300,
    predicted: 2800,
    confidence: 75,
    trend: 'up',
    factors: ['Landing page improvements', 'Funnel optimization']
  }
];

// Data Anomaly Detection
const dataAnomalies = [
  {
    id: 1,
    type: 'spike',
    metric: 'CTR',
    value: '8.5%',
    normal: '3.2%',
    severity: 'high',
    description: 'Ασυνήθιστη αύξηση CTR στο Instagram',
    timestamp: '2 ώρες πριν',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 2,
    type: 'drop',
    metric: 'Conversions',
    value: '150',
    normal: '450',
    severity: 'medium',
    description: 'Μείωση conversions στο TikTok',
    timestamp: '4 ώρες πριν',
    icon: TrendingDown,
    color: 'from-red-500 to-red-600'
  },
  {
    id: 3,
    type: 'pattern',
    metric: 'Budget',
    value: '€2,500',
    normal: '€1,800',
    severity: 'low',
    description: 'Ασυνήθιστη budget consumption',
    timestamp: '6 ώρες πριν',
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600'
  }
];

// Smart Notifications
const smartNotifications = [
  {
    id: 1,
    type: 'success',
    title: 'CTR Milestone Reached!',
    message: 'Το CTR έφτασε 4.2% - νέο ρεκόρ!',
    priority: 'high',
    timestamp: '2 λεπτά πριν',
    icon: TrendingUp,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Budget Alert',
    message: 'Το TikTok budget θα τελειώσει σε 6 ώρες',
    priority: 'medium',
    timestamp: '15 λεπτά πριν',
    icon: AlertTriangle,
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 3,
    type: 'info',
    title: 'New Audience Segment',
    message: 'Αναγνωρίστηκε νέα high-value audience: 25-34 ετών',
    priority: 'low',
    timestamp: '1 ώρα πριν',
    icon: Target,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Performance Drop',
    message: 'Το Instagram CTR μειώθηκε κατά 12%',
    priority: 'high',
    timestamp: '2 ώρες πριν',
    icon: TrendingDown,
    color: 'from-red-500 to-red-600'
  },
  // --- NEW DEMO NOTIFICATIONS ---
  {
    id: 5,
    type: 'success',
    title: 'Νέο Conversion Record!',
    message: 'Οι conversions ξεπέρασαν τις 2.500 σήμερα!',
    priority: 'high',
    timestamp: '5 λεπτά πριν',
    icon: CheckCircle,
    color: 'from-green-400 to-green-700'
  },
  {
    id: 6,
    type: 'info',
    title: 'AI Insight',
    message: 'Το AI εντόπισε αυξημένο engagement σε Facebook Stories.',
    priority: 'medium',
    timestamp: '10 λεπτά πριν',
    icon: Sparkles,
    color: 'from-blue-400 to-purple-500'
  },
  {
    id: 7,
    type: 'warning',
    title: 'Low ROAS Warning',
    message: 'Η καμπάνια "Spring Sale" έχει ROAS κάτω από 2.0.',
    priority: 'medium',
    timestamp: '20 λεπτά πριν',
    icon: AlertTriangle,
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 8,
    type: 'error',
    title: 'Σφάλμα Εξαγωγής',
    message: 'Απέτυχε η εξαγωγή δεδομένων σε CSV. Προσπαθήστε ξανά.',
    priority: 'high',
    timestamp: '30 λεπτά πριν',
    icon: XCircle,
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 9,
    type: 'info',
    title: 'Νέο AI Widget διαθέσιμο',
    message: 'Δοκίμασε το νέο AI KPI Widget για custom αναλύσεις!',
    priority: 'low',
    timestamp: '40 λεπτά πριν',
    icon: Lightbulb,
    color: 'from-purple-400 to-pink-500'
  },
];

export default function AnalyticsStudio() {
  // ALL React Hooks must be at the top level - NEVER in try-catch!
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState('All');
  const [dateFrom, setDateFrom] = useState('2024-06-01');
  const [dateTo, setDateTo] = useState('2024-06-07');
  const [selectedRecommendation, setSelectedRecommendation] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState(aiChatMessages);
  const [isListening, setIsListening] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  // useEffect must be at top level too!
  useEffect(() => {
    setIsLoading(false);
    console.log('🔍 AnalyticsStudio: Component fully loaded');
  }, []);

  // Component logic wrapped in error handling
  try {
    console.log('🔍 AnalyticsStudio: Starting component initialization...');

    console.log('🔍 AnalyticsStudio: State initialized successfully');

    // Enhanced export handler
    const handleExport = () => {
      toast.success('Ξεκίνησε η εξαγωγή δεδομένων...', {
        description: 'Τα analytics δεδομένα θα εξαχθούν σε CSV format'
      });
      
      // Simulate export process
      setTimeout(() => {
        const csvData = 'Date,Platform,Impressions,Clicks,CTR,Conversions\n' +
          lineData.map(item => `${item.name},Facebook,${item.Impressions},${item.Clicks},${((item.Clicks/item.Impressions)*100).toFixed(2)},${Math.floor(item.Clicks * 0.05)}`).join('\n');
        
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-studio-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success('Εξαγωγή ολοκληρώθηκε!', {
          description: 'Το αρχείο κατέβηκε στον υπολογιστή σας'
        });
      }, 2000);
    };

    // AI Action handlers
    const handleApplyRecommendation = (id: number) => {
      const recommendation = aiRecommendations.find(r => r.id === id);
      toast.success(`Εφαρμόζεται πρόταση: ${recommendation?.title}`, {
        description: 'Η AI πρόταση εφαρμόζεται στις καμπάνιες σας...'
      });
      
      // Simulate applying the recommendation
      setTimeout(() => {
        toast.success('Πρόταση εφαρμόστηκε επιτυχώς!', {
          description: 'Τα αποτελέσματα θα φανούν σύντομα στα analytics'
        });
      }, 3000);
    };

    const handleIgnoreRecommendation = (id: number) => {
      const recommendation = aiRecommendations.find(r => r.id === id);
      toast.info(`Πρόταση αγνοήθηκε: ${recommendation?.title}`, {
        description: 'Μπορείτε να την επανεξετάσετε αργότερα'
      });
    };

    const handleGetMoreInfo = (id: number) => {
      setSelectedRecommendation(selectedRecommendation === id ? null : id);
    };

    // Enhanced Chat handlers with typing indicator
    const handleSendMessage = () => {
      if (chatMessage.trim()) {
        const userMessage = {
          id: chatHistory.length + 1,
          type: 'user' as const,
          message: chatMessage,
          timestamp: new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
        };
        
        setChatHistory([...chatHistory, userMessage]);
        setChatMessage('');
        setIsTyping(true);
        
        // Simulate Saki typing and responding
        setTimeout(() => {
          const sakiResponse = {
            id: chatHistory.length + 2,
            type: 'ai' as const,
            message: `Γεια σου! Είμαι ο Saki! 😊 Ευχαριστώ για την ερώτηση: "${userMessage.message}". Το AI μου αναλύει τα δεδομένα και θα σου δώσω μια λεπτομερή απάντηση σύντομα...`,
            timestamp: new Date().toLocaleTimeString('el-GR', { hour: '2-digit', minute: '2-digit' })
          };
          setChatHistory(prev => [...prev, sakiResponse]);
          setIsTyping(false);
        }, 2000);
      }
    };

    // Voice input handler
    const handleVoiceInput = () => {
      setIsListening(true);
      // Simulate voice recognition
      setTimeout(() => {
        setChatMessage('Ποια πλατφόρμα έχει το καλύτερο ROAS;');
        setIsListening(false);
      }, 1500);
    };

    // Export chat handler
    const handleExportChat = () => {
      const chatText = chatHistory.map(msg => 
        `${msg.type === 'user' ? 'Εσύ' : 'Saki'}: ${msg.message}`
      ).join('\n\n');
      
      const blob = new Blob([chatText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saki-chat-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    };

    console.log('🔍 AnalyticsStudio: Handlers initialized successfully');

    console.log('🔍 AnalyticsStudio: Handlers initialized successfully');

    // If there's an error, show error UI
    if (error) {
      return (
        <div className="min-h-screen bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-2xl font-bold text-red-600">Σφάλμα στο Analytics Studio</h1>
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Ανανέωση σελίδας
            </button>
          </div>
        </div>
      );
    }

    // If loading, show loading UI
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Φόρτωση Analytics Studio...</p>
          </div>
        </div>
      );
    }

    console.log('🔍 AnalyticsStudio: Starting render...');

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/20">
        <div className="flex">
          {/* Main Content */}
          <div className="flex-1 container mx-auto px-4 py-8 space-y-8">
            {/* Header with AI Assistant & Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics Studio</h1>
                <p className="text-muted-foreground">AI-powered analytics & insights</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Notifications Dialog Button */}
                <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Ειδοποιήσεις
                      <Badge variant="destructive" className="absolute -top-2 -right-2 w-5 h-5 text-xs">
                        {smartNotifications.filter(n => n.priority === 'high').length}
                      </Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg w-full p-0 border-0 bg-transparent">
                    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/20">
                      <DialogHeader className="p-6 pb-0">
                        <DialogTitle>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                              <Bell className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                              Ειδοποιήσεις
                            </span>
                          </div>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {smartNotifications.length === 0 && (
                          <div className="text-center text-muted-foreground">Δεν υπάρχουν ειδοποιήσεις</div>
                        )}
                        {smartNotifications.map((n) => {
                          let icon = <Info className="w-6 h-6" />;
                          let gradient = 'from-purple-500 to-pink-500';
                          if (n.type === 'success') {
                            icon = <CheckCircle className="w-6 h-6" />;
                            gradient = 'from-green-500 to-emerald-500';
                          } else if (n.type === 'warning') {
                            icon = <AlertTriangle className="w-6 h-6" />;
                            gradient = 'from-orange-500 to-yellow-500';
                          } else if (n.type === 'error' || n.type === 'alert') {
                            icon = <AlertTriangle className="w-6 h-6" />;
                            gradient = 'from-red-500 to-pink-500';
                          }
                          return (
                            <div key={n.id} className={`flex items-center gap-4 p-4 rounded-2xl shadow-lg bg-gradient-to-r ${gradient} text-white`}>
                              <div className="flex-shrink-0">{icon}</div>
                              <div className="flex-1">
                                <div className="font-bold text-base leading-tight mb-1">{n.title || 'Ειδοποίηση'}</div>
                                <div className="text-sm opacity-90">{n.message || ''}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {/* Sakis AI Assistant Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChat(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ρώτησε τον Saki
                </Button>
              </div>
            </div>

            {/* Sakis AI Chat Assistant Modal */}
            <Dialog open={showChat} onOpenChange={setShowChat}>
              <DialogContent className="w-full max-w-3xl h-[85vh] flex flex-col p-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 to-pink-950">
                <DialogHeader className="p-6 pb-4 flex items-center justify-between border-b border-purple-200 dark:border-purple-800">
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-gray-100">Saki AI Assistant</div>
                      <div className="text-sm text-muted-foreground">Έτοιμος να σε βοηθήσω με analytics! 🚀</div>
                    </div>
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      onClick={handleExportChat}
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-purple-100 dark:hover:bg-purple-900"
                      title="Εξαγωγή συνομιλίας"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowChat(false)} 
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-purple-100 dark:hover:bg-purple-900"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </DialogHeader>
                
                                  <div className="flex-1 overflow-y-auto space-y-4 p-6">
                    {chatHistory.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-3 max-w-md ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`p-2 rounded-full shadow-lg ${msg.type === 'user' ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-pink-500'}`}>
                            {msg.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                          </div>
                          <div className={`p-4 rounded-2xl shadow-md ${msg.type === 'user' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800'}`}>
                            <p className="text-sm leading-relaxed">{msg.message}</p>
                            <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-muted-foreground'}`}>
                              {msg.timestamp}
                            </p>
                            {/* Message Reactions */}
                            {msg.type === 'ai' && (
                              <div className="flex gap-1 mt-2">
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-xs hover:bg-green-100 dark:hover:bg-green-900">
                                  👍
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-xs hover:bg-red-100 dark:hover:bg-red-900">
                                  👎
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-3 max-w-md">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 rounded-2xl shadow-md">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-sm text-muted-foreground">Ο Saki γράφει...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    {chatHistory.length <= 1 && (
                      <div className="mt-6">
                        <p className="text-sm text-muted-foreground mb-3 text-center">💡 Γρήγορες ερωτήσεις:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {quickActions.map((action) => (
                            <Button
                              key={action.id}
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setChatMessage(action.text);
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                              className="text-xs h-auto p-3 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            >
                              <action.icon className="w-3 h-3 mr-1" />
                              {action.text}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                
                <div className="p-6 pt-4 border-t border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-900/50">
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleVoiceInput}
                      disabled={isListening}
                      className={`border-purple-200 dark:border-purple-800 ${isListening ? 'bg-red-100 dark:bg-red-900 animate-pulse' : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}
                      title="Φωνητική ερώτηση"
                      size="sm"
                      variant="outline"
                    >
                      <Mic className={`w-4 h-4 ${isListening ? 'text-red-500' : 'text-purple-500'}`} />
                    </Button>
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Ρώτησε τον Saki για analytics, προτάσεις, ή οτιδήποτε άλλο..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 border-purple-200 dark:border-purple-800 focus:border-purple-500 dark:focus:border-purple-400"
                      disabled={isListening}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      size="sm"
                      disabled={isListening || !chatMessage.trim()}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <div className="mt-2 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        🎤 Ακούω... Μίλα τώρα!
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

          {/* Filters & Actions */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Από</label>
                <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Έως</label>
                <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1 text-muted-foreground">Πλατφόρμα</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-40 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <option value="All">Όλες</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="TikTok">TikTok</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleExport} 
                variant="outline"
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                onClick={() => setTestDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Ρυθμίσεις Dashboard
              </Button>
            </div>
          </div>

          {/* Automated AI Insights */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Alert className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
              <AlertTitle className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                Performance Boost
              </AlertTitle>
              <AlertDescription>
                🚀 Το CTR αυξήθηκε κατά <b>15%</b> αυτή την εβδομάδα! Συνεχίστε την καλή δουλειά.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <AlertTitle className="flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-600" />
                Audience Insight
              </AlertTitle>
              <AlertDescription>
                🎯 Η ηλικιακή ομάδα 25-34 έχει <b>3x καλύτερο ROAS</b>. Προτείνουμε επικέντρωση.
              </AlertDescription>
            </Alert>
            
            <Alert className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
              <AlertTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                Trend Analysis
              </AlertTitle>
              <AlertDescription>
                📈 Το Facebook έχει <b>40% καλύτερη απόδοση</b> από το Instagram. Αυξήστε το budget.
              </AlertDescription>
            </Alert>
          </div>

          {/* --- AI-powered Filters Section --- */}
          <Card className="mt-8 border-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <Filter className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-xl">AI-powered Filters από τον Sakis</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {aiFilterSuggestions.map((filter) => (
                <div key={filter.id} className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow group hover:shadow-lg transition-all border border-blue-100 dark:border-blue-800 flex flex-col gap-2">
                  <div className={`p-2 bg-gradient-to-br ${filter.color} rounded-xl w-fit mb-2`}>
                    <filter.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{filter.title}</div>
                  <div className="text-xs text-muted-foreground mb-1">{filter.description}</div>
                  <Badge variant="secondary" className="w-fit">Εμπιστοσύνη: {filter.confidence}%</Badge>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => {
                      toast.success(`Εφαρμόζεται φίλτρο: ${filter.title}`, {
                        description: `Εμπιστοσύνη: ${filter.confidence}%`
                      });
                    }}
                  >
                    Εφάρμοσε φίλτρο
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* --- Performance Predictions Section --- */}
          <Card className="mt-8 border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <Activity className="w-5 h-5 text-green-600" />
              <CardTitle className="text-xl">Performance Predictions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {performancePredictions.map((pred, idx) => (
                <div key={idx} className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow group hover:shadow-lg transition-all border border-green-100 dark:border-green-800 flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{pred.metric}</span>
                    <Badge variant="secondary">{pred.trend === 'up' ? 'Αύξηση' : 'Μείωση'}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Τρέχον: <b>{pred.current}</b></div>
                  <div className="text-xs text-green-700 dark:text-green-300">Πρόβλεψη: <b>{pred.predicted}</b></div>
                  <div className="text-xs text-muted-foreground">Εμπιστοσύνη: {pred.confidence}%</div>
                  <div className="text-xs text-muted-foreground">Factors: {pred.factors.join(', ')}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* --- Custom AI Widgets Section --- */}
          <Card className="mt-8 border-0 bg-gradient-to-br from-pink-50 to-yellow-50 dark:from-pink-900/20 dark:to-yellow-900/20 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <PieChartIcon className="w-5 h-5 text-pink-600" />
              <CardTitle className="text-xl">Custom AI Widgets</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow flex flex-col gap-2 items-center">
                <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
                <div className="font-semibold">AI KPI Widget</div>
                <div className="text-xs text-muted-foreground">Demo: Προσαρμόσιμο KPI με AI insight</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => {
                    toast.info('Άνοιγμα προσαρμογής widget...', {
                      description: 'Μπορείτε να προσαρμόσετε τις ρυθμίσεις και το περιεχόμενο'
                    });
                  }}
                >
                  Προσαρμογή
                </Button>
              </div>
              <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow flex flex-col gap-2 items-center">
                <PieChartIcon className="w-8 h-8 text-pink-500 mb-2" />
                <div className="font-semibold">AI Pie Widget</div>
                <div className="text-xs text-muted-foreground">Demo: AI-driven κατανομή budget</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => {
                    toast.info('Άνοιγμα προσαρμογής widget...', {
                      description: 'Μπορείτε να προσαρμόσετε τις ρυθμίσεις και το περιεχόμενο'
                    });
                  }}
                >
                  Προσαρμογή
                </Button>
              </div>
              <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow flex flex-col gap-2 items-center">
                <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
                <div className="font-semibold">AI Alert Widget</div>
                <div className="text-xs text-muted-foreground">Demo: Αυτόματη ειδοποίηση από τον Sakis</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => {
                    toast.info('Άνοιγμα προσαρμογής widget...', {
                      description: 'Μπορείτε να προσαρμόσετε τις ρυθμίσεις και το περιεχόμενο'
                    });
                  }}
                >
                  Προσαρμογή
                </Button>
              </div>
              <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow flex flex-col gap-2 items-center">
                <Lightbulb className="w-8 h-8 text-purple-500 mb-2" />
                <div className="font-semibold">AI Idea Widget</div>
                <div className="text-xs text-muted-foreground">Demo: Νέα ιδέα από τον Sakis</div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => {
                    toast.info('Άνοιγμα προσαρμογής widget...', {
                      description: 'Μπορείτε να προσαρμόσετε τις ρυθμίσεις και το περιεχόμενο'
                    });
                  }}
                >
                  Προσαρμογή
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* --- Data Anomaly Detection Section --- */}
          <Card className="mt-8 border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-2 flex flex-row items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <CardTitle className="text-xl">Data Anomaly Detection</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {dataAnomalies.map((anomaly) => (
                <div key={anomaly.id} className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow group hover:shadow-lg transition-all border border-red-100 dark:border-red-800 flex flex-col gap-2">
                  <div className={`p-2 bg-gradient-to-br ${anomaly.color} rounded-xl w-fit mb-2`}>
                    <anomaly.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{anomaly.metric} {anomaly.type === 'spike' ? 'Spike' : anomaly.type === 'drop' ? 'Drop' : 'Pattern'}</div>
                  <div className="text-xs text-muted-foreground mb-1">{anomaly.description}</div>
                  <div className="text-xs text-muted-foreground">Τιμή: <b>{anomaly.value}</b> (Κανονικό: {anomaly.normal})</div>
                  <Badge variant={anomaly.severity === 'high' ? 'destructive' : anomaly.severity === 'medium' ? 'default' : 'secondary'} className="w-fit">Σοβαρότητα: {anomaly.severity === 'high' ? 'Υψηλή' : anomaly.severity === 'medium' ? 'Μεσαία' : 'Χαμηλή'}</Badge>
                  <div className="text-xs text-muted-foreground">{anomaly.timestamp}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* KPI Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {KPIS.map((kpi, idx) => (
              <Card key={idx} className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10 hover:shadow-2xl hover:shadow-gray-500/20 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${kpi.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium">
                      +{kpi.change}%
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{kpi.title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {/* Line Chart */}
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Impressions & Clicks (Line Chart)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Impressions" stroke="#3B82F6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="Clicks" stroke="#10B981" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  Conversions by Platform (Bar Chart)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="platform" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Conversions" fill="#A21CAF" radius={[8, 8, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  Budget Distribution (Pie Chart)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Demo Chart Widget */}
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                Demo Chart Widget
              </CardTitle>
              <CardDescription className="text-base">
                Εδώ θα μπει ένα custom γράφημα ή visualization.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                [Chart Placeholder]
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations Panel */}
        <div className="w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-l border-gray-200 dark:border-gray-700 p-6 space-y-6 overflow-y-auto">
          {/* Panel Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Insights</h3>
              <p className="text-sm text-muted-foreground">Προτάσεις & Προβλέψεις</p>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-4">
            {aiRecommendations.map((rec) => (
              <Card key={rec.id} className="border-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 bg-gradient-to-br ${rec.color} rounded-xl shadow-lg flex-shrink-0`}>
                      <rec.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{rec.title}</h4>
                        <Badge variant={rec.impact === 'high' ? 'default' : 'secondary'} className="text-xs">
                          {rec.impact === 'high' ? 'Υψηλή' : 'Μεσαία'} επίδραση
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Εμπιστοσύνη: {rec.confidence}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Explainable AI */}
                  {selectedRecommendation === rec.id && (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Γιατί το προτείνει αυτό;</span>
                      </div>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        Το AI ανέλυσε {rec.confidence}% των δεδομένων και βρήκε συσχέτιση με παρόμοια patterns. 
                        Η πρόταση βασίζεται σε machine learning algorithms και historical data analysis.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyRecommendation(rec.id)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Εφάρμοσε
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleIgnoreRecommendation(rec.id)}
                    >
                      <XCircle className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleGetMoreInfo(rec.id)}
                    >
                      <Info className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Predictive Analytics Card */}
          <Card className="border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold">Predictive Analytics</h4>
                  <p className="text-xs text-indigo-100">Επόμενη εβδομάδα</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Προβλεπόμενο Revenue:</span>
                  <span className="font-bold">€22,500</span>
                </div>
                <div className="flex justify-between">
                  <span>Πιθανότητα:</span>
                  <span className="font-bold">85%</span>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="secondary" 
                className="w-full mt-3 bg-white/20 hover:bg-white/30"
                onClick={() => {
                  toast.info('Φόρτωση λεπτομερούς πρόβλεψης...', {
                    description: 'Περιλαμβάνει breakdown ανά πλατφόρμα και audience'
                  });
                }}
              >
                Δες λεπτομέρειες
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Test Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="w-96">
          <DialogHeader>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Αυτό είναι ένα test dialog για να δούμε αν λειτουργεί!</p>
            <div className="flex justify-end">
              <Button onClick={() => setTestDialogOpen(false)}>Κλείσιμο</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  } catch (err) {
    console.error('🔍 AnalyticsStudio: Fatal error in component:', err);
    setError(err instanceof Error ? err.message : 'Άγνωστο σφάλμα');
    
    // Return error UI
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-red-600">Σφάλμα στο Analytics Studio</h1>
          <p className="text-red-500">
            {err instanceof Error ? err.message : 'Άγνωστο σφάλμα'}
          </p>
          <pre className="text-xs text-red-400 bg-red-100 dark:bg-red-900/20 p-4 rounded overflow-auto max-w-md">
            {err instanceof Error ? err.stack : String(err)}
          </pre>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Ανανέωση σελίδας
          </button>
        </div>
      </div>
    );
  }
} 