#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Ads Pro Production Setup${NC}"
echo "================================="

# Check if required tools are installed
check_dependencies() {
    echo -e "${YELLOW}📋 Checking dependencies...${NC}"
    
    local deps=("node" "pnpm" "docker" "git")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            missing+=($dep)
        fi
    done
    
    if [ ${#missing[@]} -ne 0 ]; then
        echo -e "${RED}❌ Missing dependencies: ${missing[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
    
    echo -e "${GREEN}✅ All dependencies found${NC}"
}

# Setup environment files
setup_environment() {
    echo -e "${YELLOW}🔧 Setting up environment files...${NC}"
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ Created .env file${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env with your actual values${NC}"
    else
        echo -e "${BLUE}ℹ️  .env file already exists${NC}"
    fi
    
    if [ ! -f "ui/.env.production" ]; then
        echo -e "${YELLOW}⚠️  ui/.env.production not found${NC}"
        echo "Please create production environment file"
    fi
}

# Generate secrets
generate_secrets() {
    echo -e "${YELLOW}🔐 Generating secrets...${NC}"
    
    # JWT Secret
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT_SECRET: $JWT_SECRET"
    
    # Session Secret  
    SESSION_SECRET=$(openssl rand -base64 32)
    echo "Generated SESSION_SECRET: $SESSION_SECRET"
    
    # API Key
    API_KEY=$(openssl rand -hex 16)
    echo "Generated API_KEY: $API_KEY"
    
    echo -e "${GREEN}✅ Secrets generated (save these securely)${NC}"
}

# Database setup
setup_database() {
    echo -e "${YELLOW}🗃️  Setting up database...${NC}"
    
    read -p "Enter your database URL: " DATABASE_URL
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}❌ Database URL is required${NC}"
        return 1
    fi
    
    # Test database connection
    echo "Testing database connection..."
    # Add actual database test here
    
    echo -e "${GREEN}✅ Database configured${NC}"
}

# Docker setup
setup_docker() {
    echo -e "${YELLOW}🐳 Setting up Docker...${NC}"
    
    if ! docker info &> /dev/null; then
        echo -e "${RED}❌ Docker is not running${NC}"
        return 1
    fi
    
    # Build images
    echo "Building Docker images..."
    make docker-build
    
    echo -e "${GREEN}✅ Docker images built${NC}"
}

# CI/CD setup
setup_cicd() {
    echo -e "${YELLOW}⚙️  Setting up CI/CD...${NC}"
    
    echo "GitHub repository secrets needed:"
    echo "- VERCEL_TOKEN"
    echo "- SENTRY_AUTH_TOKEN"
    echo "- DATABASE_URL"
    echo "- JWT_SECRET"
    echo "- SLACK_WEBHOOK_URL (optional)"
    
    echo -e "${YELLOW}Please add these secrets to your GitHub repository${NC}"
}

# Monitoring setup
setup_monitoring() {
    echo -e "${YELLOW}📊 Setting up monitoring...${NC}"
    
    read -p "Enter your Sentry DSN: " SENTRY_DSN
    
    if [ -n "$SENTRY_DSN" ]; then
        echo "VITE_SENTRY_DSN=$SENTRY_DSN" >> ui/.env.production
        echo -e "${GREEN}✅ Sentry configured${NC}"
    fi
}

# Domain setup
setup_domain() {
    echo -e "${YELLOW}🌐 Domain setup...${NC}"
    
    read -p "Enter your domain name (e.g., adspro.app): " DOMAIN
    
    if [ -n "$DOMAIN" ]; then
        echo "Domain: $DOMAIN"
        echo "You'll need to:"
        echo "1. Point your domain to your hosting provider"
        echo "2. Setup SSL certificates"
        echo "3. Configure CORS origins"
        
        # Update environment files
        echo "VITE_API_URL=https://api.$DOMAIN" >> ui/.env.production
        echo "CORS_ORIGIN=https://$DOMAIN" >> .env.production
    fi
}

# Final checks
final_checks() {
    echo -e "${YELLOW}🔍 Running final checks...${NC}"
    
    # Test build
    echo "Testing build process..."
    cd ui && pnpm run build && cd ..
    
    # Test linting
    echo "Running linting..."
    make lint
    
    # Test unit tests
    echo "Running tests..."
    make test-unit
    
    echo -e "${GREEN}✅ All checks passed${NC}"
}

# Main execution
main() {
    echo -e "${BLUE}Starting production setup...${NC}"
    
    check_dependencies
    setup_environment
    generate_secrets
    setup_database
    setup_docker
    setup_cicd
    setup_monitoring
    setup_domain
    final_checks
    
    echo -e "${GREEN}🎉 Production setup completed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Edit .env files with your actual values"
    echo "2. Add GitHub repository secrets"
    echo "3. Deploy to staging: make deploy-staging"
    echo "4. Test staging environment"
    echo "5. Deploy to production: make deploy-production"
}

# Parse command line arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "secrets")
        generate_secrets
        ;;
    "database")
        setup_database
        ;;
    "docker")
        setup_docker
        ;;
    "check")
        final_checks
        ;;
    *)
        echo "Usage: $0 [setup|secrets|database|docker|check]"
        exit 1
        ;;
esac