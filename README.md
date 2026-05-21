# DevSight — Developer Portfolio & GitHub Analytics Platform

> Transform your GitHub history into a compelling professional narrative.

DevSight is an analytics-first developer portfolio platform that connects to GitHub via OAuth and surfaces rich, interactive dashboards covering contribution heatmaps, repository performance metrics, language analytics, commit patterns, and productivity scoring.

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/devsight/devsight.git && cd devsight

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in your GitHub OAuth credentials (see docs/workflows/local-development.md)
# Create a GitHub OAuth App at: https://github.com/settings/developers
# Callback URL: http://localhost:4000/api/auth/callback

# 4. Start all services
docker compose -f docker/docker-compose.yml up --build

# 5. Visit the app
open http://localhost:3000
```

---

## Project Structure

```
devsight/
├── client/          # React 18 + TypeScript + Vite + Tailwind CSS
├── server/          # Node.js + Express API (OAuth proxy, GitHub API)
├── docker/          # Dockerfile.client, Dockerfile.server, docker-compose.yml
├── docs/            # Architecture docs, workflows, API references
└── design-references/  # UI/UX design reference images by page
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, CSS Variables |
| Data Fetching | React Query (TanStack Query) |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| Backend | Node.js, Express, TypeScript |
| Auth | GitHub OAuth 2.0 |
| Dev Environment | Docker, Docker Compose |
| Deployment | Vercel |

---

## Development Commands

### With Docker (Recommended)

```bash
docker compose -f docker/docker-compose.yml up --build    # Start all services
docker compose -f docker/docker-compose.yml up -d         # Start in background
docker compose -f docker/docker-compose.yml logs -f       # View logs
docker compose -f docker/docker-compose.yml down          # Stop all services
```

### Without Docker

```bash
# Frontend
cd client && npm install && npm run dev

# Backend
cd server && npm install && npm run dev
```

---

## Environment Variables

See `.env.example` for all required variables with descriptions.

```
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
SESSION_SECRET=a_long_random_string_for_session_signing
VITE_API_URL=http://localhost:4000
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

---

## Documentation

- [Local Development Setup](docs/workflows/local-development.md)
- [Docker Setup Guide](docs/workflows/docker-setup.md)
- [System Architecture](docs/architecture/system-overview.md)
- [GitHub API Integration](docs/architecture/api-integration.md)
- [State Management](docs/architecture/state-management.md)
- [Design System](docs/design/design-system.md)

---

## License

MIT © DevSight Team
