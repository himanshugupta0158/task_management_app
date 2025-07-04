#!/bin/sh

# Wait for Postgres
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is up!"

# Run migrations
echo "Running migrations..."
python manage.py migrate

# Create admin user if it doesn't exist
echo "Creating superuser..."
python create_admin.py

# Start dev server with reload
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
