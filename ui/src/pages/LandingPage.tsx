// Premium Landing Page - Ads Pro Platform
// Conversion-Optimized Design για Maximum Subscription Sales
// 15+ Years Experience - Enterprise UI/UX

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PublicNavigation } from '@/components/PublicNavigation';
import { 
  ArrowRight, 
  Check, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Zap, 
  Shield, 
  Sparkles,
  Play,
  Users,
  Globe,
  Award,
  Rocket,
  Eye,
  Brain,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowUpRight,
  LineChart,
  PieChart,
  Activity,
  Database,
  Layers,
  MousePointer,
  Heart,
  Crown,
  Infinity,
  Monitor,
  Smartphone,
  Tablet,
  ChevronDown,
  ChevronUp,
  Gauge,
  TrendingDown,
  Calendar,
  FileText,
  Settings,
  Lock,
  Cloud,
  Wifi,
  Search,
  Filter,
  MoreHorizontal,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Bell,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Chrome,
  Smartphone as Mobile,
  Tablet as TabletIcon,
  Laptop,
  Timer,
  Percent,
  Euro,
  BarChart4,
  PieChart as PieChartIcon,
  TrendingUp as TrendingUpIcon,
  AlertCircle,
  Info,
  HelpCircle,
  Plus,
  Minus,
  X,
  ExternalLink,
  Code,
  Puzzle,
  Briefcase,
  GraduationCap,
  Building,
  Store,
  ShoppingCart,
  CreditCard,
  Banknote,
  Coins,
  Calculator,
  ChartBar,
  BarChart2,
  TrendingDown as TrendingDownIcon
} from 'lucide-react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, prefix = "", suffix = "" }: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [activeDemo, setActiveDemo] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Real-time animated stats
  const heroStats = [
    { value: 280, label: "Million € Revenue Generated", icon: DollarSign, prefix: "€", suffix: "M+" },
    { value: 2500, label: "Campaigns Optimized", icon: Target, suffix: "+" },
    { value: 150, label: "Average ROAS Increase", icon: TrendingUp, suffix: "%" },
    { value: 350, label: "Growing Businesses", icon: Users, suffix: "+" }
  ];

  // Interactive demo data
  const demoTabs = [
    {
      title: "Real-Time Dashboard",
      icon: Monitor,
      description: "Live campaign performance tracking",
      preview: {
        title: "Campaign Performance Overview",
        stats: [
          { label: "Active Campaigns", value: "24", trend: "+12%" },
          { label: "Total Spend", value: "€45.2K", trend: "+8%" },
          { label: "Conversions", value: "1,247", trend: "+23%" },
          { label: "ROAS", value: "4.2x", trend: "+15%" }
        ]
      }
    },
    {
      title: "Attribution Analysis",
      icon: Brain,
      description: "Multi-touch attribution modeling",
      preview: {
        title: "Attribution Model Comparison",
        stats: [
          { label: "First Touch", value: "€12.3K", trend: "-5%" },
          { label: "Last Touch", value: "€18.7K", trend: "+3%" },
          { label: "Data-Driven", value: "€22.1K", trend: "+18%" },
          { label: "Time Decay", value: "€19.4K", trend: "+12%" }
        ]
      }
    },
    {
      title: "Audience Insights",
      icon: Users,
      description: "Advanced audience segmentation",
      preview: {
        title: "Top Converting Segments",
        stats: [
          { label: "Lookalike 1%", value: "€8.2K", trend: "+32%" },
          { label: "Retargeting", value: "€15.1K", trend: "+28%" },
          { label: "Interest-based", value: "€11.3K", trend: "+19%" },
          { label: "Custom Audience", value: "€9.7K", trend: "+25%" }
        ]
      }
    }
  ];

  // Platform integrations
  const integrations = [
    { name: "Facebook Ads", icon: Facebook, color: "bg-blue-600", status: "connected" },
    { name: "Google Ads", icon: Chrome, color: "bg-green-600", status: "connected" },
    { name: "TikTok Ads", icon: Mobile, color: "bg-black", status: "connected" },
    { name: "LinkedIn Ads", icon: Linkedin, color: "bg-blue-700", status: "connected" },
    { name: "Twitter Ads", icon: Twitter, color: "bg-sky-500", status: "connected" },
    { name: "YouTube Ads", icon: Youtube, color: "bg-red-600", status: "connected" },
    { name: "Snapchat Ads", icon: Eye, color: "bg-yellow-400", status: "connected" },
    { name: "Pinterest Ads", icon: Heart, color: "bg-red-500", status: "connected" }
  ];

  // FAQ data
  const faqs = [
    {
      question: "How quickly can I see results with ADPD?",
      answer: "Most clients see initial insights within 24 hours of connecting their ad accounts. Significant performance improvements typically occur within 7-14 days as our AI models learn your campaign patterns and begin optimizing attribution and budget allocation."
    },
    {
      question: "What platforms does ADPD integrate with?",
      answer: "ADPD integrates with 50+ advertising platforms including Facebook, Google, TikTok, LinkedIn, Twitter, YouTube, Snapchat, Pinterest, Amazon, Microsoft, and many more. We also support custom integrations for enterprise clients."
    },
    {
      question: "Is my data secure with ADPD?",
      answer: "Absolutely. We use bank-level encryption, SOC 2 compliance, and GDPR-compliant data handling. Your data is never shared with third parties and remains under your complete control. We also offer on-premise deployment for enterprise clients."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time with no penalties or hidden fees. Your data export capabilities remain active for 30 days after cancellation, and we provide full data migration support if needed."
    },
    {
      question: "Do you offer custom attribution models?",
      answer: "Yes, our Enterprise plan includes custom AI model training specific to your business. Our data science team works with you to develop attribution models that reflect your unique customer journey and business objectives."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We offer comprehensive support including email support (all plans), priority chat support (Professional+), dedicated customer success managers (Enterprise), and 24/7 phone support for mission-critical issues. We also provide extensive documentation and video tutorials."
    }
  ];

  // Before/After comparison data
  const beforeAfter = {
    before: {
      title: "Before ADPD",
      problems: [
        "Guessing which campaigns drive real results",
        "Wasted ad spend on underperforming channels",
        "No clear view of customer journey",
        "Manual campaign optimization",
        "Disconnected data silos",
        "Poor ROAS visibility"
      ]
    },
    after: {
      title: "After ADPD",
      solutions: [
        "Data-driven attribution insights",
        "Automated budget optimization",
        "Complete customer journey mapping",
        "AI-powered campaign scaling",
        "Unified analytics dashboard",
        "150% average ROAS improvement"
      ]
    }
  };

  const features = [
    {
      icon: Brain,
      title: "Advanced Attribution Modeling",
      description: "Enterprise-grade multi-touch attribution with machine learning algorithms that reveal true campaign performance and customer journey insights.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Unified Analytics Dashboard",
      description: "Comprehensive cross-platform analytics connecting Facebook, Google, TikTok, and 50+ advertising platforms in one intelligent interface.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI-Powered Optimization",
      description: "Real-time campaign optimization using predictive algorithms that automatically adjust budgets and bidding strategies for maximum ROI.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Bank-level data encryption, GDPR compliance, and robust security protocols trusted by Fortune 500 companies worldwide.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Eye,
      title: "Predictive Analytics",
      description: "Advanced forecasting models that predict campaign performance, market trends, and optimization opportunities before they happen.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Rocket,
      title: "Automated Growth Engine",
      description: "Intelligent scaling algorithms that automatically identify winning campaigns and reallocate budgets for exponential growth.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Thompson",
      role: "Chief Marketing Officer",
      company: "TechScale Solutions",
      image: "",
      text: "ADPD transformed our attribution strategy completely. We've seen a 180% improvement in ROAS and finally understand which channels drive real value.",
      rating: 5,
      results: "+180% ROAS"
    },
    {
      name: "Marcus Rodriguez",
      role: "Performance Marketing Director",
      company: "Growth Dynamics",
      image: "",
      text: "The multi-touch attribution insights revealed revenue sources we never knew existed. This platform changed how we allocate our €5M annual ad budget.",
      rating: 5,
      results: "+95% Efficiency"
    },
    {
      name: "Elena Kowalski",
      role: "Founder & CEO",
      company: "Digital Innovation Labs",
      image: "",
      text: "Scaled from €200K to €8M in ad spend in 12 months. ADPD's predictive models and automation made sustainable growth possible.",
      rating: 5,
      results: "€200K → €8M"
    }
  ];

  const pricingPlans = [
    {
      name: "Startup",
      price: "€497",
      period: "/month",
      description: "Perfect for growing agencies and ambitious startups",
      features: [
        "Up to 50 campaigns",
        "Basic attribution modeling",
        "Core platform integrations",
        "Standard email support",
        "Weekly performance reports",
        "Campaign optimization tools"
      ],
      buttonText: "Start 14-Day Trial",
      popular: false,
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      name: "Professional",
      price: "€997",
      period: "/month",
      description: "The complete solution for performance marketing teams",
      features: [
        "Unlimited campaigns",
        "Advanced AI attribution",
        "50+ platform integrations",
        "Priority support & onboarding",
        "Real-time analytics dashboard",
        "Custom reporting suite",
        "API access & webhooks",
        "White-label solutions"
      ],
      buttonText: "Start 14-Day Trial",
      popular: true,
      gradient: "from-purple-500 to-blue-600"
    },
    {
      name: "Enterprise",
      price: "€2,497",
      period: "/month",
      description: "Enterprise-grade solution for large organizations",
      features: [
        "Everything in Professional",
        "Dedicated customer success manager",
        "Custom AI model training",
        "Enterprise security & compliance",
        "99.9% SLA guarantee",
        "On-premise deployment option",
        "Custom integrations & development",
        "24/7 phone & priority support"
      ],
      buttonText: "Contact Sales Team",
      popular: false,
      gradient: "from-emerald-500 to-purple-600"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: 0, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 25, repeat: 0, ease: "linear" }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 8, repeat: 0, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Public Navigation */}
      <PublicNavigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp}>
              <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 text-sm font-semibold">
                <Crown className="w-4 h-4 mr-2" />
                #1 Attribution Platform στην Ελλάδα
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-600 bg-clip-text text-transparent mb-8 leading-tight"
            >
              Scale Your Business
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                Through Digital Growth
              </span>
            </motion.h1>

            <motion.div 
              variants={fadeInUp}
              className="text-xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4"
            >
              Professional Digital Marketing & Attribution Platform
            </motion.div>

            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              Transform your advertising performance with enterprise-grade attribution modeling, 
              AI-powered insights, and data-driven optimization strategies. Trusted by leading agencies 
              to deliver exceptional ROI and sustainable growth.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                <Rocket className="w-5 h-5 mr-2" />
                Ξεκινήστε Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 px-8 py-4 rounded-2xl hover:bg-white/10 backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                Δείτε Demo (2 min)
              </Button>
            </motion.div>

            {/* Hero Stats with Animated Counters */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16"
            >
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <Icon className="w-12 h-12 text-blue-600 mb-4 mx-auto animate-pulse" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        <AnimatedCounter 
                          end={stat.value} 
                          prefix={stat.prefix} 
                          suffix={stat.suffix}
                          duration={2500}
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Social Proof - Trusted By */}
            <motion.div 
              variants={fadeInUp}
              className="text-center"
            >
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
                TRUSTED BY LEADING AGENCIES & ENTERPRISES
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 hover:opacity-80 transition-opacity duration-300">
                {/* Company logos placeholder - these would be actual client logos */}
                <div className="h-8 px-6 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">ENTERPRISE CLIENT</span>
                </div>
                <div className="h-8 px-6 bg-gradient-to-r from-blue-300 to-blue-400 dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-300">DIGITAL AGENCY</span>
                </div>
                <div className="h-8 px-6 bg-gradient-to-r from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-300">TECH STARTUP</span>
                </div>
                <div className="h-8 px-6 bg-gradient-to-r from-emerald-300 to-emerald-400 dark:from-emerald-600 dark:to-emerald-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">E-COMMERCE</span>
                </div>
                <div className="h-8 px-6 bg-gradient-to-r from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700 rounded-lg flex items-center">
                  <span className="text-xs font-semibold text-orange-600 dark:text-orange-300">SAAS COMPANY</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-3 text-sm font-semibold">
              <Play className="w-4 h-4 mr-2" />
              Interactive Demo
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-cyan-700 dark:from-white dark:via-emerald-200 dark:to-cyan-200 bg-clip-text text-transparent leading-tight">
              See ADPD in Action
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Live Platform Demo
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the power of enterprise-grade attribution with our interactive demo. 
              See real data, live insights, and automated optimization in action.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Demo Navigation */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {demoTabs.map((tab, index) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={index}
                      onClick={() => setActiveDemo(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 ${
                        activeDemo === index
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25'
                          : 'bg-white/80 dark:bg-gray-900/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-white/20 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <Icon className={`w-8 h-8 flex-shrink-0 ${
                          activeDemo === index ? 'text-white' : 'text-blue-600'
                        }`} />
                        <div>
                          <h3 className="font-bold text-lg mb-2">{tab.title}</h3>
                          <p className={`text-sm ${
                            activeDemo === index ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Demo Preview */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                >
                  {/* Demo Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/50 p-6 border-b border-gray-200/20 dark:border-gray-700/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {demoTabs[activeDemo].preview.title}
                      </h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  {/* Demo Content */}
                  <div className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      {demoTabs[activeDemo].preview.stats.map((stat, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              stat.trend.startsWith('+') 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {stat.trend}
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {stat.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Simulated Chart */}
                    <div className="mt-8">
                      <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl relative overflow-hidden">
                        <div className="absolute inset-0 flex items-end justify-around p-4">
                          {Array.from({ length: 8 }).map((_, index) => (
                            <motion.div
                              key={index}
                              initial={{ height: 0 }}
                              animate={{ height: Math.random() * 80 + 20 }}
                              transition={{ delay: index * 0.1, duration: 0.5 }}
                              className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg"
                              style={{ width: '8px' }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Call to Action */}
          <AnimatedSection className="text-center mt-16">
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              Try Interactive Demo Free
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              No credit card required • Full access • Setup in 2 minutes
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 text-sm font-semibold">
              <Brain className="w-4 h-4 mr-2" />
              Enterprise Technology
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Advanced Attribution
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                That Drives Results
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Enterprise-grade technology stack designed for performance marketers who demand accuracy, 
              scalability, and actionable insights from their attribution data.
            </p>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -8 }}
                  className="group p-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl hover:border-blue-200/50 dark:hover:border-blue-700/50 transition-all duration-500"
                >
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      Learn more 
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Before vs After Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 text-sm font-semibold">
              <ArrowRight className="w-4 h-4 mr-2" />
              Transformation
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-orange-700 to-red-700 dark:from-white dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent leading-tight">
              The ADPD Difference
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Before vs After
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See how businesses transform their attribution strategy and unlock explosive growth 
              with enterprise-grade data insights and AI-powered optimization.
            </p>
          </AnimatedSection>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Before */}
            <AnimatedSection>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl mb-4 shadow-xl">
                  <TrendingDownIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {beforeAfter.before.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Common attribution challenges
                </p>
              </div>

              <div className="space-y-4">
                {beforeAfter.before.problems.map((problem, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50"
                  >
                    <X className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {problem}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Simulated bad metrics */}
              <div className="mt-8 p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Typical Results:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">-35%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ROAS Efficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">68%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Wasted Spend</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* After */}
            <AnimatedSection>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl mb-4 shadow-xl">
                  <TrendingUpIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {beforeAfter.after.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Enterprise attribution success
                </p>
              </div>

              <div className="space-y-4">
                {beforeAfter.after.solutions.map((solution, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {solution}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Simulated good metrics */}
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">ADPD Results:</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">+150%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">ROAS Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">89%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Budget Efficiency</div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Transformation CTA */}
          <AnimatedSection className="text-center mt-16">
            <div className="p-8 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-3xl border border-orange-200/50 dark:border-orange-800/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Ready to Transform Your Attribution Strategy?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Join 350+ businesses who've already made the switch to data-driven attribution 
                and are seeing game-changing results in their marketing performance.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105"
              >
                <Rocket className="w-6 h-6 mr-3" />
                Start Your Transformation
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Platform Integrations Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 text-sm font-semibold">
              <Puzzle className="w-4 h-4 mr-2" />
              50+ Integrations
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent leading-tight">
              Connect Everything
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                In One Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              ADPD integrates seamlessly with all major advertising platforms, analytics tools, 
              and business systems. Set up in minutes, not months.
            </p>
          </AnimatedSection>

          {/* Integration Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mb-16">
            {integrations.map((integration, index) => {
              const Icon = integration.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="flex flex-col items-center p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                    {integration.name}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 animate-pulse"></div>
                </motion.div>
              );
            })}
          </div>

          {/* Integration Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  One-Click Setup
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Connect all your platforms in minutes with our automated integration system. 
                  No technical setup required.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <RefreshCw className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Real-Time Sync
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Live data synchronization across all platforms ensures you always have 
                  the most current attribution insights.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Bank-level encryption and GDPR compliance protect your data while 
                  providing seamless attribution insights.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 text-sm font-semibold">
              <DollarSign className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-700 dark:from-white dark:via-emerald-200 dark:to-blue-200 bg-clip-text text-transparent leading-tight">
              Choose Your Growth
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Partner Plan
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transparent pricing with no hidden fees. No long-term commitments. 
              Start your growth journey today and scale at your own pace.
            </p>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02 }}
                onHoverStart={() => setHoveredPlan(index)}
                onHoverEnd={() => setHoveredPlan(null)}
                className={`relative p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border transition-all duration-500 ${
                  plan.popular 
                    ? 'border-blue-500/50 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/20' 
                    : 'border-white/20 shadow-xl hover:shadow-2xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 font-semibold">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-300 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => navigate('/login')}
                  className={`w-full py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                  }`}
                >
                  {plan.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Χρειάζεστε custom solution; <br />
              Μιλήστε με τον sales manager μας για enterprise pricing.
            </p>
            <Button variant="outline" className="rounded-xl">
              <Users className="w-4 h-4 mr-2" />
              Book a Demo Call
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 text-sm font-semibold">
              <Heart className="w-4 h-4 mr-2" />
              Client Success Stories
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-orange-700 to-yellow-600 dark:from-white dark:via-orange-200 dark:to-yellow-200 bg-clip-text text-transparent leading-tight">
              Trusted by Industry
              <br />
              <span className="bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Leaders Worldwide
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real results from real companies who transformed their growth trajectory 
              with enterprise-grade attribution and optimization strategies.
            </p>
          </AnimatedSection>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ scale: 1.02 }}
                className="p-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.text}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {testimonial.image && testimonial.image.trim() !== "" ? (
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <img
                        src="/avatar-default.png"
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 font-semibold">
                    {testimonial.results}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 text-sm font-semibold">
              <HelpCircle className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-700 to-purple-700 dark:from-white dark:via-indigo-200 dark:to-purple-200 bg-clip-text text-transparent leading-tight">
              Everything You Need
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                To Know About ADPD
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get answers to the most common questions about enterprise attribution, 
              platform features, and getting started with ADPD.
            </p>
          </AnimatedSection>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <AnimatedSection key={index}>
                <motion.div
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between focus:outline-none group"
                  >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 ml-4"
                    >
                      <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6">
                          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* FAQ CTA */}
          <AnimatedSection className="text-center mt-16">
            <div className="p-8 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl border border-indigo-200/50 dark:border-indigo-800/50">
              <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Our attribution experts are here to help. Get personalized answers 
                and see how ADPD can transform your specific marketing challenges.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat with Expert
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all duration-300"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Demo Call
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust Badges & Certifications */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">
              TRUSTED & CERTIFIED BY INDUSTRY LEADERS
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 hover:opacity-80 transition-opacity duration-300">
              {/* Trust badges */}
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6 text-green-600" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">SOC 2 CERTIFIED</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">GDPR COMPLIANT</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">ISO 27001</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-6 h-6 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">AWS PARTNER</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">4.9/5 RATING</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="p-12 md:p-16 bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/5 bg-[size:30px_30px] bg-[radial-gradient(circle,white_1px,transparent_1px)]"></div>
              
              <div className="relative z-10">
                {/* Urgency Badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center mb-6 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-xl"
                >
                  <Timer className="w-5 h-5 mr-2 text-white animate-pulse" />
                  <span className="text-white font-bold text-sm">LIMITED TIME: 50% Off First 3 Months</span>
                </motion.div>

                <Rocket className="w-20 h-20 text-white mx-auto mb-8 animate-pulse" />
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                  Ready to Transform
                  <br />
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    Your Growth Strategy?
                  </span>
                </h2>

                {/* Social Proof Counter */}
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="flex -space-x-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center">
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      ))}
                    </div>
                    <span className="text-blue-100 text-sm font-medium">
                      <AnimatedCounter end={47} /> businesses signed up today
                    </span>
                  </div>
                  <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto leading-relaxed">
                    Join <span className="font-bold text-yellow-400">
                      <AnimatedCounter end={350} />+ growing businesses
                    </span> who trust ADPD for enterprise-grade attribution.
                  </p>
                  <p className="text-lg text-blue-200 mb-8">
                    Start your 14-day free trial today and experience the difference professional attribution makes.
                  </p>
                </div>

                {/* Urgency Timer */}
                <div className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 max-w-md mx-auto">
                  <div className="text-center">
                    <p className="text-blue-100 text-sm mb-2">🔥 Special Launch Pricing Ends In:</p>
                    <div className="flex justify-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">23</div>
                        <div className="text-xs text-blue-200">HOURS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">47</div>
                        <div className="text-xs text-blue-200">MINS</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">13</div>
                        <div className="text-xs text-blue-200">SECS</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                  <Button 
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg hover:scale-105 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Rocket className="w-6 h-6 mr-3" />
                    Start Free Trial - Save 50%
                    <ArrowRight className="w-6 h-6 ml-3" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300"
                  >
                    <Users className="w-6 h-6 mr-3" />
                    Schedule Demo
                  </Button>
                </div>

                {/* Enhanced Benefits */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-blue-200 text-sm">No credit card required</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-blue-200 text-sm">Setup in under 5 minutes</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-blue-200 text-sm">Cancel anytime</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    <span className="text-blue-200 text-sm">24/7 expert support</span>
                  </div>
                </div>

                {/* Risk Reversal */}
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-blue-100 text-sm font-medium">
                    <span className="text-green-400 font-bold">100% Money-Back Guarantee</span>
                    <br />
                    Not satisfied? Get a full refund within 30 days, no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features Section - Super High Quality */}
      <section id="features" className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 text-sm font-semibold">
              <Zap className="w-4 h-4 mr-2" />
              Enterprise Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Everything You Need to
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Scale Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From basic analytics to advanced AI-powered insights, we provide all the tools you need to optimize your advertising campaigns and maximize ROI.
            </p>
          </AnimatedSection>

          {/* Feature Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Analytics & Reporting */}
            <AnimatedSection className="group">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analytics & Reporting</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Comprehensive analytics with real-time dashboards, custom reports, and advanced data visualization.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Real-time performance tracking</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Custom dashboard builder</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Advanced filtering & segmentation</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Automated report scheduling</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* AI & Attribution */}
            <AnimatedSection className="group">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI & Attribution</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Advanced attribution modeling with AI-powered insights and predictive analytics.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Multi-touch attribution models</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">AI-powered optimization suggestions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Predictive performance modeling</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Automated bid optimization</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            {/* Integrations & Automation */}
            <AnimatedSection className="group">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-emerald-300/50 dark:hover:border-emerald-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Puzzle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Integrations & Automation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Seamless integrations with all major platforms and powerful automation workflows.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">50+ platform integrations</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Automated workflow triggers</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">API access & webhooks</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">White-label solutions</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Advanced Features Grid */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: "Campaign Management", desc: "Create, optimize, and scale campaigns" },
                { icon: Users, title: "Audience Insights", desc: "Deep audience analysis and segmentation" },
                { icon: TrendingUp, title: "Performance Optimization", desc: "AI-driven optimization recommendations" },
                { icon: Shield, title: "Enterprise Security", desc: "Bank-level security and compliance" },
                { icon: Globe, title: "Multi-Channel Tracking", desc: "Track performance across all channels" },
                { icon: Clock, title: "Real-Time Monitoring", desc: "Live performance monitoring" },
                { icon: FileText, title: "Custom Reporting", desc: "Build custom reports and dashboards" },
                { icon: Settings, title: "Advanced Controls", desc: "Granular control over all settings" }
              ].map((feature, index) => (
                <div key={index} className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300 hover:shadow-lg">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Section - Super High Quality */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50 dark:from-gray-900 dark:via-slate-900 dark:to-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-sm font-semibold">
              <DollarSign className="w-4 h-4 mr-2" />
              Transparent Pricing
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Choose the Perfect
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Plan for Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Start free, scale as you grow. All plans include our core features with no hidden fees or setup costs.
            </p>
          </AnimatedSection>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <AnimatedSection key={plan.name} className="group">
                <div className={`relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-500 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-purple-500/50 dark:border-purple-400/50 hover:shadow-purple-500/20' 
                    : 'border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:shadow-blue-500/10'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 text-sm font-semibold">
                        <Crown className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Enterprise CTA */}
          <AnimatedSection className="text-center">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 dark:from-black dark:to-blue-950 rounded-3xl p-12 border border-gray-800/50">
              <h3 className="text-3xl font-bold text-white mb-4">Need Enterprise Solutions?</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Custom integrations, dedicated support, and enterprise-grade features for large organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Sales Team
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Download Enterprise Guide
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* About Section - Super High Quality */}
      <section id="about" className="py-24 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 text-sm font-semibold">
              <Building className="w-4 h-4 mr-2" />
              About Ads Pro
            </Badge>
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6">
              Built by Marketers,
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                For Marketers
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We understand the challenges of modern digital marketing because we've lived them. Our platform is built on real-world experience and designed to solve actual problems.
            </p>
          </AnimatedSection>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <AnimatedSection className="group">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-indigo-300/50 dark:hover:border-indigo-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  To democratize access to enterprise-grade marketing analytics and attribution, enabling businesses of all sizes to make data-driven decisions and achieve sustainable growth.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Empower data-driven decisions</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Simplify complex analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Drive measurable results</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection className="group">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-purple-300/50 dark:hover:border-purple-600/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  To become the world's leading platform for marketing attribution and analytics, setting the standard for transparency, accuracy, and actionable insights in digital advertising.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Global industry standard</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Innovation leadership</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Customer success focus</span>
                  </li>
                </ul>
              </div>
            </AnimatedSection>
          </div>

          {/* Team & Values */}
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: Users,
                  title: "Expert Team",
                  desc: "15+ years of combined experience in digital marketing and analytics",
                  stats: "50+ Experts"
                },
                {
                  icon: Globe,
                  title: "Global Reach",
                  desc: "Serving clients across 25+ countries with localized support",
                  stats: "25+ Countries"
                },
                {
                  icon: Award,
                  title: "Industry Recognition",
                  desc: "Award-winning platform recognized by leading industry publications",
                  stats: "10+ Awards"
                }
              ].map((item, index) => (
                <div key={index} className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/30 dark:border-gray-700/30 hover:border-indigo-300/50 dark:hover:border-indigo-600/50 transition-all duration-300 hover:shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{item.desc}</p>
                  <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {item.stats}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Timeline */}
          <AnimatedSection>
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { year: "2020", title: "Founded", desc: "Started with a vision to solve attribution challenges" },
                  { year: "2021", title: "First 100 Clients", desc: "Reached our first milestone with 100 satisfied customers" },
                  { year: "2022", title: "AI Integration", desc: "Launched AI-powered optimization features" },
                  { year: "2024", title: "Global Expansion", desc: "Expanded to serve clients in 25+ countries" }
                ].map((milestone, index) => (
                  <div key={index} className="text-center group">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-lg">{milestone.year}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{milestone.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Ads Pro</h3>
                  <p className="text-gray-400 text-sm">Attribution Platform</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Η #1 attribution platform για agencies που θέλουν να κλιμακώσουν.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Ads Pro Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}