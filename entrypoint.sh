#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Update Apache to listen on Render-assigned port
sed -i "s/80/${PORT}/g" /etc/apache2/ports.conf /etc/apache2/sites-available/000-default.conf

# Fix permissions for storage and cache
echo "🔧 Fixing permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Ensure log file exists and is writable
touch /var/www/html/storage/logs/laravel.log
chown www-data:www-data /var/www/html/storage/logs/laravel.log
chmod 664 /var/www/html/storage/logs/laravel.log

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Run storage link
echo "🔗 Creating storage symlink..."
php artisan storage:link || true

# Run migrations 
echo "⚡ Running migrations..."
php artisan migrate --force || echo "⚠️ Migration skipped (DB not ready)."

# Start Apache
echo "🌍 Starting Apache..."
exec apache2-foreground
