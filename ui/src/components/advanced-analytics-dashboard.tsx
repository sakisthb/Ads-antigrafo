import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Calendar as CalendarIcon,
  Download,
  Activity,
  X,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info,
  Users,
  Palette,
  Share2,
  Bell,
  Search,
  FileText,
  Check,
  Circle,
} from "lucide-react";
import { 
  BarChart as ReBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  LineChart as ReLineChart, 
  Line, 
  CartesianGrid, 
  Legend, 
  Pie, 
  PieChart as RePieChart,
  Area,
  AreaChart as ReAreaChart,
  Tooltip,
  Cell,
} from 'recharts';
import { format, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import { el } from "date-fns/locale";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedAnalyticsProps {}

// AI Insights Types
interface AIInsight {
  id: string;
  type: 'positive' | 'warning' | 'recommendation' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
  metric?: string;
  value?: number;
  change?: number;
  category: 'performance' | 'audience' | 'budget' | 'creative' | 'attribution' | 'seasonality' | 'efficiency' | 'alert';
  icon?: string;
  isRead?: boolean;
  createdAt?: Date;
}

interface AIRecommendation {
  id: string;
  category: 'budget' | 'targeting' | 'creative' | 'timing' | 'audience';
  title: string;
  description: string;
  expectedImpact: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'high' | 'medium' | 'low';
}

export function AdvancedAnalyticsDashboard({}: AdvancedAnalyticsProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [filters, setFilters] = useState({
    campaign: 'all',
    device: 'all',
    ageGroup: 'all',
    region: 'all',
  });
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [insightFilter, setInsightFilter] = useState<string>('all');
  const [insightSearch, setInsightSearch] = useState<string>('');
  const [insightPriorityFilter, setInsightPriorityFilter] = useState<string>('all');
  const [insightDateFilter, setInsightDateFilter] = useState<string>('all');
  const [insightSortBy, setInsightSortBy] = useState<string>('impact');

  // Mock data for advanced analytics
  const mockData = {
    performanceTrend: [
      { date: '2024-06-01', impressions: 12000, clicks: 320, conversions: 18, spend: 450, revenue: 1800, roas: 4.0 },
      { date: '2024-06-02', impressions: 13500, clicks: 380, conversions: 22, spend: 520, revenue: 2200, roas: 4.2 },
      { date: '2024-06-03', impressions: 11000, clicks: 290, conversions: 16, spend: 410, revenue: 1600, roas: 3.9 },
      { date: '2024-06-04', impressions: 14200, clicks: 420, conversions: 25, spend: 580, revenue: 2500, roas: 4.3 },
      { date: '2024-06-05', impressions: 12800, clicks: 350, conversions: 20, spend: 490, revenue: 2000, roas: 4.1 },
      { date: '2024-06-06', impressions: 15600, clicks: 480, conversions: 28, spend: 650, revenue: 2800, roas: 4.3 },
      { date: '2024-06-07', impressions: 13900, clicks: 390, conversions: 23, spend: 540, revenue: 2300, roas: 4.3 },
    ],
    audienceDemographics: [
      { age: '18-24', percentage: 15, spend: 1200, roas: 3.2, conversionRate: 2.8 },
      { age: '25-34', percentage: 35, spend: 2800, roas: 4.1, conversionRate: 4.2 },
      { age: '35-44', percentage: 25, spend: 2000, roas: 3.8, conversionRate: 3.5 },
      { age: '45-54', percentage: 15, spend: 1200, roas: 3.5, conversionRate: 3.1 },
      { age: '55+', percentage: 10, spend: 800, roas: 2.9, conversionRate: 2.5 },
    ],
    deviceBreakdown: [
      { device: 'Mobile', percentage: 65, spend: 5200, roas: 3.8, conversionRate: 3.2 },
      { device: 'Desktop', percentage: 30, spend: 2400, roas: 4.2, conversionRate: 4.8 },
      { device: 'Tablet', percentage: 5, spend: 400, roas: 3.5, conversionRate: 3.1 },
    ],
    campaignPerformance: [
      { campaign: 'Brand Awareness', spend: 2500, impressions: 45000, clicks: 900, conversions: 45, roas: 3.6 },
      { campaign: 'Traffic', spend: 3200, impressions: 38000, clicks: 1900, conversions: 95, roas: 2.9 },
      { campaign: 'Conversions', spend: 4800, impressions: 25000, clicks: 2500, conversions: 250, roas: 4.2 },
      { campaign: 'Sales', spend: 4920, impressions: 17000, clicks: 1700, conversions: 340, roas: 4.8 },
    ],
    hourlyPerformance: [
      { hour: '00:00', impressions: 800, clicks: 20, conversions: 1, spend: 30 },
      { hour: '06:00', impressions: 1200, clicks: 35, conversions: 2, spend: 45 },
      { hour: '12:00', impressions: 2800, clicks: 85, conversions: 5, spend: 120 },
      { hour: '18:00', impressions: 3200, clicks: 95, conversions: 6, spend: 140 },
      { hour: '24:00', impressions: 1000, clicks: 25, conversions: 1, spend: 35 },
    ],
    geographicData: [
      { region: 'Αττική', percentage: 45, spend: 3600, roas: 4.1, conversionRate: 3.8 },
      { region: 'Θεσσαλονίκη', percentage: 25, spend: 2000, roas: 3.9, conversionRate: 3.5 },
      { region: 'Πάτρα', percentage: 15, spend: 1200, roas: 3.7, conversionRate: 3.2 },
      { region: 'Ηράκλειο', percentage: 10, spend: 800, roas: 3.5, conversionRate: 3.0 },
      { region: 'Άλλες', percentage: 5, spend: 400, roas: 3.2, conversionRate: 2.8 },
    ],
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const clearFilters = () => {
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
    setFilters({
      campaign: 'all',
      device: 'all',
      ageGroup: 'all',
      region: 'all',
    });
  };

  // Helper για date range
  function isInRange(dateStr: string) {
    if (!dateRange?.from || !dateRange?.to) return true;
    const d = new Date(dateStr);
    return d >= dateRange.from && d <= dateRange.to;
  }

  // Φιλτράρισμα performanceTrend
  const filteredPerformanceTrend = mockData.performanceTrend.filter(row => isInRange(row.date));

  // Φιλτράρισμα campaignPerformance
  const filteredCampaignPerformance = mockData.campaignPerformance.filter(row =>
    (filters.campaign === 'all' || row.campaign.toLowerCase().replace(/ /g, '-') === filters.campaign)
  );

  // Φιλτράρισμα deviceBreakdown
  const filteredDeviceBreakdown = mockData.deviceBreakdown.filter(row =>
    (filters.device === 'all' || row.device.toLowerCase() === filters.device)
  );

  // Φιλτράρισμα audienceDemographics
  const filteredAudienceDemographics = mockData.audienceDemographics.filter(row =>
    (filters.ageGroup === 'all' || row.age === filters.ageGroup)
  );

  // Φιλτράρισμα geographicData
  const filteredGeographicData = mockData.geographicData.filter(row =>
    (filters.region === 'all' || row.region.toLowerCase() === filters.region)
  );

  // KPIs από τα φιλτραρισμένα δεδομένα
  const kpiROAS = filteredPerformanceTrend.length
    ? (filteredPerformanceTrend.reduce((sum, r) => sum + r.roas, 0) / filteredPerformanceTrend.length).toFixed(2)
    : '0.00';
  const kpiConversion = filteredPerformanceTrend.length
    ? (filteredPerformanceTrend.reduce((sum, r) => sum + (r.conversions / r.clicks) * 100, 0) / filteredPerformanceTrend.length).toFixed(2)
    : '0.00';
  const kpiCPA = filteredPerformanceTrend.length
    ? (filteredPerformanceTrend.reduce((sum, r) => sum + (r.spend / (r.conversions || 1)), 0) / filteredPerformanceTrend.length).toFixed(2)
    : '0.00';
  const kpiQuality = '8.5/10'; // Demo

  // Demo: handle export
  const handleExport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Τα δεδομένα εξήχθησαν επιτυχώς!');
    }, 1200);
  };

  // Export insights to CSV
  const exportInsightsToCSV = () => {
    const csvContent = [
      ['Title', 'Description', 'Category', 'Impact', 'Confidence', 'Metric', 'Value', 'Change', 'Read'],
      ...filteredInsights.map(insight => [
        insight.title,
        insight.description,
        insight.category,
        insight.impact,
        insight.confidence,
        insight.metric || '',
        insight.value || '',
        insight.change || '',
        insight.isRead ? 'Yes' : 'No'
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `ai-insights-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Τα insights εξήχθησαν επιτυχώς!');
  };

  // Export insights to PDF (mock)
  const exportInsightsToPDF = () => {
    toast.success('PDF export θα είναι διαθέσιμο σύντομα!');
  };

  // Mark insight as read/unread
  const toggleInsightRead = (insightId: string) => {
    setAiInsights(prev => prev.map(insight => 
      insight.id === insightId 
        ? { ...insight, isRead: !insight.isRead }
        : insight
    ));
  };

  // Mark all insights as read
  const markAllAsRead = () => {
    setAiInsights(prev => prev.map(insight => ({ ...insight, isRead: true })));
    toast.success('Όλα τα insights σημειώθηκαν ως διαβασμένα!');
  };

  // Filter insights based on search, category, priority, and date
  const filteredInsights = aiInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(insightSearch.toLowerCase()) ||
                         insight.description.toLowerCase().includes(insightSearch.toLowerCase());
    const matchesCategory = insightFilter === 'all' || insight.category === insightFilter;
    const matchesPriority = insightPriorityFilter === 'all' || insight.impact === insightPriorityFilter;
    const matchesDate = insightDateFilter === 'all' || 
                       (insight.createdAt && 
                        insight.createdAt > new Date(Date.now() - getDateFilterDays(insightDateFilter) * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesCategory && matchesPriority && matchesDate;
  });

  // Get days for date filter
  const getDateFilterDays = (filter: string) => {
    switch (filter) {
      case 'today': return 1;
      case 'week': return 7;
      case 'month': return 30;
      case 'quarter': return 90;
      default: return 0;
    }
  };

  // Sort insights
  const sortedInsights = [...filteredInsights].sort((a, b) => {
    switch (insightSortBy) {
      case 'impact':
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      case 'confidence':
        return b.confidence - a.confidence;
      case 'date':
        return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });

  // Group insights by category
  const groupedInsights = sortedInsights.reduce((groups, insight) => {
    const category = insight.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(insight);
    return groups;
  }, {} as Record<string, AIInsight[]>);

  // Generate AI Insights based on filtered data
  const generateInsights = (): AIInsight[] => {
    const insights: AIInsight[] = [];

    if (filteredPerformanceTrend.length > 0) {
      // Trend: ROAS
      const roasValues = filteredPerformanceTrend.map(r => r.roas);
      const roasChange = roasValues[roasValues.length - 1] - roasValues[0];
      if (roasChange > 0.2) {
        insights.push({
          id: '1',
          type: 'positive',
          title: 'Αύξηση ROAS',
          description: `Το ROAS αυξήθηκε κατά ${roasChange.toFixed(2)} μονάδες σε αυτή την περίοδο.`,
          impact: 'high',
          confidence: 85,
          metric: 'ROAS',
          value: roasValues[roasValues.length - 1],
          change: roasChange,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      } else if (roasChange < -0.2) {
        insights.push({
          id: '2',
          type: 'warning',
          title: 'Πτώση ROAS',
          description: `Το ROAS μειώθηκε κατά ${Math.abs(roasChange).toFixed(2)} μονάδες. Ελέγξτε τις καμπάνιες σας.`,
          impact: 'high',
          confidence: 78,
          metric: 'ROAS',
          value: roasValues[roasValues.length - 1],
          change: roasChange,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Trend: Conversions
      const convValues = filteredPerformanceTrend.map(r => r.conversions);
      const convChange = convValues[convValues.length - 1] - convValues[0];
      if (convChange > 0) {
        insights.push({
          id: '3',
          type: 'positive',
          title: 'Αύξηση Μετατροπών',
          description: `Οι μετατροπές αυξήθηκαν κατά ${convChange} σε αυτή την περίοδο.`,
          impact: 'high',
          confidence: 82,
          metric: 'Conversions',
          value: convValues[convValues.length - 1],
          change: convChange,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      } else if (convChange < 0) {
        insights.push({
          id: '4',
          type: 'warning',
          title: 'Μείωση Μετατροπών',
          description: `Οι μετατροπές μειώθηκαν κατά ${Math.abs(convChange)}. Ελέγξτε τα funnels.`,
          impact: 'high',
          confidence: 75,
          metric: 'Conversions',
          value: convValues[convValues.length - 1],
          change: convChange,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Anomaly: Spend spike
      const spendValues = filteredPerformanceTrend.map(r => r.spend);
      const maxSpend = Math.max(...spendValues);
      const avgSpend = spendValues.reduce((a, b) => a + b, 0) / spendValues.length;
      if (maxSpend > avgSpend * 1.5) {
        insights.push({
          id: '5',
          type: 'warning',
          title: 'Απότομη Αύξηση Δαπάνης',
          description: `Εντοπίστηκε ημέρα με δαπάνη +50% πάνω από το μέσο όρο.`,
          impact: 'high',
          confidence: 75,
          metric: 'Spend',
          value: maxSpend,
          change: maxSpend - avgSpend,
          category: 'budget',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Anomaly: Conversion drop (mock)
      if (convChange < -5) {
        insights.push({
          id: '6',
          type: 'warning',
          title: 'Απότομη Πτώση Μετατροπών',
          description: 'Εντοπίστηκε σημαντική μείωση μετατροπών σε σύντομο χρονικό διάστημα.',
          impact: 'high',
          confidence: 80,
          metric: 'Conversions',
          value: convValues[convValues.length - 1],
          change: convChange,
          category: 'alert',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Comparison with previous period (mock)
      const prevRoas = roasValues[0];
      if (roasValues[roasValues.length - 1] > prevRoas * 1.1) {
        insights.push({
          id: '7',
          type: 'positive',
          title: 'Σημαντική Βελτίωση ROAS',
          description: `Το ROAS αυξήθηκε κατά πάνω από 10% σε σχέση με την αρχή της περιόδου.`,
          impact: 'medium',
          confidence: 70,
          metric: 'ROAS',
          value: roasValues[roasValues.length - 1],
          change: roasValues[roasValues.length - 1] - prevRoas,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Underperforming campaign (mock)
      const underperformingCampaign = mockData.campaignPerformance.find(c => c.roas < 3.0);
      if (underperformingCampaign) {
        insights.push({
          id: '8',
          type: 'warning',
          title: 'Καμπάνια με Χαμηλό ROAS',
          description: `Η καμπάνια "${underperformingCampaign.campaign}" έχει ROAS ${underperformingCampaign.roas.toFixed(2)}x, κάτω από το αποδεκτό όριο.`,
          impact: 'medium',
          confidence: 80,
          metric: 'ROAS',
          value: underperformingCampaign.roas,
          category: 'performance',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Underperforming device (mock)
      const underDevice = mockData.deviceBreakdown.find(d => d.roas < 3.5);
      if (underDevice) {
        insights.push({
          id: '9',
          type: 'warning',
          title: 'Συσκευή με Χαμηλό ROAS',
          description: `Η συσκευή "${underDevice.device}" έχει ROAS ${underDevice.roas.toFixed(2)}x. Εξετάστε βελτιστοποίηση για αυτή τη συσκευή.`,
          impact: 'medium',
          confidence: 75,
          metric: 'ROAS',
          value: underDevice.roas,
          category: 'audience',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // CTR/CPM/Frequency alerts (mock)
      const avgCTR = 1.2; // mock
      if (avgCTR < 1.0) {
        insights.push({
          id: '10',
          type: 'warning',
          title: 'Χαμηλό CTR',
          description: 'Το Click-Through Rate είναι κάτω από το 1%. Εξετάστε νέα creatives ή call-to-action.',
          impact: 'medium',
          confidence: 70,
          metric: 'CTR',
          value: avgCTR,
          category: 'creative',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
      const avgCPM = 7.5; // mock
      if (avgCPM > 10) {
        insights.push({
          id: '11',
          type: 'warning',
          title: 'Υψηλό CPM',
          description: 'Το κόστος ανά 1000 εμφανίσεις (CPM) είναι υψηλό. Ελέγξτε το targeting και τα placements.',
          impact: 'medium',
          confidence: 70,
          metric: 'CPM',
          value: avgCPM,
          category: 'efficiency',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }
      const avgFrequency = 3.8; // mock
      if (avgFrequency > 4.0) {
        insights.push({
          id: '12',
          type: 'warning',
          title: 'Υψηλή Συχνότητα Εμφανίσεων',
          description: 'Η συχνότητα εμφανίσεων είναι υψηλή. Υπάρχει κίνδυνος ad fatigue.',
          impact: 'medium',
          confidence: 65,
          metric: 'Frequency',
          value: avgFrequency,
          category: 'creative',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Ad fatigue detection (mock)
      if (avgCTR < 1.0 && avgFrequency > 4.0) {
        insights.push({
          id: '13',
          type: 'recommendation',
          title: 'Πιθανό Ad Fatigue',
          description: 'Σημαντική μείωση CTR με υψηλή συχνότητα. Εξετάστε rotation creatives ή νέα διαφημιστικά.',
          impact: 'medium',
          confidence: 80,
          metric: 'CTR',
          value: avgCTR,
          category: 'creative',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // A/B testing suggestion (mock)
      if (roasChange < 0.1 && convChange < 2) {
        insights.push({
          id: '14',
          type: 'recommendation',
          title: 'Προτείνεται A/B Testing',
          description: 'Η απόδοση παραμένει στάσιμη. Δοκιμάστε νέα creatives, audiences ή landing pages με A/B test.',
          impact: 'low',
          confidence: 60,
          metric: 'ROAS',
          value: roasValues[roasValues.length - 1],
          category: 'creative',
          isRead: false,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
      }

      // Lifetime Value (LTV) Analysis (mock)
      insights.push({
        id: '15',
        type: 'positive',
        title: 'Υψηλό Lifetime Value (LTV)',
        description: 'Οι πελάτες που αποκτήθηκαν μέσω της καμπάνιας "Sales" έχουν μέσο LTV €320.',
        impact: 'high',
        confidence: 90,
        metric: 'LTV',
        value: 320,
        category: 'audience',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Churn Prediction (mock)
      insights.push({
        id: '16',
        type: 'warning',
        title: 'Αύξηση Churn Rate',
        description: 'Το ποσοστό churn αυξήθηκε κατά 8% τον τελευταίο μήνα.',
        impact: 'medium',
        confidence: 75,
        metric: 'Churn Rate',
        value: 0.18,
        category: 'audience',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Attribution Analysis (mock)
      insights.push({
        id: '17',
        type: 'positive',
        title: 'Αποδοτικό Funnel BOFU',
        description: 'Το 60% των μετατροπών προήλθε από το funnel BOFU.',
        impact: 'high',
        confidence: 85,
        metric: 'BOFU Conversions',
        value: 60,
        category: 'attribution',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Seasonality/Trend Detection (mock)
      insights.push({
        id: '18',
        type: 'trend',
        title: 'Εποχικότητα στις Κυριακές',
        description: 'Τις Κυριακές παρατηρείται αύξηση 30% στις μετατροπές.',
        impact: 'medium',
        confidence: 80,
        metric: 'Sunday Conversions',
        value: 30,
        category: 'seasonality',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Budget Pacing Alerts (mock)
      insights.push({
        id: '19',
        type: 'warning',
        title: 'Budget Πλησιάζει Εξάντληση',
        description: 'Το 80% του budget έχει δαπανηθεί στο 60% του μήνα.',
        impact: 'high',
        confidence: 85,
        metric: 'Budget Used',
        value: 80,
        category: 'budget',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Creative Fatigue Detection (mock)
      insights.push({
        id: '20',
        type: 'warning',
        title: 'Creative Fatigue',
        description: 'Το creative "Summer Sale" έχει μείωση CTR κατά 40% σε 7 ημέρες.',
        impact: 'medium',
        confidence: 80,
        metric: 'CTR',
        value: 0.8,
        category: 'creative',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Audience Overlap (mock)
      insights.push({
        id: '21',
        type: 'warning',
        title: 'Υψηλή Επικάλυψη Κοινού',
        description: 'Υψηλή επικάλυψη κοινού μεταξύ των καμπανιών "Brand Awareness" και "Traffic".',
        impact: 'medium',
        confidence: 70,
        metric: 'Audience Overlap',
        value: 0.65,
        category: 'audience',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Lookalike/Similarity Analysis (mock)
      insights.push({
        id: '22',
        type: 'positive',
        title: 'Lookalike Audience Success',
        description: 'Το κοινό "Lookalike 1%" έχει παρόμοια συμπεριφορά με το top segment.',
        impact: 'medium',
        confidence: 80,
        metric: 'Lookalike',
        value: 1,
        category: 'audience',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Spend Efficiency (mock)
      insights.push({
        id: '23',
        type: 'trend',
        title: 'Αποδοτικότητα Spend στο MOFU',
        description: 'Το 70% του spend στο MOFU φέρνει το 40% των μετατροπών.',
        impact: 'medium',
        confidence: 75,
        metric: 'MOFU Efficiency',
        value: 0.4,
        category: 'efficiency',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });

      // Alert για απότομες αλλαγές σε metrics (mock)
      insights.push({
        id: '24',
        type: 'warning',
        title: 'Απότομη Αύξηση CPA',
        description: 'Το CPA αυξήθηκε κατά 50% σε 2 ημέρες.',
        impact: 'high',
        confidence: 85,
        metric: 'CPA',
        value: 75,
        category: 'alert',
        isRead: false,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    if (insights.length === 0) {
      insights.push({
        id: '6',
        type: 'trend',
        title: 'Κανονική Απόδοση',
        description: 'Δεν εντοπίστηκαν αξιοσημείωτες μεταβολές ή ανωμαλίες για τα επιλεγμένα φίλτρα.',
        impact: 'low',
        confidence: 100,
        category: 'performance',
        isRead: true,
        createdAt: new Date()
      });
    }

    return insights;
  };

  // AI Insights Generation - Only run when component mounts and data changes
  useEffect(() => {
    if (filteredPerformanceTrend.length > 0) {
      const insights = generateInsights();
      setAiInsights(insights);
      
      // Generate recommendations as well
      const recommendations: AIRecommendation[] = [];
      const avgRoas = filteredPerformanceTrend.reduce((sum, r) => sum + r.roas, 0) / filteredPerformanceTrend.length;
      const avgConvRate = filteredPerformanceTrend.reduce((sum, r) => sum + (r.conversions / r.clicks) * 100, 0) / filteredPerformanceTrend.length;
      const avgCpa = filteredPerformanceTrend.reduce((sum, r) => sum + (r.spend / (r.conversions || 1)), 0) / filteredPerformanceTrend.length;

      // ROAS-based recommendations
      if (avgRoas < 3.0) {
        recommendations.push({
          id: 'rec1',
          category: 'targeting',
          title: 'Optimize Audience Targeting',
          description: `Your current ROAS of ${avgRoas.toFixed(2)}x is below optimal levels. Focus on refining audience targeting and improving ad relevance.`,
          expectedImpact: '20-35% ROAS improvement',
          difficulty: 'medium',
          priority: 'high'
        });
      }

      // Add other recommendations here...
      setAiRecommendations(recommendations);
    }
  }, [filteredPerformanceTrend.length, dateRange]); // Use stable dependencies


  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'recommendation': return <Target className="h-4 w-4 text-blue-500" />;
      case 'trend': return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'recommendation': return 'border-blue-200 bg-blue-50';
      case 'trend': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'audience': return <Users className="h-4 w-4 text-green-500" />;
      case 'budget': return <DollarSign className="h-4 w-4 text-yellow-500" />;
      case 'creative': return <Palette className="h-4 w-4 text-purple-500" />;
      case 'attribution': return <Share2 className="h-4 w-4 text-indigo-500" />;
      case 'seasonality': return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'efficiency': return <Zap className="h-4 w-4 text-red-500" />;
      case 'alert': return <Bell className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getInsightCategoryColor = (category: string) => {
    switch (category) {
      case 'performance': return 'bg-blue-100 text-blue-800';
      case 'audience': return 'bg-green-100 text-green-800';
      case 'budget': return 'bg-yellow-100 text-yellow-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'attribution': return 'bg-indigo-100 text-indigo-800';
      case 'seasonality': return 'bg-orange-100 text-orange-800';
      case 'efficiency': return 'bg-red-100 text-red-800';
      case 'alert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightCategoryName = (category: string) => {
    switch (category) {
      case 'performance': return 'Performance';
      case 'audience': return 'Audience';
      case 'budget': return 'Budget';
      case 'creative': return 'Creative';
      case 'attribution': return 'Attribution';
      case 'seasonality': return 'Seasonality';
      case 'efficiency': return 'Efficiency';
      case 'alert': return 'Alert';
      default: return 'Other';
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-center" richColors />
        {/* Header with Date Picker and Filters */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Προηγμένα Analytics</h2>
            <p className="text-muted-foreground">
              Βαθιά ανάλυση με προηγμένα charts και insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearFilters} title="Καθαρισμός όλων των φίλτρων">
              <X className="w-4 h-4 mr-2" />
              Καθαρισμός Φίλτρων
            </Button>
            <Button onClick={handleExport} disabled={loading} title="Εξαγωγή δεδομένων σε CSV">
              <Download className="w-4 h-4 mr-2" />
              Εξαγωγή
            </Button>
          </div>
        </div>

      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Περίοδος:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      dateRange?.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y", { locale: el })} -{" "}
                          {format(dateRange.to, "LLL dd, y", { locale: el })}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y", { locale: el })
                      )
                    ) : (
                      <span>Επιλέξτε ημερομηνία</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    locale={el}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Campaign Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Καμπάνια:</span>
              <Select value={filters.campaign} onValueChange={(value) => setFilters({...filters, campaign: value})}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι Καμπάνιες</SelectItem>
                  <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                  <SelectItem value="traffic">Traffic</SelectItem>
                  <SelectItem value="conversions">Conversions</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Device Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Συσκευή:</span>
              <Select value={filters.device} onValueChange={(value) => setFilters({...filters, device: value})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι Συσκευές</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Age Group Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Ηλικία:</span>
              <Select value={filters.ageGroup} onValueChange={(value) => setFilters({...filters, ageGroup: value})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι Ηλικίες</SelectItem>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55+">55+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Περιοχή:</span>
              <Select value={filters.region} onValueChange={(value) => setFilters({...filters, region: value})}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Όλες οι Περιοχές</SelectItem>
                  <SelectItem value="αττική">Αττική</SelectItem>
                  <SelectItem value="θεσσαλονίκη">Θεσσαλονίκη</SelectItem>
                  <SelectItem value="πάτρα">Πάτρα</SelectItem>
                  <SelectItem value="ηράκλειο">Ηράκλειο</SelectItem>
                  <SelectItem value="άλλες">Άλλες</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loader Demo */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Tabs Navigation */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">Επισκόπηση</TabsTrigger>
              <TabsTrigger value="performance">Απόδοση</TabsTrigger>
              <TabsTrigger value="audience">Κοινό</TabsTrigger>
              <TabsTrigger value="campaigns">Καμπάνιες</TabsTrigger>
              <TabsTrigger value="geographic">Γεωγραφικά</TabsTrigger>
              <TabsTrigger value="timing">Χρονικά</TabsTrigger>
              <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Συνολικό ROAS</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpiROAS}x</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+18.5%</span> από την προηγούμενη περίοδο
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Μέση Μετατροπή</CardTitle>
                    <Target className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpiConversion}%</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.3%</span> από την προηγούμενη περίοδο
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Κόστος ανά Μετατροπή</CardTitle>
                    <DollarSign className="h-4 w-4 text-orange-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">€{kpiCPA}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-red-600">-8.2%</span> από την προηγούμενη περίοδο
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ποιότητα Score</CardTitle>
                    <Activity className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpiQuality}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+0.8</span> από την προηγούμενη περίοδο
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Trend Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Τάση Απόδοσης</CardTitle>
                  <CardDescription>Ημερήσια μετρικά απόδοσης</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReAreaChart data={filteredPerformanceTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Έσοδα" />
                      <Area type="monotone" dataKey="spend" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Δαπάνη" />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>ROAS ανά Καμπάνια</CardTitle>
                    <CardDescription>Απόδοση διαφημιστικής δαπάνης ανά καμπάνια</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ReBarChart data={filteredCampaignPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="campaign" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="roas" fill="#8884d8" name="ROAS" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Μετατροπές ανά Όρα</CardTitle>
                    <CardDescription>Μετατροπές ανά ώρα της ημέρας</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ReLineChart data={mockData.hourlyPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="conversions" stroke="#8884d8" name="Μετατροπές" />
                        <Line type="monotone" dataKey="clicks" stroke="#82ca9d" name="Κλικ" />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Δημογραφικά</CardTitle>
                    <CardDescription>Κατανομή κοινού ανά ηλικία</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RePieChart>
                        <Pie
                          data={filteredAudienceDemographics}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ age, percentage }) => `${age} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="percentage"
                        >
                          {filteredAudienceDemographics.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Συσκευές</CardTitle>
                    <CardDescription>Κατανομή ανά συσκευή</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <ReBarChart data={filteredDeviceBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="device" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="percentage" fill="#82ca9d" name="Ποσοστό %" />
                        <Bar dataKey="roas" fill="#8884d8" name="ROAS" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Απόδοση Καμπανιών</CardTitle>
                  <CardDescription>Συγκριτική ανάλυση καμπανιών</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredCampaignPerformance.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <div>
                            <h4 className="font-semibold">{campaign.campaign}</h4>
                            <p className="text-sm text-muted-foreground">
                              {campaign.impressions.toLocaleString()} εμφανίσεις • {campaign.clicks.toLocaleString()} κλικ
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-sm font-medium">€{campaign.spend.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Δαπάνη</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{campaign.conversions}</p>
                            <p className="text-xs text-muted-foreground">Μετατροπές</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{campaign.roas.toFixed(1)}x</p>
                            <p className="text-xs text-muted-foreground">ROAS</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Geographic Tab */}
            <TabsContent value="geographic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Γεωγραφική Κατανομή</CardTitle>
                  <CardDescription>Απόδοση ανά περιοχή</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReBarChart data={filteredGeographicData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="percentage" fill="#8884d8" name="Ποσοστό %" />
                      <Bar dataKey="roas" fill="#82ca9d" name="ROAS" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Timing Tab */}
            <TabsContent value="timing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Χρονική Ανάλυση</CardTitle>
                  <CardDescription>Απόδοση ανά ώρα της ημέρας</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ReAreaChart data={mockData.hourlyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="impressions" stackId="1" stroke="#8884d8" fill="#8884d8" name="Εμφανίσεις" />
                      <Area type="monotone" dataKey="clicks" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Κλικ" />
                      <Area type="monotone" dataKey="conversions" stackId="1" stroke="#ffc658" fill="#ffc658" name="Μετατροπές" />
                    </ReAreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Insights Tab */}
            <TabsContent value="ai-insights" className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col gap-4">
                {/* Top row: Search and Export */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Αναζήτηση insights..."
                        value={insightSearch}
                        onChange={(e) => setInsightSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportInsightsToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" onClick={exportInsightsToPDF}>
                      <FileText className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button variant="outline" onClick={markAllAsRead}>
                      <Check className="w-4 h-4 mr-2" />
                      Mark All Read
                    </Button>
                  </div>
                </div>

                {/* Bottom row: Filters */}
                <div className="flex flex-wrap gap-4">
                  <Select value={insightFilter} onValueChange={setInsightFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Κατηγορία" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Όλες οι Κατηγορίες</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="audience">Audience</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="attribution">Attribution</SelectItem>
                      <SelectItem value="seasonality">Seasonality</SelectItem>
                      <SelectItem value="efficiency">Efficiency</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={insightPriorityFilter} onValueChange={setInsightPriorityFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Προτεραιότητα" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Όλες</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={insightDateFilter} onValueChange={setInsightDateFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Ημερομηνία" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Όλες</SelectItem>
                      <SelectItem value="today">Σήμερα</SelectItem>
                      <SelectItem value="week">Τελευταία εβδομάδα</SelectItem>
                      <SelectItem value="month">Τελευταίος μήνας</SelectItem>
                      <SelectItem value="quarter">Τελευταίο τρίμηνο</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={insightSortBy} onValueChange={setInsightSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Ταξινόμηση" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impact">Προτεραιότητα</SelectItem>
                      <SelectItem value="confidence">Confidence</SelectItem>
                      <SelectItem value="date">Ημερομηνία</SelectItem>
                      <SelectItem value="category">Κατηγορία</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Insights Summary */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Σύνολο: {filteredInsights.length} insights</span>
                  <span className="text-sm text-gray-600">
                    Διαβασμένα: {filteredInsights.filter(i => i.isRead).length}
                  </span>
                  <span className="text-sm text-gray-600">
                    Μη διαβασμένα: {filteredInsights.filter(i => !i.isRead).length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-100 text-red-800">
                    High: {filteredInsights.filter(i => i.impact === 'high').length}
                  </Badge>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Medium: {filteredInsights.filter(i => i.impact === 'medium').length}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800">
                    Low: {filteredInsights.filter(i => i.impact === 'low').length}
                  </Badge>
                </div>
              </div>

              {/* Insights by Category */}
              <div className="space-y-6">
                {Object.entries(groupedInsights).map(([category, categoryInsights]) => (
                  <div key={category} className="space-y-3">
                    <div className="flex items-center gap-2">
                      {getInsightCategoryIcon(category)}
                      <h3 className="text-lg font-semibold">{getInsightCategoryName(category)}</h3>
                      <Badge className={getInsightCategoryColor(category)}>
                        {categoryInsights.length}
                      </Badge>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categoryInsights.map((insight, i) => (
                        <Card key={i} className={`${getInsightColor(insight.type)} ${!insight.isRead ? 'ring-2 ring-blue-500' : ''}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getInsightIcon(insight.type)}
                                <CardTitle className="text-sm font-medium">
                                  {insight.title}
                                </CardTitle>
                                {!insight.isRead && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge 
                                  variant="secondary" 
                                  className={
                                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                  }
                                >
                                  {insight.impact}
                                </Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleInsightRead(insight.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  {insight.isRead ? (
                                    <Check className="h-3 w-3" />
                                  ) : (
                                    <Circle className="h-3 w-3" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 mb-3">
                              {insight.description}
                            </p>
                            {insight.metric && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{insight.metric}:</span>
                                  <span className="font-bold">
                                    {insight.value?.toFixed(2)}
                                    {insight.change && (
                                      <span className={`ml-1 ${insight.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ({insight.change > 0 ? '+' : ''}{insight.change.toFixed(2)})
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>Confidence:</span>
                                  <span>{insight.confidence}%</span>
                                </div>
                                <Progress value={insight.confidence} className="h-2" />
                              </div>
                            )}
                            {insight.createdAt && (
                              <div className="text-xs text-gray-500 mt-2">
                                {insight.createdAt.toLocaleDateString('el-GR')}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4">
                {aiRecommendations.map((rec) => (
                  <Card key={rec.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(rec.difficulty)}>
                            {rec.difficulty}
                          </Badge>
                          <Badge className={getPriorityColor(rec.priority)}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {rec.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">Expected Impact:</span>
                          <span className="text-sm text-gray-600">{rec.expectedImpact}</span>
                        </div>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 