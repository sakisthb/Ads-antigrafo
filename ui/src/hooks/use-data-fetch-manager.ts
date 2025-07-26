// React Hook για Smart Data Fetch Manager
// Enterprise-Grade Integration με React Components
// 20+ Years Experience - Production-Ready

import { useState, useEffect, useCallback } from 'react';
import { dataFetchManager, FetchLimits, PlatformHealth, FetchAttempt } from '@/lib/data-fetch-manager';

export interface UseDataFetchManagerReturn {
  // Status
  isEnabled: boolean;
  platforms: { [key: string]: PlatformHealth };
  settings: FetchLimits;
  
  // Stats
  stats: {
    totalFetches: number;
    successRate: number;
    avgResponseTime: number;
  };
  
  // Recent Activity
  recentActivity: FetchAttempt[];
  
  // Actions
  fetchData: (platform: string, type?: 'auto' | 'manual' | 'emergency') => Promise<{ success: boolean; data?: any; error?: string }>;
  canFetch: (platform: string, type: 'auto' | 'manual' | 'emergency') => Promise<{ allowed: boolean; reason?: string; nextAllowed?: Date }>;
  updateSettings: (settings: Partial<FetchLimits>) => void;
  enableFetching: () => void;
  disableFetching: () => void;
  
  // Platform specific helpers
  fetchAllPlatforms: () => Promise<{ [platform: string]: any }>;
  getHealthStatus: (platform: string) => PlatformHealth | null;
  getNextFetchTime: (platform: string) => Date | null;
  getRemainingManualFetches: () => number;
  getRemainingEmergencyFetches: () => number;
}

export function useDataFetchManager(): UseDataFetchManagerReturn {
  const [status, setStatus] = useState(() => dataFetchManager.getStatus());
  const [recentActivity, setRecentActivity] = useState<FetchAttempt[]>([]);

  // Update state when manager status changes
  useEffect(() => {
    const unsubscribe = dataFetchManager.onStatusChange((newStatus) => {
      setStatus(newStatus);
      setRecentActivity(dataFetchManager.getRecentActivity(20));
    });

    // Initial load
    setRecentActivity(dataFetchManager.getRecentActivity(20));

    return unsubscribe;
  }, []);

  // Fetch data από specific platform
  const fetchData = useCallback(async (
    platform: string, 
    type: 'auto' | 'manual' | 'emergency' = 'manual'
  ) => {
    return await dataFetchManager.fetchPlatformData(platform, type);
  }, []);

  // Check if we can fetch data
  const canFetch = useCallback(async (
    platform: string, 
    type: 'auto' | 'manual' | 'emergency'
  ) => {
    return await dataFetchManager.canFetchData(platform, type);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<FetchLimits>) => {
    dataFetchManager.updateSettings(newSettings);
  }, []);

  // Enable/disable fetching
  const enableFetching = useCallback(() => {
    dataFetchManager.enableFetching();
  }, []);

  const disableFetching = useCallback(() => {
    dataFetchManager.disableFetching();
  }, []);

  // Fetch data από όλες τις platforms
  const fetchAllPlatforms = useCallback(async () => {
    const platforms = ['meta', 'google', 'tiktok', 'linkedin'];
    const results: { [platform: string]: any } = {};

    const fetchPromises = platforms.map(async (platform) => {
      const canFetchResult = await canFetch(platform, 'manual');
      if (canFetchResult.allowed) {
        const result = await fetchData(platform, 'manual');
        results[platform] = result;
      } else {
        results[platform] = { 
          success: false, 
          error: canFetchResult.reason,
          nextAllowed: canFetchResult.nextAllowed
        };
      }
    });

    await Promise.all(fetchPromises);
    return results;
  }, [canFetch, fetchData]);

  // Get health status για specific platform
  const getHealthStatus = useCallback((platform: string): PlatformHealth | null => {
    return status.platforms[platform] || null;
  }, [status.platforms]);

  // Get next fetch time για platform
  const getNextFetchTime = useCallback((platform: string): Date | null => {
    const health = getHealthStatus(platform);
    return health?.nextAllowedFetch || null;
  }, [getHealthStatus]);

  // Get remaining manual fetches για σήμερα
  const getRemainingManualFetches = useCallback((): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const manualFetchesToday = recentActivity.filter(activity => 
      activity.type === 'manual' && 
      activity.timestamp >= today
    ).length;

    return Math.max(status.settings.manual.maxPerDay - manualFetchesToday, 0);
  }, [recentActivity, status.settings]);

  // Get remaining emergency fetches για αυτή την εβδομάδα
  const getRemainingEmergencyFetches = useCallback((): number => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const emergencyFetchesThisWeek = recentActivity.filter(activity => 
      activity.type === 'emergency' && 
      activity.timestamp >= weekAgo
    ).length;

    return Math.max(status.settings.emergency.maxPerWeek - emergencyFetchesThisWeek, 0);
  }, [recentActivity, status.settings]);

  return {
    // Status
    isEnabled: status.isEnabled,
    platforms: status.platforms,
    settings: status.settings,
    stats: status.stats,
    recentActivity,
    
    // Actions
    fetchData,
    canFetch,
    updateSettings,
    enableFetching,
    disableFetching,
    
    // Helpers
    fetchAllPlatforms,
    getHealthStatus,
    getNextFetchTime,
    getRemainingManualFetches,
    getRemainingEmergencyFetches
  };
}

// Specialized hooks για specific use cases

export function usePlatformHealth(platform: string) {
  const { platforms, getHealthStatus } = useDataFetchManager();
  return getHealthStatus(platform);
}

export function useFetchLimits() {
  const { getRemainingManualFetches, getRemainingEmergencyFetches, settings } = useDataFetchManager();
  
  return {
    manual: {
      remaining: getRemainingManualFetches(),
      max: settings.manual.maxPerDay,
      cooldownHours: settings.manual.cooldownHours
    },
    emergency: {
      remaining: getRemainingEmergencyFetches(),
      max: settings.emergency.maxPerWeek
    },
    auto: {
      interval: settings.auto.interval,
      maxPerDay: settings.auto.maxPerDay
    }
  };
}

export function useQuickFetch() {
  const { fetchData, canFetch } = useDataFetchManager();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickFetch = useCallback(async (platform: string) => {
    setLoading(true);
    setError(null);

    try {
      const canFetchResult = await canFetch(platform, 'manual');
      if (!canFetchResult.allowed) {
        setError(canFetchResult.reason || 'Cannot fetch data');
        return null;
      }

      const result = await fetchData(platform, 'manual');
      if (!result.success) {
        setError(result.error || 'Fetch failed');
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchData, canFetch]);

  return {
    quickFetch,
    loading,
    error,
    clearError: () => setError(null)
  };
}