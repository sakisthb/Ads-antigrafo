#!/bin/bash
set -e

# Contabo VPS Setup Script for Ads Pro (adpd.gr)
# Run this script on your Contabo VPS as root

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

DOMAIN="adpd.gr"
EMAIL="admin@adpd.gr"  # Change this to your email
PROJECT_DIR="/opt/adspro"

echo -e "${BLUE}🚀 Setting up Ads Pro on Contabo VPS for ${DOMAIN}${NC}"
echo "================================================================"

# Update system
update_system() {
    echo -e "${YELLOW}📦 Updating system packages...${NC}"
    apt update && apt upgrade -y
    apt install -y curl wget git vim htop fail2ban ufw
    echo -e "${GREEN}✅ System updated${NC}"
}

# Install Docker
install_docker() {
    echo -e "${YELLOW}🐳 Installing Docker...${NC}"
    
    # Remove old versions
    apt remove -y docker docker-engine docker.io containerd runc || true
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    
    # Install Docker Compose
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Start Docker
    systemctl enable docker
    systemctl start docker
    
    echo -e "${GREEN}✅ Docker installed${NC}"
}

# Install Node.js and pnpm
install_nodejs() {
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
    
    # Install pnpm
    npm install -g pnpm
    
    echo -e "${GREEN}✅ Node.js and pnpm installed${NC}"
}

# Setup firewall
setup_firewall() {
    echo -e "${YELLOW}🔒 Setting up firewall...${NC}"
    
    # Reset UFW
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # SSH (change port if needed)
    ufw allow 22/tcp
    
    # HTTP and HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    
    # Enable firewall
    ufw --force enable
    
    echo -e "${GREEN}✅ Firewall configured${NC}"
}

# Install SSL certificates
install_ssl() {
    echo -e "${YELLOW}🔐 Installing SSL certificates...${NC}"
    
    # Install Certbot
    apt install -y certbot python3-certbot-nginx
    
    # Stop nginx if running
    systemctl stop nginx || true
    
    # Get certificates
    certbot certonly --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    # Setup auto-renewal
    crontab -l 2>/dev/null | grep -q "certbot renew" || {
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    }
    
    echo -e "${GREEN}✅ SSL certificates installed${NC}"
}

# Install Nginx
install_nginx() {
    echo -e "${YELLOW}🌐 Installing Nginx...${NC}"
    
    apt install -y nginx
    systemctl enable nginx
    
    # Backup default config
    cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup
    
    echo -e "${GREEN}✅ Nginx installed${NC}"
}

# Create Nginx configuration
create_nginx_config() {
    echo -e "${YELLOW}⚙️  Creating Nginx configuration...${NC}"
    
    cat > /etc/nginx/sites-available/$DOMAIN << EOF
# Ads Pro - adpd.gr Configuration
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend (React App)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Fallback for SPA
        try_files \$uri \$uri/ @fallback;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
    
    # Static assets with long cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA fallback
    location @fallback {
        proxy_pass http://localhost:3000;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# Rate limiting
http {
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    nginx -t
    
    echo -e "${GREEN}✅ Nginx configuration created${NC}"
}

# Setup project directory
setup_project() {
    echo -e "${YELLOW}📁 Setting up project directory...${NC}"
    
    # Create project directory
    mkdir -p $PROJECT_DIR
    cd $PROJECT_DIR
    
    # Create environment file
    cat > .env << EOF
# Production Environment - adpd.gr
NODE_ENV=production
DOMAIN=$DOMAIN

# Database
DATABASE_URL=postgresql://adspro:$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)@localhost:5432/adspro
POSTGRES_DB=adspro
POSTGRES_USER=adspro
POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d

# API
API_PORT=5000
CORS_ORIGIN=https://$DOMAIN

# Sentry (add your DSN)
VITE_SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=

# Features
ENABLE_DEMO_MODE=false
ENABLE_ANALYTICS=true
ENABLE_PERFORMANCE_MONITORING=true
EOF

    chmod 600 .env
    
    echo -e "${GREEN}✅ Project directory setup complete${NC}"
}

# Setup monitoring
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    # Install htop, iotop for monitoring
    apt install -y htop iotop nethogs
    
    # Create monitoring script
    cat > /usr/local/bin/server-status.sh << EOF
#!/bin/bash
echo "=== Server Status ==="
echo "Date: \$(date)"
echo "Uptime: \$(uptime)"
echo "Disk Usage: \$(df -h / | tail -1 | awk '{print \$5}')"
echo "Memory Usage: \$(free -m | awk 'NR==2{printf "%.1f%%", \$3*100/\$2 }')"
echo "CPU Load: \$(top -bn1 | grep load | awk '{printf "%.2f%%", \$(NF-2)}')"
echo "Docker Containers: \$(docker ps --format "table {{.Names}}\t{{.Status}}")"
EOF

    chmod +x /usr/local/bin/server-status.sh
    
    echo -e "${GREEN}✅ Monitoring setup complete${NC}"
}

# Setup fail2ban
setup_fail2ban() {
    echo -e "${YELLOW}🛡️  Setting up fail2ban...${NC}"
    
    # Create jail for nginx
    cat > /etc/fail2ban/jail.d/nginx.conf << EOF
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5
bantime = 3600

[nginx-noscript]
enabled = true
filter = nginx-noscript
logpath = /var/log/nginx/access.log
maxretry = 6
bantime = 86400

[nginx-badbots]
enabled = true
filter = nginx-badbots
logpath = /var/log/nginx/access.log
maxretry = 2
bantime = 86400
EOF

    systemctl enable fail2ban
    systemctl restart fail2ban
    
    echo -e "${GREEN}✅ Fail2ban configured${NC}"
}

# Main installation
main() {
    echo -e "${BLUE}Starting Contabo VPS setup for ${DOMAIN}...${NC}"
    
    update_system
    install_docker
    install_nodejs
    setup_firewall
    install_nginx
    install_ssl
    create_nginx_config
    setup_project
    setup_monitoring
    setup_fail2ban
    
    echo -e "${GREEN}🎉 Contabo VPS setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Clone your repository to $PROJECT_DIR"
    echo "2. Edit $PROJECT_DIR/.env with your actual values"
    echo "3. Deploy with: cd $PROJECT_DIR && docker-compose up -d"
    echo "4. Point your domain DNS to this server IP"
    echo "5. Start Nginx: systemctl start nginx"
    echo ""
    echo -e "${YELLOW}Server IP: $(curl -s ifconfig.me)${NC}"
    echo -e "${YELLOW}Domain: https://$DOMAIN${NC}"
}

# Run main function
main "$@"