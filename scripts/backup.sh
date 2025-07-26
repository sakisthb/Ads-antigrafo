#!/bin/bash
set -e

# Backup script for adpd.gr - Ads Pro
# Backs up PostgreSQL database and Redis data

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

echo "🗄️  Starting backup process for adpd.gr..."

# Create backup directory
mkdir -p $BACKUP_DIR

# PostgreSQL backup
echo "📊 Backing up PostgreSQL database..."
pg_dump -h postgres -U $POSTGRES_USER -d $POSTGRES_DB > "$BACKUP_DIR/postgres_backup_$DATE.sql"

# Compress PostgreSQL backup
gzip "$BACKUP_DIR/postgres_backup_$DATE.sql"

echo "✅ PostgreSQL backup completed: postgres_backup_$DATE.sql.gz"

# Redis backup (if Redis container is accessible)
echo "🗃️  Backing up Redis data..."
if redis-cli -h redis ping > /dev/null 2>&1; then
    redis-cli -h redis --rdb "$BACKUP_DIR/redis_backup_$DATE.rdb"
    gzip "$BACKUP_DIR/redis_backup_$DATE.rdb"
    echo "✅ Redis backup completed: redis_backup_$DATE.rdb.gz"
else
    echo "⚠️  Redis not accessible, skipping Redis backup"
fi

# Application files backup (if needed)
echo "📁 Backing up application configuration..."
tar -czf "$BACKUP_DIR/app_config_$DATE.tar.gz" \
    /opt/adspro/.env \
    /opt/adspro/docker-compose.production.yml \
    /etc/nginx/sites-available/adpd.gr \
    /etc/letsencrypt/live/adpd.gr/ 2>/dev/null || echo "Some files not found, continuing..."

# Clean up old backups
echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -name "*.gz" -type f -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete

# Create backup summary
echo "📋 Creating backup summary..."
cat > "$BACKUP_DIR/backup_summary_$DATE.txt" << EOF
Backup Summary - adpd.gr Ads Pro
Date: $(date)
Backup ID: $DATE

Files created:
$(ls -la $BACKUP_DIR/*$DATE*)

Database Size: $(du -h $BACKUP_DIR/postgres_backup_$DATE.sql.gz 2>/dev/null | cut -f1 || echo "N/A")
Redis Size: $(du -h $BACKUP_DIR/redis_backup_$DATE.rdb.gz 2>/dev/null | cut -f1 || echo "N/A")
Config Size: $(du -h $BACKUP_DIR/app_config_$DATE.tar.gz 2>/dev/null | cut -f1 || echo "N/A")

Total backup space used: $(du -sh $BACKUP_DIR | cut -f1)
EOF

echo "✅ Backup process completed successfully!"
echo "📁 Backup location: $BACKUP_DIR"
echo "🆔 Backup ID: $DATE"

# Optional: Send backup notification (uncomment if you have configured email/slack)
# curl -X POST -H 'Content-type: application/json' \
#     --data "{\"text\":\"✅ adpd.gr backup completed successfully - ID: $DATE\"}" \
#     $SLACK_WEBHOOK_URL