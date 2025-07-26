#!/bin/bash

# Health check script for production monitoring
# This script can be used by monitoring systems like Nagios, Zabbix, etc.

set -e

# Configuration
UI_URL="${UI_URL:-http://localhost:3000}"
API_URL="${API_URL:-http://localhost:5000}"
DB_URL="${DB_URL:-localhost:5432}"
REDIS_URL="${REDIS_URL:-localhost:6379}"
TIMEOUT=10

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Exit codes
EXIT_OK=0
EXIT_WARNING=1
EXIT_CRITICAL=2
EXIT_UNKNOWN=3

# Overall health status
OVERALL_STATUS=$EXIT_OK
FAILED_SERVICES=()

# Check function
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=${3:-200}
    
    echo -n "Checking ${service_name}... "
    
    # Make HTTP request
    if command -v curl &> /dev/null; then
        response=$(curl -s -w "%{http_code}" -o /dev/null --max-time $TIMEOUT "$url" 2>/dev/null || echo "000")
    else
        echo -e "${RED}UNKNOWN - curl not found${NC}"
        return $EXIT_UNKNOWN
    fi
    
    if [ "$response" = "$expected_status" ]; then
        echo -e "${GREEN}OK${NC}"
        return $EXIT_OK
    else
        echo -e "${RED}CRITICAL - HTTP $response${NC}"
        FAILED_SERVICES+=("$service_name")
        OVERALL_STATUS=$EXIT_CRITICAL
        return $EXIT_CRITICAL
    fi
}

# Check database connectivity
check_database() {
    echo -n "Checking PostgreSQL... "
    
    if command -v pg_isready &> /dev/null; then
        if pg_isready -h ${DB_HOST:-localhost} -p ${DB_PORT:-5432} -U ${DB_USER:-adspro} &> /dev/null; then
            echo -e "${GREEN}OK${NC}"
            return $EXIT_OK
        else
            echo -e "${RED}CRITICAL - Not ready${NC}"
            FAILED_SERVICES+=("PostgreSQL")
            OVERALL_STATUS=$EXIT_CRITICAL
            return $EXIT_CRITICAL
        fi
    else
        echo -e "${YELLOW}WARNING - pg_isready not found${NC}"
        return $EXIT_WARNING
    fi
}

# Check Redis connectivity
check_redis() {
    echo -n "Checking Redis... "
    
    if command -v redis-cli &> /dev/null; then
        if redis-cli -h ${REDIS_HOST:-localhost} -p ${REDIS_PORT:-6379} ping | grep -q "PONG"; then
            echo -e "${GREEN}OK${NC}"
            return $EXIT_OK
        else
            echo -e "${RED}CRITICAL - Not responding${NC}"
            FAILED_SERVICES+=("Redis")
            OVERALL_STATUS=$EXIT_CRITICAL
            return $EXIT_CRITICAL
        fi
    else
        echo -e "${YELLOW}WARNING - redis-cli not found${NC}"
        return $EXIT_WARNING
    fi
}

# Check disk space
check_disk_space() {
    echo -n "Checking disk space... "
    
    # Check if disk usage is above 90%
    disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$disk_usage" -lt 80 ]; then
        echo -e "${GREEN}OK (${disk_usage}% used)${NC}"
        return $EXIT_OK
    elif [ "$disk_usage" -lt 90 ]; then
        echo -e "${YELLOW}WARNING (${disk_usage}% used)${NC}"
        if [ $OVERALL_STATUS -eq $EXIT_OK ]; then
            OVERALL_STATUS=$EXIT_WARNING
        fi
        return $EXIT_WARNING
    else
        echo -e "${RED}CRITICAL (${disk_usage}% used)${NC}"
        FAILED_SERVICES+=("Disk Space")
        OVERALL_STATUS=$EXIT_CRITICAL
        return $EXIT_CRITICAL
    fi
}

# Check memory usage
check_memory() {
    echo -n "Checking memory usage... "
    
    # Get memory usage percentage
    if command -v free &> /dev/null; then
        memory_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
        
        if [ "$memory_usage" -lt 80 ]; then
            echo -e "${GREEN}OK (${memory_usage}% used)${NC}"
            return $EXIT_OK
        elif [ "$memory_usage" -lt 90 ]; then
            echo -e "${YELLOW}WARNING (${memory_usage}% used)${NC}"
            if [ $OVERALL_STATUS -eq $EXIT_OK ]; then
                OVERALL_STATUS=$EXIT_WARNING
            fi
            return $EXIT_WARNING
        else
            echo -e "${RED}CRITICAL (${memory_usage}% used)${NC}"
            FAILED_SERVICES+=("Memory")
            OVERALL_STATUS=$EXIT_CRITICAL
            return $EXIT_CRITICAL
        fi
    else
        echo -e "${YELLOW}WARNING - free command not found${NC}"
        return $EXIT_WARNING
    fi
}

# Check SSL certificate (if HTTPS)
check_ssl() {
    local domain=$1
    
    if [[ "$domain" == https://* ]]; then
        echo -n "Checking SSL certificate... "
        domain=$(echo "$domain" | sed 's|https://||' | sed 's|/.*||')
        
        if command -v openssl &> /dev/null; then
            expiry_date=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates | grep "notAfter" | cut -d= -f2)
            expiry_timestamp=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
            current_timestamp=$(date +%s)
            days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
            
            if [ "$days_until_expiry" -gt 30 ]; then
                echo -e "${GREEN}OK (${days_until_expiry} days remaining)${NC}"
                return $EXIT_OK
            elif [ "$days_until_expiry" -gt 7 ]; then
                echo -e "${YELLOW}WARNING (${days_until_expiry} days remaining)${NC}"
                if [ $OVERALL_STATUS -eq $EXIT_OK ]; then
                    OVERALL_STATUS=$EXIT_WARNING
                fi
                return $EXIT_WARNING
            else
                echo -e "${RED}CRITICAL (${days_until_expiry} days remaining)${NC}"
                FAILED_SERVICES+=("SSL Certificate")
                OVERALL_STATUS=$EXIT_CRITICAL
                return $EXIT_CRITICAL
            fi
        else
            echo -e "${YELLOW}WARNING - openssl not found${NC}"
            return $EXIT_WARNING
        fi
    fi
}

# Main health check
main() {
    echo "=== Ads Pro Health Check ==="
    echo "Timestamp: $(date)"
    echo "=========================="
    
    # Check all services
    check_service "UI" "$UI_URL/health"
    check_service "API" "$API_URL/health"
    check_database
    check_redis
    check_disk_space
    check_memory
    check_ssl "$UI_URL"
    
    echo "=========================="
    
    # Summary
    if [ $OVERALL_STATUS -eq $EXIT_OK ]; then
        echo -e "${GREEN}✅ Overall Status: HEALTHY${NC}"
    elif [ $OVERALL_STATUS -eq $EXIT_WARNING ]; then
        echo -e "${YELLOW}⚠️  Overall Status: WARNING${NC}"
    elif [ $OVERALL_STATUS -eq $EXIT_CRITICAL ]; then
        echo -e "${RED}❌ Overall Status: CRITICAL${NC}"
        echo "Failed services: ${FAILED_SERVICES[*]}"
    else
        echo -e "${YELLOW}❓ Overall Status: UNKNOWN${NC}"
    fi
    
    # Send alert if critical
    if [ $OVERALL_STATUS -eq $EXIT_CRITICAL ] && [ -n "$ALERT_WEBHOOK" ]; then
        send_alert
    fi
    
    exit $OVERALL_STATUS
}

# Send alert function
send_alert() {
    local message="🚨 CRITICAL: Ads Pro health check failed!\nFailed services: ${FAILED_SERVICES[*]}\nTime: $(date)"
    
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"$message\"}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
    
    if [ -n "$DISCORD_WEBHOOK_URL" ]; then
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"content\":\"$message\"}" \
            "$DISCORD_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Run main function
main "$@"