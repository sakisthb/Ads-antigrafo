# Ads Pro - Production-Ready Makefile

.PHONY: help install build test deploy clean docker-build docker-run health-check

# Default target
.DEFAULT_GOAL := help

# Variables
NODE_VERSION = 20
PNPM_VERSION = 10
PROJECT_NAME = adspro
DOCKER_REGISTRY = your-registry.com
VERSION ?= $(shell git rev-parse --short HEAD)
ENVIRONMENT ?= staging

# Colors
GREEN = \033[32m
YELLOW = \033[33m
RED = \033[31m
BLUE = \033[34m
NC = \033[0m

help: ## Show this help message
	@echo "$(BLUE)Ads Pro - Available Commands$(NC)"
	@echo "================================="
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*?##/ { printf "$(GREEN)%-20s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# Development Commands
install: ## Install dependencies for all services
	@echo "$(YELLOW)📦 Installing dependencies...$(NC)"
	@pnpm install --frozen-lockfile
	@cd ui && pnpm install --frozen-lockfile
	@cd api-server && pnpm install --frozen-lockfile
	@cd database-server && pnpm install --frozen-lockfile
	@echo "$(GREEN)✅ Dependencies installed$(NC)"

dev: ## Start development environment
	@echo "$(YELLOW)🚀 Starting development environment...$(NC)"
	@docker-compose -f docker-compose.dev.yml up -d postgres redis
	@sleep 5
	@concurrently \
		"cd ui && pnpm run dev" \
		"cd api-server && pnpm run dev" \
		"cd database-server && pnpm run dev"

dev-stop: ## Stop development environment
	@echo "$(YELLOW)🛑 Stopping development environment...$(NC)"
	@docker-compose -f docker-compose.dev.yml down
	@echo "$(GREEN)✅ Development environment stopped$(NC)"

# Build Commands
build: ## Build all services
	@echo "$(YELLOW)🔨 Building all services...$(NC)"
	@cd ui && pnpm run build
	@cd api-server && pnpm run build
	@cd database-server && pnpm run build
	@echo "$(GREEN)✅ All services built$(NC)"

build-ui: ## Build UI only
	@echo "$(YELLOW)🔨 Building UI...$(NC)"
	@cd ui && pnpm run build
	@echo "$(GREEN)✅ UI built$(NC)"

build-api: ## Build API only
	@echo "$(YELLOW)🔨 Building API...$(NC)"
	@cd api-server && pnpm run build
	@echo "$(GREEN)✅ API built$(NC)"

# Testing Commands
test: ## Run all tests
	@echo "$(YELLOW)🧪 Running all tests...$(NC)"
	@cd ui && pnpm run test:unit:run
	@cd ui && pnpm run test:e2e
	@cd api-server && pnpm run test
	@echo "$(GREEN)✅ All tests completed$(NC)"

test-unit: ## Run unit tests only
	@echo "$(YELLOW)🧪 Running unit tests...$(NC)"
	@cd ui && pnpm run test:unit:run
	@cd api-server && pnpm run test
	@echo "$(GREEN)✅ Unit tests completed$(NC)"

test-e2e: ## Run E2E tests only
	@echo "$(YELLOW)🎭 Running E2E tests...$(NC)"
	@cd ui && pnpm run test:e2e
	@echo "$(GREEN)✅ E2E tests completed$(NC)"

test-coverage: ## Generate test coverage reports
	@echo "$(YELLOW)📊 Generating coverage reports...$(NC)"
	@cd ui && pnpm run test:unit:coverage
	@cd api-server && pnpm run test:coverage
	@echo "$(GREEN)✅ Coverage reports generated$(NC)"

# Linting and Formatting
lint: ## Run linting for all services
	@echo "$(YELLOW)🔍 Running linting...$(NC)"
	@cd ui && pnpm run lint
	@cd api-server && pnpm run lint
	@echo "$(GREEN)✅ Linting completed$(NC)"

lint-fix: ## Fix linting issues
	@echo "$(YELLOW)🔧 Fixing linting issues...$(NC)"
	@cd ui && pnpm run lint:fix
	@cd api-server && pnpm run lint:fix
	@echo "$(GREEN)✅ Linting issues fixed$(NC)"

format: ## Format code
	@echo "$(YELLOW)✨ Formatting code...$(NC)"
	@cd ui && pnpm run format
	@cd api-server && pnpm run format
	@echo "$(GREEN)✅ Code formatted$(NC)"

type-check: ## Run TypeScript type checking
	@echo "$(YELLOW)🔎 Running type checks...$(NC)"
	@cd ui && pnpm run type-check
	@cd api-server && pnpm run type-check
	@echo "$(GREEN)✅ Type checking completed$(NC)"

# Docker Commands
docker-build: ## Build Docker images
	@echo "$(YELLOW)🐳 Building Docker images...$(NC)"
	@docker build -t $(DOCKER_REGISTRY)/$(PROJECT_NAME)-ui:$(VERSION) ./ui
	@docker build -t $(DOCKER_REGISTRY)/$(PROJECT_NAME)-api:$(VERSION) ./api-server
	@docker build -t $(DOCKER_REGISTRY)/$(PROJECT_NAME)-db:$(VERSION) ./database-server
	@echo "$(GREEN)✅ Docker images built$(NC)"

docker-push: ## Push Docker images to registry
	@echo "$(YELLOW)📤 Pushing Docker images...$(NC)"
	@docker push $(DOCKER_REGISTRY)/$(PROJECT_NAME)-ui:$(VERSION)
	@docker push $(DOCKER_REGISTRY)/$(PROJECT_NAME)-api:$(VERSION)
	@docker push $(DOCKER_REGISTRY)/$(PROJECT_NAME)-db:$(VERSION)
	@echo "$(GREEN)✅ Docker images pushed$(NC)"

docker-run: ## Run application with Docker Compose
	@echo "$(YELLOW)🐳 Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Docker containers started$(NC)"

docker-stop: ## Stop Docker containers
	@echo "$(YELLOW)🛑 Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Docker containers stopped$(NC)"

docker-logs: ## Show Docker container logs
	@docker-compose logs -f

# Deployment Commands
deploy-staging: ## Deploy to staging environment
	@echo "$(YELLOW)🚀 Deploying to staging...$(NC)"
	@./scripts/deploy.sh staging
	@echo "$(GREEN)✅ Deployed to staging$(NC)"

deploy-production: ## Deploy to production environment
	@echo "$(YELLOW)🚀 Deploying to production...$(NC)"
	@./scripts/deploy.sh production
	@echo "$(GREEN)✅ Deployed to production$(NC)"

rollback: ## Rollback deployment (requires VERSION env var)
	@if [ -z "$(VERSION_TO_ROLLBACK)" ]; then \
		echo "$(RED)❌ Please specify VERSION_TO_ROLLBACK$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)🔄 Rolling back to version $(VERSION_TO_ROLLBACK)...$(NC)"
	@./scripts/deploy.sh $(ENVIRONMENT) rollback $(VERSION_TO_ROLLBACK)
	@echo "$(GREEN)✅ Rollback completed$(NC)"

# Monitoring Commands
health-check: ## Run health check
	@echo "$(YELLOW)🔍 Running health check...$(NC)"
	@./scripts/health-check.sh

logs: ## Show application logs
	@echo "$(YELLOW)📜 Showing logs...$(NC)"
	@docker-compose logs -f

stats: ## Show container statistics
	@echo "$(YELLOW)📊 Container statistics:$(NC)"
	@docker stats

# Database Commands
db-migrate: ## Run database migrations
	@echo "$(YELLOW)🗃️  Running database migrations...$(NC)"
	@cd database-server && pnpm run migrate
	@echo "$(GREEN)✅ Database migrations completed$(NC)"

db-seed: ## Seed database with test data
	@echo "$(YELLOW)🌱 Seeding database...$(NC)"
	@cd database-server && pnpm run seed
	@echo "$(GREEN)✅ Database seeded$(NC)"

db-reset: ## Reset database (dangerous!)
	@echo "$(RED)⚠️  This will reset the database. Are you sure? [y/N]$(NC)" && read ans && [ $${ans:-N} = y ]
	@cd database-server && pnpm run reset
	@echo "$(GREEN)✅ Database reset$(NC)"

db-backup: ## Backup database
	@echo "$(YELLOW)💾 Creating database backup...$(NC)"
	@mkdir -p backups
	@docker exec $$(docker-compose ps -q postgres) pg_dump -U adspro adspro > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Database backup created$(NC)"

# Cleanup Commands
clean: ## Clean build artifacts
	@echo "$(YELLOW)🧹 Cleaning build artifacts...$(NC)"
	@rm -rf ui/dist
	@rm -rf ui/coverage
	@rm -rf ui/test-results
	@rm -rf api-server/dist
	@rm -rf api-server/coverage
	@rm -rf database-server/dist
	@echo "$(GREEN)✅ Build artifacts cleaned$(NC)"

clean-docker: ## Clean Docker images and containers
	@echo "$(YELLOW)🧹 Cleaning Docker resources...$(NC)"
	@docker system prune -f
	@echo "$(GREEN)✅ Docker resources cleaned$(NC)"

clean-all: clean clean-docker ## Clean everything
	@echo "$(GREEN)✅ Everything cleaned$(NC)"

# Utility Commands
setup: ## Initial project setup
	@echo "$(YELLOW)🔧 Setting up project...$(NC)"
	@cp .env.example .env
	@echo "$(BLUE)Please edit .env file with your configuration$(NC)"
	@make install
	@echo "$(GREEN)✅ Project setup completed$(NC)"

version: ## Show current version
	@echo "$(BLUE)Current version: $(VERSION)$(NC)"

status: ## Show service status
	@echo "$(YELLOW)📊 Service Status:$(NC)"
	@docker-compose ps

# CI/CD Commands
ci: lint type-check test-unit ## Run CI pipeline
	@echo "$(GREEN)✅ CI pipeline completed$(NC)"

cd: build docker-build docker-push ## Run CD pipeline
	@echo "$(GREEN)✅ CD pipeline completed$(NC)"

# Storybook Commands
storybook: ## Start Storybook
	@echo "$(YELLOW)📖 Starting Storybook...$(NC)"
	@cd ui && pnpm run storybook

storybook-build: ## Build Storybook
	@echo "$(YELLOW)📖 Building Storybook...$(NC)"
	@cd ui && pnpm run build-storybook
	@echo "$(GREEN)✅ Storybook built$(NC)"

# Security Commands
security-audit: ## Run security audit
	@echo "$(YELLOW)🔒 Running security audit...$(NC)"
	@cd ui && pnpm audit
	@cd api-server && pnpm audit
	@echo "$(GREEN)✅ Security audit completed$(NC)"

# Performance Commands
analyze-bundle: ## Analyze bundle size
	@echo "$(YELLOW)📊 Analyzing bundle size...$(NC)"
	@cd ui && pnpm run analyze
	@echo "$(GREEN)✅ Bundle analysis completed$(NC)"