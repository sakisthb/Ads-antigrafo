import { jwtDecode } from 'jwt-decode';
import { reportError } from './sentry';

// JWT token interface
interface JWTPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expires at
  permissions: string[];
}

// User interface
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

// Auth response interface
interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: number;
}

class AuthService {
  private readonly TOKEN_KEY = 'adspro_token';
  private readonly REFRESH_TOKEN_KEY = 'adspro_refresh_token';
  private readonly API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  private refreshTimeout: NodeJS.Timeout | null = null;

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const authData: AuthResponse = await response.json();
      
      // Store tokens
      this.setTokens(authData.token, authData.refreshToken);
      
      // Setup auto refresh
      this.setupTokenRefresh(authData.expiresAt);
      
      return authData;
    } catch (error) {
      reportError(error as Error, { context: 'auth_login' });
      throw error;
    }
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const authData: AuthResponse = await response.json();
      
      // Store tokens
      this.setTokens(authData.token, authData.refreshToken);
      
      // Setup auto refresh
      this.setupTokenRefresh(authData.expiresAt);
      
      return authData;
    } catch (error) {
      reportError(error as Error, { context: 'auth_register' });
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      
      if (token) {
        // Notify server about logout
        await fetch(`${this.API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // Log error but don't throw - logout should always succeed locally
      console.warn('Server logout failed:', error);
    } finally {
      // Clear tokens locally
      this.clearTokens();
      
      // Clear refresh timeout
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout);
        this.refreshTimeout = null;
      }
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token, expiresAt } = await response.json();
      
      // Store new token
      localStorage.setItem(this.TOKEN_KEY, token);
      
      // Setup next refresh
      this.setupTokenRefresh(expiresAt);
      
      return token;
    } catch (error) {
      reportError(error as Error, { context: 'auth_refresh' });
      
      // Clear tokens if refresh fails
      this.clearTokens();
      
      return null;
    }
  }

  /**
   * Get current access token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    
    if (!token) {
      return false;
    }

    try {
      const payload = jwtDecode<JWTPayload>(token);
      const now = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUser(): User | null {
    const token = this.getToken();
    
    if (!token || !this.isAuthenticated()) {
      return null;
    }

    try {
      const payload = jwtDecode<JWTPayload>(token);
      
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role as User['role'],
        permissions: payload.permissions,
        createdAt: '', // These would come from API
        lastLogin: '',
      };
    } catch {
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions.includes(permission) || false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: User['role']): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  /**
   * Get authorization header for API requests
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    
    if (token && this.isAuthenticated()) {
      return { Authorization: `Bearer ${token}` };
    }
    
    return {};
  }

  /**
   * Store tokens in localStorage
   */
  private setTokens(token: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  /**
   * Clear tokens from localStorage
   */
  private clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(expiresAt: number): void {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    const now = Date.now();
    const expiresAtMs = expiresAt * 1000;
    const refreshTime = expiresAtMs - now - (5 * 60 * 1000); // Refresh 5 minutes before expiry

    if (refreshTime > 0) {
      this.refreshTimeout = setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  /**
   * Initialize auth service
   */
  init(): void {
    // Check if token exists and setup refresh if needed
    const token = this.getToken();
    
    if (token && this.isAuthenticated()) {
      try {
        const payload = jwtDecode<JWTPayload>(token);
        this.setupTokenRefresh(payload.exp);
      } catch {
        this.clearTokens();
      }
    }
  }
}

// Create singleton instance
export const authService = new AuthService();

// Initialize on module load
authService.init();

// API client with automatic auth headers
export class AuthenticatedAPIClient {
  private readonly baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 - token expired
      if (response.status === 401) {
        // Try to refresh token
        const newToken = await authService.refreshToken();
        
        if (newToken) {
          // Retry request with new token
          config.headers = {
            ...config.headers,
            ...authService.getAuthHeader(),
          };
          
          const retryResponse = await fetch(url, config);
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
          }
          
          return retryResponse.json();
        } else {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      reportError(error as Error, { 
        context: 'api_request',
        endpoint,
        method: options.method || 'GET'
      });
      throw error;
    }
  }

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Create authenticated API client instance
export const apiClient = new AuthenticatedAPIClient();