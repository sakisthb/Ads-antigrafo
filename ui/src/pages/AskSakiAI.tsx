import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  BarChart3, 
  Target,
  Mic,
  MicOff,
  Download,
  RefreshCw,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  Volume2,
  VolumeX,
  Search,
  FileText,
  Mail,
  Users,
  Building2,
  Linkedin,
  DollarSign,
  Eye,
  HelpCircle,
  X,
  Star,
  Heart,
  Crown,
  Rocket,
  Globe,
  Shield,
  Award,
  Coffee,
  Palette,
  Music,
  Camera,
  Video,
  Smartphone,
  Monitor,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Keyboard,
  Mouse,
  Wifi,
  Bluetooth,
  Battery,
  Signal,
  WifiOff,
  BluetoothOff,
  BatteryCharging,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Facebook,
  Instagram,
  Image as ImageIcon,
  ShoppingCart,
  Play,
  Twitter,
  Map as MapIcon,
  Activity,
  Edit3,
  Link,
  Calendar,
  Clock,
  BookOpen,
  AlertTriangle,
  Handshake
} from "lucide-react";
import { toast } from "sonner";
import { sakiAIService, SakiAIQuery } from "@/lib/saki-ai-service";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'suggestion' | 'insight';
  metadata?: {
    confidence?: number;
    category?: string;
    actionItems?: string[];
  };
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  prompt: string;
  category: 'optimization' | 'analysis' | 'help' | 'insights';
}

const quickActions: QuickAction[] = [
  {
    id: 'enterprise-strategy',
    title: '🏢 Enterprise SaaS Strategy',
    description: 'Ολοκληρωμένη στρατηγική για enterprise SaaS',
    icon: <Target className="w-5 h-5" />,
    prompt: 'Μπορείς να μου στησεις μια στρατηγική σύμφωνα με τις καμπάνιες μου;',
    category: 'optimization'
  },
  {
    id: 'b2b-targeting',
    title: '👥 B2B Audience Targeting',
    description: 'Στόχευση B2B audience και decision makers',
    icon: <Users className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να φτάσω στους decision makers;',
    category: 'insights'
  },
  {
    id: 'lead-generation',
    title: '📈 Lead Generation',
    description: 'Στρατηγική lead generation για SaaS',
    icon: <TrendingUp className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αυξήσω τα qualified leads μου;',
    category: 'optimization'
  },
  {
    id: 'account-based-marketing',
    title: '🏢 Account-Based Marketing',
    description: 'ABM strategy για enterprise accounts',
    icon: <Building2 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να implement account-based marketing;',
    category: 'insights'
  },
  {
    id: 'conversion-optimization',
    title: '🎯 Conversion Optimization',
    description: 'Βελτιστοποίηση conversion rates',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα conversion rates μου;',
    category: 'optimization'
  },
  {
    id: 'content-strategy',
    title: '📝 Content Strategy',
    description: 'Thought leadership και educational content',
    icon: <FileText className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να δημιουργήσω thought leadership content;',
    category: 'insights'
  },
  {
    id: 'linkedin-ads',
    title: '💼 LinkedIn Ads',
    description: 'Στρατηγική LinkedIn advertising',
    icon: <Linkedin className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα LinkedIn ads μου;',
    category: 'optimization'
  },
  {
    id: 'google-ads-b2b',
    title: '🔍 Google Ads B2B',
    description: 'Google Ads για B2B και SaaS',
    icon: <Search className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Google Ads μου για B2B;',
    category: 'optimization'
  },
  {
    id: 'retargeting-strategy',
    title: '🔄 Retargeting Strategy',
    description: 'Retargeting για website visitors',
    icon: <RefreshCw className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το retargeting μου;',
    category: 'optimization'
  },
  {
    id: 'email-nurturing',
    title: '📧 Email Nurturing',
    description: 'Email nurturing για leads',
    icon: <Mail className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το email nurturing μου;',
    category: 'optimization'
  },
  {
    id: 'roi-analysis',
    title: '💰 ROI Analysis',
    description: 'Ανάλυση ROI και LTV',
    icon: <DollarSign className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να μετρήσω το ROI και LTV μου;',
    category: 'analysis'
  },
  {
    id: 'competitive-analysis',
    title: '👁️ Competitive Analysis',
    description: 'Ανάλυση ανταγωνιστών',
    icon: <Eye className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω τους ανταγωνιστές μου;',
    category: 'insights'
  },
  // META (Facebook/Instagram) Actions
  {
    id: 'facebook-ads-strategy',
    title: '📘 Facebook Ads Strategy',
    description: 'Στρατηγική Facebook advertising',
    icon: <Facebook className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Facebook ads μου;',
    category: 'optimization'
  },
  {
    id: 'instagram-ads',
    title: '📷 Instagram Ads',
    description: 'Instagram advertising για B2B',
    icon: <Instagram className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να χρησιμοποιήσω Instagram για B2B marketing;',
    category: 'optimization'
  },
  {
    id: 'meta-audience-targeting',
    title: '🎯 Meta Audience Targeting',
    description: 'Στόχευση audience στο Meta',
    icon: <Target className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το audience targeting μου στο Meta;',
    category: 'optimization'
  },
  {
    id: 'meta-remarketing',
    title: '🔄 Meta Remarketing',
    description: 'Remarketing στρατηγική Meta',
    icon: <RefreshCw className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το remarketing μου στο Meta;',
    category: 'optimization'
  },
  // TikTok Actions
  {
    id: 'tiktok-ads-strategy',
    title: '🎵 TikTok Ads Strategy',
    description: 'TikTok advertising για B2B',
    icon: <Music className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να χρησιμοποιήσω TikTok για B2B marketing;',
    category: 'optimization'
  },
  {
    id: 'tiktok-content-strategy',
    title: '📱 TikTok Content Strategy',
    description: 'Content strategy για TikTok',
    icon: <Video className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να δημιουργήσω engaging content για TikTok;',
    category: 'insights'
  },
  // Google Actions
  {
    id: 'google-search-ads',
    title: '🔍 Google Search Ads',
    description: 'Google Search advertising',
    icon: <Search className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Google Search ads μου;',
    category: 'optimization'
  },
  {
    id: 'google-display-ads',
    title: '🖼️ Google Display Ads',
    description: 'Google Display Network',
    icon: <ImageIcon className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Google Display ads μου;',
    category: 'optimization'
  },
  {
    id: 'google-shopping-ads',
    title: '🛒 Google Shopping Ads',
    description: 'Google Shopping campaigns',
    icon: <ShoppingCart className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Google Shopping ads μου;',
    category: 'optimization'
  },
  {
    id: 'google-video-ads',
    title: '📺 Google Video Ads',
    description: 'YouTube advertising',
    icon: <Play className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα YouTube ads μου;',
    category: 'optimization'
  },
  // LinkedIn Actions
  {
    id: 'linkedin-content-strategy',
    title: '💼 LinkedIn Content Strategy',
    description: 'Content strategy για LinkedIn',
    icon: <FileText className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να δημιουργήσω engaging content για LinkedIn;',
    category: 'insights'
  },
  {
    id: 'linkedin-lead-gen',
    title: '📈 LinkedIn Lead Gen',
    description: 'LinkedIn Lead Generation',
    icon: <TrendingUp className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αυξήσω τα leads μου από LinkedIn;',
    category: 'optimization'
  },
  // Twitter/X Actions
  {
    id: 'twitter-ads-strategy',
    title: '🐦 Twitter/X Ads Strategy',
    description: 'Twitter/X advertising',
    icon: <Twitter className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω τα Twitter/X ads μου;',
    category: 'optimization'
  },
  {
    id: 'twitter-content-strategy',
    title: '📝 Twitter/X Content',
    description: 'Content strategy για Twitter/X',
    icon: <MessageSquare className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να δημιουργήσω engaging content για Twitter/X;',
    category: 'insights'
  },
  // Advanced Analytics
  {
    id: 'attribution-modeling',
    title: '📊 Attribution Modeling',
    description: 'Multi-touch attribution',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να υλοποιήσω multi-touch attribution;',
    category: 'analysis'
  },
  {
    id: 'customer-journey-mapping',
    title: '🗺️ Customer Journey Mapping',
    description: 'Mapping customer journey',
    icon: <MapIcon className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να δημιουργήσω customer journey maps;',
    category: 'insights'
  },
  {
    id: 'predictive-analytics',
    title: '🔮 Predictive Analytics',
    description: 'Predictive modeling',
    icon: <Zap className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να χρησιμοποιήσω predictive analytics;',
    category: 'analysis'
  },
  // Budget & Performance
  {
    id: 'budget-optimization',
    title: '💰 Budget Optimization',
    description: 'Budget allocation strategy',
    icon: <DollarSign className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιστοποιήσω το budget μου;',
    category: 'optimization'
  },
  {
    id: 'performance-monitoring',
    title: '📊 Performance Monitoring',
    description: 'Real-time performance tracking',
    icon: <Activity className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να παρακολουθώ την απόδοση μου σε real-time;',
    category: 'analysis'
  },
  // Creative & Design
  {
    id: 'creative-strategy',
    title: '🎨 Creative Strategy',
    description: 'Creative development strategy',
    icon: <Palette className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το creative strategy μου;',
    category: 'insights'
  },
  {
    id: 'ad-copy-optimization',
    title: '✍️ Ad Copy Optimization',
    description: 'Ad copy testing & optimization',
    icon: <Edit3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να βελτιώσω το ad copy μου;',
    category: 'optimization'
  },
  // Automation & Tools
  {
    id: 'marketing-automation',
    title: '🤖 Marketing Automation',
    description: 'Marketing automation strategy',
    icon: <Settings className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αυτοματοποιήσω το marketing μου;',
    category: 'optimization'
  },
  {
    id: 'crm-integration',
    title: '🔗 CRM Integration',
    description: 'CRM & marketing integration',
    icon: <Link className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να ενσωματώσω το CRM μου με το marketing;',
    category: 'optimization'
  },
  // Advanced Analysis Actions
  {
    id: 'funnel-analysis',
    title: '🔄 Funnel Analysis',
    description: 'Ανάλυση marketing funnel',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω το marketing funnel μου;',
    category: 'analysis'
  },
  {
    id: 'customer-segmentation',
    title: '👥 Customer Segmentation',
    description: 'Ανάλυση και segmentation πελατών',
    icon: <Users className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να κάνω customer segmentation;',
    category: 'analysis'
  },
  {
    id: 'behavioral-analysis',
    title: '🧠 Behavioral Analysis',
    description: 'Ανάλυση συμπεριφοράς χρηστών',
    icon: <Brain className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω τη συμπεριφορά των χρηστών μου;',
    category: 'analysis'
  },
  {
    id: 'trend-analysis',
    title: '📈 Trend Analysis',
    description: 'Ανάλυση trends και patterns',
    icon: <TrendingUp className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω τα trends στο marketing μου;',
    category: 'analysis'
  },
  {
    id: 'performance-benchmarking',
    title: '📊 Performance Benchmarking',
    description: 'Σύγκριση με industry benchmarks',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να κάνω performance benchmarking;',
    category: 'analysis'
  },
  {
    id: 'a-b-testing-analysis',
    title: '🧪 A/B Testing Analysis',
    description: 'Ανάλυση A/B testing results',
    icon: <Activity className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω τα A/B testing results μου;',
    category: 'analysis'
  },
  {
    id: 'seasonal-analysis',
    title: '📅 Seasonal Analysis',
    description: 'Ανάλυση seasonal patterns',
    icon: <Calendar className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω τα seasonal patterns μου;',
    category: 'analysis'
  },
  {
    id: 'geographic-analysis',
    title: '🌍 Geographic Analysis',
    description: 'Ανάλυση γεωγραφικής απόδοσης',
    icon: <Globe className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω την γεωγραφική απόδοση μου;',
    category: 'analysis'
  },
  {
    id: 'device-analysis',
    title: '📱 Device Analysis',
    description: 'Ανάλυση απόδοσης ανά device',
    icon: <Smartphone className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω την απόδοση ανά device;',
    category: 'analysis'
  },
  {
    id: 'time-analysis',
    title: '⏰ Time-based Analysis',
    description: 'Ανάλυση απόδοσης ανά ώρα/ημέρα',
    icon: <Clock className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω την απόδοση ανά ώρα/ημέρα;',
    category: 'analysis'
  },
  {
    id: 'audience-overlap',
    title: '🎯 Audience Overlap Analysis',
    description: 'Ανάλυση overlap μεταξύ audiences',
    icon: <Target className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω το audience overlap μου;',
    category: 'analysis'
  },
  {
    id: 'creative-performance',
    title: '🎨 Creative Performance Analysis',
    description: 'Ανάλυση απόδοσης creatives',
    icon: <Palette className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω την απόδοση των creatives μου;',
    category: 'analysis'
  },
  {
    id: 'budget-efficiency',
    title: '💰 Budget Efficiency Analysis',
    description: 'Ανάλυση αποδοτικότητας budget',
    icon: <DollarSign className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να αναλύσω την αποδοτικότητα του budget μου;',
    category: 'analysis'
  },
  {
    id: 'cross-platform-analysis',
    title: '🔄 Cross-Platform Analysis',
    description: 'Ανάλυση απόδοσης ανά platform',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Πώς μπορώ να συγκρίνω την απόδοση ανά platform;',
    category: 'analysis'
  },
  // Help & Support Actions
  {
    id: 'campaign-setup-help',
    title: '🚀 Campaign Setup Help',
    description: 'Βοήθεια στη δημιουργία campaigns',
    icon: <HelpCircle className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στη δημιουργία campaigns;',
    category: 'help'
  },
  {
    id: 'technical-support',
    title: '🔧 Technical Support',
    description: 'Τεχνική υποστήριξη για tools',
    icon: <Settings className="w-5 h-5" />,
    prompt: 'Χρειάζομαι τεχνική υποστήριξη;',
    category: 'help'
  },
  {
    id: 'best-practices-guide',
    title: '📚 Best Practices Guide',
    description: 'Οδηγός best practices',
    icon: <BookOpen className="w-5 h-5" />,
    prompt: 'Ποια είναι τα best practices για digital marketing;',
    category: 'help'
  },
  {
    id: 'troubleshooting',
    title: '🔍 Troubleshooting',
    description: 'Επίλυση προβλημάτων',
    icon: <Search className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στην επίλυση προβλημάτων;',
    category: 'help'
  },
  {
    id: 'strategy-consultation',
    title: '💡 Strategy Consultation',
    description: 'Συμβουλές στρατηγικής',
    icon: <Lightbulb className="w-5 h-5" />,
    prompt: 'Χρειάζομαι συμβουλές για τη στρατηγική μου;',
    category: 'help'
  },
  {
    id: 'platform-specific-help',
    title: '📱 Platform-Specific Help',
    description: 'Βοήθεια για συγκεκριμένα platforms',
    icon: <Smartphone className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια για συγκεκριμένο platform;',
    category: 'help'
  },
  {
    id: 'audience-research-help',
    title: '🔬 Audience Research Help',
    description: 'Βοήθεια στην έρευνα audience',
    icon: <Users className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στην έρευνα audience;',
    category: 'help'
  },
  {
    id: 'creative-guidance',
    title: '🎨 Creative Guidance',
    description: 'Οδηγίες για creative development',
    icon: <Palette className="w-5 h-5" />,
    prompt: 'Χρειάζομαι οδηγίες για creative development;',
    category: 'help'
  },
  {
    id: 'budget-planning-help',
    title: '💰 Budget Planning Help',
    description: 'Βοήθεια στον προγραμματισμό budget',
    icon: <DollarSign className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στον προγραμματισμό budget;',
    category: 'help'
  },
  {
    id: 'measurement-setup',
    title: '📊 Measurement Setup Help',
    description: 'Βοήθεια στη ρύθμιση measurement',
    icon: <BarChart3 className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στη ρύθμιση measurement;',
    category: 'help'
  },
  {
    id: 'compliance-help',
    title: '⚖️ Compliance Help',
    description: 'Βοήθεια με compliance και regulations',
    icon: <Shield className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια με compliance και regulations;',
    category: 'help'
  },
  {
    id: 'scaling-strategy-help',
    title: '📈 Scaling Strategy Help',
    description: 'Βοήθεια στην scaling strategy',
    icon: <TrendingUp className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στην scaling strategy;',
    category: 'help'
  },
  {
    id: 'crisis-management',
    title: '🚨 Crisis Management',
    description: 'Διαχείριση κρίσεων και προβλημάτων',
    icon: <AlertTriangle className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στη διαχείριση κρίσεων;',
    category: 'help'
  },
  {
    id: 'team-training',
    title: '👥 Team Training',
    description: 'Εκπαίδευση ομάδας marketing',
    icon: <Users className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στην εκπαίδευση της ομάδας;',
    category: 'help'
  },
  {
    id: 'vendor-selection',
    title: '🤝 Vendor Selection',
    description: 'Βοήθεια στην επιλογή vendors',
    icon: <Handshake className="w-5 h-5" />,
    prompt: 'Χρειάζομαι βοήθεια στην επιλογή vendors;',
    category: 'help'
  }
];

// Sample questions that customers can ask
const sampleQuestionsData = [
  {
    category: '🏢 Enterprise Strategy',
    questions: [
      'Μπορείς να μου στησεις μια στρατηγική σύμφωνα με τις καμπάνιες μου;',
      'Πώς μπορώ να φτάσω στους decision makers;',
      'Πώς μπορώ να αυξήσω τα qualified leads μου;',
      'Πώς μπορώ να implement account-based marketing;',
      'Πώς μπορώ να βελτιώσω τα conversion rates μου;'
    ]
  },
  {
    category: '📘 META (Facebook/Instagram)',
    questions: [
      'Πώς μπορώ να βελτιώσω τα Facebook ads μου;',
      'Πώς μπορώ να χρησιμοποιήσω Instagram για B2B marketing;',
      'Πώς μπορώ να βελτιώσω το audience targeting μου στο Meta;',
      'Πώς μπορώ να βελτιώσω το remarketing μου στο Meta;',
      'Ποια είναι τα best practices για Meta advertising;'
    ]
  },
  {
    category: '🎵 TikTok Marketing',
    questions: [
      'Πώς μπορώ να χρησιμοποιήσω TikTok για B2B marketing;',
      'Πώς μπορώ να δημιουργήσω engaging content για TikTok;',
      'Ποια είναι τα best practices για TikTok advertising;',
      'Πώς μπορώ να βελτιώσω το TikTok strategy μου;',
      'Πώς μπορώ να μετρήσω την απόδοση στο TikTok;'
    ]
  },
  {
    category: '🔍 Google Advertising',
    questions: [
      'Πώς μπορώ να βελτιώσω τα Google Search ads μου;',
      'Πώς μπορώ να βελτιώσω τα Google Display ads μου;',
      'Πώς μπορώ να βελτιώσω τα Google Shopping ads μου;',
      'Πώς μπορώ να βελτιώσω τα YouTube ads μου;',
      'Πώς μπορώ να βελτιώσω το Google Ads strategy μου;'
    ]
  },
  {
    category: '💼 LinkedIn Marketing',
    questions: [
      'Πώς μπορώ να βελτιώσω τα LinkedIn ads μου;',
      'Πώς μπορώ να δημιουργήσω engaging content για LinkedIn;',
      'Πώς μπορώ να αυξήσω τα leads μου από LinkedIn;',
      'Πώς μπορώ να βελτιώσω το LinkedIn strategy μου;',
      'Ποια είναι τα best practices για LinkedIn B2B;'
    ]
  },
  {
    category: '🐦 Twitter/X Marketing',
    questions: [
      'Πώς μπορώ να βελτιώσω τα Twitter/X ads μου;',
      'Πώς μπορώ να δημιουργήσω engaging content για Twitter/X;',
      'Πώς μπορώ να βελτιώσω το Twitter/X strategy μου;',
      'Ποια είναι τα best practices για Twitter/X B2B;',
      'Πώς μπορώ να μετρήσω την απόδοση στο Twitter/X;'
    ]
  },
  {
    category: '📊 Analytics & Performance',
    questions: [
      'Πώς μπορώ να μετρήσω το ROI και LTV μου;',
      'Πώς μπορώ να αναλύσω την απόδοση των campaigns μου;',
      'Πώς μπορώ να υλοποιήσω multi-touch attribution;',
      'Πώς μπορώ να δημιουργήσω customer journey maps;',
      'Πώς μπορώ να χρησιμοποιήσω predictive analytics;'
    ]
  },
  {
    category: '💰 Budget & Optimization',
    questions: [
      'Πώς μπορώ να βελτιστοποιήσω το budget μου;',
      'Πώς μπορώ να παρακολουθώ την απόδοση μου σε real-time;',
      'Πώς μπορώ να βελτιώσω το ad copy μου;',
      'Πώς μπορώ να αυτοματοποιήσω το marketing μου;',
      'Πώς μπορώ να ενσωματώσω το CRM μου με το marketing;'
    ]
  },
  {
    category: '🎨 Creative & Content',
    questions: [
      'Πώς μπορώ να βελτιώσω το creative strategy μου;',
      'Πώς μπορώ να δημιουργήσω thought leadership content;',
      'Πώς μπορώ να βελτιώσω το content marketing μου;',
      'Ποια είναι τα best practices για B2B content;',
      'Πώς μπορώ να δημιουργήσω engaging video content;'
    ]
  },
  {
    category: '🎯 Advanced Targeting',
    questions: [
      'Πώς μπορώ να βελτιώσω το audience targeting μου;',
      'Πώς μπορώ να αναλύσω τους ανταγωνιστές μου;',
      'Πώς μπορώ να βελτιώσω το retargeting μου;',
      'Πώς μπορώ να βελτιώσω το email nurturing μου;',
      'Πώς μπορώ να υλοποιήσω account-based marketing;'
    ]
  },
  {
    category: '📊 Advanced Analytics',
    questions: [
      'Πώς μπορώ να αναλύσω το marketing funnel μου;',
      'Πώς μπορώ να κάνω customer segmentation;',
      'Πώς μπορώ να αναλύσω τη συμπεριφορά των χρηστών μου;',
      'Πώς μπορώ να αναλύσω τα trends στο marketing μου;',
      'Πώς μπορώ να κάνω performance benchmarking;'
    ]
  },
  {
    category: '🔍 Deep Analysis',
    questions: [
      'Πώς μπορώ να αναλύσω τα A/B testing results μου;',
      'Πώς μπορώ να αναλύσω τα seasonal patterns μου;',
      'Πώς μπορώ να αναλύσω την γεωγραφική απόδοση μου;',
      'Πώς μπορώ να αναλύσω την απόδοση ανά device;',
      'Πώς μπορώ να αναλύσω την απόδοση ανά ώρα/ημέρα;'
    ]
  },
  {
    category: '🎨 Creative & Performance',
    questions: [
      'Πώς μπορώ να αναλύσω το audience overlap μου;',
      'Πώς μπορώ να αναλύσω την απόδοση των creatives μου;',
      'Πώς μπορώ να αναλύσω την αποδοτικότητα του budget μου;',
      'Πώς μπορώ να συγκρίνω την απόδοση ανά platform;',
      'Πώς μπορώ να βελτιώσω το creative strategy μου;'
    ]
  },
  {
    category: '🚀 Help & Support',
    questions: [
      'Χρειάζομαι βοήθεια στη δημιουργία campaigns;',
      'Χρειάζομαι τεχνική υποστήριξη;',
      'Ποια είναι τα best practices για digital marketing;',
      'Χρειάζομαι βοήθεια στην επίλυση προβλημάτων;',
      'Χρειάζομαι συμβουλές για τη στρατηγική μου;'
    ]
  },
  {
    category: '📚 Learning & Guidance',
    questions: [
      'Χρειάζομαι βοήθεια για συγκεκριμένο platform;',
      'Χρειάζομαι βοήθεια στην έρευνα audience;',
      'Χρειάζομαι οδηγίες για creative development;',
      'Χρειάζομαι βοήθεια στον προγραμματισμό budget;',
      'Χρειάζομαι βοήθεια στη ρύθμιση measurement;'
    ]
  },
  {
    category: '⚖️ Compliance & Strategy',
    questions: [
      'Χρειάζομαι βοήθεια με compliance και regulations;',
      'Χρειάζομαι βοήθεια στην scaling strategy;',
      'Χρειάζομαι βοήθεια στη διαχείριση κρίσεων;',
      'Χρειάζομαι βοήθεια στην εκπαίδευση της ομάδας;',
      'Χρειάζομαι βοήθεια στην επιλογή vendors;'
    ]
  }
];

export function AskSakiAI() {
  // Memoize sample questions to prevent unnecessary re-renders and duplication issues
  const sampleQuestions = useMemo(() => {
    // Ensure unique questions by creating a new array with unique identifiers
    return sampleQuestionsData.map((category, categoryIndex) => ({
      ...category,
      id: `category-${categoryIndex}`,
      questions: category.questions.map((question, questionIndex) => ({
        text: question,
        id: `${categoryIndex}-${questionIndex}`
      }))
    }));
  }, []);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '🎉 **Γεια σου! Είμαι ο Saki, ο AI assistant σου για enterprise SaaS digital marketing!** ✨\n\n🚀 **Ειδικεύομαι σε:**\n• 🏢 Enterprise SaaS Strategy\n• 👥 B2B Audience Targeting\n• 📈 Lead Generation\n• 💼 Account-Based Marketing\n• 🔍 LinkedIn & Google Ads B2B\n• 📊 ROI Analysis & Performance\n\n💡 **Μπορείς να μου ρωτήσεις οτιδήποτε για digital marketing ή να χρησιμοποιήσεις τα quick actions!**\n\n🎯 **Τι θα ήθελες να μάθεις σήμερα;**',
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  // Enhanced state variables for modern effects
  const [showParticles, setShowParticles] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [messageAnimations, setMessageAnimations] = useState<Set<string>>(new Set());
  const [showQuestionsPopup, setShowQuestionsPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'optimization' | 'analysis' | 'help' | 'insights'>('all');
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Enhanced refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const particleAnimationRef = useRef<number | null>(null);
  
  // New enhanced state variables
  const [hoveredQuickAction, setHoveredQuickAction] = useState<string | null>(null);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Typing effect for AI responses
  const simulateTyping = useCallback((content: string, callback: () => void) => {
    setIsTyping(true);
    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        index++;
        // Update the last message with partial content
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages.length > 0) {
            newMessages[newMessages.length - 1] = {
              ...newMessages[newMessages.length - 1],
              content: content.substring(0, index)
            };
          }
          return newMessages;
        });
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        callback();
      }
    }, 20); // Typing speed
  }, []);

  // Add message animation
  const addMessageAnimation = useCallback((messageId: string) => {
    setMessageAnimations(prev => new Set(prev).add(messageId));
    setTimeout(() => {
      setMessageAnimations(prev => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Particle effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowParticles(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Use Saki AI Service
      const query: SakiAIQuery = {
        message: content.trim(),
        context: {
          userRole: 'user',
          currentPage: 'ask-saki-ai'
        },
        history: messages.map(msg => ({
          message: msg.sender === 'user' ? msg.content : '',
          response: msg.sender === 'ai' ? msg.content : '',
          timestamp: msg.timestamp
        })).filter(item => item.message || item.response)
      };

      const aiResponse = await sakiAIService.processQuery(query);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '', // Start with empty content for typing effect
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
        metadata: {
          confidence: aiResponse.confidence,
          category: aiResponse.category,
          actionItems: aiResponse.actionItems
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      addMessageAnimation(aiMessage.id);

      // Start typing effect
      simulateTyping(aiResponse.content, () => {
        // Typing completed
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error processing AI query:', error);
      toast.error('Σφάλμα κατά την επεξεργασία της ερώτησης');
      setIsLoading(false);
    }
  };



  const handleQuickAction = (action: QuickAction) => {
    setActiveQuickAction(action.id);
    setTimeout(() => {
      setActiveQuickAction(null);
      handleSendMessage(action.prompt);
    }, 300);
  };

  const handleVoiceToggle = () => {
    setIsVoiceMode(!isVoiceMode);
    toast.success(isVoiceMode ? 'Voice mode disabled' : 'Voice mode enabled');
  };

  const handleExportChat = () => {
    const chatData = messages.map(msg => ({
      timestamp: msg.timestamp.toLocaleString(),
      sender: msg.sender === 'user' ? 'You' : 'Saki AI',
      content: msg.content
    }));
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saki-ai-chat-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Chat exported successfully!');
  };

  const handleClearChat = () => {
    setMessages([messages[0]]); // Keep only the welcome message
    sakiAIService.clearHistory(); // Clear AI service history
    toast.success('Chat cleared!');
  };

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.2)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
          
          {/* Enhanced Floating Particles */}
          {showParticles && (
            <>
              {Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 4}s`
                  }}
                />
              ))}
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={`star-${i}`}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-60 animate-ping"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`
                  }}
                />
              ))}
              {/* New: Floating Icons */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`icon-${i}`}
                  className="absolute opacity-40 animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 4}s`,
                    animationDuration: `${6 + Math.random() * 4}s`
                  }}
                >
                  {[<Star className="w-4 h-4 text-yellow-400" />, <Heart className="w-4 h-4 text-red-400" />, <Crown className="w-4 h-4 text-yellow-500" />, <Rocket className="w-4 h-4 text-blue-400" />, <Globe className="w-4 h-4 text-green-400" />][i % 5]}
                </div>
              ))}
            </>
          )}
        </div>

      {/* Main Content Container */}
      <div className="container mx-auto p-4 max-w-7xl relative z-10">
        {/* Enhanced Header Section */}
        <div className="flex items-center justify-between mb-4 animate-fade-in-down">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="p-3 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 animate-pulse-glow group-hover:animate-bounce-in">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-4 border-white animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full border-2 border-white animate-ping" style={{ animationDelay: '1s' }}></div>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-pulse hover:animate-shimmer">
                Ρώτησε τον Saki - AI
              </h1>
              <p className="text-lg text-gray-200 font-medium animate-fade-in-up">
                Enterprise SaaS Digital Marketing Expert 🤖✨
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Crown className="w-2.5 h-2.5 text-yellow-500" />
                  <span>Premium AI</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-blue-500" />
                  <span>Enterprise Ready</span>
                </div>
              </div>
            </div>
          </div>
        
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuestionsPopup(true)}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600 text-gray-200 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-purple-900/50 hover:to-pink-900/50"
              title="Δες όλες τις ερωτήσεις που μπορείς να κάνεις"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Ερωτήσεις
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleVoiceToggle}
              className={`bg-slate-800/80 backdrop-blur-sm border-slate-600 text-gray-200 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                isVoiceMode 
                  ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400 shadow-lg' 
                  : 'hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50'
              }`}
            >
              {isVoiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {isVoiceMode ? 'Voice On' : 'Voice Off'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportChat}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600 text-gray-200 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-green-900/50 hover:to-blue-900/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="bg-slate-800/80 backdrop-blur-sm border-slate-600 text-gray-200 hover:bg-slate-700 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r hover:from-red-900/50 hover:to-orange-900/50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6 bg-slate-800/80 backdrop-blur-sm border-slate-600 shadow-2xl hover:shadow-3xl transition-all duration-500 max-h-[600px] overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-b border-slate-600">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-200">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {['all', 'optimization', 'analysis', 'help', 'insights'].map((category) => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedCategory === category 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                          : 'bg-slate-700/50 text-gray-200 border-slate-600 hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50'
                      }`}
                      onClick={() => setSelectedCategory(category as 'all' | 'optimization' | 'analysis' | 'help' | 'insights')}
                    >
                      {category === 'all' ? 'All' : 
                       category === 'optimization' ? 'Optimization' :
                       category === 'analysis' ? 'Analysis' :
                       category === 'help' ? 'Help' : 'Insights'}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-blue-400 to-purple-400" />

              {/* Quick Actions List */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-200">Actions</h4>
                <div className="space-y-2">
                  {filteredActions.map((action) => (
                    <Tooltip key={action.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start h-auto p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl rounded-xl group ${
                            activeQuickAction === action.id 
                              ? 'bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400 shadow-xl scale-105 animate-bounce-in' 
                              : 'bg-slate-700/50 border-slate-600 text-gray-200 hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50 hover:border-blue-400'
                          } ${
                            hoveredQuickAction === action.id ? 'animate-pulse-glow' : ''
                          }`}
                          onClick={() => handleQuickAction(action)}
                          onMouseEnter={() => setHoveredQuickAction(action.id)}
                          onMouseLeave={() => setHoveredQuickAction(null)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                              activeQuickAction === action.id 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 animate-rotate-in' 
                                : 'bg-slate-600 hover:bg-slate-500 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white'
                            }`}>
                              {action.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm text-gray-200 group-hover:text-blue-300 transition-colors duration-300">{action.title}</div>
                              <div className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors duration-300">{action.description}</div>
                            </div>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-600 text-gray-200">
                        <p className="text-sm font-medium">Κλικ για να ρωτήσεις: {action.prompt}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col bg-slate-800/80 backdrop-blur-sm border-slate-600 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="border-b border-slate-600 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
              <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-200">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                Chat με τον Saki AI
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full p-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
                <div className="space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 transition-all duration-500 ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      } ${
                        messageAnimations.has(message.id) 
                          ? 'animate-in slide-in-from-bottom-4 fade-in' 
                          : ''
                      } ${
                        message.sender === 'user' ? 'animate-slide-in-right' : 'animate-slide-in-left'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="h-10 w-10 group">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm group-hover:animate-bounce-in transition-all duration-300">
                            <Bot className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-lg group ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            : 'bg-gradient-to-r from-slate-700 to-slate-800 text-gray-200 shadow-md hover:shadow-lg hover:scale-105'
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                          {isTyping && message.sender === 'ai' && (
                            <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                          )}
                        </div>
                        
                        {/* Message Reactions */}
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200/20">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-slate-600 hover:text-blue-400 transition-all duration-200"
                              onClick={() => {
                                const reactions = messageReactions[message.id] || [];
                                setMessageReactions({
                                  ...messageReactions,
                                  [message.id]: reactions.includes('👍') 
                                    ? reactions.filter(r => r !== '👍')
                                    : [...reactions, '👍']
                                });
                              }}
                            >
                              👍
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-slate-600 hover:text-red-400 transition-all duration-200"
                              onClick={() => {
                                const reactions = messageReactions[message.id] || [];
                                setMessageReactions({
                                  ...messageReactions,
                                  [message.id]: reactions.includes('❤️') 
                                    ? reactions.filter(r => r !== '❤️')
                                    : [...reactions, '❤️']
                                });
                              }}
                            >
                              ❤️
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:bg-slate-600 hover:text-green-400 transition-all duration-200"
                              onClick={() => {
                                const reactions = messageReactions[message.id] || [];
                                setMessageReactions({
                                  ...messageReactions,
                                  [message.id]: reactions.includes('🚀') 
                                    ? reactions.filter(r => r !== '🚀')
                                    : [...reactions, '🚀']
                                });
                              }}
                            >
                              🚀
                            </Button>
                          </div>
                          {messageReactions[message.id] && messageReactions[message.id].length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              {messageReactions[message.id].map((reaction, i) => (
                                <span key={i} className="animate-bounce-in" style={{ animationDelay: `${i * 0.1}s` }}>
                                  {reaction}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {message.metadata?.actionItems && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs font-medium mb-2">💡 Suggested Actions:</div>
                            <ul className="text-xs space-y-1">
                              {message.metadata.actionItems.map((item, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className={`text-xs mt-2 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex gap-3 justify-start animate-in slide-in-from-bottom-4 fade-in">
                      <Avatar className="h-8 w-8 animate-pulse">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl px-4 py-3 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600 font-medium">Saki is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="p-4 border-t border-slate-600 bg-gradient-to-r from-slate-800/50 to-blue-900/50">
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="Ρώτησε τον Saki για enterprise SaaS digital marketing..."
                    className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 rounded-xl bg-slate-700/90 backdrop-blur-sm border-slate-600 text-gray-200 placeholder-gray-400 group-hover:shadow-lg group-hover:scale-105 pr-12"
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
                
                {isVoiceMode && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsListening(!isListening)}
                        className={`transition-all duration-300 hover:scale-105 hover:shadow-lg bg-slate-700/90 backdrop-blur-sm border-slate-600 text-gray-200 hover:bg-slate-600 hover:border-blue-400 ${
                          isListening 
                            ? 'bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-400 shadow-xl animate-pulse-glow' 
                            : 'hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isListening ? 'Απενεργοποίηση φωνής' : 'Ενεργοποίηση φωνής'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={isLoading || !inputValue.trim()}
                      className="transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 rounded-xl px-6 group"
                    >
                      <Send className="w-4 h-4 group-hover:animate-bounce-in" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Στείλε μήνυμα</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Questions Popup */}
      {showQuestionsPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200 p-4" onClick={() => setShowQuestionsPopup(false)}>
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-slate-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                    <HelpCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Ερωτήσεις που μπορείς να κάνεις
                    </h2>
                    <p className="text-gray-300">
                      Κλικ σε οποιαδήποτε ερώτηση για να την στείλεις στον Saki
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowQuestionsPopup(false)}
                  className="hover:bg-slate-700 text-gray-300 transition-all duration-300 hover:scale-105"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 auto-rows-min">
                {sampleQuestions.map((category) => (
                  <div key={category.id} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 border-b border-slate-600 pb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-3">
                      {category.questions.map((question) => (
                        <div
                          key={question.id}
                          onClick={() => {
                            handleSendMessage(question.text);
                            setShowQuestionsPopup(false);
                          }}
                          className="p-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl border border-slate-600 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-900/50 hover:to-purple-900/50 hover:border-blue-400 group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                                     <p className="text-sm text-gray-200 leading-relaxed group-hover:text-white transition-colors duration-300 break-words">
                         {question.text}
                       </p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                <span>Κλικ για να ρωτήσεις</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      💡 Συμβουλή
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Μπορείς επίσης να κάνεις ελεύθερες ερωτήσεις! Απλά πληκτρολόγησε ότι θέλεις και ο Saki θα σου απαντήσει στα ελληνικά με φιλικό τρόπο! 🚀
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </TooltipProvider>
  );
} 