-- Database Performance Monitoring Queries for Ads Pro
-- Use these queries to monitor and optimize database performance

-- 1. Index Usage Statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    ROUND(
        CASE WHEN idx_tup_read > 0 
        THEN (idx_tup_fetch::FLOAT / idx_tup_read) * 100 
        ELSE 0 END, 2
    ) as hit_ratio_percent
FROM pg_stat_user_indexes 
ORDER BY idx_tup_read DESC;

-- 2. Table Size and Statistics
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    ROUND((n_dead_tup::FLOAT / GREATEST(n_live_tup, 1)) * 100, 2) as dead_row_percent
FROM pg_stat_user_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 3. Slow Queries (requires pg_stat_statements extension)
SELECT 
    LEFT(query, 100) as query_snippet,
    calls,
    ROUND(total_exec_time::NUMERIC, 2) as total_time_ms,
    ROUND(mean_exec_time::NUMERIC, 2) as avg_time_ms,
    ROUND((100 * total_exec_time / sum(total_exec_time) OVER())::NUMERIC, 2) as percent_total_time,
    rows
FROM pg_stat_statements 
WHERE calls > 5
ORDER BY mean_exec_time DESC 
LIMIT 20;

-- 4. Lock Monitoring
SELECT 
    l.locktype,
    l.database,
    l.relation::regclass as table_name,
    l.mode,
    l.granted,
    a.application_name,
    a.client_addr,
    a.state,
    a.query_start,
    LEFT(a.query, 100) as query_snippet
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT l.granted
ORDER BY l.relation;

-- 5. Connection Statistics
SELECT 
    datname as database,
    numbackends as connections,
    xact_commit as commits,
    xact_rollback as rollbacks,
    ROUND((xact_rollback::FLOAT / GREATEST(xact_commit + xact_rollback, 1)) * 100, 2) as rollback_percent,
    blks_read as disk_reads,
    blks_hit as cache_hits,
    ROUND((blks_hit::FLOAT / GREATEST(blks_hit + blks_read, 1)) * 100, 2) as cache_hit_ratio
FROM pg_stat_database 
WHERE datname = current_database();

-- 6. Buffer Cache Hit Ratio
SELECT 
    'Buffer Cache Hit Ratio' as metric,
    ROUND(
        (sum(heap_blks_hit) / GREATEST(sum(heap_blks_hit + heap_blks_read), 1)) * 100, 2
    ) as percentage
FROM pg_statio_user_tables;

-- 7. Index Hit Ratio
SELECT 
    'Index Hit Ratio' as metric,
    ROUND(
        (sum(idx_blks_hit) / GREATEST(sum(idx_blks_hit + idx_blks_read), 1)) * 100, 2
    ) as percentage
FROM pg_statio_user_indexes;

-- 8. Unused Indexes (potential candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes 
WHERE idx_tup_read = 0 
AND idx_tup_fetch = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- 9. Most Updated Tables
SELECT 
    schemaname,
    tablename,
    n_tup_ins + n_tup_upd + n_tup_del as total_operations,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables 
ORDER BY total_operations DESC;

-- 10. Vacuum and Analyze Recommendations
SELECT 
    schemaname,
    tablename,
    n_dead_tup,
    n_live_tup,
    ROUND((n_dead_tup::FLOAT / GREATEST(n_live_tup, 1)) * 100, 2) as dead_row_percent,
    last_vacuum,
    last_autovacuum,
    CASE 
        WHEN n_dead_tup > n_live_tup * 0.1 THEN 'VACUUM RECOMMENDED'
        WHEN n_dead_tup > n_live_tup * 0.05 THEN 'VACUUM SUGGESTED'
        ELSE 'OK'
    END as vacuum_recommendation,
    last_analyze,
    last_autoanalyze,
    CASE 
        WHEN last_analyze < NOW() - INTERVAL '7 days' 
        OR last_autoanalyze < NOW() - INTERVAL '7 days' 
        THEN 'ANALYZE RECOMMENDED'
        ELSE 'OK'
    END as analyze_recommendation
FROM pg_stat_user_tables 
WHERE n_dead_tup > 0
ORDER BY dead_row_percent DESC;

-- 11. Database Bloat Estimation
WITH constants AS (
    SELECT current_setting('block_size')::numeric AS bs, 23 AS hdr, 4 AS ma
), no_stats AS (
    SELECT table_schema, table_name, 
        n_live_tup::numeric as est_rows,
        pg_table_size(c.oid)::numeric as table_size
    FROM information_schema.columns
    JOIN pg_class c ON c.relname = table_name
    JOIN pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_stat_user_tables t ON c.oid = t.relid
    WHERE n.nspname = table_schema
    AND c.relkind = 'r'
), null_frac AS (
    SELECT 
        ns.table_schema, ns.table_name,
        ns.est_rows, ns.table_size,
        COALESCE(1-(1-SUM(GREATEST(avg_width, 4) * (1-null_frac)))/SUM(GREATEST(avg_width, 4)), 0) AS null_frac
    FROM no_stats ns
    JOIN pg_stats s ON s.schemaname = ns.table_schema AND s.tablename = ns.table_name
    GROUP BY 1,2,3,4
), estimates AS (
    SELECT table_schema, table_name, est_rows, table_size,
        CEIL((bs*(hdr+ma)-23)/bs) +
        CEIL((est_rows*((4+4+4+8+8+8+8)+hdr+ma-(CASE WHEN hdr%ma=0 THEN ma ELSE hdr%ma END)))/bs) as expected_pages
    FROM null_frac, constants
)
SELECT 
    table_schema,
    table_name,
    pg_size_pretty(table_size) as table_size,
    est_rows,
    expected_pages,
    CASE WHEN table_size > 0 
         THEN ROUND((table_size - expected_pages*bs)::numeric/table_size*100, 2) 
         ELSE 0 END as bloat_percent,
    pg_size_pretty((table_size - expected_pages*bs)::bigint) as bloat_size
FROM estimates, constants
WHERE table_size > 0
ORDER BY bloat_percent DESC;

-- 12. Top Tables by Activity
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del,
    ROUND((idx_scan::FLOAT / GREATEST(seq_scan + idx_scan, 1)) * 100, 2) as index_usage_percent
FROM pg_stat_user_tables 
ORDER BY seq_scan + idx_scan DESC
LIMIT 20;

-- 13. Wait Events (PostgreSQL 9.6+)
SELECT 
    wait_event_type,
    wait_event,
    COUNT(*) as waiting_processes,
    AVG(EXTRACT(epoch FROM (now() - query_start))) as avg_wait_time_seconds
FROM pg_stat_activity 
WHERE wait_event IS NOT NULL
GROUP BY wait_event_type, wait_event
ORDER BY waiting_processes DESC;

-- 14. Query to find missing indexes (based on sequential scans)
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    seq_tup_read / seq_scan as avg_seq_read,
    idx_scan,
    CASE 
        WHEN seq_scan > 1000 AND seq_tup_read / seq_scan > 1000 
        THEN 'Consider adding index'
        WHEN seq_scan > 100 AND seq_tup_read / seq_scan > 10000 
        THEN 'Definitely needs index'
        ELSE 'OK'
    END as recommendation
FROM pg_stat_user_tables 
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC;

-- 15. Current Running Queries
SELECT 
    pid,
    application_name,
    client_addr,
    state,
    EXTRACT(epoch FROM (now() - query_start)) as runtime_seconds,
    LEFT(query, 200) as query_snippet
FROM pg_stat_activity 
WHERE state = 'active'
AND query NOT LIKE '%pg_stat_activity%'
ORDER BY runtime_seconds DESC;