import { useState, useEffect } from 'react';
import { useSaaS } from '@/lib/demo-auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  MousePointer, 
  Eye,
  Target,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Activity,
  Zap,
  Brain,
  Rocket,
  Award,
  Clock,
  Globe,
  Shield,
  Star,
  Network,
  Layers,
  Cpu,
  Lightbulb,
  TrendingDown,
  Calendar,
  Timer,
  PlayCircle,
  RefreshCw,
  PieChart,
  LineChart
} from 'lucide-react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  ComposedChart,
  Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { log } from '@/lib/logger';
import claudeAI from '@/lib/claude-ai-service';
import { DataFetchStatus } from '@/components/data-fetch-status';

interface KPI {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  trend: 'up' | 'down';
}

const KPIS: KPI[] = [
  {
    title: 'Συνολικά Έσοδα',
    value: '€245,850',
    change: 24.5,
    icon: <DollarSign className="w-5 h-5" />,
    color: 'from-emerald-500 via-green-500 to-teal-500',
    trend: 'up'
  },
  {
    title: 'Ενεργές Καμπάνιες',
    value: '127',
    change: 18.2,
    icon: <Rocket className="w-5 h-5" />,
    color: 'from-blue-500 via-cyan-500 to-indigo-500',
    trend: 'up'
  },
  {
    title: 'ROAS Μέσος',
    value: '4.87x',
    change: 12.3,
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-purple-500 via-violet-500 to-purple-600',
    trend: 'up'
  },
  {
    title: 'Συνολικό Reach',
    value: '2.4M',
    change: 32.1,
    icon: <Globe className="w-5 h-5" />,
    color: 'from-orange-500 via-pink-500 to-red-500',
    trend: 'up'
  }
];

const PERFORMANCE_DATA = [
  { name: 'Meta Ads', value: 42, color: 'from-blue-500 to-blue-600', revenue: '€103,450', roas: 5.2 },
  { name: 'Google Ads', value: 28, color: 'from-red-500 to-orange-500', revenue: '€68,820', roas: 4.8 },
  { name: 'TikTok Ads', value: 18, color: 'from-gray-800 to-black', revenue: '€44,250', roas: 4.1 },
  { name: 'LinkedIn Ads', value: 12, color: 'from-blue-600 to-blue-800', revenue: '€29,330', roas: 3.9 }
];

const AI_INSIGHTS = [
  {
    title: 'Βελτιστοποίηση Budget',
    description: 'Μετακίνηση 15% budget από Google σε Meta μπορεί να αυξήσει ROAS κατά 23%',
    impact: 'high',
    icon: <Lightbulb className="w-4 h-4" />,
    action: 'Εφαρμογή'
  },
  {
    title: 'Καλύτερο Timing',
    description: 'Οι καμπάνιες έχουν 34% καλύτερη απόδοση μεταξύ 18:00-21:00',
    impact: 'medium',
    icon: <Clock className="w-4 h-4" />,
    action: 'Δείτε Περισσότερα'
  },
  {
    title: 'Audience Expansion',
    description: 'Lookalike audiences 3% εμφανίζουν υψηλότερο CVR από 1%',
    impact: 'medium',
    icon: <Users className="w-4 h-4" />,
    action: 'Δοκιμάστε'
  }
];

const LIVE_METRICS = [
  { label: 'Active Users', value: '1,247', change: '+12%', color: 'text-green-600' },
  { label: 'Revenue Today', value: '€8,450', change: '+24%', color: 'text-green-600' },
  { label: 'Campaigns Live', value: '23', change: '+3', color: 'text-blue-600' },
  { label: 'Avg CTR', value: '2.8%', change: '+0.3%', color: 'text-green-600' }
];

const ADVANCED_FEATURES = [
  {
    title: 'Multi-Touch Attribution',
    description: 'LSTM και ML-powered attribution analysis',
    icon: <Network className="w-6 h-6" />,
    color: 'from-purple-500 to-indigo-600',
    route: '/multi-touch-attribution',
    badge: 'SOS Priority'
  },
  {
    title: 'AI Prediction Engine',
    description: 'Προβλέψεις απόδοσης με Machine Learning',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    route: '/ai-ml-predictions',
    badge: 'AI Powered'
  },
  {
    title: 'Real-Time Analytics',
    description: 'Live δεδομένα και instant insights',
    icon: <Activity className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    route: '/realtime',
    badge: 'Live'
  },
  {
    title: 'Advanced Analytics',
    description: 'Βαθιά ανάλυση και custom reports',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    route: '/advanced-analytics',
    badge: 'Pro'
  }
];

const RECENT_ACTIVITY = [
  {
    action: 'Νέα καμπάνια "Black Friday 2024" ενεργοποιήθηκε',
    time: 'Πριν από 2 λεπτά'
  },
  {
    action: 'AI Attribution model ενημερώθηκε με νέα δεδομένα',
    time: 'Πριν από 5 λεπτά'
  },
  {
    action: 'Budget αυξήθηκε κατά €500 για Meta Ads',
    time: 'Πριν από 12 λεπτά'
  },
  {
    action: 'Νέο custom report "Performance Q4" δημιουργήθηκε',
    time: 'Πριν από 18 λεπτά'
  },
  {
    action: 'Alert: CPC αύξηση 15% στο Google Ads',
    time: 'Πριν από 25 λεπτά'
  },
  {
    action: 'Dashboard metrics ανανεώθηκαν',
    time: 'Πριν από 30 λεπτά'
  }
];

// Chart Data για Beautiful Visualizations
const REVENUE_TREND_DATA = [
  { date: '1 Ιαν', revenue: 12500, spend: 8200, roas: 1.52 },
  { date: '8 Ιαν', revenue: 15800, spend: 9100, roas: 1.74 },
  { date: '15 Ιαν', revenue: 18200, spend: 9800, roas: 1.86 },
  { date: '22 Ιαν', revenue: 22100, spend: 10200, roas: 2.17 },
  { date: '29 Ιαν', revenue: 28400, spend: 11500, roas: 2.47 },
  { date: '5 Φεβ', revenue: 31200, spend: 12100, roas: 2.58 },
  { date: '12 Φεβ', revenue: 35600, spend: 12800, roas: 2.78 },
  { date: '19 Φεβ', revenue: 42100, spend: 13200, roas: 3.19 },
  { date: '26 Φεβ', revenue: 48700, spend: 14100, roas: 3.45 },
  { date: '5 Μαρ', revenue: 52300, spend: 14800, roas: 3.53 },
  { date: '12 Μαρ', revenue: 58900, spend: 15200, roas: 3.87 },
  { date: 'Σήμερα', revenue: 65200, spend: 15800, roas: 4.13 }
];

const PLATFORM_PIE_DATA = [
  { name: 'Meta Ads', value: 42, revenue: 103450, color: '#1877F2' },
  { name: 'Google Ads', value: 28, revenue: 68820, color: '#4285F4' },
  { name: 'TikTok Ads', value: 18, revenue: 44250, color: '#000000' },
  { name: 'LinkedIn Ads', value: 12, revenue: 29330, color: '#0A66C2' }
];

const HOURLY_PERFORMANCE_DATA = [
  { hour: '00:00', impressions: 2100, clicks: 45, conversions: 3 },
  { hour: '04:00', impressions: 1200, clicks: 28, conversions: 2 },
  { hour: '08:00', impressions: 8500, clicks: 180, conversions: 12 },
  { hour: '12:00', impressions: 12400, clicks: 280, conversions: 18 },
  { hour: '16:00', impressions: 15600, clicks: 340, conversions: 25 },
  { hour: '20:00', impressions: 18200, clicks: 420, conversions: 32 },
  { hour: '23:59', impressions: 9800, clicks: 210, conversions: 15 }
];

const ATTRIBUTION_FUNNEL_DATA = [
  { stage: 'Awareness', meta: 85, google: 78, tiktok: 45, linkedin: 32 },
  { stage: 'Interest', meta: 72, google: 65, tiktok: 38, linkedin: 28 },
  { stage: 'Consideration', meta: 58, google: 52, tiktok: 28, linkedin: 22 },
  { stage: 'Purchase', meta: 42, google: 38, tiktok: 18, linkedin: 15 }
];

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function Dashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { t } = useTranslation();
  const { user, isAuthenticated, organization } = useSaaS();

  // Debug authentication status
  useEffect(() => {
    console.log('🔍 Dashboard Authentication Status:', {
      isAuthenticated,
      user: user?.firstName + ' ' + user?.lastName,
      userEmail: user?.email,
      userRole: user?.role,
      userPermissions: user?.permissions,
      organization: organization?.name
    });
  }, [isAuthenticated, user, organization]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center animate-pulse shadow-2xl shadow-purple-500/50">
              <Sparkles className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ads Pro Platform
            </h3>
            <p className="text-gray-300">Φόρτωση προηγμένων analytics...</p>
            <div className="w-64 mx-auto">
              <Progress value={85} className="h-2 bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-950 dark:via-blue-950/20 dark:to-indigo-950/10">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 space-y-10">
        {/* Hero Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-full border border-white/20 shadow-xl">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              Live Analytics - {currentTime.toLocaleTimeString('el-GR')}
            </span>
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
          </div>
          
          <div className="space-y-4">
            {user && (
              <div className="mb-4">
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                  Welcome back, {user.firstName}! 👋
                </h2>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-gray-600 dark:text-gray-400">
                    {organization?.name || 'Personal Workspace'} • {user.role} Access
                  </p>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    ✅ Full Access Enabled
                  </Badge>
                </div>
              </div>
            )}
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent leading-tight">
              Ads Pro
              <span className="block text-4xl md:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Κέντρο ελέγχου επαγγελματικών καμπανιών με AI-powered analytics και real-time optimization
            </p>
          </div>

          {/* Live Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {LIVE_METRICS.map((metric, index) => (
              <div key={index} className="group bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/60 dark:hover:bg-gray-900/60 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</div>
                <div className={`text-sm font-medium ${metric.color} flex items-center gap-1`}>
                  <TrendingUp className="w-3 h-3" />
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Data Fetch Status */}
          <div className="max-w-2xl mx-auto">
            <DataFetchStatus 
              compact={true} 
              showControls={true}
              onSettingsClick={() => navigate('/settings')}
            />
          </div>
        </div>

        {/* Enhanced KPI Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 cursor-pointer">
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              <CardContent className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className={`relative p-4 bg-gradient-to-br ${kpi.color} rounded-2xl shadow-xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
                    <div className="text-white">
                      {kpi.icon}
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} rounded-2xl blur-lg opacity-50 group-hover:blur-xl transition-all duration-500`}></div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                      kpi.trend === 'up' 
                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0' 
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0'
                    }`}>
                      {kpi.trend === 'up' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                      +{Math.abs(kpi.change)}%
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{kpi.title}</p>
                  <p className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    {kpi.value}
                  </p>
                  <div className="h-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${kpi.color} rounded-full w-0 group-hover:w-full transition-all duration-1000 delay-200`}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Insights Section */}
        <Card className="border-0 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    AI Insights
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    Προτάσεις βελτιστοποίησης με Machine Learning
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold">
                AI Powered
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {AI_INSIGHTS.map((insight, index) => (
                <div key={index} className={`group p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  insight.impact === 'high' 
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20 hover:border-emerald-300 dark:hover:border-emerald-700'
                    : 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 hover:border-blue-300 dark:hover:border-blue-700'
                }`}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl ${
                      insight.impact === 'high' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{insight.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{insight.description}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className={`w-full ${
                      insight.impact === 'high'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                    } text-white border-0 shadow-lg`}
                  >
                    {insight.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Trend Chart - Beautiful Line & Area Chart */}
        <Card className="border-0 bg-gradient-to-br from-white/80 via-blue-50/80 to-purple-50/80 dark:from-gray-900/80 dark:via-blue-950/80 dark:to-purple-950/80 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-2xl shadow-xl">
                  <LineChart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Revenue Trend & ROAS Evolution
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-400">
                    Εξέλιξη εσόδων και απόδοσης επενδύσεων τελευταίους 3 μήνες
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white px-4 py-2 text-sm font-semibold">
                +187% Revenue Growth
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={REVENUE_TREND_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6b7280" 
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="#6b7280" 
                    fontSize={12}
                    fontWeight={500}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                      backdropFilter: 'blur(16px)'
                    }}
                    labelStyle={{ color: '#374151', fontWeight: '600' }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    name="Revenue (€)"
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    fill="url(#spendGradient)"
                    name="Ad Spend (€)"
                  />
                  <Line
                    type="monotone"
                    dataKey="roas"
                    stroke="#8b5cf6"
                    strokeWidth={4}
                    strokeDasharray="5 5"
                    name="ROAS"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Platform Performance Pie Chart */}
          <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                Platform Revenue Distribution
              </CardTitle>
              <CardDescription className="text-base">
                Κατανομή εσόδων ανά διαφημιστική πλατφόρμα
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <defs>
                      {PLATFORM_PIE_DATA.map((entry, index) => (
                        <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={0.8}/>
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie
                      data={PLATFORM_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {PLATFORM_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                      formatter={(value, name) => [
                        `${value}% (€${PLATFORM_PIE_DATA.find(p => p.name === name)?.revenue.toLocaleString()})`,
                        name
                      ]}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '14px', fontWeight: '500' }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Performance Bar Chart */}
          <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                24h Performance Pattern
              </CardTitle>
              <CardDescription className="text-base">
                Απόδοση καμπανιών ανά ώρα της ημέρας
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={HOURLY_PERFORMANCE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="impressionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      </linearGradient>
                      <linearGradient id="conversionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#6b7280" 
                      fontSize={12}
                      fontWeight={500}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="impressions" 
                      fill="url(#impressionsGradient)"
                      name="Impressions"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="conversions" 
                      fill="url(#conversionsGradient)"
                      name="Conversions"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Attribution Funnel Chart */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-purple-50/80 via-blue-50/80 to-cyan-50/80 dark:from-purple-950/80 dark:via-blue-950/80 dark:to-cyan-950/80 backdrop-blur-xl rounded-3xl shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl shadow-lg">
                  <Network className="w-6 h-6 text-white" />
                </div>
                Multi-Touch Attribution Funnel
              </CardTitle>
              <CardDescription className="text-base">
                Customer journey analysis με AI-powered attribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart 
                    data={ATTRIBUTION_FUNNEL_DATA} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="horizontal"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis 
                      type="category" 
                      dataKey="stage" 
                      stroke="#6b7280" 
                      fontSize={12}
                      fontWeight={500}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="meta" stackId="a" fill="#1877F2" name="Meta Ads" />
                    <Bar dataKey="google" stackId="a" fill="#4285F4" name="Google Ads" />
                    <Bar dataKey="tiktok" stackId="a" fill="#000000" name="TikTok Ads" />
                    <Bar dataKey="linkedin" stackId="a" fill="#0A66C2" name="LinkedIn Ads" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-500/10">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                Live Activity Feed
              </CardTitle>
              <CardDescription className="text-base">
                Real-time events και system updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {RECENT_ACTIVITY.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 hover:scale-105">
                  <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2 animate-pulse" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Advanced Features Section */}
        <Card className="border-0 bg-gradient-to-br from-slate-50/90 via-blue-50/90 to-purple-50/90 dark:from-slate-950/90 dark:via-blue-950/90 dark:to-purple-950/90 backdrop-blur-xl rounded-3xl shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-full border border-white/20">
                <Rocket className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Enterprise Features
                </span>
              </div>
              
              <div>
                <CardTitle className="text-4xl font-black bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-white dark:via-blue-200 dark:to-white bg-clip-text text-transparent mb-4">
                  Advanced Analytics Suite
                </CardTitle>
                <CardDescription className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Προηγμένα εργαλεία ανάλυσης με AI και Machine Learning για μέγιστη απόδοση
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {ADVANCED_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  onClick={() => navigate(feature.route)}
                  className="group relative overflow-hidden cursor-pointer bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl hover:bg-white/80 dark:hover:bg-gray-900/80 rounded-3xl border border-white/20 transition-all duration-500 hover:scale-110 hover:shadow-2xl"
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                  
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>
                  
                  <div className="relative p-8 space-y-6">
                    {/* Icon with badge */}
                    <div className="flex items-start justify-between">
                      <div className={`relative p-4 bg-gradient-to-br ${feature.color} rounded-2xl shadow-xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500`}>
                        <div className="text-white">
                          {feature.icon}
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-lg opacity-50 group-hover:blur-xl transition-all duration-500`}></div>
                      </div>
                      
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 text-xs font-bold border-0 shadow-lg">
                        {feature.badge}
                      </Badge>
                    </div>
                    
                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Action button */}
                    <div className="pt-4">
                      <Button 
                        size="sm"
                        className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg text-white border-0 transition-all duration-300 group-hover:scale-105`}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Εξερευνήστε
                      </Button>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>Ετοιμότητα</span>
                        <span>95%</span>
                      </div>
                      <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${feature.color} rounded-full w-0 group-hover:w-full transition-all duration-1000 delay-300`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="mt-12 text-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-full border border-white/20">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
                    Έτοιμοι για την επόμενη εποχή των διαφημίσεων;
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Button 
                    onClick={() => navigate('/campaigns')}
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-700 hover:via-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
                  >
                    <Rocket className="w-5 h-5 mr-3" />
                    Ξεκινήστε Νέα Καμπάνια
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/multi-touch-attribution')}
                    variant="outline"
                    className="border-2 border-purple-300 hover:border-purple-400 bg-white/60 hover:bg-white/80 dark:bg-gray-900/60 dark:hover:bg-gray-900/80 backdrop-blur-xl px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-110"
                  >
                    <Brain className="w-5 h-5 mr-3" />
                    Εξερευνήστε AI Attribution
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 