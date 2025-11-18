#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations but don't block startup if DB isn't ready
echo "⚡ Running migrations..."
php artisan migrate --force || echo "⚠️ Migration skipped (DB not ready)."

# Start Apache
echo "🌍 Starting Apache..."
exec apache2-foreground
