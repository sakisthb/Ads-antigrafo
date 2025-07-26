// WebSocket React Hook
// Enterprise-Grade Real-Time Data Hook για React Components
// 25+ Years Marketing Experience - Production-Ready

import { useState, useEffect, useRef, useCallback } from 'react';
import { wsService, WebSocketMessage, SubscriptionFilter } from '@/lib/websocket-service';

export interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnectOnMount?: boolean;
  filter?: SubscriptionFilter;
}

export interface UseWebSocketReturn {
  // Connection state
  isConnected: boolean;
  connectionStatus: string;
  connectionId: string;
  
  // Data
  messages: WebSocketMessage[];
  lastMessage: WebSocketMessage | null;
  messageCount: number;
  
  // Actions
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (message: Omit<WebSocketMessage, 'id' | 'timestamp'>) => boolean;
  
  // Stats
  stats: {
    sent: number;
    received: number;
    errors: number;
    reconnections: number;
    subscriptions: number;
    uptime: number;
    bufferSize: number;
    lastMessageTime: Date;
  };
  
  // Error handling
  error: string | null;
  clearError: () => void;
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const {
    autoConnect = true,
    reconnectOnMount = true,
    filter = {}
  } = options;

  // State
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [connectionId, setConnectionId] = useState('');
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [stats, setStats] = useState({
    sent: 0,
    received: 0,
    errors: 0,
    reconnections: 0,
    subscriptions: 0,
    uptime: 0,
    bufferSize: 0,
    lastMessageTime: new Date()
  });
  const [error, setError] = useState<string | null>(null);

  // Refs
  const subscriptionRef = useRef<string | null>(null);
  const statusUnsubscribeRef = useRef<(() => void) | null>(null);
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Message handler
  const handleMessage = useCallback((message: WebSocketMessage) => {
    setMessages(prev => {
      const newMessages = [message, ...prev].slice(0, 100); // Keep last 100 messages
      return newMessages;
    });
    setLastMessage(message);
    setMessageCount(prev => prev + 1);
    
    // Update last message time
    setStats(prev => ({
      ...prev,
      lastMessageTime: message.timestamp
    }));
  }, []);

  // Status change handler
  const handleStatusChange = useCallback((status: string) => {
    setConnectionStatus(status);
    setIsConnected(status === 'connected');
    setConnectionId(wsService.getConnectionId());
    
    if (status === 'connected') {
      setError(null);
    } else if (status === 'error') {
      setError('WebSocket connection error');
    }
  }, []);

  // Connection functions
  const connect = useCallback(async () => {
    try {
      setError(null);
      await wsService.connect();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const disconnect = useCallback(() => {
    wsService.disconnect();
  }, []);

  const sendMessage = useCallback((message: Omit<WebSocketMessage, 'id' | 'timestamp'>) => {
    const success = wsService.sendMessage(message);
    if (success) {
      setStats(prev => ({ ...prev, sent: prev.sent + 1 }));
    } else {
      setStats(prev => ({ ...prev, errors: prev.errors + 1 }));
      setError('Failed to send message');
    }
    return success;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update stats periodically
  const updateStats = useCallback(() => {
    const currentStats = wsService.getMessageStats();
    setStats(currentStats);
  }, []);

  // Setup and cleanup
  useEffect(() => {
    // Subscribe to status changes
    statusUnsubscribeRef.current = wsService.onStatusChange(handleStatusChange);
    
    // Subscribe to messages with filter
    subscriptionRef.current = wsService.subscribe(filter, handleMessage);
    
    // Start stats update interval
    statsIntervalRef.current = setInterval(updateStats, 5000); // Update every 5 seconds
    
    // Initial stats update
    updateStats();
    
    // Initial status
    handleStatusChange(wsService.getConnectionStatus());
    
    // Auto-connect if enabled
    if (autoConnect && !wsService.isConnected()) {
      connect().catch(err => {
        console.error('Auto-connect failed:', err);
      });
    }

    // Cleanup function
    return () => {
      if (subscriptionRef.current) {
        wsService.unsubscribe(subscriptionRef.current);
      }
      
      if (statusUnsubscribeRef.current) {
        statusUnsubscribeRef.current();
      }
      
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    };
  }, [autoConnect, filter, handleMessage, handleStatusChange, connect, updateStats]);

  // Reconnect on mount if requested
  useEffect(() => {
    if (reconnectOnMount && !wsService.isConnected()) {
      connect().catch(err => {
        console.error('Reconnect on mount failed:', err);
      });
    }
  }, [reconnectOnMount, connect]);

  return {
    // Connection state
    isConnected,
    connectionStatus,
    connectionId,
    
    // Data
    messages,
    lastMessage,
    messageCount,
    
    // Actions
    connect,
    disconnect,
    sendMessage,
    
    // Stats
    stats,
    
    // Error handling
    error,
    clearError
  };
}

// Specialized hooks για specific data types

export function useCampaignUpdates() {
  return useWebSocket({
    filter: { channel: 'campaigns', messageType: 'campaign_update' },
    autoConnect: true
  });
}

export function useMetricUpdates() {
  return useWebSocket({
    filter: { channel: 'metrics', messageType: 'metric_update' },
    autoConnect: true
  });
}

export function useAlerts() {
  return useWebSocket({
    filter: { channel: 'alerts', messageType: 'alert' },
    autoConnect: true
  });
}

export function useAttributionUpdates() {
  return useWebSocket({
    filter: { channel: 'attribution', messageType: 'attribution_update' },
    autoConnect: true
  });
}

export function useRealTimeData() {
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [metricData, setMetricData] = useState<any[]>([]);
  const [alertData, setAlertData] = useState<any[]>([]);
  const [attributionData, setAttributionData] = useState<any>(null);

  const campaigns = useCampaignUpdates();
  const metrics = useMetricUpdates();
  const alerts = useAlerts();
  const attribution = useAttributionUpdates();

  // Update campaign data
  useEffect(() => {
    if (campaigns.lastMessage?.data) {
      setCampaignData(prev => {
        const updated = [...prev];
        const index = updated.findIndex(c => c.campaignId === campaigns.lastMessage?.data.campaignId);
        
        if (index >= 0) {
          updated[index] = { ...updated[index], ...campaigns.lastMessage?.data };
        } else {
          updated.push(campaigns.lastMessage?.data);
        }
        
        return updated.slice(0, 50); // Keep last 50 campaign updates
      });
    }
  }, [campaigns.lastMessage]);

  // Update metric data
  useEffect(() => {
    if (metrics.lastMessage?.data) {
      setMetricData(prev => [metrics.lastMessage?.data, ...prev].slice(0, 100));
    }
  }, [metrics.lastMessage]);

  // Update alert data
  useEffect(() => {
    if (alerts.lastMessage?.data) {
      setAlertData(prev => [alerts.lastMessage?.data, ...prev].slice(0, 20));
    }
  }, [alerts.lastMessage]);

  // Update attribution data
  useEffect(() => {
    if (attribution.lastMessage?.data) {
      setAttributionData(attribution.lastMessage?.data);
    }
  }, [attribution.lastMessage]);

  const isConnected = campaigns.isConnected || metrics.isConnected || alerts.isConnected || attribution.isConnected;
  const connectionStatus = campaigns.connectionStatus;

  return {
    // Connection state
    isConnected,
    connectionStatus,
    
    // Data
    campaignData,
    metricData,
    alertData,
    attributionData,
    
    // Individual hook returns για advanced usage
    campaigns,
    metrics,
    alerts,
    attribution,
    
    // Combined stats
    totalMessages: campaigns.messageCount + metrics.messageCount + alerts.messageCount + attribution.messageCount,
    
    // Actions
    connect: campaigns.connect,
    disconnect: campaigns.disconnect,
    
    // Errors
    errors: [
      campaigns.error,
      metrics.error,
      alerts.error,
      attribution.error
    ].filter(Boolean)
  };
}