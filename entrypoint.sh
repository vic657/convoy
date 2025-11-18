#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Storage link
php artisan storage:link || true

# Run package discover (important since we skipped it in build)
php artisan package:discover --ansi

# Run migrations
php artisan migrate --force || echo "⚠️ Migration skipped"

# Clear caches
php artisan config:cache || true
php artisan route:cache || true

# Start Apache
exec apache2-foreground
