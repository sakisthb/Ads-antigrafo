// Data Source Switcher Component
// Demo/Live mode toggle with connection status

import React from 'react';
import { useDataSource } from '@/contexts/DataSourceContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Database, 
  Zap, 
  Settings, 
  ChevronDown,
  Wifi,
  WifiOff,
  Play,
  Square
} from 'lucide-react';

export function DataSourceSwitcher() {
  const { 
    state, 
    setDemoMode, 
    switchToSource, 
    showConnectionModal,
    hasConnections,
    canSwitchToLive
  } = useDataSource();

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'demo':
        return <Play className="h-4 w-4" />;
      case 'woocommerce':
        return <Database className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'demo':
        return 'Demo Mode';
      case 'woocommerce':
        return 'WooCommerce';
      case 'facebook':
        return 'Facebook Ads';
      case 'google':
        return 'Google Ads';
      case 'shopify':
        return 'Shopify';
      case 'tiktok':
        return 'TikTok Ads';
      default:
        return source;
    }
  };

  const getStatusBadge = () => {
    if (state.demoMode) {
      return (
        <Badge variant="secondary" className="ml-2">
          Demo
        </Badge>
      );
    }

    if (state.activeConnection) {
      return (
        <Badge variant="default" className="ml-2 bg-green-500">
          <Wifi className="h-3 w-3 mr-1" />
          Live
        </Badge>
      );
    }

    return (
      <Badge variant="destructive" className="ml-2">
        <WifiOff className="h-3 w-3 mr-1" />
        Offline
      </Badge>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 min-w-[160px]"
          disabled={state.isLoading}
        >
          {getSourceIcon(state.currentSource)}
          <span className="flex-1 text-left">
            {getSourceLabel(state.currentSource)}
          </span>
          {getStatusBadge()}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Data Sources
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {/* Demo Mode */}
        <DropdownMenuItem
          onClick={() => setDemoMode(true)}
          className={`flex items-center gap-2 ${state.demoMode ? 'bg-muted' : ''}`}
        >
          <Play className="h-4 w-4" />
          <div className="flex-1">
            <div className="font-medium">Demo Mode</div>
            <div className="text-xs text-muted-foreground">
              Sample data for exploration
            </div>
          </div>
          {state.demoMode && (
            <Badge variant="secondary" className="text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Connected Sources
        </DropdownMenuLabel>

        {/* Connected Sources */}
        {state.connections
          .filter(conn => conn.status === 'connected')
          .map(connection => (
            <DropdownMenuItem
              key={connection.id}
              onClick={() => switchToSource(connection.platform)}
              className={`flex items-center gap-2 ${
                state.activeConnection?.id === connection.id ? 'bg-muted' : ''
              }`}
            >
              {getSourceIcon(connection.platform)}
              <div className="flex-1">
                <div className="font-medium">{connection.displayName}</div>
                <div className="text-xs text-muted-foreground">
                  Last sync: {connection.lastSync?.toLocaleTimeString() || 'Never'}
                </div>
              </div>
              {state.activeConnection?.id === connection.id && (
                <Badge variant="default" className="text-xs bg-green-500">
                  <Wifi className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
            </DropdownMenuItem>
          ))}

        {/* No connections message */}
        {!hasConnections() && (
          <DropdownMenuItem disabled className="text-muted-foreground">
            <Square className="h-4 w-4 mr-2" />
            No connections available
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        
        {/* Manage Connections */}
        <DropdownMenuItem
          onClick={() => showConnectionModal(true)}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Manage Connections
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick Demo/Live Toggle (for header/navigation)
export function QuickDataToggle() {
  const { state, setDemoMode, canSwitchToLive } = useDataSource();

  if (!canSwitchToLive()) {
    return null; // Don't show toggle if no connections
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={state.demoMode ? "default" : "outline"}
        size="sm"
        onClick={() => setDemoMode(true)}
        className="text-xs"
      >
        <Play className="h-3 w-3 mr-1" />
        Demo
      </Button>
      <Button
        variant={!state.demoMode ? "default" : "outline"}
        size="sm"
        onClick={() => setDemoMode(false)}
        className="text-xs"
        disabled={!canSwitchToLive()}
      >
        <Wifi className="h-3 w-3 mr-1" />
        Live
      </Button>
    </div>
  );
}

// Data Source Status Indicator (for dashboard)
export function DataSourceStatus() {
  const { state } = useDataSource();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {state.demoMode ? (
        <>
          <Play className="h-4 w-4 text-blue-500" />
          <span>Demo Data</span>
          <Badge variant="secondary" className="text-xs">
            Sample
          </Badge>
        </>
      ) : state.activeConnection ? (
        <>
          <Wifi className="h-4 w-4 text-green-500" />
          <span>Live from {state.activeConnection.displayName}</span>
          <Badge variant="default" className="text-xs bg-green-500">
            Connected
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-red-500" />
          <span>No Data Source</span>
          <Badge variant="destructive" className="text-xs">
            Offline
          </Badge>
        </>
      )}
      
      {state.lastSync && !state.demoMode && (
        <span className="text-xs">
          • Updated {state.lastSync.toLocaleTimeString()}
        </span>
      )}
      
      {state.error && (
        <Badge variant="destructive" className="text-xs">
          Error
        </Badge>
      )}
    </div>
  );
}