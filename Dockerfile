FROM node:20 AS node-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend .
RUN npm run build

FROM composer:2 AS vendor
WORKDIR /app
COPY backend/composer.json backend/composer.lock* ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

FROM php:8.2-fpm
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
 && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
WORKDIR /var/www
COPY backend .
COPY --from=vendor /app/vendor ./vendor
COPY --from=node-builder /app/public/build ./public/build
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
