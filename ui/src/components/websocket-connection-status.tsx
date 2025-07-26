// WebSocket Connection Status Component
// Real-Time Connection Monitoring για Enterprise Analytics
// 25+ Years Marketing Experience - Production-Ready

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Wifi, 
  WifiOff, 
  Activity, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap,
  Network,
  Clock,
  BarChart3,
  TrendingUp,
  Settings
} from "lucide-react";
import { useWebSocket } from '@/hooks/use-websocket';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

interface WebSocketConnectionStatusProps {
  showDetails?: boolean;
  showControls?: boolean;
  compact?: boolean;
  className?: string;
}

export function WebSocketConnectionStatus({ 
  showDetails = true, 
  showControls = true, 
  compact = false,
  className = ""
}: WebSocketConnectionStatusProps) {
  // Try to use WebSocket hook with error handling
  let hookResult;
  try {
    hookResult = useWebSocket();
  } catch (error) {
    console.warn('WebSocketConnectionStatus: WebSocket hook failed, using demo mode:', error);
    hookResult = {
      isConnected: false,
      connectionStatus: 'demo_mode',
      connectionId: 'demo-connection-123',
      stats: {
        sent: 0,
        received: 0,
        errors: 0,
        reconnections: 0,
        subscriptions: 0,
        uptime: 0,
        bufferSize: 0,
        lastMessageTime: new Date()
      },
      error: 'WebSocket service not available in development mode',
      connect: () => Promise.resolve(),
      disconnect: () => {},
      clearError: () => {}
    };
  }

  const {
    isConnected,
    connectionStatus,
    connectionId,
    stats,
    error,
    connect,
    disconnect,
    clearError
  } = hookResult;

  const [uptime, setUptime] = useState('');

  // Update uptime display
  useEffect(() => {
    if (stats.uptime > 0) {
      const uptimeDate = new Date(Date.now() - stats.uptime);
      setUptime(formatDistanceToNow(uptimeDate, { addSuffix: false }));
    }
  }, [stats.uptime]);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-700';
      case 'connecting': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-600" />;
      case 'connecting': return <RefreshCw className="h-4 w-4 animate-spin text-yellow-600" />;
      case 'error': return <WifiOff className="h-4 w-4 text-red-600" />;
      default: return <WifiOff className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
      toast.success('🚀 WebSocket connected successfully!');
    } catch (err) {
      toast.error('❌ Failed to connect WebSocket');
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('🔌 WebSocket disconnected');
  };

  const handleClearError = () => {
    clearError();
    toast.success('Error cleared');
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon()}
        <Badge className={getStatusBadgeColor()}>
          {connectionStatus}
        </Badge>
        {isConnected && (
          <span className="text-xs text-muted-foreground">
            {stats.received} msgs
          </span>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            <CardTitle className="text-lg">WebSocket Connection</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getStatusBadgeColor()}>
              {connectionStatus}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Real-time data connection status και performance metrics
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button size="sm" variant="outline" onClick={handleClearError}>
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Details */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connection ID:</span>
                <span className="text-sm font-mono">
                  {connectionId || 'Not connected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime:</span>
                <span className="text-sm">
                  {uptime || 'Not connected'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Message:</span>
                <span className="text-sm">
                  {stats.lastMessageTime ? formatDistanceToNow(stats.lastMessageTime, { addSuffix: true }) : 'None'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages Received:</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {stats.received.toLocaleString()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Messages Sent:</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {stats.sent.toLocaleString()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subscriptions:</span>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  {stats.subscriptions}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {showDetails && isConnected && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-green-600">{stats.received}</div>
                <div className="text-muted-foreground">Messages Received</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-blue-600">{stats.errors}</div>
                <div className="text-muted-foreground">Errors</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{stats.reconnections}</div>
                <div className="text-muted-foreground">Reconnections</div>
              </div>
            </div>

            {/* Buffer Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Message Buffer:</span>
                <span>{stats.bufferSize} / 1000</span>
              </div>
              <Progress value={(stats.bufferSize / 1000) * 100} className="h-2" />
            </div>
          </div>
        )}

        {/* Connection Controls */}
        {showControls && (
          <div className="flex items-center gap-2 pt-4 border-t">
            {!isConnected ? (
              <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                <Wifi className="h-4 w-4 mr-2" />
                Connect
              </Button>
            ) : (
              <Button onClick={handleDisconnect} variant="outline">
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            )}
            
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>

            {isConnected && (
              <Badge className="bg-green-100 text-green-700 ml-auto">
                <Activity className="h-3 w-3 mr-1 animate-pulse" />
                Live
              </Badge>
            )}
          </div>
        )}

        {/* Real-time Indicator */}
        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>
              <strong>Real-time data streaming active</strong>
              <br />
              Receiving live campaign updates, metrics, και alerts από το analytics engine.
            </AlertDescription>
          </Alert>
        )}

        {/* Disconnected State Info */}
        {!isConnected && connectionStatus === 'disconnected' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Real-time features disabled</strong>
              <br />
              Connect to receive live campaign updates και real-time analytics data.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}