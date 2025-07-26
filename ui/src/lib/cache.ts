import { reportError, addBreadcrumb } from './sentry';

// Cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  namespace?: string; // Cache namespace/prefix
}

// Cache entry interface
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  hits: number;
}

// Cache statistics
interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
}

// In-memory cache implementation (fallback when Redis is not available)
class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    hitRate: 0
  };

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    const now = Date.now();
    
    // Check if expired
    if (now > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      this.stats.misses++;
      this.stats.size--;
      this.updateHitRate();
      return null;
    }

    // Update hit count
    entry.hits++;
    this.stats.hits++;
    this.updateHitRate();
    
    return entry.data;
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      hits: 0
    };

    const wasPresent = this.cache.has(key);
    this.cache.set(key, entry);
    
    if (!wasPresent) {
      this.stats.size++;
    }
    
    this.stats.sets++;
  }

  async delete(key: string): Promise<boolean> {
    const deleted = this.cache.delete(key);
    
    if (deleted) {
      this.stats.deletes++;
      this.stats.size--;
    }
    
    return deleted;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.stats.size = 0;
  }

  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    this.stats.size -= cleaned;
    
    addBreadcrumb(`Cache cleanup: ${cleaned} expired entries removed`, 'cache');
  }
}

// Redis cache implementation
class RedisCache {
  private baseUrl: string;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0,
    hitRate: 0
  };

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_REDIS_URL || 'http://localhost:6379';
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache/${encodeURIComponent(key)}`);
      
      if (response.status === 404) {
        this.stats.misses++;
        this.updateHitRate();
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`Redis GET failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.stats.hits++;
      this.updateHitRate();
      
      return data;
    } catch (error) {
      reportError(error as Error, { context: 'redis_get', key });
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          ttl: Math.floor(ttl / 1000) // Convert to seconds for Redis
        })
      });
      
      if (!response.ok) {
        throw new Error(`Redis SET failed: ${response.statusText}`);
      }
      
      this.stats.sets++;
    } catch (error) {
      reportError(error as Error, { context: 'redis_set', key });
      throw error;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache/${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        this.stats.deletes++;
        return true;
      }
      
      return false;
    } catch (error) {
      reportError(error as Error, { context: 'redis_delete', key });
      return false;
    }
  }

  async clear(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/cache`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Redis CLEAR failed: ${response.statusText}`);
      }
    } catch (error) {
      reportError(error as Error, { context: 'redis_clear' });
      throw error;
    }
  }

  async getStats(): Promise<CacheStats> {
    return { ...this.stats };
  }

  async cleanup(): Promise<void> {
    // Redis handles TTL automatically, so this is a no-op
    addBreadcrumb('Redis cleanup called (handled automatically)', 'cache');
  }
}

// Cache manager with automatic fallback
class CacheManager {
  private primaryCache: RedisCache | MemoryCache;
  private fallbackCache: MemoryCache;
  private usingFallback = false;

  constructor() {
    this.primaryCache = new RedisCache();
    this.fallbackCache = new MemoryCache();
    
    this.checkRedisAvailability();
  }

  private async checkRedisAvailability(): Promise<void> {
    try {
      await this.primaryCache.set('health_check', 'ok', 1000);
      await this.primaryCache.get('health_check');
      
      if (this.usingFallback) {
        this.usingFallback = false;
        addBreadcrumb('Redis cache restored', 'cache');
      }
    } catch (error) {
      if (!this.usingFallback) {
        this.usingFallback = true;
        addBreadcrumb('Falling back to memory cache', 'cache');
        console.warn('Redis unavailable, using memory cache fallback');
      }
    }
  }

  private getActiveCache(): RedisCache | MemoryCache {
    return this.usingFallback ? this.fallbackCache : this.primaryCache;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      return await this.getActiveCache().get<T>(key);
    } catch (error) {
      // Try fallback if primary fails
      if (!this.usingFallback) {
        this.usingFallback = true;
        return await this.fallbackCache.get<T>(key);
      }
      throw error;
    }
  }

  async set<T>(key: string, data: T, ttl: number): Promise<void> {
    try {
      await this.getActiveCache().set(key, data, ttl);
    } catch (error) {
      // Try fallback if primary fails
      if (!this.usingFallback) {
        this.usingFallback = true;
        await this.fallbackCache.set(key, data, ttl);
      } else {
        throw error;
      }
    }
  }

  async delete(key: string): Promise<boolean> {
    return await this.getActiveCache().delete(key);
  }

  async clear(): Promise<void> {
    await this.getActiveCache().clear();
  }

  async getStats(): Promise<CacheStats & { usingFallback: boolean }> {
    const stats = await this.getActiveCache().getStats();
    return { ...stats, usingFallback: this.usingFallback };
  }

  async cleanup(): Promise<void> {
    await this.getActiveCache().cleanup();
  }

  isUsingFallback(): boolean {
    return this.usingFallback;
  }
}

// Create global cache manager
export const cacheManager = new CacheManager();

// Cache TTL presets
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 2 * 60 * 60 * 1000,  // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// Cache key generators
export const CACHE_KEYS = {
  USER_DASHBOARD: (userId: string) => `dashboard:${userId}`,
  CAMPAIGN_LIST: (userId: string, filters?: string) => 
    `campaigns:${userId}${filters ? `:${btoa(filters)}` : ''}`,
  CAMPAIGN_METRICS: (campaignId: string, dateRange: string) => 
    `metrics:${campaignId}:${dateRange}`,
  ANALYTICS_DATA: (userId: string, period: string) => 
    `analytics:${userId}:${period}`,
  USER_PROFILE: (userId: string) => `profile:${userId}`,
  PLATFORM_STATS: () => 'platform:stats',
} as const;

// High-level caching functions
export class CacheService {
  static async getCachedData<T>(
    key: string, 
    fetchFunction: () => Promise<T>, 
    ttl: number = CACHE_TTL.MEDIUM
  ): Promise<T> {
    // Try to get from cache first
    const cached = await cacheManager.get<T>(key);
    
    if (cached !== null) {
      addBreadcrumb(`Cache hit: ${key}`, 'cache');
      return cached;
    }

    // Cache miss - fetch data
    addBreadcrumb(`Cache miss: ${key}`, 'cache');
    
    try {
      const data = await fetchFunction();
      
      // Cache the result
      await cacheManager.set(key, data, ttl);
      
      return data;
    } catch (error) {
      reportError(error as Error, { context: 'cache_fetch', key });
      throw error;
    }
  }

  static async invalidatePattern(pattern: string): Promise<void> {
    // This would be implemented with Redis SCAN for pattern matching
    // For now, we'll implement basic prefix matching for memory cache
    addBreadcrumb(`Cache invalidation pattern: ${pattern}`, 'cache');
  }

  static async getUserDashboard(userId: string): Promise<any> {
    return this.getCachedData(
      CACHE_KEYS.USER_DASHBOARD(userId),
      async () => {
        // This would call your API
        const response = await fetch(`/api/dashboard/${userId}`);
        return response.json();
      },
      CACHE_TTL.SHORT
    );
  }

  static async getCampaignsList(userId: string, filters?: any): Promise<any[]> {
    const filtersKey = filters ? JSON.stringify(filters) : '';
    
    return this.getCachedData(
      CACHE_KEYS.CAMPAIGN_LIST(userId, filtersKey),
      async () => {
        const params = new URLSearchParams();
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            params.append(key, String(value));
          });
        }
        
        const response = await fetch(`/api/campaigns/${userId}?${params}`);
        return response.json();
      },
      CACHE_TTL.MEDIUM
    );
  }

  static async getCampaignMetrics(campaignId: string, dateRange: string): Promise<any> {
    return this.getCachedData(
      CACHE_KEYS.CAMPAIGN_METRICS(campaignId, dateRange),
      async () => {
        const response = await fetch(`/api/campaigns/${campaignId}/metrics?range=${dateRange}`);
        return response.json();
      },
      CACHE_TTL.LONG
    );
  }

  static async invalidateUserCache(userId: string): Promise<void> {
    await Promise.all([
      cacheManager.delete(CACHE_KEYS.USER_DASHBOARD(userId)),
      cacheManager.delete(CACHE_KEYS.USER_PROFILE(userId)),
      // Could extend to invalidate all user-related keys
    ]);
    
    addBreadcrumb(`Invalidated cache for user: ${userId}`, 'cache');
  }

  static async getStats(): Promise<any> {
    return await cacheManager.getStats();
  }
}

// Cache statistics getter (non-React version)
export async function getCacheStats() {
  try {
    return await CacheService.getStats();
  } catch (error) {
    console.warn('Failed to fetch cache stats:', error);
    return null;
  }
}

// Auto-cleanup on interval
setInterval(() => {
  cacheManager.cleanup();
}, 5 * 60 * 1000); // Cleanup every 5 minutes