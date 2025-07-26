// Data Fetch Settings Panel
// Enterprise-Grade Control Panel για Smart Data Fetching
// 20+ Years Experience - Production-Ready

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Settings,
  Activity,
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  TrendingUp,
  Shield,
  Download,
  Upload,
  Database,
  Wifi,
  WifiOff,
  Timer,
  Calendar,
  Info,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useDataFetchManager, useFetchLimits } from '@/hooks/use-data-fetch-manager';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export function DataFetchSettings() {
  const {
    isEnabled,
    platforms,
    settings,
    stats,
    recentActivity,
    fetchData,
    canFetch,
    updateSettings,
    enableFetching,
    disableFetching,
    fetchAllPlatforms,
    getHealthStatus,
    getNextFetchTime
  } = useDataFetchManager();

  const fetchLimits = useFetchLimits();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFetching = () => {
    if (isEnabled) {
      disableFetching();
      toast.success('🛑 Data fetching disabled');
    } else {
      enableFetching();
      toast.success('✅ Data fetching enabled');
    }
  };

  const handleManualFetch = async (platform: string) => {
    setIsLoading(true);
    try {
      const canFetchResult = await canFetch(platform, 'manual');
      if (!canFetchResult.allowed) {
        toast.error(`❌ ${canFetchResult.reason}`);
        return;
      }

      toast.loading(`🔄 Fetching ${platform} data...`);
      const result = await fetchData(platform, 'manual');
      
      if (result.success) {
        toast.success(`✅ ${platform} data fetched successfully!`);
      } else {
        toast.error(`❌ ${platform} fetch failed: ${result.error}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchAll = async () => {
    setIsLoading(true);
    try {
      toast.loading('🔄 Fetching data from all platforms...');
      const results = await fetchAllPlatforms();
      
      const successful = Object.values(results).filter(r => r.success).length;
      const total = Object.keys(results).length;
      
      if (successful === total) {
        toast.success(`✅ All platforms fetched successfully! (${successful}/${total})`);
      } else {
        toast.warning(`⚠️ Partial success: ${successful}/${total} platforms fetched`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInterval = (newInterval: number) => {
    updateSettings({
      auto: { ...settings.auto, interval: newInterval }
    });
    toast.success(`📝 Auto-fetch interval updated to ${newInterval} hours`);
  };

  const getPlatformStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'degraded': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'rate_limited': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPlatformIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'rate_limited': return <Timer className="w-4 h-4 text-orange-600" />;
      default: return <Wifi className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'rate_limited': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <Settings className="w-8 h-8 text-white" />
            </div>
            Smart Data Fetch Manager
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Enterprise Pro
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Intelligent rate limiting και automated data fetching με enterprise-grade safety controls
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleFetching}
              disabled={isLoading}
            />
            <span className="text-sm font-medium">
              {isEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          
          <Button 
            onClick={handleFetchAll}
            disabled={!isEnabled || isLoading || fetchLimits.manual.remaining === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Fetch All Platforms
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600">
              {stats.totalFetches} total fetches
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">{stats.avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-blue-600">
              Real-time performance
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Fetches Left</CardTitle>
            <Zap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {fetchLimits.manual.remaining}/{fetchLimits.manual.max}
            </div>
            <p className="text-xs text-purple-600">
              Resets daily
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Fetches</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700">
              {fetchLimits.emergency.remaining}/{fetchLimits.emergency.max}
            </div>
            <p className="text-xs text-orange-600">
              Resets weekly
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="platforms" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="platforms">Platform Status</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Platform Status Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(platforms).map(([platform, health]) => {
              const nextFetch = getNextFetchTime(platform);
              const canManualFetch = fetchLimits.manual.remaining > 0;
              
              return (
                <Card key={platform} className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                          <Database className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">{health.platform}</CardTitle>
                          <CardDescription>
                            Last fetch: {formatDistanceToNow(health.lastSuccessfulFetch, { addSuffix: true })}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(health.status)}
                        <Badge className={getPlatformStatusColor(health.status)}>
                          {health.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Platform Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Requests Today:</span>
                          <span className="font-medium">{health.requestsToday}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Error Rate:</span>
                          <span className="font-medium">{health.errorRate.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg Response:</span>
                          <span className="font-medium">{health.avgResponseTime.toFixed(0)}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">This Hour:</span>
                          <span className="font-medium">{health.requestsThisHour}</span>
                        </div>
                      </div>
                    </div>

                    {/* Next Fetch Time */}
                    {nextFetch && nextFetch > new Date() && (
                      <Alert>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                          Next allowed fetch: {format(nextFetch, 'HH:mm:ss')}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Manual Fetch Button */}
                    <Button
                      onClick={() => handleManualFetch(platform)}
                      disabled={
                        !isEnabled || 
                        isLoading || 
                        !canManualFetch ||
                        (nextFetch && nextFetch > new Date())
                      }
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Manual Fetch
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Recent Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Fetch Activity
              </CardTitle>
              <CardDescription>
                Last 20 fetch attempts across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Recent Activity</h3>
                      <p className="text-muted-foreground">
                        No fetch attempts have been made yet
                      </p>
                    </div>
                  ) : (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl border bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {activity.status === 'success' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : activity.status === 'error' ? (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          ) : (
                            <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium capitalize">{activity.platform}</span>
                            <Badge className={getActivityStatusColor(activity.status)} variant="outline">
                              {activity.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              {format(activity.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                              {activity.duration > 0 && ` • ${activity.duration}ms`}
                            </div>
                            
                            {activity.errorMessage && (
                              <div className="text-red-600 text-xs">
                                Error: {activity.errorMessage}
                              </div>
                            )}
                            
                            {activity.dataSize > 0 && (
                              <div className="text-xs">
                                Data size: {(activity.dataSize / 1024).toFixed(1)}KB
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Auto Fetch Settings */}
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5" />
                  Automatic Fetching
                </CardTitle>
                <CardDescription>
                  Configure automatic data fetching intervals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Fetch Interval (hours)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[4, 6, 8, 12].map((interval) => (
                      <Button
                        key={interval}
                        variant={settings.auto.interval === interval ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleUpdateInterval(interval)}
                        className="text-xs"
                      >
                        {interval}h
                      </Button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Current: Every {settings.auto.interval} hours (max {settings.auto.maxPerDay}/day)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Jitter Range</label>
                  <div className="text-sm text-muted-foreground">
                    ±{settings.auto.jitterRange} minutes randomization για rate limiting
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manual Fetch Settings */}
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Manual Controls
                </CardTitle>
                <CardDescription>
                  Manual and emergency fetch limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Manual Fetches (Daily)</span>
                    <Badge variant="outline">
                      {fetchLimits.manual.remaining}/{fetchLimits.manual.max}
                    </Badge>
                  </div>
                  <Progress 
                    value={(fetchLimits.manual.remaining / fetchLimits.manual.max) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {fetchLimits.manual.cooldownHours}h cooldown between manual fetches
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Emergency Fetches (Weekly)</span>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                      {fetchLimits.emergency.remaining}/{fetchLimits.emergency.max}
                    </Badge>
                  </div>
                  <Progress 
                    value={(fetchLimits.emergency.remaining / fetchLimits.emergency.max) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    For critical situations only
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Safety Features */}
          <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Safety Features Active
              </CardTitle>
              <CardDescription>
                Enterprise-grade protection για advertising accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Intelligent Rate Limiting</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Exponential Backoff</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Platform-Specific Limits</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Error Recovery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Health Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Compliance Tracking</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Success Rate Chart */}
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Platform Performance
                </CardTitle>
                <CardDescription>
                  Success rates και response times ανά platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(platforms).map(([platform, health]) => (
                    <div key={platform} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{platform}</span>
                        <span>{(100 - health.errorRate).toFixed(1)}% success</span>
                      </div>
                      <Progress value={100 - health.errorRate} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Avg: {health.avgResponseTime.toFixed(0)}ms • Today: {health.requestsToday} requests
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Summary */}
            <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Usage Summary
                </CardTitle>
                <CardDescription>
                  Current limits και usage patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Today's Activity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Manual Fetches:</span>
                        <span>{fetchLimits.manual.max - fetchLimits.manual.remaining}/{fetchLimits.manual.max}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Auto Fetches:</span>
                        <span>Every {settings.auto.interval}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Requests:</span>
                        <span>{Object.values(platforms).reduce((sum, p) => sum + p.requestsToday, 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-3">System Health</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Overall Success Rate:</span>
                        <span className="font-medium text-green-600">{stats.successRate.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Healthy Platforms:</span>
                        <span className="font-medium">
                          {Object.values(platforms).filter(p => p.status === 'healthy').length}/{Object.keys(platforms).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Response Time:</span>
                        <span className="font-medium">{stats.avgResponseTime.toFixed(0)}ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}