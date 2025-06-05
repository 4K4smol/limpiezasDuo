# Limpiezas Duo

This repository contains the backend and frontend code for the Limpiezas Duo application.

## Backend (`backend/`)

The backend is a **Laravel 12** project. Key folders include:

- `app/` – application code such as models, controllers, and services
- `database/` – migrations and seeders for the application tables
- `routes/` – API and web route definitions
- `resources/` – Blade views and asset sources

The backend exposes REST APIs and uses Vite + Tailwind for frontend assets served from Laravel.

## Frontend (`frontend/`)

The frontend is built with **React** and **Vite**. The `src/` directory is organised by modules (e.g. `landing`, `auth`, `clientes`, `inventario`, `ordenesTrabajo`, `serviciosPeriodicos`). Shared utilities live under `components`, `contexts`, `hooks`, `services`, and `router`.

## Installation

### Requirements

- **PHP 8.2+**
- **Node 18+**
- Composer and npm

### Backend setup

```bash
cd backend
composer install
npm install
cp .env.example .env
php artisan key:generate
# create SQLite database file
mkdir -p database && touch database/database.sqlite
php artisan migrate --seed
npm run dev &   # compiles assets
php artisan serve
```

The environment variables come from `.env` (see `backend/.env.example`). Adjust the `DB_*` settings if you wish to use MySQL instead of the default SQLite connection.

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies API requests to `http://localhost:8000` as configured in `frontend/vite.config.js`.

## Running

Start both the Laravel server and the React dev server. You can run them separately as shown above, or from the backend run:

```bash
composer run dev
```

This command uses `concurrently` to start the PHP server, queue worker, log watcher and Vite.
