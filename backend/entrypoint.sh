#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 0.5
done
echo "PostgreSQL is up."

echo "Generating migrations..."
python manage.py makemigrations users products orders payments --noinput

echo "Applying database migrations..."
python manage.py migrate --noinput

echo "Loading initial product fixtures..."
python manage.py loaddata fixtures/initial_products.json || echo "Fixtures already loaded or skipped."

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

echo "Starting Gunicorn server..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120
