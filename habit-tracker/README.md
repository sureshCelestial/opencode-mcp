# Personal Habit Tracker

A modern, responsive web application for tracking personal habits.

## Tech Stack

- **Frontend:** React 18, TypeScript, Material UI, Vite
- **Backend:** Node.js, Express, TypeScript, PostgreSQL
- **DevOps:** Docker, Docker Compose

## Quick Start

1. Copy `.env.example` to `.env` and adjust values.
2. Run:
   ```bash
   docker compose up --build
   ```
3. Frontend: http://localhost:5173
4. Backend API: http://localhost:3000

## Project Structure

```
habit-tracker/
├── apps/
│   ├── frontend/   # React SPA
│   └── backend/    # Express API
├── docker-compose.yml
└── .env.example
```

## Scripts

- `docker compose up --build` — Start all services
- `docker compose down` — Stop all services

## Jira Project

- [OP-12 — Frontend Development](https://celestialsys.atlassian.net/browse/OP-12)
- [OP-13 — Backend Development](https://celestialsys.atlassian.net/browse/OP-13)

## Confluence Docs

- [Project Overview](https://celestialsys.atlassian.net/wiki/spaces/CDEV/pages/3842736135)
- [Technical Stack](https://celestialsys.atlassian.net/wiki/spaces/CDEV/pages/3842736160)
- [Project Architecture](https://celestialsys.atlassian.net/wiki/spaces/CDEV/pages/3844046850)
- [Folder Structure](https://celestialsys.atlassian.net/wiki/spaces/CDEV/pages/3844046875)
