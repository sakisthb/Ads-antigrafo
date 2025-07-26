import { useState, useEffect, useRef, useCallback } from 'react';

export interface RealTimeMetrics {
  campaigns: {
    active: number;
    paused: number;
  };
  performance: {
    impressions: number;
    clicks: number;
    ctr: string;
    cpc: string;
    roas: string;
  };
  spend: {
    today: number;
    yesterday: number;
    thisMonth: number;
  };
  alerts: Array<{
    id: string;
    type: 'performance' | 'budget' | 'system';
    message: string;
    severity: 'info' | 'warning' | 'critical';
    timestamp: string;
  }>;
  timestamp: string;
  connectionId?: string;
}

export interface RealTimeConnection {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  metrics: RealTimeMetrics | null;
  error: string | null;
  connectionId: string | null;
  lastUpdate: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

export const useRealTimeMetrics = (userId?: string) => {
  const [connection, setConnection] = useState<RealTimeConnection>({
    status: 'disconnected',
    metrics: null,
    error: null,
    connectionId: null,
    lastUpdate: null
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setConnection(prev => ({ ...prev, status: 'connecting', error: null }));

    try {
      const url = `${API_BASE_URL}/api/v1/realtime/metrics${userId ? `?userId=${userId}` : ''}`;
      console.log('🔴 Connecting to real-time metrics:', url);
      
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('🟢 Real-time metrics connected');
        setConnection(prev => ({ 
          ...prev, 
          status: 'connected', 
          error: null 
        }));
        reconnectAttemptsRef.current = 0;
      };

      eventSource.addEventListener('connected', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('🔗 Connection established:', data);
          setConnection(prev => ({
            ...prev,
            connectionId: data.connectionId,
            lastUpdate: data.timestamp
          }));
        } catch (error) {
          console.error('Error parsing connection data:', error);
        }
      });

      eventSource.addEventListener('metrics-update', (event) => {
        try {
          const metrics: RealTimeMetrics = JSON.parse(event.data);
          console.log('📊 Metrics update received:', metrics);
          
          setConnection(prev => ({
            ...prev,
            metrics,
            lastUpdate: metrics.timestamp,
            connectionId: metrics.connectionId || prev.connectionId
          }));
        } catch (error) {
          console.error('Error parsing metrics data:', error);
          setConnection(prev => ({
            ...prev,
            error: 'Failed to parse metrics data'
          }));
        }
      });

      eventSource.onerror = (error) => {
        console.error('🔴 Real-time metrics error:', error);
        setConnection(prev => ({ 
          ...prev, 
          status: 'error',
          error: 'Connection error occurred'
        }));

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          console.log(`🔄 Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectDelay);
        } else {
          console.error('❌ Max reconnection attempts reached');
          setConnection(prev => ({ 
            ...prev, 
            status: 'disconnected',
            error: 'Max reconnection attempts reached'
          }));
        }
      };

    } catch (error) {
      console.error('Failed to create EventSource:', error);
      setConnection(prev => ({ 
        ...prev, 
        status: 'error',
        error: 'Failed to create connection'
      }));
    }
  }, [userId]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnection(prev => ({ 
      ...prev, 
      status: 'disconnected',
      error: null 
    }));
    
    console.log('🔴 Real-time metrics disconnected');
  }, []);

  const startDemo = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/realtime/start-demo`);
      const result = await response.json();
      console.log('🎮 Demo started:', result);
      return result;
    } catch (error) {
      console.error('Failed to start demo:', error);
      throw error;
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    // Start demo data
    const timer = setTimeout(() => {
      startDemo().catch(console.error);
    }, 1000);

    return () => {
      disconnect();
      clearTimeout(timer);
    };
  }, [connect, disconnect, startDemo]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...connection,
    connect,
    disconnect,
    startDemo,
    isConnected: connection.status === 'connected',
    isConnecting: connection.status === 'connecting',
    hasError: connection.status === 'error'
  };
};