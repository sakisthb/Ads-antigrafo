#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
PROJECT_NAME="adspro"
DOCKER_REGISTRY="your-registry.com"
VERSION=$(git rev-parse --short HEAD)

echo -e "${BLUE}🚀 Starting deployment for ${ENVIRONMENT} environment${NC}"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Check if we're on the correct branch
if [ "$ENVIRONMENT" = "production" ]; then
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        echo -e "${RED}❌ Production deployments must be from 'main' branch${NC}"
        exit 1
    fi
fi

# Load environment variables
if [ -f ".env.${ENVIRONMENT}" ]; then
    echo -e "${YELLOW}📦 Loading environment variables for ${ENVIRONMENT}${NC}"
    export $(cat .env.${ENVIRONMENT} | xargs)
else
    echo -e "${RED}❌ Environment file .env.${ENVIRONMENT} not found${NC}"
    exit 1
fi

# Build and push Docker images
echo -e "${BLUE}🔨 Building Docker images${NC}"

# Build UI
docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}-ui:${VERSION} \
    --build-arg NODE_ENV=${ENVIRONMENT} \
    --build-arg VITE_API_URL=${VITE_API_URL} \
    --build-arg VITE_SENTRY_DSN=${VITE_SENTRY_DSN} \
    ./ui

# Build API
docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}-api:${VERSION} ./api-server

# Build Database
docker build -t ${DOCKER_REGISTRY}/${PROJECT_NAME}-db:${VERSION} ./database-server

echo -e "${GREEN}✅ Docker images built successfully${NC}"

# Push to registry
echo -e "${BLUE}📤 Pushing images to registry${NC}"
docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-ui:${VERSION}
docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-api:${VERSION}
docker push ${DOCKER_REGISTRY}/${PROJECT_NAME}-db:${VERSION}

echo -e "${GREEN}✅ Images pushed to registry${NC}"

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    deploy_staging
elif [ "$ENVIRONMENT" = "production" ]; then
    deploy_production
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"

# Deploy to staging
deploy_staging() {
    echo -e "${BLUE}🚀 Deploying to staging environment${NC}"
    
    # Create staging docker-compose override
    cat > docker-compose.staging.yml << EOF
version: '3.8'
services:
  ui:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-ui:${VERSION}
    environment:
      - NODE_ENV=staging
  api:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-api:${VERSION}
    environment:
      - NODE_ENV=staging
  database:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-db:${VERSION}
EOF

    # Deploy with docker-compose
    docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 30
    
    # Health checks
    check_service_health "ui" "http://localhost:3000/health"
    check_service_health "api" "http://localhost:5000/health"
}

# Deploy to production
deploy_production() {
    echo -e "${BLUE}🚀 Deploying to production environment${NC}"
    
    # Production deployment with zero downtime
    echo -e "${YELLOW}🔄 Performing rolling update...${NC}"
    
    # Create production docker-compose override
    cat > docker-compose.production.yml << EOF
version: '3.8'
services:
  ui:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-ui:${VERSION}
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
  api:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-api:${VERSION}
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
  database:
    image: ${DOCKER_REGISTRY}/${PROJECT_NAME}-db:${VERSION}
EOF

    # Deploy with docker swarm for production
    if ! docker node ls &> /dev/null; then
        echo -e "${YELLOW}🔧 Initializing Docker Swarm${NC}"
        docker swarm init
    fi
    
    docker stack deploy -c docker-compose.yml -c docker-compose.production.yml ${PROJECT_NAME}
    
    # Wait for deployment
    echo -e "${YELLOW}⏳ Waiting for deployment to complete...${NC}"
    sleep 60
    
    # Health checks
    check_service_health "ui" "http://localhost:3000/health"
    check_service_health "api" "http://localhost:5000/health"
    
    # Send deployment notification
    send_deployment_notification "production" "${VERSION}"
}

# Health check function
check_service_health() {
    local service_name=$1
    local health_url=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}🔍 Checking health of ${service_name}...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "${health_url}" > /dev/null; then
            echo -e "${GREEN}✅ ${service_name} is healthy${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}⏳ Attempt ${attempt}/${max_attempts} - ${service_name} not ready yet...${NC}"
        sleep 10
        ((attempt++))
    done
    
    echo -e "${RED}❌ ${service_name} health check failed${NC}"
    exit 1
}

# Send deployment notification
send_deployment_notification() {
    local env=$1
    local version=$2
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"🚀 Deployment to ${env} completed!\nVersion: ${version}\nTime: $(date)\"}" \
            "$SLACK_WEBHOOK_URL"
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"content\":\"🚀 Deployment to ${env} completed!\nVersion: ${version}\nTime: $(date)\"}" \
            "$DISCORD_WEBHOOK_URL"
    fi
}

# Rollback function
rollback() {
    local environment=$1
    local previous_version=$2
    
    echo -e "${YELLOW}🔄 Rolling back to version ${previous_version}${NC}"
    
    # Rollback logic here
    if [ "$environment" = "production" ]; then
        docker service update --image ${DOCKER_REGISTRY}/${PROJECT_NAME}-ui:${previous_version} ${PROJECT_NAME}_ui
        docker service update --image ${DOCKER_REGISTRY}/${PROJECT_NAME}-api:${previous_version} ${PROJECT_NAME}_api
    else
        # Update staging environment
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml down
        # Deploy previous version
        docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d
    fi
    
    echo -e "${GREEN}✅ Rollback completed${NC}"
}

# If script is called with 'rollback' as second argument
if [ "$2" = "rollback" ]; then
    if [ -z "$3" ]; then
        echo -e "${RED}❌ Please specify version to rollback to${NC}"
        exit 1
    fi
    rollback "$ENVIRONMENT" "$3"
    exit 0
fi