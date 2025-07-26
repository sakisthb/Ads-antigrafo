#!/bin/sh
set -e

echo "🚀 Starting Ads Pro UI..."

# Replace environment variables in nginx config if needed
if [ -n "$VITE_API_URL" ]; then
    echo "📡 Configuring API URL: $VITE_API_URL"
    sed -i "s|\$VITE_API_URL|$VITE_API_URL|g" /etc/nginx/nginx.conf
fi

# Start nginx
echo "🌐 Starting Nginx..."
exec nginx -g "daemon off;"