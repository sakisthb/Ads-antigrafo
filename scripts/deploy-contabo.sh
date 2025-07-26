#!/bin/bash
set -e

# Deployment script for Contabo VPS - adpd.gr
# Run this from your local machine

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="${1:-YOUR_CONTABO_IP}"  # Replace with your Contabo IP
SERVER_USER="${2:-root}"
DOMAIN="adpd.gr"
PROJECT_DIR="/opt/adspro"

if [ "$SERVER_IP" = "YOUR_CONTABO_IP" ]; then
    echo -e "${RED}❌ Please provide your Contabo server IP${NC}"
    echo "Usage: $0 <server_ip> [username]"
    exit 1
fi

echo -e "${BLUE}🚀 Deploying Ads Pro to Contabo VPS (${SERVER_IP})${NC}"
echo "================================================="

# Test SSH connection
test_ssh() {
    echo -e "${YELLOW}🔍 Testing SSH connection...${NC}"
    if ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'SSH connection successful'"; then
        echo -e "${GREEN}✅ SSH connection established${NC}"
    else
        echo -e "${RED}❌ SSH connection failed${NC}"
        exit 1
    fi
}

# Prepare local build
prepare_build() {
    echo -e "${YELLOW}🔨 Preparing local build...${NC}"
    
    # Install dependencies
    pnpm install
    
    # Build frontend
    cd ui
    pnpm run build
    cd ..
    
    # Build API (if needed)
    if [ -d "api-server" ]; then
        cd api-server
        pnpm install
        pnpm run build
        cd ..
    fi
    
    echo -e "${GREEN}✅ Local build completed${NC}"
}

# Create deployment package
create_package() {
    echo -e "${YELLOW}📦 Creating deployment package...${NC}"
    
    # Create temporary directory
    TEMP_DIR=$(mktemp -d)
    PACKAGE_NAME="adspro-$(date +%Y%m%d_%H%M%S).tar.gz"
    
    # Copy necessary files
    cp -r ui/dist $TEMP_DIR/ui-dist
    cp -r api-server $TEMP_DIR/ 2>/dev/null || echo "No api-server directory"
    cp -r database-server $TEMP_DIR/ 2>/dev/null || echo "No database-server directory"
    cp docker-compose.production.yml $TEMP_DIR/
    cp redis.conf $TEMP_DIR/
    cp -r scripts $TEMP_DIR/
    cp .env.example $TEMP_DIR/
    
    # Create package
    cd $TEMP_DIR
    tar -czf /tmp/$PACKAGE_NAME .
    cd - > /dev/null
    
    # Cleanup
    rm -rf $TEMP_DIR
    
    echo -e "${GREEN}✅ Package created: /tmp/$PACKAGE_NAME${NC}"
    echo $PACKAGE_NAME
}

# Upload to server
upload_to_server() {
    local package_name=$1
    
    echo -e "${YELLOW}📤 Uploading to server...${NC}"
    
    # Create project directory on server
    ssh $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR"
    
    # Upload package
    scp /tmp/$package_name $SERVER_USER@$SERVER_IP:/tmp/
    
    # Extract on server
    ssh $SERVER_USER@$SERVER_IP "
        cd $PROJECT_DIR
        tar -xzf /tmp/$package_name
        rm /tmp/$package_name
    "
    
    # Cleanup local package
    rm /tmp/$package_name
    
    echo -e "${GREEN}✅ Files uploaded to server${NC}"
}

# Setup environment on server
setup_environment() {
    echo -e "${YELLOW}⚙️  Setting up environment on server...${NC}"
    
    ssh $SERVER_USER@$SERVER_IP "
        cd $PROJECT_DIR
        
        # Copy environment file if it doesn't exist
        if [ ! -f .env ]; then
            cp .env.example .env
            echo '✅ Created .env file - please edit with your values'
        fi
        
        # Set correct permissions
        chmod +x scripts/*.sh
        chmod 600 .env
        
        # Create necessary directories
        mkdir -p logs backups monitoring
        
        echo '✅ Environment setup completed'
    "
    
    echo -e "${GREEN}✅ Server environment configured${NC}"
}

# Deploy with Docker
deploy_application() {
    echo -e "${YELLOW}🐳 Deploying application...${NC}"
    
    ssh $SERVER_USER@$SERVER_IP "
        cd $PROJECT_DIR
        
        # Stop existing containers
        docker-compose -f docker-compose.production.yml down || true
        
        # Remove old images (optional)
        docker system prune -f
        
        # Build and start containers
        docker-compose -f docker-compose.production.yml up -d --build
        
        # Wait for services to start
        echo 'Waiting for services to start...'
        sleep 30
        
        # Check service health
        docker-compose -f docker-compose.production.yml ps
        
        echo '✅ Application deployed'
    "
    
    echo -e "${GREEN}✅ Application deployed successfully${NC}"
}

# Setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    ssh $SERVER_USER@$SERVER_IP "
        # Create monitoring directories
        mkdir -p $PROJECT_DIR/monitoring/{prometheus,grafana/provisioning,loki}
        
        # Create Prometheus config
        cat > $PROJECT_DIR/monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
  
  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
EOF
        
        # Setup log rotation
        cat > /etc/logrotate.d/adspro << EOF
$PROJECT_DIR/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF
        
        echo '✅ Monitoring configured'
    "
    
    echo -e "${GREEN}✅ Monitoring setup completed${NC}"
}

# Setup automated backups
setup_backups() {
    echo -e "${YELLOW}💾 Setting up automated backups...${NC}"
    
    ssh $SERVER_USER@$SERVER_IP "
        # Create backup directory
        mkdir -p $PROJECT_DIR/backups
        
        # Add backup cron job
        (crontab -l 2>/dev/null | grep -v 'adspro-backup'; echo '0 2 * * * cd $PROJECT_DIR && docker-compose -f docker-compose.production.yml run --rm backup') | crontab -
        
        # Test backup script
        chmod +x $PROJECT_DIR/scripts/backup.sh
        
        echo '✅ Automated backups configured (daily at 2 AM)'
    "
    
    echo -e "${GREEN}✅ Automated backups configured${NC}"
}

# Restart Nginx
restart_nginx() {
    echo -e "${YELLOW}🌐 Restarting Nginx...${NC}"
    
    ssh $SERVER_USER@$SERVER_IP "
        # Test Nginx configuration
        nginx -t
        
        # Restart Nginx
        systemctl restart nginx
        systemctl status nginx --no-pager -l
        
        echo '✅ Nginx restarted'
    "
    
    echo -e "${GREEN}✅ Nginx restarted successfully${NC}"
}

# Health check
health_check() {
    echo -e "${YELLOW}🔍 Running health checks...${NC}"
    
    # Wait a bit for services to fully start
    sleep 10
    
    echo "Checking frontend..."
    if curl -f -s https://$DOMAIN/health > /dev/null; then
        echo -e "${GREEN}✅ Frontend is healthy${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
    fi
    
    echo "Checking API..."
    if curl -f -s https://$DOMAIN/api/health > /dev/null; then
        echo -e "${GREEN}✅ API is healthy${NC}"
    else
        echo -e "${RED}❌ API health check failed${NC}"
    fi
    
    # Check SSL certificate
    echo "Checking SSL certificate..."
    if openssl s_client -connect $DOMAIN:443 -servername $DOMAIN < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
        echo -e "${GREEN}✅ SSL certificate is valid${NC}"
    else
        echo -e "${YELLOW}⚠️  SSL certificate issue detected${NC}"
    fi
}

# Main deployment function
main() {
    echo -e "${BLUE}Starting deployment to $DOMAIN...${NC}"
    
    test_ssh
    prepare_build
    PACKAGE_NAME=$(create_package)
    upload_to_server $PACKAGE_NAME
    setup_environment
    deploy_application
    setup_monitoring
    setup_backups
    restart_nginx
    health_check
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}Your application is now live at:${NC}"
    echo -e "${GREEN}🌐 https://$DOMAIN${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Edit $PROJECT_DIR/.env with your actual configuration"
    echo "2. Restart services: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose -f docker-compose.production.yml restart'"
    echo "3. Check logs: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose -f docker-compose.production.yml logs'"
    echo "4. Monitor services: https://$DOMAIN:3001 (Grafana dashboard)"
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        if [ $# -lt 2 ]; then
            echo "Usage: $0 deploy <server_ip> [username]"
            exit 1
        fi
        SERVER_IP=$2
        SERVER_USER=${3:-root}
        main
        ;;
    "health")
        health_check
        ;;
    "backup")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose -f docker-compose.production.yml run --rm backup"
        ;;
    *)
        echo "Usage: $0 [deploy|health|backup] <server_ip> [username]"
        exit 1
        ;;
esac