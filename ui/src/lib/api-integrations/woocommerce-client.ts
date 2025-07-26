// WooCommerce REST API Client - SECURE & COMPLIANT
// Uses official WooCommerce REST API v3+ with proper authentication
// Reference: https://woocommerce.github.io/woocommerce-rest-api-docs/

import { BaseAPIClient, APICredentials, APIRequest, APIResponse, RateLimitConfig } from './base-api-client';
import CryptoJS from 'crypto-js';

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  featured: boolean;
  catalog_visibility: string;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  price_html: string;
  on_sale: boolean;
  total_sales: number;
  stock_quantity: number;
  stock_status: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
}

export interface WooCommerceOrder {
  id: number;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id: number;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    sku: string;
    price: number;
  }>;
}

export interface WooCommerceCustomer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: any;
  shipping: any;
  is_paying_customer: boolean;
  avatar_url: string;
  orders_count: number;
  total_spent: string;
}

export interface WooCommerceReport {
  totals: {
    orders: number;
    items_sold: number;
    tax: string;
    shipping: string;
    discount: string;
    customers: number;
  };
  total_sales: string;
  net_sales: string;
  average_sales: string;
  total_orders: number;
  total_items: number;
  total_tax: string;
  total_shipping: string;
  total_refunds: string;
  total_discount: string;
  totals_grouped_by: string;
}

export class WooCommerceClient extends BaseAPIClient {
  private static readonly API_VERSION = 'wc/v3';
  
  // **CRITICAL**: Conservative rate limits for WooCommerce (varies by hosting)
  private static readonly RATE_LIMITS: RateLimitConfig = {
    requestsPerSecond: 2,      // Very conservative 
    requestsPerMinute: 60,     // Most hosting allows this
    requestsPerHour: 3600,     // 60 * 60
    requestsPerDay: 86400,     // 3600 * 24
    burstLimit: 5
  };

  private siteUrl: string;
  
  constructor(credentials: APICredentials) {
    super('woocommerce', credentials, WooCommerceClient.RATE_LIMITS);
    this.siteUrl = credentials.siteUrl?.replace(/\/$/, '') || ''; // Remove trailing slash
  }

  // **SECURITY**: OAuth 1.0a signature generation for WooCommerce
  private generateOAuthSignature(
    method: string,
    url: string,
    params: Record<string, any>
  ): string {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.random().toString(36).substring(2, 15);
    
    const oauthParams = {
      oauth_consumer_key: this.credentials.consumerKey!,
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
      ...params
    };

    // Sort parameters
    const sortedParams = Object.keys(oauthParams)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(oauthParams[key])}`)
      .join('&');

    // Create signature base string
    const signatureBaseString = [
      method.toUpperCase(),
      encodeURIComponent(url),
      encodeURIComponent(sortedParams)
    ].join('&');

    // Create signing key
    const signingKey = `${encodeURIComponent(this.credentials.consumerSecret || '')}&`;

    // Generate signature
    const signature = CryptoJS.HmacSHA1(signatureBaseString, signingKey).toString(CryptoJS.enc.Base64);

    return signature;
  }

  protected async executeRequest<T>(request: APIRequest): Promise<APIResponse<T>> {
    try {
      if (!this.siteUrl) {
        throw new Error('WooCommerce site URL not configured');
      }

      const url = `${this.siteUrl}/wp-json/${WooCommerceClient.API_VERSION}${request.endpoint}`;
      const params = { ...request.params };

      // **SECURITY**: Add OAuth 1.0a authentication
      if (this.credentials.consumerKey && this.credentials.consumerSecret) {
        const signature = this.generateOAuthSignature(request.method, url, params);
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = Math.random().toString(36).substring(2, 15);

        params.oauth_consumer_key = this.credentials.consumerKey;
        params.oauth_timestamp = timestamp;
        params.oauth_nonce = nonce;
        params.oauth_signature_method = 'HMAC-SHA1';
        params.oauth_version = '1.0';
        params.oauth_signature = signature;
      }

      const searchParams = new URLSearchParams(params);
      const fullUrl = request.method === 'GET' ? 
        `${url}?${searchParams.toString()}` : url;

      const fetchOptions: RequestInit = {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'AdsProApp/1.0',
          ...request.headers
        }
      };

      if (request.method !== 'GET' && request.body) {
        fetchOptions.body = JSON.stringify(request.body);
      }

      const response = await fetch(fullUrl, fetchOptions);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.message || `HTTP ${response.status}`) as any;
        error.status = response.status;
        error.code = errorData.code;
        error.headers = Object.fromEntries(response.headers.entries());
        
        // **CRITICAL**: Handle WooCommerce specific errors
        if (response.status === 401) {
          console.error('WooCommerce API: Invalid credentials - check consumer key/secret');
        } else if (response.status === 403) {
          console.error('WooCommerce API: Access denied - check user permissions');
        } else if (response.status === 404) {
          console.error('WooCommerce API: Endpoint not found - check WooCommerce version');
        }
        
        throw error;
      }

      const data = await response.json();
      
      return {
        success: true,
        data: data
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  protected async performTokenRefresh(): Promise<boolean> {
    // WooCommerce uses consumer key/secret, no token refresh needed
    return true;
  }

  protected getHealthCheckEndpoint(): string {
    return '/system_status';
  }

  // **API METHODS** - WooCommerce REST API

  public async getSystemStatus(): Promise<APIResponse<any>> {
    return this.queueRequest<any>({
      endpoint: '/system_status',
      method: 'GET'
    });
  }

  public async getProducts(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    category?: string,
    status?: string
  ): Promise<APIResponse<WooCommerceProduct[]>> {
    const params: any = {
      page: page.toString(),
      per_page: perPage.toString()
    };

    if (search) params.search = search;
    if (category) params.category = category;
    if (status) params.status = status;

    return this.queueRequest<WooCommerceProduct[]>({
      endpoint: '/products',
      method: 'GET',
      params
    });
  }

  public async getProduct(productId: number): Promise<APIResponse<WooCommerceProduct>> {
    return this.queueRequest<WooCommerceProduct>({
      endpoint: `/products/${productId}`,
      method: 'GET'
    });
  }

  public async getOrders(
    page: number = 1,
    perPage: number = 10,
    status?: string,
    after?: string,
    before?: string
  ): Promise<APIResponse<WooCommerceOrder[]>> {
    const params: any = {
      page: page.toString(),
      per_page: perPage.toString()
    };

    if (status) params.status = status;
    if (after) params.after = after;
    if (before) params.before = before;

    return this.queueRequest<WooCommerceOrder[]>({
      endpoint: '/orders',
      method: 'GET',
      params
    });
  }

  public async getOrder(orderId: number): Promise<APIResponse<WooCommerceOrder>> {
    return this.queueRequest<WooCommerceOrder>({
      endpoint: `/orders/${orderId}`,
      method: 'GET'
    });
  }

  public async getCustomers(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    role?: string
  ): Promise<APIResponse<WooCommerceCustomer[]>> {
    const params: any = {
      page: page.toString(),
      per_page: perPage.toString()
    };

    if (search) params.search = search;
    if (role) params.role = role;

    return this.queueRequest<WooCommerceCustomer[]>({
      endpoint: '/customers',
      method: 'GET',
      params
    });
  }

  public async getSalesReport(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    after?: string,
    before?: string
  ): Promise<APIResponse<WooCommerceReport>> {
    const params: any = {
      period
    };

    if (after) params.after = after;
    if (before) params.before = before;

    return this.queueRequest<WooCommerceReport>({
      endpoint: '/reports/sales',
      method: 'GET',
      params
    });
  }

  public async getTopSellers(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    after?: string,
    before?: string
  ): Promise<APIResponse<any[]>> {
    const params: any = {
      period
    };

    if (after) params.after = after;
    if (before) params.before = before;

    return this.queueRequest<any[]>({
      endpoint: '/reports/top_sellers',
      method: 'GET',
      params
    });
  }

  public async getOrdersReport(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month',
    after?: string,
    before?: string
  ): Promise<APIResponse<any>> {
    const params: any = {
      period
    };

    if (after) params.after = after;
    if (before) params.before = before;

    return this.queueRequest<any>({
      endpoint: '/reports/orders/totals',
      method: 'GET',
      params
    });
  }

  // **CONVENIENCE METHODS** for common ecommerce metrics

  public async getRevenueData(
    startDate: string,
    endDate: string
  ): Promise<APIResponse<{ totalRevenue: number; totalOrders: number; averageOrderValue: number }>> {
    try {
      const ordersResponse = await this.getOrders(1, 100, 'completed', startDate, endDate);
      
      if (!ordersResponse.success || !ordersResponse.data) {
        return { success: false, error: 'Failed to fetch orders' };
      }

      const orders = ordersResponse.data;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      return {
        success: true,
        data: {
          totalRevenue,
          totalOrders,
          averageOrderValue
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  public async getProductPerformance(): Promise<APIResponse<any[]>> {
    try {
      const topSellersResponse = await this.getTopSellers('month');
      
      if (!topSellersResponse.success) {
        return topSellersResponse;
      }

      return topSellersResponse;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // **CRITICAL**: Validate WooCommerce connection and permissions
  public async validateConnection(): Promise<{ valid: boolean; message: string; version?: string }> {
    try {
      const statusResponse = await this.getSystemStatus();
      
      if (statusResponse.success && statusResponse.data) {
        const wooVersion = statusResponse.data.environment?.version || 'Unknown';
        return {
          valid: true,
          message: 'WooCommerce connection successful',
          version: wooVersion
        };
      } else {
        return {
          valid: false,
          message: `WooCommerce connection failed: ${statusResponse.error}`
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        message: `WooCommerce connection error: ${error.message}`
      };
    }
  }
}