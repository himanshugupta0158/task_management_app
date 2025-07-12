# Fullstack Task Manager App

A modern, real-time fullstack web application built with:

- **Django (REST + Channels + Celery)**
- **PostgreSQL** for persistent storage
- **Redis** for caching and async tasks
- **React (Vite + TailwindCSS)** for the frontend
- **Docker + Docker Compose** for isolated development

---

### NOTE :
> - Make sure you have **Docker** installed on your system
> - If you are using windows make sure to run **make** command in power shell
> - In case make command do not work, please use docker command like **docker compose up --build** - for starting project and **docker compose down** - for stopping.
> - In case `docker compose` does not work, please use `docker-compose`

## Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | React, Vite, Tailwind CSS                   |
| Backend     | Django, Django REST Framework, Channels     |
| Async Tasks | Celery, Redis                               |
| Database    | PostgreSQL                                  |
| DevOps      | Docker, Docker Compose                      |
| Testing     | Pytest                                      |

---

## Project Structure

```
.
├── backend/
├── frontend/
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/himanshugupta0158/task_management_app.git
cd app_management_app
```

### 2. Start the stack

```bash
make up
```

App will be accessible at:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:8000](http://localhost:8000)

### 3. Run Backend Tests

```bash
make test
```

---

## 🛠 Common Development Commands

| Command          | Description                                |
|------------------|--------------------------------------------|
| `make up`        | Start all containers                      |
| `make down`      | Stop containers                           |
| `make test`      | Run backend tests                         |

---

## Default Admin Credentials

```plaintext
username: admin
email:    admin@gmail.com
password: 1234
```

---

## Features

- Modular Django apps: users, tasks, notifications
- JWT Authentication
- Real-time updates with Django Channels
- Background job handling via Celery
- Pytest-based testing
- Auto-reloading frontend/backend in development
