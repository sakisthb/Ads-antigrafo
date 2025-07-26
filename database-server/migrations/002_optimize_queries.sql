-- Query optimization for Ads Pro
-- Custom functions and optimizations for frequently used queries

-- Function to get campaign performance summary
CREATE OR REPLACE FUNCTION get_campaign_performance(
    p_user_id UUID,
    p_date_from DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    campaign_id UUID,
    campaign_name VARCHAR,
    total_spend DECIMAL,
    total_impressions BIGINT,
    total_clicks BIGINT,
    avg_ctr DECIMAL,
    avg_cpc DECIMAL,
    conversions BIGINT,
    roas DECIMAL
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id as campaign_id,
        c.name as campaign_name,
        COALESCE(SUM(cm.spend), 0) as total_spend,
        COALESCE(SUM(cm.impressions), 0) as total_impressions,
        COALESCE(SUM(cm.clicks), 0) as total_clicks,
        CASE 
            WHEN SUM(cm.impressions) > 0 
            THEN ROUND((SUM(cm.clicks)::DECIMAL / SUM(cm.impressions)) * 100, 2)
            ELSE 0 
        END as avg_ctr,
        CASE 
            WHEN SUM(cm.clicks) > 0 
            THEN ROUND(SUM(cm.spend) / SUM(cm.clicks), 2)
            ELSE 0 
        END as avg_cpc,
        COALESCE(SUM(cm.conversions), 0) as conversions,
        CASE 
            WHEN SUM(cm.spend) > 0 
            THEN ROUND(SUM(cm.revenue) / SUM(cm.spend), 2)
            ELSE 0 
        END as roas
    FROM campaigns c
    LEFT JOIN campaign_metrics cm ON c.id = cm.campaign_id
        AND cm.date BETWEEN p_date_from AND p_date_to
    WHERE c.user_id = p_user_id
    GROUP BY c.id, c.name
    ORDER BY total_spend DESC;
END;
$$;

-- Function to get user dashboard data efficiently
CREATE OR REPLACE FUNCTION get_user_dashboard(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'summary', (
            SELECT json_build_object(
                'total_campaigns', COUNT(*),
                'active_campaigns', COUNT(*) FILTER (WHERE status = 'ACTIVE'),
                'total_spend', COALESCE(SUM(
                    SELECT SUM(spend) 
                    FROM campaign_metrics cm 
                    WHERE cm.campaign_id = c.id 
                    AND cm.date >= CURRENT_DATE - INTERVAL '30 days'
                ), 0),
                'total_impressions', COALESCE(SUM(
                    SELECT SUM(impressions) 
                    FROM campaign_metrics cm 
                    WHERE cm.campaign_id = c.id 
                    AND cm.date >= CURRENT_DATE - INTERVAL '30 days'
                ), 0)
            )
            FROM campaigns c 
            WHERE c.user_id = p_user_id
        ),
        'recent_campaigns', (
            SELECT json_agg(
                json_build_object(
                    'id', id,
                    'name', name,
                    'status', status,
                    'created_at', created_at
                ) ORDER BY created_at DESC
            )
            FROM campaigns 
            WHERE user_id = p_user_id 
            LIMIT 5
        ),
        'performance_trend', (
            SELECT json_agg(
                json_build_object(
                    'date', date,
                    'spend', daily_spend,
                    'impressions', daily_impressions,
                    'clicks', daily_clicks
                ) ORDER BY date DESC
            )
            FROM (
                SELECT 
                    cm.date,
                    SUM(cm.spend) as daily_spend,
                    SUM(cm.impressions) as daily_impressions,
                    SUM(cm.clicks) as daily_clicks
                FROM campaign_metrics cm
                JOIN campaigns c ON cm.campaign_id = c.id
                WHERE c.user_id = p_user_id
                AND cm.date >= CURRENT_DATE - INTERVAL '7 days'
                GROUP BY cm.date
                ORDER BY cm.date DESC
                LIMIT 7
            ) trend_data
        )
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Optimized view for campaign analytics
CREATE OR REPLACE VIEW campaign_analytics_view AS
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.user_id,
    c.created_at,
    -- Latest metrics (last 7 days)
    (
        SELECT json_build_object(
            'spend', SUM(spend),
            'impressions', SUM(impressions),
            'clicks', SUM(clicks),
            'conversions', SUM(conversions),
            'ctr', CASE WHEN SUM(impressions) > 0 THEN ROUND((SUM(clicks)::DECIMAL / SUM(impressions)) * 100, 2) ELSE 0 END,
            'cpc', CASE WHEN SUM(clicks) > 0 THEN ROUND(SUM(spend) / SUM(clicks), 2) ELSE 0 END,
            'cpa', CASE WHEN SUM(conversions) > 0 THEN ROUND(SUM(spend) / SUM(conversions), 2) ELSE 0 END
        )
        FROM campaign_metrics cm
        WHERE cm.campaign_id = c.id
        AND cm.date >= CURRENT_DATE - INTERVAL '7 days'
    ) as metrics_7d,
    -- Previous period for comparison (8-14 days ago)
    (
        SELECT json_build_object(
            'spend', SUM(spend),
            'impressions', SUM(impressions),
            'clicks', SUM(clicks),
            'conversions', SUM(conversions)
        )
        FROM campaign_metrics cm
        WHERE cm.campaign_id = c.id
        AND cm.date BETWEEN CURRENT_DATE - INTERVAL '14 days' AND CURRENT_DATE - INTERVAL '8 days'
    ) as metrics_prev_7d
FROM campaigns c;

-- Indexes for the new functions and views
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_campaign_metrics_user_date
ON campaign_metrics (
    (SELECT user_id FROM campaigns WHERE id = campaign_id),
    date DESC
);

-- Partitioning setup for analytics_data (if table grows large)
-- This is for future scaling when data volume increases

-- Create partition function
CREATE OR REPLACE FUNCTION create_monthly_partition(table_name TEXT, start_date DATE)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    partition_name TEXT;
    end_date DATE;
BEGIN
    partition_name := table_name || '_' || to_char(start_date, 'YYYY_MM');
    end_date := start_date + INTERVAL '1 month';
    
    EXECUTE format('
        CREATE TABLE IF NOT EXISTS %I 
        PARTITION OF %I
        FOR VALUES FROM (%L) TO (%L)',
        partition_name, table_name, start_date, end_date
    );
    
    -- Create indexes on partition
    EXECUTE format('
        CREATE INDEX IF NOT EXISTS %I ON %I (campaign_id, date DESC)',
        'idx_' || partition_name || '_campaign_date',
        partition_name
    );
END;
$$;

-- Query performance monitoring
CREATE OR REPLACE FUNCTION get_slow_queries()
RETURNS TABLE (
    query TEXT,
    calls BIGINT,
    total_time DOUBLE PRECISION,
    mean_time DOUBLE PRECISION,
    stddev_time DOUBLE PRECISION,
    rows BIGINT
)
LANGUAGE SQL
AS $$
    SELECT 
        query,
        calls,
        total_exec_time as total_time,
        mean_exec_time as mean_time,
        stddev_exec_time as stddev_time,
        rows
    FROM pg_stat_statements
    WHERE calls > 10
    ORDER BY mean_exec_time DESC
    LIMIT 20;
$$;

-- Database maintenance function
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Clean up old sessions (older than 30 days)
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() - INTERVAL '30 days';
    
    -- Clean up old audit logs (older than 1 year)
    DELETE FROM audit_logs 
    WHERE timestamp < NOW() - INTERVAL '1 year';
    
    -- Clean up old rate limit entries (older than 1 day)
    DELETE FROM rate_limits 
    WHERE window_start < NOW() - INTERVAL '1 day';
    
    -- Update table statistics
    ANALYZE;
    
    RAISE NOTICE 'Cleanup completed successfully';
END;
$$;

-- Create a function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_dashboard_views()
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_summary;
    RAISE NOTICE 'Dashboard views refreshed successfully';
END;
$$;

-- Performance monitoring view
CREATE OR REPLACE VIEW database_performance AS
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation,
    most_common_vals,
    most_common_freqs
FROM pg_stats
WHERE schemaname = 'public'
AND tablename IN ('campaigns', 'campaign_metrics', 'analytics_data', 'users')
ORDER BY tablename, attname;