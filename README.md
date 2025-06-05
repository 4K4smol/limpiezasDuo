# Development environment

This repository contains a Laravel backend and a React frontend. A `docker-compose.yml` file is provided to run the complete stack using Docker.

## Prerequisites

- Docker and Docker Compose installed.

## Usage

1. Copy the example environment for Laravel:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Build the images and start the containers:

   ```bash
   docker-compose up --build
   ```

The Laravel API will be available at `http://localhost:8000` and the React application at `http://localhost:5173`. The MySQL database listens on port `3306` using the credentials defined in `docker-compose.yml`.

Stop the stack with `docker-compose down`.
