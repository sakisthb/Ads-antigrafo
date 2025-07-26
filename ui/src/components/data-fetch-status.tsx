// Data Fetch Status Component
// Compact Status Display για Dashboard Integration
// 20+ Years Experience - Production-Ready

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Zap,
  Settings,
  Activity,
  TrendingUp,
  WifiOff,
  Timer
} from 'lucide-react';
import { useDataFetchManager, useFetchLimits, useQuickFetch } from '@/hooks/use-data-fetch-manager';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface DataFetchStatusProps {
  compact?: boolean;
  showControls?: boolean;
  onSettingsClick?: () => void;
}

export function DataFetchStatus({ 
  compact = false, 
  showControls = true,
  onSettingsClick 
}: DataFetchStatusProps) {
  const {
    isEnabled,
    platforms,
    stats,
    recentActivity,
    fetchAllPlatforms
  } = useDataFetchManager();
  
  const fetchLimits = useFetchLimits();
  const { quickFetch, loading: quickFetchLoading } = useQuickFetch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleQuickRefresh = async () => {
    if (fetchLimits.manual.remaining === 0) {
      toast.error('❌ No manual fetches remaining today');
      return;
    }

    setIsRefreshing(true);
    try {
      toast.loading('🔄 Quick refreshing data...');
      const results = await fetchAllPlatforms();
      
      const successful = Object.values(results).filter(r => r.success).length;
      const total = Object.keys(results).length;
      
      if (successful === total) {
        toast.success(`✅ Data refreshed successfully!`);
      } else {
        toast.warning(`⚠️ Partial refresh: ${successful}/${total} platforms`);
      }
    } catch (error) {
      toast.error('❌ Refresh failed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const getOverallStatus = () => {
    const healthyCount = Object.values(platforms).filter(p => p.status === 'healthy').length;
    const totalCount = Object.keys(platforms).length;
    const healthyPercentage = (healthyCount / Math.max(totalCount, 1)) * 100;
    
    if (healthyPercentage >= 75) return { status: 'healthy', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (healthyPercentage >= 50) return { status: 'degraded', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'error', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const getLastSuccessfulFetch = () => {
    const lastFetches = Object.values(platforms).map(p => p.lastSuccessfulFetch);
    const mostRecent = new Date(Math.max(...lastFetches.map(d => d.getTime())));
    return mostRecent;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <WifiOff className="w-4 h-4 text-red-600" />;
      default: return <Database className="w-4 h-4 text-gray-600" />;
    }
  };

  const overallStatus = getOverallStatus();
  const lastFetch = getLastSuccessfulFetch();

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl border">
        <div className="flex items-center gap-2">
          {getStatusIcon(overallStatus.status)}
          <span className="text-sm font-medium">Data Sync</span>
        </div>
        
        <Badge className={`${overallStatus.bgColor} ${overallStatus.color} border-0`}>
          {stats.successRate.toFixed(0)}% success
        </Badge>
        
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(lastFetch, { addSuffix: true })}
        </div>
        
        {showControls && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleQuickRefresh}
            disabled={!isEnabled || isRefreshing || fetchLimits.manual.remaining === 0}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Data Fetch Status</CardTitle>
              <CardDescription>
                Real-time platform sync και fetch analytics
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {getStatusIcon(overallStatus.status)}
            <Badge className={`${overallStatus.bgColor} ${overallStatus.color} border-0`}>
              {overallStatus.status}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-lg font-bold text-green-600">{stats.successRate.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-lg font-bold text-blue-600">{stats.avgResponseTime.toFixed(0)}ms</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
            <div className="text-lg font-bold text-purple-600">{fetchLimits.manual.remaining}</div>
            <div className="text-xs text-muted-foreground">Manual Left</div>
          </div>
        </div>

        {/* Platform Status Grid */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Platform Status
          </h4>
          
          <div className="grid gap-2">
            {Object.entries(platforms).map(([platform, health]) => {
              const isHealthy = health.status === 'healthy';
              const nextFetch = health.nextAllowedFetch;
              const isInCooldown = nextFetch && nextFetch > new Date();
              
              return (
                <div key={platform} className="flex items-center justify-between p-3 bg-gray-50/30 dark:bg-gray-800/30 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      health.status === 'healthy' ? 'bg-green-500' :
                      health.status === 'degraded' ? 'bg-yellow-500' :
                      health.status === 'rate_limited' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`} />
                    
                    <div>
                      <div className="text-sm font-medium capitalize">{platform}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(health.lastSuccessfulFetch, { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {isInCooldown && (
                      <div className="flex items-center gap-1 text-xs text-orange-600">
                        <Timer className="w-3 h-3" />
                        {format(nextFetch, 'HH:mm')}
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      {health.requestsToday}
                    </div>
                    
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        isHealthy ? 'text-green-600 border-green-200' :
                        health.status === 'degraded' ? 'text-yellow-600 border-yellow-200' :
                        health.status === 'rate_limited' ? 'text-orange-600 border-orange-200' :
                        'text-red-600 border-red-200'
                      }`}
                    >
                      {health.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual Fetch Limits */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Manual Fetch Limits
          </h4>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Manual Fetches</span>
                <span className="font-medium">
                  {fetchLimits.manual.remaining}/{fetchLimits.manual.max}
                </span>
              </div>
              <Progress 
                value={(fetchLimits.manual.remaining / fetchLimits.manual.max) * 100} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Emergency Fetches (Weekly)</span>
                <span className="font-medium">
                  {fetchLimits.emergency.remaining}/{fetchLimits.emergency.max}
                </span>
              </div>
              <Progress 
                value={(fetchLimits.emergency.remaining / fetchLimits.emergency.max) * 100} 
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Activity
            </h4>
            
            <div className="space-y-2">
              {recentActivity.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between text-xs p-2 bg-gray-50/30 dark:bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : activity.status === 'error' ? (
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                    ) : (
                      <RefreshCw className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="capitalize">{activity.platform}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                  
                  <div className="text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Controls */}
        {showControls && (
          <div className="flex items-center gap-2 pt-4 border-t">
            <Button
              onClick={handleQuickRefresh}
              disabled={!isEnabled || isRefreshing || fetchLimits.manual.remaining === 0}
              className="flex-1"
              variant="outline"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Quick Refresh
            </Button>
            
            {onSettingsClick && (
              <Button
                onClick={onSettingsClick}
                variant="ghost"
                size="icon"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}

        {/* Status Footer */}
        <div className="text-center pt-2 border-t">
          <div className="text-xs text-muted-foreground">
            Last sync: {formatDistanceToNow(lastFetch, { addSuffix: true })} • 
            Next auto-fetch in {8 - (new Date().getHours() % 8)}h
          </div>
        </div>
      </CardContent>
    </Card>
  );
}