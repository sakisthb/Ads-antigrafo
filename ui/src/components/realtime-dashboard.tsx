// Real-Time Streaming Analytics Dashboard
// Advanced Live Campaign Monitoring - 25+ Years Marketing Experience
// Simulates Kafka/Redis streams για enterprise-grade real-time insights

import { useState, useEffect, useRef, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  Play, 
  Pause, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MousePointer,
  ShoppingCart,
  DollarSign,
  Clock,
  Users,
  Target,
  BarChart3,
  RefreshCw,
  Bell,
  BellOff,
  Settings,
  Filter,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Wifi,
  WifiOff
} from "lucide-react";
import { realTimeEngine, LiveCampaignStatus, RealTimeEvent, LiveMetric } from '@/lib/realtime-analytics-engine';
import { useWebSocket } from '@/hooks/use-websocket';
import { WebSocketConnectionStatus } from '@/components/websocket-connection-status';
import { format } from 'date-fns';
import { TestMystery } from './test-mystery';

import { toast } from 'sonner';

export function RealTimeDashboard() {
  const [campaigns, setCampaigns] = useState<LiveCampaignStatus[]>([]);
  const [events, setEvents] = useState<RealTimeEvent[]>([]);
  const [metrics, setMetrics] = useState<LiveMetric[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  // WebSocket integration - Simplified to prevent infinite loops
  const {
    isConnected: wsConnected,
    connectionStatus: wsStatus,
    connect: wsConnect,
    disconnect: wsDisconnect
  } = useWebSocket({
    autoConnect: true,
    filter: { channel: 'metrics', messageType: 'metric_update' }
  });
  
  const subscriptionsRef = useRef<string[]>([]);

  useEffect(() => {
    // Initialize data
    try {
      setCampaigns(realTimeEngine.getCampaigns());
      setEvents(realTimeEngine.getEvents());
      setMetrics(realTimeEngine.getLiveMetrics());
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing realtime dashboard:', error);
      setIsLoading(false);
    }
    
    // Setup subscriptions
    const campaignsSub = realTimeEngine.subscribe('campaigns_update', (data: LiveCampaignStatus[]) => {
      setCampaigns(data);
      setLastUpdate(new Date());
    });
    
    const eventsSub = realTimeEngine.subscribe('new_event', (event: RealTimeEvent) => {
      if (alertsEnabled && event.severity === 'high') {
        toast.error(`🚨 ${event.data.message}`, {
          duration: 5000,
          action: {
            label: "View Details",
            onClick: () => setSelectedCampaign(event.campaignId)
          }
        });
      }
      setEvents(prev => [event, ...prev.slice(0, 19)]);
    });

    const metricsSub = realTimeEngine.subscribe('metrics_update', (data: LiveMetric[]) => {
      setMetrics(data);
    });

    subscriptionsRef.current = [campaignsSub, eventsSub, metricsSub];

    // Periodic refresh for real-time data
    const refreshInterval = setInterval(() => {
      if (isStreaming) {
        const newMetrics = realTimeEngine.getLiveMetrics();
        // Only update if there are actually new metrics
        if (newMetrics.length > 0) {
          setMetrics(newMetrics);
          setLastUpdate(new Date());
        }
      }
    }, 10000); // Refresh every 10 seconds to reduce frequency

    return () => {
      subscriptionsRef.current.forEach(sub => realTimeEngine.unsubscribe(sub));
      clearInterval(refreshInterval);
    };
  }, [alertsEnabled, isStreaming]);

  // Simplified WebSocket data sync - using local realtime engine instead
  useEffect(() => {
    if (wsConnected) {
      // Update metrics from realtime engine
      const liveMetrics = realTimeEngine.getLiveMetrics();
      setMetrics(liveMetrics);
      setLastUpdate(new Date());
    }
  }, [wsConnected]);

  const toggleStreaming = () => {
    if (isStreaming) {
      realTimeEngine.stopStreaming();
      wsDisconnect();
      setIsStreaming(false);
      toast.info('🛑 Real-time streaming stopped');
    } else {
      wsConnect();
      realTimeEngine.startStreaming();
      setIsStreaming(true);
      toast.success('🔴 Real-time streaming started');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'poor': return 'text-yellow-600';
      case 'concerning': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDownRight className="w-4 h-4 text-red-600" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'meta': return '📘';
      case 'google': return '🟢';
      case 'tiktok': return '⚫';
      default: return '📊';
    }
  };

  const getEventSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  const filteredCampaigns = selectedCampaign === 'all' 
    ? campaigns 
    : campaigns.filter(c => c.id === selectedCampaign);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgROAS = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;
  const activeAlertsCount = campaigns.reduce((sum, c) => sum + c.alerts, 0);

  // Generate real-time metrics chart data - Memoized to prevent infinite loops
  const chartData = useMemo(() => {
    return metrics
      .filter(m => m.metric === 'roas')
      .slice(-20)
      .map(m => ({
        time: format(m.timestamp, 'HH:mm:ss'),
        roas: m.value,
        campaign: m.campaignName
      }));
  }, [metrics]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-muted-foreground">Loading real-time dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="w-8 h-8 text-blue-600" />
            Real-Time Analytics
            <Badge className={`${wsConnected ? 'bg-green-100 text-green-700' : 
                                wsStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'}`}>
              {wsConnected && <Wifi className="w-3 h-3 mr-1" />}
              {wsStatus === 'disconnected' && <WifiOff className="w-3 h-3 mr-1" />}
              {wsStatus === 'connecting' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
              {wsConnected ? 'WebSocket Connected' : wsStatus}
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Live campaign monitoring με real-time data streams • Last update: {format(lastUpdate, 'HH:mm:ss')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={alertsEnabled ? 'bg-blue-50' : ''}
          >
            {alertsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            Alerts
          </Button>
          
          <Button
            onClick={toggleStreaming}
            className={`${isStreaming ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
            disabled={wsStatus === 'connecting'}
          >
            {isStreaming ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isStreaming ? 'Stop Stream' : 'Start Stream'}
          </Button>
        </div>
      </div>

      {/* Real-Time Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{totalSpend.toLocaleString()}</div>
            <p className="text-xs text-blue-600">Real-time tracking</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Live Conversions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              {isStreaming && <Activity className="w-3 h-3 inline mr-1 animate-pulse" />}
              Live tracking
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROAS</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgROAS.toFixed(2)}x</div>
            <p className="text-xs text-purple-600">Live calculation</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlertsCount}</div>
            <p className="text-xs text-red-600">
              {activeAlertsCount > 0 ? 'Action required' : 'All systems normal'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* WebSocket Connection Status */}
      <WebSocketConnectionStatus 
        showDetails={true}
        showControls={true}
        compact={false}
      />

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Live Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Monitor</TabsTrigger>
          <TabsTrigger value="events">Event Stream</TabsTrigger>
          <TabsTrigger value="metrics">Real-Time Metrics</TabsTrigger>
          <TabsTrigger value="mystery">🔮 Mystery AI</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real-time ROAS Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Real-Time ROAS Tracking
                </CardTitle>
                <CardDescription>Live ROAS updates κάθε 2 δευτερόλεπτα</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Recent ROAS Values</h4>
                    <span className="text-sm text-muted-foreground">
                      Last {chartData.length} updates
                    </span>
                  </div>
                  
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {chartData.length > 0 ? (
                      chartData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{data.time}</span>
                            <span className="text-xs text-muted-foreground">{data.campaign}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${
                              data.roas >= 4 ? 'text-green-600' : 
                              data.roas >= 2 ? 'text-blue-600' : 
                              'text-red-600'
                            }`}>
                              {data.roas.toFixed(2)}x
                            </span>
                            {data.roas >= 4 && <TrendingUp className="w-3 h-3 text-green-600" />}
                            {data.roas < 2 && <TrendingDown className="w-3 h-3 text-red-600" />}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No ROAS data available</p>
                        <p className="text-xs">Start streaming to see live updates</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Live Campaign Status</CardTitle>
                <CardDescription>Real-time performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {campaigns.slice(0, 4).map(campaign => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getPlatformIcon(campaign.platform)}</span>
                      <div>
                        <h4 className="font-medium text-sm">{campaign.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          €{campaign.spend.toLocaleString()} / €{campaign.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(campaign.status)}>{campaign.status}</Badge>
                      <p className={`text-sm font-medium ${getPerformanceColor(campaign.performance)}`}>
                        {campaign.roas.toFixed(2)}x ROAS
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Events Alert */}
          {events.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {events.slice(0, 3).map(event => (
                    <div key={event.id} className={`p-3 border rounded-lg ${getEventSeverityColor(event.severity)}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getPlatformIcon(event.platform)}</span>
                          <span className="font-medium text-sm">{event.data.message}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${event.severity === 'high' ? 'bg-red-100 text-red-700' : 
                                             event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                             'bg-green-100 text-green-700'}`}>
                            {event.severity}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(event.timestamp, 'HH:mm:ss')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Campaign Monitor Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Campaign Monitoring</CardTitle>
              <CardDescription>Real-time campaign performance με live controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 border rounded-lg bg-white dark:bg-gray-900">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getPlatformIcon(campaign.platform)}</span>
                        <div>
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Campaign ID: {campaign.id} • Platform: {campaign.platform.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                        {campaign.alerts > 0 && (
                          <Badge className="bg-red-100 text-red-700">
                            {campaign.alerts} alerts
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Campaign Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Spend</p>
                        <p className="font-semibold">€{campaign.spend.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Conversions</p>
                        <p className="font-semibold">{campaign.conversions}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CTR</p>
                        <p className="font-semibold">{campaign.ctr.toFixed(2)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">CPC</p>
                        <p className="font-semibold">€{campaign.cpc.toFixed(2)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">ROAS</p>
                        <p className={`font-semibold ${getPerformanceColor(campaign.performance)}`}>
                          {campaign.roas.toFixed(2)}x
                        </p>
                      </div>
                    </div>

                    {/* Budget Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Budget Utilization</span>
                        <span>{campaign.budgetUtilization.toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={campaign.budgetUtilization} 
                        className={`h-2 ${campaign.budgetUtilization > 90 ? 'bg-red-100' : 'bg-green-100'}`} 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        €{campaign.spend.toLocaleString()} / €{campaign.budget.toLocaleString()}
                      </p>
                    </div>

                    {/* Campaign Controls */}
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (campaign.status === 'active') {
                            realTimeEngine.pauseCampaign(campaign.id);
                            toast.success(`Campaign ${campaign.name} paused`);
                          } else {
                            realTimeEngine.resumeCampaign(campaign.id);
                            toast.success(`Campaign ${campaign.name} resumed`);
                          }
                        }}
                      >
                        {campaign.status === 'active' ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                        {campaign.status === 'active' ? 'Pause' : 'Resume'}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          realTimeEngine.increaseBudget(campaign.id, 500);
                          toast.success(`Budget increased by €500 for ${campaign.name}`);
                        }}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +€500 Budget
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Real-Time Event Stream
              </CardTitle>
              <CardDescription>Live campaign events και alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {events.map(event => (
                  <div key={event.id} className={`p-3 border rounded-lg ${getEventSeverityColor(event.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getPlatformIcon(event.platform)}</span>
                        <div>
                          <h4 className="font-medium text-sm">{event.type.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-xs text-muted-foreground">Campaign: {event.campaignId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${event.severity === 'high' ? 'bg-red-100 text-red-700' : 
                                           event.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                                           'bg-green-100 text-green-700'}`}>
                          {event.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(event.timestamp, 'HH:mm:ss')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm">{event.data.message}</p>
                    {event.actionRequired && (
                      <div className="mt-2">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Immediate action required για αυτό το event.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                ))}
                
                {events.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
                    <p className="text-muted-foreground">
                      {isStreaming ? 'Waiting for real-time events...' : 'Start streaming to see live events'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics Tab */}
        <TabsContent value="metrics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Live Metrics Dashboard
              </CardTitle>
              <CardDescription>Real-time campaign metrics με live updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.slice(0, 12).map((metric, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getPlatformIcon(metric.platform)}</span>
                        <span className="text-sm font-medium">{metric.metric.toUpperCase()}</span>
                      </div>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="text-xl font-bold">
                      {metric.metric === 'spend' || metric.metric === 'cpc' ? '€' : ''}
                      {metric.value.toLocaleString()}
                      {metric.metric === 'ctr' || metric.metric === 'roas' ? (metric.metric === 'ctr' ? '%' : 'x') : ''}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {metric.campaignName.slice(0, 20)}...
                      </span>
                      <span className={`font-medium ${metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                    {metric.alert && (
                      <Alert className="mt-2">
                        <AlertTriangle className="h-3 w-3" />
                        <AlertDescription className="text-xs">
                          {metric.alert.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mystery AI Tab */}
        <TabsContent value="mystery" className="space-y-6">
          <TestMystery />
        </TabsContent>
      </Tabs>
    </div>
  );
}