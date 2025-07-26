// Data Source Types and Interfaces
// Separation between Demo and Real Data

export type DataSource = 'demo' | 'woocommerce' | 'facebook' | 'google' | 'shopify' | 'tiktok';

export type ConnectionStatus = 'connected' | 'disconnected' | 'error' | 'connecting' | 'syncing';

export interface Connection {
  id: string;
  platform: DataSource;
  status: ConnectionStatus;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  credentials: Record<string, string>;
  config: ConnectionConfig;
  metrics?: ConnectionMetrics;
}

export interface ConnectionConfig {
  // WooCommerce specific
  siteUrl?: string;
  consumerKey?: string;
  consumerSecret?: string;
  version?: string;
  
  // Facebook specific
  facebookAccessToken?: string;
  adAccountId?: string;
  
  // Google specific
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  
  // Shopify specific
  shopDomain?: string;
  shopifyAccessToken?: string;
  
  // General settings
  syncInterval?: number;
  dataRetention?: number;
  features?: string[];
}

export interface ConnectionMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastRequestTime?: Date;
  avgResponseTime?: number;
  dataVolume?: number;
}

export interface UserDataSources {
  userId: string;
  connectedSources: DataSource[];
  primarySource: DataSource;
  demoMode: boolean;
  lastUsedSource?: DataSource;
  preferences: DataSourcePreferences;
}

export interface DataSourcePreferences {
  defaultMode: 'demo' | 'live';
  autoSwitch: boolean;
  showDemoWarnings: boolean;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
}

// WooCommerce specific types
export interface WooCommerceConfig {
  siteUrl: string;
  consumerKey: string;
  consumerSecret: string;
  version: 'wc/v3' | 'wc/v2' | 'wc/v1';
  timeout?: number;
  queryStringAuth?: boolean;
}

export interface WooOrder {
  id: number;
  status: 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | 'failed';
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  total_tax: string;
  shipping_total: string;
  customer_id: number;
  billing: WooAddress;
  shipping: WooAddress;
  line_items: WooLineItem[];
  payment_method: string;
  payment_method_title: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  status: 'draft' | 'pending' | 'private' | 'publish';
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  stock_quantity: number;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  categories: WooCategory[];
  images: WooImage[];
  total_sales: number;
}

export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  date_created: string;
  date_modified: string;
  total_spent: string;
  orders_count: number;
  billing: WooAddress;
  shipping: WooAddress;
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WooLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  price: number;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
}

export interface WooImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooAnalytics {
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    growth: number;
  };
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    growth: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    growth: number;
  };
  products: {
    total: number;
    inStock: number;
    outOfStock: number;
    topSelling: WooProduct[];
  };
}

export interface WooCommerceData {
  orders: WooOrder[];
  products: WooProduct[];
  customers: WooCustomer[];
  analytics: WooAnalytics;
  lastSync: Date;
  isLoading: boolean;
  error?: string;
}

// Generic data structure for all sources
export interface DashboardData {
  revenue: RevenueData;
  campaigns: CampaignData[];
  analytics: AnalyticsData;
  customers: CustomerData;
  products: ProductData;
  source: DataSource;
  lastUpdated: Date;
  isDemo: boolean;
}

export interface RevenueData {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  growth: number;
  currency: string;
  trend: 'up' | 'down' | 'stable';
}

export interface CampaignData {
  id: string;
  name: string;
  platform: DataSource;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  roas: number;
  startDate: Date;
  endDate?: Date;
}

export interface AnalyticsData {
  pageViews: number;
  sessions: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversionRate: number;
  topPages: { path: string; views: number }[];
  traffic: TrafficData[];
}

export interface TrafficData {
  date: string;
  visitors: number;
  pageViews: number;
  conversions: number;
}

export interface CustomerData {
  total: number;
  new: number;
  returning: number;
  ltv: number;
  segments: CustomerSegment[];
}

export interface CustomerSegment {
  name: string;
  count: number;
  value: number;
  growth: number;
}

export interface ProductData {
  total: number;
  inStock: number;
  outOfStock: number;
  topSelling: { id: string; name: string; sales: number }[];
  categories: { name: string; count: number }[];
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    responseTime: number;
    version: string;
    features: string[];
  };
}

// Events and notifications
export interface DataSourceEvent {
  type: 'connection_success' | 'connection_failed' | 'sync_started' | 'sync_completed' | 'sync_failed' | 'data_updated';
  source: DataSource;
  timestamp: Date;
  data?: any;
  error?: string;
}