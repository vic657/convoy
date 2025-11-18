#!/bin/bash
set -e

echo "🚀 Starting Laravel on Render..."

# Only run lightweight commands
php artisan storage:link || true
php artisan migrate --force || echo "⚠️ Migration skipped"
php artisan config:cache || true
php artisan route:cache || true

# Start Apache
exec apache2-foreground
