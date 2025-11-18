# Stage 1: Build
FROM composer:2.6 AS build
WORKDIR /app
COPY . .                         # Copy all files first!
RUN composer install --no-dev --optimize-autoloader

# Stage 2: Runtime
FROM php:8.2-apache
WORKDIR /var/www/html

# Install PHP extensions
RUN apt-get update && apt-get install -y zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring gd \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*

# Copy app from build
COPY --from=build /app /var/www/html

# Fix permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Apache public directory
RUN sed -i 's#/var/www/html#/var/www/html/public#g' /etc/apache2/sites-available/000-default.conf

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000
ENTRYPOINT ["/entrypoint.sh"]
