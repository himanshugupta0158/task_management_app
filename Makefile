# Detect if sudo is required
DOCKER_COMPOSE = $(shell if [ "$$(id -u)" -ne 0 ]; then echo "sudo docker compose"; else echo "docker compose"; fi)

# Start all services
up:
	@$(DOCKER_COMPOSE) up --build

down:
	@$(DOCKER_COMPOSE) down

# Stop and remove containers, networks, and volumes
remove:
	@$(DOCKER_COMPOSE) down -v

# Run tests with verbosity
tests:
	@$(DOCKER_COMPOSE) exec backend pytest -v

# Format Django backend (excluding venv and migrations) and frontend src/
format:
	@echo "Formatting Django backend..."
	@$(DOCKER_COMPOSE) exec backend black ./ --exclude "/(venv|migrations)/"
	@$(DOCKER_COMPOSE) exec backend isort ./ --skip venv --skip migrations
	@echo "Formatting React frontend..."
	@$(DOCKER_COMPOSE) exec frontend npx prettier --write "src/**/*.{js,jsx,ts,tsx,json,css}"

# Run any Django management command: make manage cmd="command here"
manage:
	@$(DOCKER_COMPOSE) exec backend python manage.py $(cmd)