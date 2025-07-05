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

# Start ASGI server (with Channels support)
echo "Starting Daphne server..."
daphne -b 0.0.0.0 -p 8000 core.asgi:application
