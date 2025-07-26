import { reportError, addBreadcrumb } from './sentry';

// Rate limiting configuration
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  keyGenerator?: (request: any) => string; // Function to generate rate limit key
  onLimitReached?: (key: string) => void; // Callback when limit is reached
}

// Rate limit storage
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || now > existing.resetTime) {
      // First request or window expired
      const resetTime = now + windowMs;
      const entry = { count: 1, resetTime };
      this.store.set(key, entry);
      return entry;
    } else {
      // Increment existing count
      existing.count++;
      this.store.set(key, existing);
      return existing;
    }
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Rate limiter class
export class RateLimiter {
  private store = new RateLimitStore();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.store.cleanup();
    }, 60000);
  }

  check(key: string, config: RateLimitConfig): { allowed: boolean; resetTime: number; remaining: number } {
    const result = this.store.increment(key, config.windowMs);
    const allowed = result.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - result.count);

    if (!allowed && config.onLimitReached) {
      config.onLimitReached(key);
    }

    addBreadcrumb(`Rate limit check: ${key}`, 'security', {
      allowed,
      count: result.count,
      maxRequests: config.maxRequests,
      remaining
    });

    return {
      allowed,
      resetTime: result.resetTime,
      remaining
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Create global rate limiter instance
export const rateLimiter = new RateLimiter();

// Common rate limit configurations
export const RATE_LIMITS = {
  API: { windowMs: 15 * 60 * 1000, maxRequests: 100 }, // 100 requests per 15 minutes
  LOGIN: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 login attempts per 15 minutes
  STRICT: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 requests per minute
  LENIENT: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 requests per minute
};

// Request fingerprinting for security
export function generateRequestFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset().toString(),
    canvas.toDataURL(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform,
  ].join('|');

  return btoa(fingerprint).slice(0, 32);
}

// Content Security Policy helper
export function setupCSP(): void {
  if (import.meta.env.PROD) {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.adspro.app https://sentry.io",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');

    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }
}

// XSS Protection
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// CSRF Token management
class CSRFTokenManager {
  private token: string | null = null;
  private readonly STORAGE_KEY = 'csrf_token';

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem(this.STORAGE_KEY);
    }
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.STORAGE_KEY, token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async fetchToken(): Promise<string> {
    try {
      const response = await fetch('/api/csrf-token');
      const { token } = await response.json();
      this.setToken(token);
      return token;
    } catch (error) {
      reportError(error as Error, { context: 'csrf_fetch' });
      throw error;
    }
  }
}

export const csrfTokenManager = new CSRFTokenManager();

// Security headers checker
export function checkSecurityHeaders(): void {
  // This would typically be done on the server, but we can check some client-side
  const checks = [
    {
      name: 'HTTPS',
      check: () => location.protocol === 'https:' || location.hostname === 'localhost',
      message: 'Application should be served over HTTPS in production'
    },
    {
      name: 'Secure Context',
      check: () => window.isSecureContext,
      message: 'Application is not running in a secure context'
    }
  ];

  checks.forEach(({ name, check, message }) => {
    if (!check()) {
      console.warn(`Security Warning [${name}]: ${message}`);
      addBreadcrumb(`Security check failed: ${name}`, 'security', { message });
    }
  });
}

// Session security
export function setupSessionSecurity(): void {
  // Detect if user switches tabs/windows (potential session hijacking)
  let lastActiveTime = Date.now();
  
  const updateActivity = () => {
    lastActiveTime = Date.now();
  };

  // Track user activity
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, updateActivity, { passive: true });
  });

  // Check for session anomalies
  const checkSessionSecurity = () => {
    const now = Date.now();
    const inactiveTime = now - lastActiveTime;
    
    // If inactive for more than 30 minutes, warn about potential security risk
    if (inactiveTime > 30 * 60 * 1000) {
      console.warn('Extended inactivity detected - consider re-authentication');
      addBreadcrumb('Extended inactivity detected', 'security', { inactiveTime });
    }
  };

  // Check every 5 minutes
  setInterval(checkSessionSecurity, 5 * 60 * 1000);

  // Detect multiple tabs (potential session sharing)
  if ('BroadcastChannel' in window) {
    const channel = new BroadcastChannel('security_channel');
    
    channel.postMessage({ type: 'tab_opened', timestamp: Date.now() });
    
    channel.addEventListener('message', (event) => {
      if (event.data.type === 'tab_opened') {
        addBreadcrumb('Multiple tabs detected', 'security', event.data);
      }
    });
  }
}

// Input validation helpers
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  },

  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  sanitizeHtml: (html: string): string => {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
};

// Security event logger
export function logSecurityEvent(event: string, details: Record<string, any> = {}): void {
  const securityEvent = {
    event,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    fingerprint: generateRequestFingerprint(),
    ...details
  };

  // Log to Sentry
  addBreadcrumb(`Security event: ${event}`, 'security', securityEvent);

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('Security Event:', securityEvent);
  }

  // Could also send to a dedicated security logging endpoint
  if (import.meta.env.PROD) {
    fetch('/api/security/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(securityEvent)
    }).catch(error => {
      console.warn('Failed to log security event:', error);
    });
  }
}

// Initialize security measures
export function initializeSecurity(): void {
  setupCSP();
  checkSecurityHeaders();
  setupSessionSecurity();
  
  // Log security initialization
  logSecurityEvent('security_initialized', {
    environment: import.meta.env.MODE,
    timestamp: Date.now()
  });
}