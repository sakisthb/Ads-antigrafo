-- Database optimization migrations for Ads Pro
-- Performance indexes for high-frequency queries

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Users table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_email 
ON users (email);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_created_at 
ON users (created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_status 
ON users (status) WHERE status = 'active';

-- Campaigns table indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_user_id 
ON campaigns (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_status 
ON campaigns (status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_created_at 
ON campaigns (created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_updated_at 
ON campaigns (updated_at DESC);

-- Composite index for common query patterns
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_user_status_date 
ON campaigns (user_id, status, created_at DESC);

-- Campaigns performance data indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaign_metrics_campaign_id 
ON campaign_metrics (campaign_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaign_metrics_date 
ON campaign_metrics (date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaign_metrics_campaign_date 
ON campaign_metrics (campaign_id, date DESC);

-- Analytics data indexes (for time-series queries)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_data_date_range 
ON analytics_data (date DESC, campaign_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_data_campaign_id 
ON analytics_data (campaign_id) 
WHERE date >= CURRENT_DATE - INTERVAL '90 days';

-- Partial index for recent data (last 30 days)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_recent 
ON analytics_data (campaign_id, date DESC, impressions, clicks, spend) 
WHERE date >= CURRENT_DATE - INTERVAL '30 days';

-- User sessions indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_user_id 
ON user_sessions (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_token 
ON user_sessions (token_hash);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_sessions_expires_at 
ON user_sessions (expires_at) 
WHERE expires_at > NOW();

-- Audit logs indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_user_id 
ON audit_logs (user_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_timestamp 
ON audit_logs (timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_audit_logs_action 
ON audit_logs (action);

-- API rate limiting indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_rate_limits_key_window 
ON rate_limits (rate_key, window_start);

-- GIN indexes for JSON columns (if any)
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_metadata_gin 
ON campaigns USING GIN (metadata) 
WHERE metadata IS NOT NULL;

-- Full-text search indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaigns_search 
ON campaigns USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Update table statistics
ANALYZE users;
ANALYZE campaigns;
ANALYZE campaign_metrics;
ANALYZE analytics_data;
ANALYZE user_sessions;
ANALYZE audit_logs;

-- Create materialized view for dashboard analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS dashboard_summary AS
SELECT 
    c.user_id,
    COUNT(c.id) as total_campaigns,
    COUNT(CASE WHEN c.status = 'ACTIVE' THEN 1 END) as active_campaigns,
    SUM(cm.spend) as total_spend,
    SUM(cm.impressions) as total_impressions,
    SUM(cm.clicks) as total_clicks,
    AVG(cm.ctr) as avg_ctr,
    MAX(cm.updated_at) as last_updated
FROM campaigns c
LEFT JOIN campaign_metrics cm ON c.id = cm.campaign_id
WHERE cm.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY c.user_id;

-- Index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_dashboard_summary_user_id 
ON dashboard_summary (user_id);

-- Refresh schedule for materialized view (to be set up in cron)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_summary;