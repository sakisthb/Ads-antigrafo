// WebSocket Monitor Page
// Enterprise WebSocket Connection Monitoring και Debugging
// 25+ Years Marketing Experience - Production-Ready

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Network, 
  Activity, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  RefreshCw,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Database,
  Wifi,
  WifiOff,
  Download,
  Eye,
  Filter,
  Info
} from "lucide-react";
import { useWebSocket } from '@/hooks/use-websocket';
import { WebSocketConnectionStatus } from '@/components/websocket-connection-status';
import { format } from 'date-fns';
import { toast } from 'sonner';

export function WebSocketMonitor() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  // Check if we're in development mode
  const isDevMode = import.meta.env.DEV;
  
  // Create demo data for development mode
  const demoMessages = [
    {
      id: 'demo-1',
      type: 'campaign_update' as const,
      timestamp: new Date(Date.now() - 5000),
      data: { campaignId: 'camp_123', status: 'active', spend: 150.50 },
      channel: 'campaigns',
      priority: 'medium' as const,
      source: 'campaign_service'
    },
    {
      id: 'demo-2', 
      type: 'metric_update' as const,
      timestamp: new Date(Date.now() - 10000),
      data: { metric: 'ctr', value: 2.45, campaignId: 'camp_123' },
      channel: 'metrics',
      priority: 'low' as const,
      source: 'analytics_engine'
    },
    {
      id: 'demo-3',
      type: 'alert' as const,
      timestamp: new Date(Date.now() - 15000),
      data: { type: 'budget_exceeded', campaignId: 'camp_456', threshold: 200 },
      channel: 'alerts',
      priority: 'high' as const,
      source: 'alert_manager'
    }
  ];

  // Use WebSocket hook only if not in dev mode
  let hookResult;
  if (isDevMode) {
    hookResult = {
      isConnected: false,
      connectionStatus: 'demo_mode',
      connectionId: 'demo-connection-123',
      messages: demoMessages,
      lastMessage: demoMessages[0],
      messageCount: demoMessages.length,
      stats: {
        sent: 5,
        received: 12,
        errors: 0,
        reconnections: 2,
        subscriptions: 4,
        uptime: 120000,
        bufferSize: demoMessages.length,
        lastMessageTime: demoMessages[0].timestamp
      },
      error: null,
      connect: () => Promise.resolve(),
      disconnect: () => {},
      sendMessage: () => true,
      clearError: () => {}
    };
  } else {
    try {
      hookResult = useWebSocket();
    } catch (error) {
      console.error('WebSocket hook failed:', error);
      hookResult = {
        isConnected: false,
        connectionStatus: 'error',
        connectionId: '',
        messages: [],
        lastMessage: null,
        messageCount: 0,
        stats: {
          sent: 0,
          received: 0,
          errors: 1,
          reconnections: 0,
          subscriptions: 0,
          uptime: 0,
          bufferSize: 0,
          lastMessageTime: new Date()
        },
        error: 'WebSocket service initialization failed',
        connect: () => Promise.resolve(),
        disconnect: () => {},
        sendMessage: () => false,
        clearError: () => {}
      };
    }
  }

  const {
    isConnected,
    connectionStatus,
    connectionId,
    messages,
    lastMessage,
    messageCount,
    stats,
    error,
    connect,
    disconnect,
    sendMessage,
    clearError
  } = hookResult;

  const [testMessage, setTestMessage] = useState('');

  const filteredMessages = messages.filter(msg => {
    if (selectedFilter === 'all') return true;
    return msg.type === selectedFilter || msg.channel === selectedFilter;
  });

  const uniqueTypes = [...new Set(messages.map(m => m.type))];
  const uniqueChannels = [...new Set(messages.map(m => m.channel).filter(Boolean))];

  const handleSendTestMessage = () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    const success = sendMessage({
      type: 'test',
      data: { message: testMessage, timestamp: new Date() },
      priority: 'low',
      source: 'monitor_page'
    });

    if (success) {
      toast.success('Test message sent!');
      setTestMessage('');
    } else {
      toast.error('Failed to send test message');
    }
  };

  const handleDownloadLogs = () => {
    const logs = messages.map(msg => ({
      timestamp: msg.timestamp,
      type: msg.type,
      channel: msg.channel,
      priority: msg.priority,
      source: msg.source,
      data: msg.data
    }));

    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-logs-${format(new Date(), 'yyyy-MM-dd-HH-mm-ss')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('WebSocket logs downloaded!');
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'campaign_update': return 'bg-blue-100 text-blue-800';
      case 'metric_update': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'attribution_update': return 'bg-purple-100 text-purple-800';
      case 'heartbeat': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Network className="w-8 h-8 text-blue-600" />
            WebSocket Monitor
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Enterprise Debug
            </Badge>
          </h1>
          <p className="text-muted-foreground">
            Real-time WebSocket connection monitoring, message debugging και performance analysis
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleDownloadLogs} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download Logs
          </Button>
          
          <Button onClick={() => window.location.reload()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Development Mode Notice */}
      {connectionStatus === 'demo_mode' && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Development Demo Mode:</strong> WebSocket service is not running in development. 
            This page shows demo data to preview the monitoring interface used in production environments.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status Overview */}
      <WebSocketConnectionStatus 
        showDetails={true}
        showControls={true}
        compact={false}
      />

      {/* Main Monitor Tabs */}
      <Tabs defaultValue="messages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="messages">Message Stream</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="debug">Debug Tools</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* Message Stream Tab */}
        <TabsContent value="messages" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Message Type</h4>
                  <div className="space-y-1">
                    <Button
                      variant={selectedFilter === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedFilter('all')}
                    >
                      All Messages ({messages.length})
                    </Button>
                    {uniqueTypes.map((type: string) => (
                      <Button
                        key={type}
                        variant={selectedFilter === type ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter(type)}
                      >
                        {type.replace('_', ' ')} ({messages.filter(m => m.type === type).length})
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Channels</h4>
                  <div className="space-y-1">
                    {uniqueChannels.map((channel: string) => (
                      <Button
                        key={channel}
                        variant={selectedFilter === channel ? 'default' : 'ghost'}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setSelectedFilter(channel)}
                      >
                        {channel} ({messages.filter(m => m.channel === channel).length})
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Message List */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Live Message Stream
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {isConnected && (
                        <Badge className="bg-green-100 text-green-700">
                          <Activity className="w-3 h-3 mr-1 animate-pulse" />
                          Live
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {filteredMessages.length} messages
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-3">
                      {filteredMessages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium mb-2">No Messages</h3>
                          <p className="text-muted-foreground">
                            {isConnected ? 'Waiting for messages...' : 'Connect to start receiving messages'}
                          </p>
                        </div>
                      ) : (
                        filteredMessages.map((message, index) => (
                          <div key={message.id} className="p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getMessageTypeColor(message.type)}>
                                  {message.type}
                                </Badge>
                                {message.channel && (
                                  <Badge variant="outline">{message.channel}</Badge>
                                )}
                                <span className={`text-xs font-medium ${getPriorityColor(message.priority)}`}>
                                  {message.priority.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-muted-foreground">
                                  {format(message.timestamp, 'HH:mm:ss.SSS')}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {message.source}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-sm">
                              <strong>ID:</strong> {message.id}
                            </div>
                            
                            {/* Message Data Preview */}
                            <details className="mt-2">
                              <summary className="text-sm font-medium cursor-pointer hover:text-blue-600">
                                View Data
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                                {JSON.stringify(message.data, null, 2)}
                              </pre>
                            </details>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Received</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.received.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Total since connection
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <Zap className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.sent.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Outbound messages
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Errors</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.errors}</div>
                <p className="text-xs text-muted-foreground">
                  Connection errors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reconnections</CardTitle>
                <RefreshCw className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.reconnections}</div>
                <p className="text-xs text-muted-foreground">
                  Auto-reconnects
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Message Type Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Message Type Distribution</CardTitle>
              <CardDescription>Breakdown of received messages by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uniqueTypes.map((type: string) => {
                  const count = messages.filter(m => m.type === type).length;
                  const percentage = (count / messages.length) * 100;
                  
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getMessageTypeColor(type)}>{type}</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Debug Tools Tab */}
        <TabsContent value="debug" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Send Test Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Send Test Message
                </CardTitle>
                <CardDescription>Send custom messages για testing WebSocket functionality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Test Message Content</label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter test message content..."
                    className="w-full mt-1 p-2 border rounded-md"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleSendTestMessage}
                  disabled={!isConnected || !testMessage.trim()}
                  className="w-full"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Send Test Message
                </Button>
                
                {!isConnected && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      WebSocket must be connected to send test messages
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Connection Debug Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Connection Debug Info
                </CardTitle>
                <CardDescription>Detailed connection information για debugging</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connection ID:</span>
                    <span className="font-mono">{connectionId || 'Not connected'}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge className={isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {connectionStatus}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buffer Size:</span>
                    <span>{stats.bufferSize} messages</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subscriptions:</span>
                    <span>{stats.subscriptions} active</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Message:</span>
                    <span>
                      {stats.lastMessageTime ? format(stats.lastMessageTime, 'HH:mm:ss') : 'None'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span>
                      {stats.uptime > 0 ? `${Math.floor(stats.uptime / 1000)}s` : 'Not connected'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Details */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>WebSocket Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                WebSocket Configuration
              </CardTitle>
              <CardDescription>Current WebSocket service configuration και settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Connection Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">URL:</span>
                      <span className="font-mono">ws://localhost:5501/ws/analytics</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auto-Connect:</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reconnect Interval:</span>
                      <span>3000ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Reconnects:</span>
                      <span>10 attempts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Heartbeat:</span>
                      <span>30s interval</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Performance Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Message Queue Size:</span>
                      <span>1000 messages</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compression:</span>
                      <Badge className="bg-blue-100 text-blue-700">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encryption:</span>
                      <Badge className="bg-yellow-100 text-yellow-700">Development Mode</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Environment:</span>
                      <Badge variant="outline">Development</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}