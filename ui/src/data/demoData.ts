// Demo Data for ADPD Platform
// Comprehensive demo dataset for showcasing platform capabilities

import { DashboardData, CampaignData, AnalyticsData, CustomerData, ProductData, RevenueData, TrafficData } from '@/types/dataSource';

// Revenue Demo Data
const demoRevenue: RevenueData = {
  total: 1250000,
  today: 8420,
  thisWeek: 52340,
  thisMonth: 187650,
  growth: 23.5,
  currency: 'EUR',
  trend: 'up'
};

// Campaign Demo Data
const demoCampaigns: CampaignData[] = [
  {
    id: 'demo-fb-001',
    name: 'Summer Collection 2024',
    platform: 'facebook',
    status: 'active',
    budget: 15000,
    spent: 12480,
    impressions: 2450000,
    clicks: 49000,
    conversions: 1225,
    ctr: 2.0,
    cpc: 0.25,
    roas: 4.8,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31')
  },
  {
    id: 'demo-google-001',
    name: 'Search - Premium Products',
    platform: 'google',
    status: 'active',
    budget: 20000,
    spent: 18750,
    impressions: 1850000,
    clicks: 37000,
    conversions: 925,
    ctr: 2.1,
    cpc: 0.51,
    roas: 3.2,
    startDate: new Date('2024-05-15'),
    endDate: new Date('2024-09-15')
  },
  {
    id: 'demo-tiktok-001',
    name: 'Gen Z Fashion Campaign',
    platform: 'tiktok',
    status: 'active',
    budget: 8000,
    spent: 6920,
    impressions: 5200000,
    clicks: 78000,
    conversions: 1560,
    ctr: 1.5,
    cpc: 0.089,
    roas: 6.2,
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-09-30')
  },
  {
    id: 'demo-fb-002',
    name: 'Retargeting - Cart Abandonment',
    platform: 'facebook',
    status: 'active',
    budget: 5000,
    spent: 4820,
    impressions: 890000,
    clicks: 26700,
    conversions: 535,
    ctr: 3.0,
    cpc: 0.18,
    roas: 7.1,
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-12-31')
  },
  {
    id: 'demo-google-002',
    name: 'YouTube Video Campaign',
    platform: 'google',
    status: 'paused',
    budget: 12000,
    spent: 9240,
    impressions: 3200000,
    clicks: 64000,
    conversions: 320,
    ctr: 2.0,
    cpc: 0.144,
    roas: 2.8,
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-07-31')
  }
];

// Traffic Demo Data
const demoTraffic: TrafficData[] = [
  { date: '2024-07-01', visitors: 8420, pageViews: 25260, conversions: 168 },
  { date: '2024-07-02', visitors: 9150, pageViews: 27450, conversions: 183 },
  { date: '2024-07-03', visitors: 7890, pageViews: 23670, conversions: 158 },
  { date: '2024-07-04', visitors: 10200, pageViews: 30600, conversions: 204 },
  { date: '2024-07-05', visitors: 11340, pageViews: 34020, conversions: 227 },
  { date: '2024-07-06', visitors: 9760, pageViews: 29280, conversions: 195 },
  { date: '2024-07-07', visitors: 8920, pageViews: 26760, conversions: 178 },
  { date: '2024-07-08', visitors: 12480, pageViews: 37440, conversions: 249 },
  { date: '2024-07-09', visitors: 13120, pageViews: 39360, conversions: 262 },
  { date: '2024-07-10', visitors: 11890, pageViews: 35670, conversions: 238 },
  { date: '2024-07-11', visitors: 10540, pageViews: 31620, conversions: 211 },
  { date: '2024-07-12', visitors: 14280, pageViews: 42840, conversions: 285 },
  { date: '2024-07-13', visitors: 15670, pageViews: 47010, conversions: 313 },
  { date: '2024-07-14', visitors: 13950, pageViews: 41850, conversions: 279 },
  { date: '2024-07-15', visitors: 12340, pageViews: 37020, conversions: 247 },
  { date: '2024-07-16', visitors: 16890, pageViews: 50670, conversions: 337 },
  { date: '2024-07-17', visitors: 18420, pageViews: 55260, conversions: 368 },
  { date: '2024-07-18', visitors: 17560, pageViews: 52680, conversions: 351 },
  { date: '2024-07-19', visitors: 15980, pageViews: 47940, conversions: 319 },
  { date: '2024-07-20', visitors: 19240, pageViews: 57720, conversions: 385 },
  { date: '2024-07-21', visitors: 20150, pageViews: 60450, conversions: 403 }
];

// Analytics Demo Data
const demoAnalytics: AnalyticsData = {
  pageViews: 986420,
  sessions: 324680,
  users: 287340,
  bounceRate: 42.3,
  avgSessionDuration: 185, // seconds
  conversionRate: 2.8,
  topPages: [
    { path: '/products/summer-collection', views: 125420 },
    { path: '/products/premium-line', views: 98560 },
    { path: '/categories/women', views: 87340 },
    { path: '/sale', views: 76890 },
    { path: '/products/accessories', views: 65210 },
    { path: '/categories/men', views: 54670 },
    { path: '/blog/fashion-trends', views: 43280 },
    { path: '/about-us', views: 32150 },
    { path: '/contact', views: 28490 },
    { path: '/shipping-info', views: 24670 }
  ],
  traffic: demoTraffic
};

// Customer Demo Data
const demoCustomers: CustomerData = {
  total: 45680,
  new: 3240,
  returning: 12890,
  ltv: 285.40,
  segments: [
    {
      name: 'VIP Customers',
      count: 2840,
      value: 185420,
      growth: 18.5
    },
    {
      name: 'Regular Buyers',
      count: 18920,
      value: 468950,
      growth: 12.3
    },
    {
      name: 'First-time Buyers',
      count: 15240,
      value: 156780,
      growth: 25.7
    },
    {
      name: 'Inactive Customers',
      count: 8680,
      value: 42180,
      growth: -8.2
    }
  ]
};

// Product Demo Data
const demoProducts: ProductData = {
  total: 1250,
  inStock: 1120,
  outOfStock: 130,
  topSelling: [
    { id: 'demo-prod-001', name: 'Premium Leather Handbag', sales: 1250 },
    { id: 'demo-prod-002', name: 'Designer Summer Dress', sales: 980 },
    { id: 'demo-prod-003', name: 'Classic Men\'s Watch', sales: 875 },
    { id: 'demo-prod-004', name: 'Wireless Earbuds Pro', sales: 820 },
    { id: 'demo-prod-005', name: 'Organic Cotton T-Shirt', sales: 760 },
    { id: 'demo-prod-006', name: 'Smart Fitness Tracker', sales: 690 },
    { id: 'demo-prod-007', name: 'Artisan Coffee Blend', sales: 645 },
    { id: 'demo-prod-008', name: 'Luxury Skincare Set', sales: 590 },
    { id: 'demo-prod-009', name: 'Vintage Denim Jacket', sales: 535 },
    { id: 'demo-prod-010', name: 'Professional Camera Lens', sales: 480 }
  ],
  categories: [
    { name: 'Fashion & Apparel', count: 420 },
    { name: 'Electronics', count: 280 },
    { name: 'Beauty & Health', count: 195 },
    { name: 'Home & Garden', count: 165 },
    { name: 'Sports & Outdoors', count: 125 },
    { name: 'Books & Media', count: 65 }
  ]
};

// Complete Demo Dashboard Data
export const demoData: DashboardData = {
  revenue: demoRevenue,
  campaigns: demoCampaigns,
  analytics: demoAnalytics,
  customers: demoCustomers,
  products: demoProducts,
  source: 'demo',
  lastUpdated: new Date(),
  isDemo: true
};

// Additional demo datasets for specific components
export const demoChartData = {
  revenueChart: [
    { month: 'Jan', revenue: 84200, target: 80000 },
    { month: 'Feb', revenue: 89500, target: 85000 },
    { month: 'Mar', revenue: 95200, target: 90000 },
    { month: 'Apr', revenue: 102800, target: 95000 },
    { month: 'May', revenue: 118600, target: 100000 },
    { month: 'Jun', revenue: 134200, target: 110000 },
    { month: 'Jul', revenue: 156800, target: 120000 }
  ],
  
  campaignPerformance: [
    { platform: 'Facebook', spend: 45000, revenue: 216000, roas: 4.8 },
    { platform: 'Google', spend: 38000, revenue: 121600, roas: 3.2 },
    { platform: 'TikTok', spend: 12000, revenue: 74400, roas: 6.2 },
    { platform: 'LinkedIn', spend: 8000, revenue: 28800, roas: 3.6 },
    { platform: 'Twitter', spend: 5000, revenue: 15000, roas: 3.0 }
  ],
  
  conversionFunnel: [
    { stage: 'Visitors', count: 125420, conversion: 100 },
    { stage: 'Product Views', count: 68450, conversion: 54.6 },
    { stage: 'Add to Cart', count: 18920, conversion: 15.1 },
    { stage: 'Checkout Started', count: 12480, conversion: 9.9 },
    { stage: 'Purchase Completed', count: 8960, conversion: 7.1 }
  ],
  
  geographicData: [
    { country: 'Greece', sessions: 125420, revenue: 425680 },
    { country: 'Cyprus', sessions: 45680, revenue: 185920 },
    { country: 'Germany', sessions: 38920, revenue: 298450 },
    { country: 'United Kingdom', sessions: 32150, revenue: 256780 },
    { country: 'Italy', sessions: 28640, revenue: 189560 },
    { country: 'France', sessions: 24890, revenue: 198740 },
    { country: 'Spain', sessions: 21560, revenue: 156890 },
    { country: 'Netherlands', sessions: 18490, revenue: 142680 }
  ],
  
  hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
    hour: hour.toString().padStart(2, '0') + ':00',
    visitors: Math.floor(Math.random() * 500) + 200,
    conversions: Math.floor(Math.random() * 25) + 5
  })),
  
  deviceBreakdown: [
    { device: 'Desktop', sessions: 148920, percentage: 45.8 },
    { device: 'Mobile', sessions: 142680, percentage: 43.9 },
    { device: 'Tablet', sessions: 33080, percentage: 10.2 }
  ],
  
  ageGroups: [
    { age: '18-24', count: 45280, percentage: 15.7 },
    { age: '25-34', count: 89640, percentage: 31.2 },
    { age: '35-44', count: 78920, percentage: 27.5 },
    { age: '45-54', count: 48560, percentage: 16.9 },
    { age: '55+', count: 24940, percentage: 8.7 }
  ]
};

// Demo notification data
export const demoNotifications = [
  {
    id: 'demo-notif-001',
    type: 'success',
    title: 'Campaign Performance Alert',
    message: 'Summer Collection campaign exceeded ROAS target by 25%',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false
  },
  {
    id: 'demo-notif-002',
    type: 'warning',
    title: 'Budget Alert',
    message: 'Google Ads campaign has spent 85% of daily budget',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false
  },
  {
    id: 'demo-notif-003',
    type: 'info',
    title: 'Weekly Report Available',
    message: 'Your weekly performance report is ready to view',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true
  },
  {
    id: 'demo-notif-004',
    type: 'error',
    title: 'Integration Issue',
    message: 'Facebook API connection temporarily unavailable',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true
  }
];

// Demo insight recommendations
export const demoInsights = [
  {
    id: 'demo-insight-001',
    type: 'optimization',
    priority: 'high',
    title: 'Budget Reallocation Opportunity',
    description: 'Moving 20% budget from Google Search to TikTok could increase overall ROAS by 35%',
    potentialImpact: '+€12,450 monthly revenue',
    action: 'Implement Budget Shift',
    confidence: 87
  },
  {
    id: 'demo-insight-002',
    type: 'audience',
    priority: 'medium',
    title: 'High-Value Audience Expansion',
    description: 'Lookalike audiences based on VIP customers show 180% higher conversion rates',
    potentialImpact: '+€8,920 monthly revenue',
    action: 'Create Lookalike Campaigns',
    confidence: 92
  },
  {
    id: 'demo-insight-003',
    type: 'timing',
    priority: 'medium',
    title: 'Optimal Ad Scheduling',
    description: 'Campaigns perform 45% better between 6 PM - 9 PM on weekdays',
    potentialImpact: '+€5,680 monthly revenue',
    action: 'Adjust Ad Schedule',
    confidence: 78
  },
  {
    id: 'demo-insight-004',
    type: 'creative',
    priority: 'low',
    title: 'Creative Performance Analysis',
    description: 'Video creatives outperform static images by 65% in engagement',
    potentialImpact: '+€3,240 monthly revenue',
    action: 'Increase Video Creative Production',
    confidence: 83
  }
];

export default demoData;