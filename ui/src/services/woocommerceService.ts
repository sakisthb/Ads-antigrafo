// WooCommerce API Service
// Professional integration with WooCommerce REST API

import { 
  WooCommerceConfig, 
  WooCommerceData, 
  WooOrder, 
  WooProduct, 
  WooCustomer, 
  WooAnalytics,
  ConnectionTestResult,
  ApiResponse
} from '@/types/dataSource';

class WooCommerceService {
  private config: WooCommerceConfig | null = null;
  private baseUrl: string = '';
  private auth: string = '';

  constructor() {
    // Initialize service
  }

  /**
   * Configure the WooCommerce connection
   */
  configure(config: WooCommerceConfig): void {
    this.config = config;
    this.baseUrl = `${config.siteUrl.replace(/\/$/, '')}/wp-json/${config.version}`;
    
    // Create basic auth string
    const credentials = btoa(`${config.consumerKey}:${config.consumerSecret}`);
    this.auth = `Basic ${credentials}`;
  }

  /**
   * Test the connection to WooCommerce store
   */
  async testConnection(config: WooCommerceConfig): Promise<ConnectionTestResult> {
    try {
      const startTime = Date.now();
      this.configure(config);

      const response = await this.makeRequest('/system_status', 'GET');
      const responseTime = Date.now() - startTime;

      if (response.success && response.data) {
        return {
          success: true,
          message: 'Connection successful! Store is accessible.',
          details: {
            responseTime,
            version: response.data.environment?.wp_version || 'Unknown',
            features: ['orders', 'products', 'customers', 'analytics']
          }
        };
      }

      return {
        success: false,
        message: 'Connection failed. Please check your credentials.'
      };
    } catch (error) {
      console.error('WooCommerce connection test failed:', error);
      return {
        success: false,
        message: this.getErrorMessage(error)
      };
    }
  }

  /**
   * Fetch all WooCommerce data
   */
  async fetchAllData(): Promise<ApiResponse<WooCommerceData>> {
    try {
      if (!this.config) {
        throw new Error('WooCommerce not configured');
      }

      const [orders, products, customers, analytics] = await Promise.all([
        this.fetchOrders(),
        this.fetchProducts(),
        this.fetchCustomers(),
        this.generateAnalytics()
      ]);

      const data: WooCommerceData = {
        orders: orders.data || [],
        products: products.data || [],
        customers: customers.data || [],
        analytics: analytics.data || this.getEmptyAnalytics(),
        lastSync: new Date(),
        isLoading: false
      };

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Failed to fetch WooCommerce data:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch orders from WooCommerce
   */
  async fetchOrders(params: { 
    per_page?: number; 
    page?: number; 
    status?: string;
    after?: string;
    before?: string;
  } = {}): Promise<ApiResponse<WooOrder[]>> {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        orderby: 'date',
        order: 'desc',
        ...params
      };

      const queryString = new URLSearchParams(defaultParams as any).toString();
      const response = await this.makeRequest(`/orders?${queryString}`, 'GET');

      return {
        success: true,
        data: response.data || [],
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch products from WooCommerce
   */
  async fetchProducts(params: { 
    per_page?: number; 
    page?: number; 
    status?: string;
  } = {}): Promise<ApiResponse<WooProduct[]>> {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        status: 'publish',
        orderby: 'date',
        order: 'desc',
        ...params
      };

      const queryString = new URLSearchParams(defaultParams as any).toString();
      const response = await this.makeRequest(`/products?${queryString}`, 'GET');

      return {
        success: true,
        data: response.data || [],
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * Fetch customers from WooCommerce
   */
  async fetchCustomers(params: { 
    per_page?: number; 
    page?: number;
  } = {}): Promise<ApiResponse<WooCustomer[]>> {
    try {
      const defaultParams = {
        per_page: 100,
        page: 1,
        orderby: 'registered_date',
        order: 'desc',
        ...params
      };

      const queryString = new URLSearchParams(defaultParams as any).toString();
      const response = await this.makeRequest(`/customers?${queryString}`, 'GET');

      return {
        success: true,
        data: response.data || [],
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate analytics from WooCommerce data
   */
  async generateAnalytics(): Promise<ApiResponse<WooAnalytics>> {
    try {
      // Fetch recent orders for analytics
      const ordersResponse = await this.fetchOrders({ per_page: 1000 });
      const productsResponse = await this.fetchProducts({ per_page: 1000 });
      const customersResponse = await this.fetchCustomers({ per_page: 1000 });

      if (!ordersResponse.success || !productsResponse.success || !customersResponse.success) {
        throw new Error('Failed to fetch data for analytics');
      }

      const orders = ordersResponse.data || [];
      const products = productsResponse.data || [];
      const customers = customersResponse.data || [];

      const analytics = this.calculateAnalytics(orders, products, customers);

      return {
        success: true,
        data: analytics,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: this.getErrorMessage(error),
        timestamp: new Date()
      };
    }
  }

  /**
   * Calculate analytics from raw data
   */
  private calculateAnalytics(orders: WooOrder[], products: WooProduct[], customers: WooCustomer[]): WooAnalytics {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Revenue calculations
    const totalRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + parseFloat(order.total), 0);

    const todayRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.date_created);
        return orderDate >= today && order.status === 'completed';
      })
      .reduce((sum, order) => sum + parseFloat(order.total), 0);

    const weekRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.date_created);
        return orderDate >= thisWeek && order.status === 'completed';
      })
      .reduce((sum, order) => sum + parseFloat(order.total), 0);

    const monthRevenue = orders
      .filter(order => {
        const orderDate = new Date(order.date_created);
        return orderDate >= thisMonth && order.status === 'completed';
      })
      .reduce((sum, order) => sum + parseFloat(order.total), 0);

    // Order calculations
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const processingOrders = orders.filter(order => order.status === 'processing').length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;

    // Customer calculations
    const totalCustomers = customers.length;
    const newCustomers = customers.filter(customer => {
      const registrationDate = new Date(customer.date_created);
      return registrationDate >= thisMonth;
    }).length;

    const returningCustomers = customers.filter(customer => customer.orders_count > 1).length;

    // Product calculations
    const totalProducts = products.length;
    const inStockProducts = products.filter(product => product.stock_status === 'instock').length;
    const outOfStockProducts = products.filter(product => product.stock_status === 'outofstock').length;
    const topSellingProducts = products
      .sort((a, b) => b.total_sales - a.total_sales)
      .slice(0, 10);

    return {
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        thisWeek: weekRevenue,
        thisMonth: monthRevenue,
        growth: this.calculateGrowth(monthRevenue, totalRevenue)
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        growth: this.calculateGrowth(completedOrders, totalOrders)
      },
      customers: {
        total: totalCustomers,
        new: newCustomers,
        returning: returningCustomers,
        growth: this.calculateGrowth(newCustomers, totalCustomers)
      },
      products: {
        total: totalProducts,
        inStock: inStockProducts,
        outOfStock: outOfStockProducts,
        topSelling: topSellingProducts
      }
    };
  }

  /**
   * Calculate growth percentage
   */
  private calculateGrowth(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
  }

  /**
   * Make HTTP request to WooCommerce API
   */
  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<any> {
    if (!this.config || !this.baseUrl) {
      throw new Error('WooCommerce not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': this.auth,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 30000);
    options.signal = controller.signal;

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: any): string {
    if (error.name === 'AbortError') {
      return 'Request timeout. Please check your internet connection.';
    }
    
    if (error.message?.includes('404')) {
      return 'WooCommerce REST API not found. Please ensure WooCommerce is installed and REST API is enabled.';
    }
    
    if (error.message?.includes('401') || error.message?.includes('403')) {
      return 'Authentication failed. Please check your Consumer Key and Secret.';
    }
    
    if (error.message?.includes('CORS')) {
      return 'CORS error. Please ensure your store allows requests from this domain.';
    }

    return error.message || 'An unexpected error occurred';
  }

  /**
   * Get empty analytics structure
   */
  private getEmptyAnalytics(): WooAnalytics {
    return {
      revenue: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        growth: 0
      },
      orders: {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        growth: 0
      },
      customers: {
        total: 0,
        new: 0,
        returning: 0,
        growth: 0
      },
      products: {
        total: 0,
        inStock: 0,
        outOfStock: 0,
        topSelling: []
      }
    };
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return this.config !== null;
  }

  /**
   * Get current configuration (without sensitive data)
   */
  getConfig(): Partial<WooCommerceConfig> | null {
    if (!this.config) return null;
    
    return {
      siteUrl: this.config.siteUrl,
      version: this.config.version,
      timeout: this.config.timeout
    };
  }
}

// Export singleton instance
export const wooCommerceService = new WooCommerceService();
export default wooCommerceService;