FROM php:8.4-cli

# Install dependencies untuk PostgreSQL dan zip
RUN apt-get update && apt-get install -y \
    libpq-dev \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions untuk terhubung ke PostgreSQL
RUN docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set folder kerja di dalam server
WORKDIR /app

# Copy semua file project ke dalam server
COPY . .

# Install library Laravel
RUN composer install --no-dev --optimize-autoloader

# Izinkan akses folder storage
RUN chmod -R 777 storage bootstrap/cache

# Beritahu Back4App port yang kita gunakan
EXPOSE 8080

# Jalankan server bawaan Laravel (cocok untuk API)
CMD php artisan serve --host=0.0.0.0 --port=8080
