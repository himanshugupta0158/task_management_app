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
echo "Starting uvicorn server..."
uvicorn core.asgi:application --host 0.0.0.0 --port 8000 --reload

