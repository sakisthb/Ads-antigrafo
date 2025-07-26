// WebSocket Real-Time Data Service
// Enterprise-Grade Real-Time Analytics με WebSocket connections
// 25+ Years Marketing Experience - Production-Ready Architecture

export interface WebSocketMessage {
  id: string;
  type: 'campaign_update' | 'metric_update' | 'alert' | 'attribution_update' | 'heartbeat' | 'connection_status';
  timestamp: Date;
  data: any;
  channel?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  source: string;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
  messageQueueSize: number;
  enableCompression: boolean;
  enableEncryption: boolean;
}

export interface SubscriptionFilter {
  channel?: string;
  messageType?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  source?: string;
}

export interface Subscription {
  id: string;
  filter: SubscriptionFilter;
  callback: (message: WebSocketMessage) => void;
  active: boolean;
  subscribed: Date;
  messagesReceived: number;
}

export class WebSocketRealTimeService {
  private static instance: WebSocketRealTimeService;
  private socket: WebSocket | null = null;
  private config: WebSocketConfig;
  private subscriptions: Map<string, Subscription> = new Map();
  private messageQueue: WebSocketMessage[] = [];
  private reconnectAttempts: number = 0;
  private isConnecting: boolean = false;
  private connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error' = 'disconnected';
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageBuffer: WebSocketMessage[] = [];
  private connectionId: string = '';
  private lastMessageTime: Date = new Date();
  private statusListeners: ((status: string) => void)[] = [];
  private messageStats = {
    sent: 0,
    received: 0,
    errors: 0,
    reconnections: 0
  };

  static getInstance(): WebSocketRealTimeService {
    if (!WebSocketRealTimeService.instance) {
      WebSocketRealTimeService.instance = new WebSocketRealTimeService();
    }
    return WebSocketRealTimeService.instance;
  }

  constructor() {
    this.config = {
      url: this.getWebSocketUrl(),
      reconnectInterval: 3000, // 3 seconds
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000, // 30 seconds
      messageQueueSize: 1000,
      enableCompression: true,
      enableEncryption: false // Set to true in production
    };

    // Auto-connect in development mode
    if (import.meta.env.DEV) {
      this.startSimulatedService();
    }
  }

  private getWebSocketUrl(): string {
    // In production, this would connect to your real WebSocket server
    // For development, we'll simulate the service
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws/analytics`;
  }

  // Simulated WebSocket service για development
  private startSimulatedService() {
    console.log('🚀 Starting simulated WebSocket real-time service...');
    this.connectionStatus = 'connecting';
    this.notifyStatusListeners();

    setTimeout(() => {
      this.connectionStatus = 'connected';
      this.connectionId = `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.notifyStatusListeners();
      this.startHeartbeat();
      this.startDataSimulation();
      console.log('✅ WebSocket simulated service connected:', this.connectionId);
    }, 2000);
  }

  private startDataSimulation() {
    // Simulate campaign updates every 5 seconds
    setInterval(() => {
      this.simulateCampaignUpdate();
    }, 5000);

    // Simulate metric updates every 2 seconds
    setInterval(() => {
      this.simulateMetricUpdate();
    }, 2000);

    // Simulate alerts randomly
    setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance
        this.simulateAlert();
      }
    }, 10000);

    // Simulate attribution updates every 30 seconds
    setInterval(() => {
      this.simulateAttributionUpdate();
    }, 30000);
  }

  private simulateCampaignUpdate() {
    const campaigns = ['meta_video_001', 'google_search_001', 'tiktok_ugc_001'];
    const selectedCampaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    
    const message: WebSocketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'campaign_update',
      timestamp: new Date(),
      data: {
        campaignId: selectedCampaign,
        metrics: {
          spend: Math.random() * 100 + 1000,
          impressions: Math.floor(Math.random() * 10000) + 50000,
          clicks: Math.floor(Math.random() * 500) + 1000,
          conversions: Math.floor(Math.random() * 50) + 10,
          roas: Math.random() * 3 + 2
        },
        budgetUtilization: Math.random() * 30 + 70,
        performance: Math.random() > 0.5 ? 'good' : 'excellent'
      },
      channel: 'campaigns',
      priority: 'medium',
      source: 'campaign_service'
    };

    this.processMessage(message);
  }

  private simulateMetricUpdate() {
    const metrics = ['ctr', 'cpc', 'roas', 'conversion_rate'];
    const platforms = ['meta', 'google', 'tiktok'];
    
    const message: WebSocketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'metric_update',
      timestamp: new Date(),
      data: {
        metric: metrics[Math.floor(Math.random() * metrics.length)],
        platform: platforms[Math.floor(Math.random() * platforms.length)],
        value: Math.random() * 10 + 1,
        change: (Math.random() - 0.5) * 20, // -10% to +10%
        trend: Math.random() > 0.6 ? 'up' : Math.random() > 0.3 ? 'down' : 'stable'
      },
      channel: 'metrics',
      priority: 'low',
      source: 'metrics_service'
    };

    this.processMessage(message);
  }

  private simulateAlert() {
    const alertTypes = ['budget_threshold', 'performance_drop', 'cost_spike', 'conversion_anomaly'];
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    
    const message: WebSocketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'alert',
      timestamp: new Date(),
      data: {
        alertType: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        campaignId: 'meta_video_001',
        message: 'CPC αυξήθηκε κατά 25% τα τελευταία 30 λεπτά',
        actionRequired: Math.random() > 0.5,
        affectedMetrics: ['cpc', 'roas'],
        recommendation: 'Consider pausing low-performing ad sets'
      },
      channel: 'alerts',
      priority: 'high',
      source: 'alert_service'
    };

    this.processMessage(message);
  }

  private simulateAttributionUpdate() {
    const message: WebSocketMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'attribution_update',
      timestamp: new Date(),
      data: {
        modelId: 'lstm_deep_attribution',
        accuracy: 0.89 + (Math.random() - 0.5) * 0.02,
        channelAttributions: {
          'meta': Math.random() * 0.4 + 0.2,
          'google': Math.random() * 0.3 + 0.15,
          'tiktok': Math.random() * 0.2 + 0.1,
          'email': Math.random() * 0.15 + 0.1
        },
        revenueImpact: Math.random() * 1000 + 5000,
        optimizationOpportunities: [
          'Increase Meta budget by 15%',
          'Optimize Google keyword bidding',
          'Test new TikTok creative formats'
        ]
      },
      channel: 'attribution',
      priority: 'medium',
      source: 'attribution_service'
    };

    this.processMessage(message);
  }

  private processMessage(message: WebSocketMessage) {
    this.messageStats.received++;
    this.lastMessageTime = new Date();
    
    // Add to message buffer
    this.messageBuffer.push(message);
    if (this.messageBuffer.length > this.config.messageQueueSize) {
      this.messageBuffer.shift(); // Remove oldest message
    }

    // Notify subscribers
    this.subscriptions.forEach(subscription => {
      if (this.matchesFilter(message, subscription.filter)) {
        subscription.messagesReceived++;
        try {
          subscription.callback(message);
        } catch (error) {
          console.error('Error in subscription callback:', error);
          this.messageStats.errors++;
        }
      }
    });
  }

  private matchesFilter(message: WebSocketMessage, filter: SubscriptionFilter): boolean {
    if (filter.channel && message.channel !== filter.channel) return false;
    if (filter.messageType && message.type !== filter.messageType) return false;
    if (filter.priority && message.priority !== filter.priority) return false;
    if (filter.source && message.source !== filter.source) return false;
    return true;
  }

  private startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      const heartbeat: WebSocketMessage = {
        id: `heartbeat_${Date.now()}`,
        type: 'heartbeat',
        timestamp: new Date(),
        data: {
          connectionId: this.connectionId,
          uptime: Date.now(),
          messageStats: this.messageStats
        },
        priority: 'low',
        source: 'websocket_service'
      };

      this.processMessage(heartbeat);
    }, this.config.heartbeatInterval);
  }

  private notifyStatusListeners() {
    this.statusListeners.forEach(listener => {
      try {
        listener(this.connectionStatus);
      } catch (error) {
        console.error('Error in status listener:', error);
      }
    });
  }

  // Public API Methods

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connectionStatus === 'connected') {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        const checkConnection = () => {
          if (this.connectionStatus === 'connected') {
            resolve();
          } else if (this.connectionStatus === 'error') {
            reject(new Error('Connection failed'));
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
        return;
      }

      // For development, use simulated service
      if (import.meta.env.DEV) {
        this.startSimulatedService();
        setTimeout(() => resolve(), 2500);
        return;
      }

      // Production WebSocket connection would go here
      this.isConnecting = true;
      this.connectionStatus = 'connecting';
      this.notifyStatusListeners();

      try {
        this.socket = new WebSocket(this.config.url);
        
        this.socket.onopen = () => {
          this.connectionStatus = 'connected';
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.connectionId = `conn_${Date.now()}`;
          this.startHeartbeat();
          this.notifyStatusListeners();
          console.log('✅ WebSocket connected:', this.connectionId);
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.processMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            this.messageStats.errors++;
          }
        };

        this.socket.onclose = () => {
          this.connectionStatus = 'disconnected';
          this.isConnecting = false;
          this.notifyStatusListeners();
          this.attemptReconnect();
        };

        this.socket.onerror = () => {
          this.connectionStatus = 'error';
          this.isConnecting = false;
          this.notifyStatusListeners();
          this.messageStats.errors++;
          reject(new Error('WebSocket connection error'));
        };

      } catch (error) {
        this.connectionStatus = 'error';
        this.isConnecting = false;
        this.notifyStatusListeners();
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.connectionStatus = 'disconnected';
    this.notifyStatusListeners();
    console.log('🔌 WebSocket disconnected');
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      this.connectionStatus = 'error';
      this.notifyStatusListeners();
      return;
    }

    this.reconnectAttempts++;
    this.messageStats.reconnections++;
    
    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.config.reconnectInterval);
  }

  public subscribe(filter: SubscriptionFilter, callback: (message: WebSocketMessage) => void): string {
    const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const subscription: Subscription = {
      id: subscriptionId,
      filter,
      callback,
      active: true,
      subscribed: new Date(),
      messagesReceived: 0
    };

    this.subscriptions.set(subscriptionId, subscription);
    
    console.log('📡 New subscription created:', {
      id: subscriptionId,
      filter,
      totalSubscriptions: this.subscriptions.size
    });

    return subscriptionId;
  }

  public unsubscribe(subscriptionId: string): boolean {
    const removed = this.subscriptions.delete(subscriptionId);
    if (removed) {
      console.log('📡 Subscription removed:', subscriptionId);
    }
    return removed;
  }

  public getConnectionStatus(): string {
    return this.connectionStatus;
  }

  public getConnectionId(): string {
    return this.connectionId;
  }

  public isConnected(): boolean {
    return this.connectionStatus === 'connected';
  }

  public getMessageStats() {
    return {
      ...this.messageStats,
      subscriptions: this.subscriptions.size,
      uptime: this.connectionId ? Date.now() - parseInt(this.connectionId.split('_')[1]) : 0,
      lastMessageTime: this.lastMessageTime,
      bufferSize: this.messageBuffer.length
    };
  }

  public getRecentMessages(limit: number = 50): WebSocketMessage[] {
    return this.messageBuffer.slice(-limit);
  }

  public onStatusChange(callback: (status: string) => void): () => void {
    this.statusListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.statusListeners.indexOf(callback);
      if (index > -1) {
        this.statusListeners.splice(index, 1);
      }
    };
  }

  public sendMessage(message: Omit<WebSocketMessage, 'id' | 'timestamp'>): boolean {
    if (!this.isConnected() || !this.socket) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    const fullMessage: WebSocketMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    try {
      this.socket.send(JSON.stringify(fullMessage));
      this.messageStats.sent++;
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      this.messageStats.errors++;
      return false;
    }
  }

  // Convenience methods για specific subscription types
  
  public subscribeToCampaignUpdates(callback: (data: any) => void): string {
    return this.subscribe(
      { channel: 'campaigns', messageType: 'campaign_update' },
      (message) => callback(message.data)
    );
  }

  public subscribeToMetricUpdates(callback: (data: any) => void): string {
    return this.subscribe(
      { channel: 'metrics', messageType: 'metric_update' },
      (message) => callback(message.data)
    );
  }

  public subscribeToAlerts(callback: (data: any) => void): string {
    return this.subscribe(
      { channel: 'alerts', messageType: 'alert' },
      (message) => callback(message.data)
    );
  }

  public subscribeToAttributionUpdates(callback: (data: any) => void): string {
    return this.subscribe(
      { channel: 'attribution', messageType: 'attribution_update' },
      (message) => callback(message.data)
    );
  }
}

// Export singleton instance
export const wsService = WebSocketRealTimeService.getInstance();