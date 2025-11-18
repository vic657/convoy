#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Update Apache to listen on Render-assigned port
sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run migrations safely
echo "⚡ Running migrations..."
php artisan migrate --force || echo "⚠️ Migration skipped (DB not ready)."

# Start Apache
echo "🌍 Starting Apache..."
exec apache2-foreground