import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Database,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Trash2,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { CacheService, cacheManager } from '../lib/cache';

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
  hitRate: number;
  usingFallback: boolean;
}

export function CacheDashboard() {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const cacheStats = await CacheService.getStats();
      setStats(cacheStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch cache stats:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const clearCache = async () => {
    try {
      await cacheManager.clear();
      await fetchStats();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  const forceCleanup = async () => {
    try {
      await cacheManager.cleanup();
      await fetchStats();
    } catch (error) {
      console.error('Failed to cleanup cache:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <p className="text-muted-foreground">Loading cache statistics...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getCacheStatus = () => {
    if (stats.usingFallback) {
      return {
        status: 'fallback',
        icon: AlertCircle,
        text: 'Memory Fallback',
        color: 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300'
      };
    } else {
      return {
        status: 'redis',
        icon: CheckCircle,
        text: 'Redis Active',
        color: 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900/20 dark:text-green-300'
      };
    }
  };

  const cacheStatus = getCacheStatus();
  const StatusIcon = cacheStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cache Performance</h2>
          <p className="text-muted-foreground">Real-time caching system statistics</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cacheStatus.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {cacheStatus.text}
          </Badge>
          <Button onClick={fetchStats} size="sm" variant="outline" disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hit Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.hitRate.toFixed(1)}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/20">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cache Hits</p>
                <p className="text-2xl font-bold text-blue-600">{formatNumber(stats.hits)}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/20">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cache Misses</p>
                <p className="text-2xl font-bold text-orange-600">{formatNumber(stats.misses)}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/20">
                <TrendingDown className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cache Size</p>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.size)}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900/20">
                <Database className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Performance Overview</CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Requests:</span>
                    <span className="text-sm">{formatNumber(stats.hits + stats.misses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cache Hits:</span>
                    <span className="text-sm text-green-600">{formatNumber(stats.hits)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cache Misses:</span>
                    <span className="text-sm text-red-600">{formatNumber(stats.misses)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Hit Rate:</span>
                    <span className="text-sm font-bold text-green-600">{stats.hitRate.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cache Type:</span>
                    <span className="text-sm">{stats.usingFallback ? 'Memory' : 'Redis'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Stored Items:</span>
                    <span className="text-sm">{formatNumber(stats.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Last Refresh:</span>
                    <span className="text-sm">{lastRefresh.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              {/* Hit Rate Visual */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hit Rate Progress</span>
                  <span>{stats.hitRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(stats.hitRate, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Operations</CardTitle>
              <CardDescription>Detailed operation statistics and controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(stats.sets)}</p>
                  <p className="text-sm text-muted-foreground">Sets</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg dark:bg-green-900/20">
                  <p className="text-2xl font-bold text-green-600">{formatNumber(stats.hits)}</p>
                  <p className="text-sm text-muted-foreground">Gets (Hit)</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg dark:bg-orange-900/20">
                  <p className="text-2xl font-bold text-orange-600">{formatNumber(stats.misses)}</p>
                  <p className="text-sm text-muted-foreground">Gets (Miss)</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg dark:bg-red-900/20">
                  <p className="text-2xl font-bold text-red-600">{formatNumber(stats.deletes)}</p>
                  <p className="text-sm text-muted-foreground">Deletes</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={forceCleanup} variant="outline">
                  <Activity className="w-4 h-4 mr-2" />
                  Force Cleanup
                </Button>
                <Button onClick={clearCache} variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cache Health Status</CardTitle>
              <CardDescription>System health and diagnostics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">System Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Backend:</span>
                      <Badge className={cacheStatus.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {stats.usingFallback ? 'Memory Fallback' : 'Redis'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Performance:</span>
                      <Badge className={stats.hitRate > 80 ? 'bg-green-100 text-green-700' : stats.hitRate > 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                        {stats.hitRate > 80 ? 'Excellent' : stats.hitRate > 60 ? 'Good' : 'Poor'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cache Size:</span>
                      <span className="text-sm font-medium">{formatNumber(stats.size)} items</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    {stats.hitRate < 60 && (
                      <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded dark:bg-yellow-900/20">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <span>Consider reviewing cache TTL settings to improve hit rate</span>
                      </div>
                    )}
                    {stats.usingFallback && (
                      <div className="flex items-start gap-2 p-2 bg-orange-50 rounded dark:bg-orange-900/20">
                        <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                        <span>Redis is unavailable. Using memory fallback cache</span>
                      </div>
                    )}
                    {stats.hitRate >= 80 && !stats.usingFallback && (
                      <div className="flex items-start gap-2 p-2 bg-green-50 rounded dark:bg-green-900/20">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>Cache is performing optimally</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last updated: {lastRefresh.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}