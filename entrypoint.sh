#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Storage link (safe to run here)
php artisan storage:link || true

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations but do not block startup
echo "⚡ Running migrations..."
php artisan migrate --force || echo "⚠️ Migration skipped (DB not ready)."

# Start Apache
echo "🌍 Starting Apache..."
exec apache2-foreground
