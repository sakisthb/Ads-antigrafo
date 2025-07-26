import 'dotenv/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { authMiddleware } from './middleware/auth';
import { getDatabase, testDatabaseConnection } from './lib/db';
import { setEnvContext, clearEnvContext, getDatabaseUrl } from './lib/env';
import * as schema from './schema/users';
import { facebookTokens } from './schema/facebook_tokens';
import { eq } from 'drizzle-orm';
import { streamSSE } from 'hono/streaming';

type Env = {
  RUNTIME?: string;
  [key: string]: any;
};

const app = new Hono<{ Bindings: Env }>();

// In Node.js environment, set environment context from process.env
if (typeof process !== 'undefined' && process.env) {
  setEnvContext(process.env);
}

// Environment context middleware - detect runtime using RUNTIME env var
app.use('*', async (c, next) => {
  if (c.env?.RUNTIME === 'cloudflare') {
    setEnvContext(c.env);
  }
  
  await next();
  // No need to clear context - env vars are the same for all requests
  // In fact, clearing the context would cause the env vars to potentially be unset for parallel requests
});

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check route - public
app.get('/', (c) => c.json({ status: 'ok', message: 'API is running' }));

// Facebook API proxy routes - secure backend proxy for Facebook Graph API
const facebookRoutes = new Hono();

// Rate limiting for Facebook API calls
const facebookRateLimiter = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10; // Conservative limit

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = facebookRateLimiter.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    facebookRateLimiter.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

// Safe Facebook API call wrapper
const safeFacebookAPICall = async (url: string, userId: string): Promise<any> => {
  if (!checkRateLimit(userId)) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Ads-Pro-Platform/1.0',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Facebook API error:', response.status, errorText);
      
      // Handle specific Facebook errors
      if (response.status === 429) {
        throw new Error('Facebook rate limit exceeded. Please try again later.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Please check your Facebook permissions.');
      } else if (response.status === 400) {
        throw new Error('Invalid request to Facebook API.');
      }
      
      throw new Error(`Facebook API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    // Check for Facebook API errors in response
    if (data.error) {
      console.error('Facebook API error response:', data.error);
      
      // Handle specific Facebook error codes
      if (data.error.code === 4) {
        throw new Error('Facebook API rate limit exceeded.');
      } else if (data.error.code === 190) {
        throw new Error('Invalid or expired access token.');
      } else if (data.error.code === 100) {
        throw new Error('Invalid parameter in Facebook API request.');
      }
      
      throw new Error(`Facebook API error: ${data.error.message || 'Unknown error'}`);
    }
    
    return data;
  } catch (error) {
    console.error('Safe Facebook API call error:', error);
    throw error;
  }
};

// Get Facebook access token from environment or user session
const getFacebookAccessToken = async (c: any): Promise<string | null> => {
  // First try to get from authenticated user's database record
  const user = c.get('user');
  if (user && user.id) {
    try {
      const db = await getDatabase();
      const tokenRecord = await db.select().from(facebookTokens).where(eq(facebookTokens.user_id, user.id)).limit(1);
      if (tokenRecord.length > 0) {
        const token = tokenRecord[0];
        // Check if token is expired
        if (new Date() < token.expires_at) {
          return token.access_token;
        } else {
          // Token expired, try to refresh it
          return await refreshFacebookToken(c, user.id, token.access_token);
        }
      }
    } catch (error) {
      console.error('Error getting Facebook token from database:', error);
    }
  }
  
  // Fallback to environment variable (for admin/system use)
  return process.env.FACEBOOK_ACCESS_TOKEN || null;
};

// Helper function to refresh Facebook token
const refreshFacebookToken = async (c: any, userId: string, oldToken: string): Promise<string | null> => {
  try {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    
    if (!appId || !appSecret) {
      console.error('Facebook app credentials not configured for token refresh');
      return null;
    }

    // Facebook doesn't provide refresh tokens, so we need to re-authenticate
    // For now, we'll return null to trigger re-authentication
    console.log('Facebook token expired, re-authentication required');
    return null;
  } catch (error) {
    console.error('Error refreshing Facebook token:', error);
    return null;
  }
};

// Test Facebook connection
facebookRoutes.get('/test', async (c) => {
  const user = c.get('user');
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
    if (!adAccountId) {
      return c.json({ error: 'Facebook Ad Account ID not configured' }, 500);
    }

    // Test by fetching campaigns with safe API call
    const url = `https://graph.facebook.com/v19.0/act_${adAccountId.replace('act_', '')}/campaigns?fields=id,name&limit=1&access_token=${accessToken}`;
    const data = await safeFacebookAPICall(url, user?.id || 'system');

    return c.json({
      success: true,
      message: 'Facebook connection successful',
      campaignsCount: data.data?.length || 0
    });

  } catch (error) {
    console.error('Facebook test error:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to test Facebook connection' 
    }, 500);
  }
});

// Proxy route for Facebook campaigns
facebookRoutes.get('/campaigns', async (c) => {
  const user = c.get('user');
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
    if (!adAccountId) {
      return c.json({ error: 'Facebook Ad Account ID not configured' }, 500);
    }

    const fields = c.req.query('fields') || 'id,name,status,objective,created_time,updated_time,start_time,stop_time,daily_budget,lifetime_budget,budget_remaining,spend_cap';
    const url = `https://graph.facebook.com/v19.0/act_${adAccountId.replace('act_', '')}/campaigns?fields=${fields}&access_token=${accessToken}`;
    
    const data = await safeFacebookAPICall(url, user?.id || 'system');
    return c.json(data);

  } catch (error) {
    console.error('Facebook campaigns error:', error);
    return c.json({ error: 'Failed to fetch campaigns' }, 500);
  }
});

// Proxy route for Facebook campaign insights
facebookRoutes.get('/campaigns/:campaignId/insights', async (c) => {
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const campaignId = c.req.param('campaignId');
    const fields = c.req.query('fields') || 'impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,actions,date_start,date_stop';
    const dateRange = c.req.query('date_range') || 'last_30d';
    
    const url = `https://graph.facebook.com/v19.0/${campaignId}/insights?fields=${fields}&time_range={"${dateRange}":""}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.error) {
      return c.json({ error: 'Facebook API error', details: data.error }, 400);
    }

    return c.json(data);

  } catch (error) {
    console.error('Facebook insights error:', error);
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

// Proxy route for Facebook ad sets
facebookRoutes.get('/campaigns/:campaignId/adsets', async (c) => {
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const campaignId = c.req.param('campaignId');
    const fields = c.req.query('fields') || 'id,name,status,daily_budget,lifetime_budget,targeting,optimization_goal,billing_event,bid_amount';
    
    const url = `https://graph.facebook.com/v19.0/${campaignId}/adsets?fields=${fields}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.error) {
      return c.json({ error: 'Facebook API error', details: data.error }, 400);
    }

    return c.json(data);

  } catch (error) {
    console.error('Facebook ad sets error:', error);
    return c.json({ error: 'Failed to fetch ad sets' }, 500);
  }
});

// Proxy route for Facebook ads
facebookRoutes.get('/adsets/:adSetId/ads', async (c) => {
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const adSetId = c.req.param('adSetId');
    const fields = c.req.query('fields') || 'id,name,status,creative,created_time,updated_time';
    
    const url = `https://graph.facebook.com/v19.0/${adSetId}/ads?fields=${fields}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.error) {
      return c.json({ error: 'Facebook API error', details: data.error }, 400);
    }

    return c.json(data);

  } catch (error) {
    console.error('Facebook ads error:', error);
    return c.json({ error: 'Failed to fetch ads' }, 500);
  }
});

// Proxy route for account-level insights
facebookRoutes.get('/account/insights', async (c) => {
  const accessToken = await getFacebookAccessToken(c);
  if (!accessToken) {
    return c.json({ error: 'Facebook access token not available' }, 401);
  }

  try {
    const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
    if (!adAccountId) {
      return c.json({ error: 'Facebook Ad Account ID not configured' }, 500);
    }

    const fields = c.req.query('fields') || 'campaign_id,impressions,clicks,spend,reach,frequency,ctr,cpc,cpm,actions,date_start,date_stop';
    const dateRange = c.req.query('date_range') || 'last_30d';
    
    const url = `https://graph.facebook.com/v19.0/act_${adAccountId.replace('act_', '')}/insights?fields=${fields}&time_range={"${dateRange}":""}&access_token=${accessToken}`;
    
    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.error) {
      return c.json({ error: 'Facebook API error', details: data.error }, 400);
    }

    return c.json(data);

  } catch (error) {
    console.error('Facebook account insights error:', error);
    return c.json({ error: 'Failed to fetch account insights' }, 500);
  }
});

// Facebook OAuth callback handler
facebookRoutes.get('/oauth/callback', async (c) => {
  const { code, state } = c.req.query();
  // Require authentication
  const user = c.get('user');
  if (!user || !user.id) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  if (!code) {
    return c.json({ error: 'Authorization code not provided' }, 400);
  }

  try {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const redirectUri = process.env.FACEBOOK_REDIRECT_URI || `${c.req.header('origin')}/api/v1/facebook/oauth/callback`;

    if (!appId || !appSecret) {
      return c.json({ error: 'Facebook app credentials not configured' }, 500);
    }

    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?` +
      `client_id=${appId}&` +
      `client_secret=${appSecret}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `code=${code}`;

    const response = await fetch(tokenUrl);
    const tokenData = await response.json() as any;

    if (tokenData.error) {
      return c.json({ error: 'Failed to exchange code for token', details: tokenData.error }, 400);
    }

    // Store token in database
    const db = await getDatabase();
    const expiresAt = new Date(Date.now() + (tokenData.expires_in || 60 * 60 * 2) * 1000); // expires_in in seconds
    await db.insert(facebookTokens).values({
      user_id: user.id,
      access_token: tokenData.access_token,
      expires_at: expiresAt,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return c.json({
      success: true,
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in
    });

  } catch (error) {
    console.error('Facebook OAuth error:', error);
    return c.json({ error: 'OAuth exchange failed' }, 500);
  }
});

// Refresh Facebook token endpoint
facebookRoutes.post('/refresh-token', async (c) => {
  const user = c.get('user');
  if (!user || !user.id) {
    return c.json({ error: 'Authentication required' }, 401);
  }

  try {
    const db = await getDatabase();
    const tokenRecord = await db.select().from(facebookTokens).where(eq(facebookTokens.user_id, user.id)).limit(1);
    
    if (tokenRecord.length === 0) {
      return c.json({ error: 'No Facebook token found for user' }, 404);
    }

    const token = tokenRecord[0];
    const refreshedToken = await refreshFacebookToken(c, user.id, token.access_token);
    
    if (refreshedToken) {
      // Update token in database
      const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 60 * 1000); // 60 days
      await db.update(facebookTokens)
        .set({
          access_token: refreshedToken,
          expires_at: expiresAt,
          updated_at: new Date(),
        })
        .where(eq(facebookTokens.user_id, user.id));

      return c.json({ success: true, message: 'Token refreshed successfully' });
    } else {
      return c.json({ error: 'Token refresh failed, re-authentication required' }, 401);
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return c.json({ error: 'Failed to refresh token' }, 500);
  }
});

// API routes
const api = new Hono();

// Public routes go here (if any)
api.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  });
});

// Database test route - public for testing
api.get('/db-test', async (c) => {
  try {
    // Use external DB URL if available, otherwise use local PostgreSQL database server
    // Note: In development, the port is dynamically allocated by port-manager.js
    const defaultLocalConnection = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5502/postgres';
    const dbUrl = getDatabaseUrl() || defaultLocalConnection;
    
    const db = await getDatabase(dbUrl);
    const isHealthy = await testDatabaseConnection();
    
    if (!isHealthy) {
      return c.json({
        error: 'Database connection is not healthy',
        timestamp: new Date().toISOString(),
      }, 500);
    }
    
    const result = await db.select().from(schema.users).limit(5);
    
    return c.json({
      message: 'Database connection successful!',
      users: result,
      connectionHealthy: isHealthy,
      usingLocalDatabase: !getDatabaseUrl(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return c.json({
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, 500);
  }
});

// Protected routes - require authentication
const protectedRoutes = new Hono();

protectedRoutes.use('*', authMiddleware);

protectedRoutes.get('/me', (c) => {
  const user = c.get('user');
  return c.json({
    user,
    message: 'You are authenticated!',
  });
});

// Mount Facebook routes
api.route('/facebook', facebookRoutes);

// Mount the protected routes under /protected
api.route('/protected', protectedRoutes);

// Real-Time Data Pipeline - Server-Sent Events
const realTimeRoutes = new Hono();

// Store active SSE connections
const activeConnections = new Map<string, { stream: any; userId: string }>();

// Real-time metrics endpoint
realTimeRoutes.get('/metrics', async (c) => {
  // For demo purposes, no authentication required
  // In production, add authentication here
  const connectionId = crypto.randomUUID();
  const userId = c.req.query('userId') || 'demo';
  
  return streamSSE(c, async (stream) => {
    console.log(`🔴 SSE: New connection ${connectionId} for user ${userId}`);
    
    // Store connection
    activeConnections.set(connectionId, { 
      stream: stream, 
      userId 
    });
    
    // Send initial connection message
    await stream.writeSSE({
      event: 'connected',
      data: JSON.stringify({ 
        connectionId, 
        timestamp: new Date().toISOString(),
        message: 'Real-time metrics stream connected' 
      })
    });
    
    // Cleanup on connection close
    c.req.raw.signal.addEventListener('abort', () => {
      console.log(`🔴 SSE: Connection ${connectionId} closed`);
      activeConnections.delete(connectionId);
    });
  });
});

// Endpoint to broadcast metrics to all connected clients
realTimeRoutes.post('/broadcast-metrics', async (c) => {
  try {
    const metricsData = await c.req.json();
    const timestamp = new Date().toISOString();
    
    // Broadcast to all active connections
    const broadcastPromises = Array.from(activeConnections.entries()).map(async ([connectionId, connection]) => {
      try {
        await connection.stream.writeSSE({
          event: 'metrics-update',
          data: JSON.stringify({
            ...metricsData,
            timestamp,
            connectionId
          })
        });
      } catch (error) {
        console.error(`Failed to send to connection ${connectionId}:`, error);
        // Remove failed connection
        activeConnections.delete(connectionId);
      }
    });
    
    await Promise.all(broadcastPromises);
    
    return c.json({
      success: true,
      activeConnections: activeConnections.size,
      broadcastAt: timestamp
    });
  } catch (error) {
    console.error('Broadcast error:', error);
    return c.json({ error: 'Failed to broadcast metrics' }, 500);
  }
});

// Simulate real-time data for demo purposes
realTimeRoutes.get('/start-demo', async (c) => {
  const demoInterval = setInterval(async () => {
    if (activeConnections.size === 0) {
      clearInterval(demoInterval);
      return;
    }
    
    // Generate realistic demo metrics
    const demoMetrics = {
      campaigns: {
        active: Math.floor(Math.random() * 10) + 15,
        paused: Math.floor(Math.random() * 5) + 2
      },
      performance: {
        impressions: Math.floor(Math.random() * 50000) + 100000,
        clicks: Math.floor(Math.random() * 2000) + 5000,
        ctr: (Math.random() * 2 + 1.5).toFixed(2),
        cpc: (Math.random() * 0.5 + 0.3).toFixed(2),
        roas: (Math.random() * 2 + 3.5).toFixed(2)
      },
      spend: {
        today: Math.floor(Math.random() * 1000) + 2000,
        yesterday: Math.floor(Math.random() * 1000) + 1800,
        thisMonth: Math.floor(Math.random() * 10000) + 45000
      },
      alerts: Math.random() > 0.8 ? [
        {
          id: crypto.randomUUID(),
          type: 'performance',
          message: 'CPC increased by 15% in last hour',
          severity: 'warning',
          timestamp: new Date().toISOString()
        }
      ] : []
    };
    
    // Broadcast to all connections
    const broadcastPromises = Array.from(activeConnections.entries()).map(async ([connectionId, connection]) => {
      try {
        await connection.stream.writeSSE({
          event: 'metrics-update',
          data: JSON.stringify({
            ...demoMetrics,
            timestamp: new Date().toISOString(),
            connectionId
          })
        });
      } catch (error) {
        console.error(`Failed to send demo data to ${connectionId}:`, error);
        activeConnections.delete(connectionId);
      }
    });
    
    await Promise.all(broadcastPromises);
  }, 3000); // Update every 3 seconds
  
  return c.json({ 
    message: 'Demo real-time data started',
    updateInterval: '3 seconds'
  });
});

// Mount real-time routes
api.route('/realtime', realTimeRoutes);

// Mount the API router
app.route('/api/v1', api);

export default app; 