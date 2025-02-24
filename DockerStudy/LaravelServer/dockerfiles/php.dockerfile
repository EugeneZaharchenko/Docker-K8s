FROM php:8.2-fpm

WORKDIR /var/www/html

COPY src .

RUN docker-php-ext-install pdo pdo_mysql
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
# RUN chmod -R 775 storage bootstrap/cache && \
#     chown -R www-data:www-data storage bootstrap/cache
RUN chown -R www-data:www-data /var/www/html